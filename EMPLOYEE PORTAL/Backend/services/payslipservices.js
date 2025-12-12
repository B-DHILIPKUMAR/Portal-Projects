// Backend/services/payslipservices.js
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

/**
 * Config (override with env vars for production)
 */
const SAP_URL =
  process.env.SAP_URL_PAYSLIP ||
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_payslip_rfc?sap-client=100";

const SAP_AUTH = process.env.SAP_AUTH || "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
const SAP_COOKIE = process.env.SAP_COOKIE || "sap-usercontext=sap-client=100";

/**
 * Build SOAP envelope for payslip RFC
 */
function buildSOAP(empId) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:ZEMP_FM_PAYSLIP>
      <I_EMP_ID>${empId}</I_EMP_ID>
    </urn:ZEMP_FM_PAYSLIP>
  </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Normalize item keys to uppercase simple properties
 */
function normalizeItem(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const out = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    // xml2js can put text under '_' or '#text'
    if (typeof v === "string") out[k.toUpperCase()] = v;
    else if (v && typeof v === "object") out[k.toUpperCase()] = v._ || v["#text"] || (typeof v === "object" ? JSON.stringify(v) : String(v));
    else out[k.toUpperCase()] = v;
  }
  return out;
}

/**
 * Call SAP and return parsed payslip data
 */
exports.fetchPayslip = async (empId) => {
  const soapBody = buildSOAP(empId);

  try {
    const resp = await axios({
      method: "GET", // SAP accepts GET with SOAP body in your environment
      url: SAP_URL,
      headers: {
        "Content-Type": "text/xml",
        Authorization: SAP_AUTH,
        Cookie: SAP_COOKIE,
      },
      data: soapBody,
      timeout: 20000,
      validateStatus: () => true,
    });

    const xml = typeof resp.data === "string" ? resp.data : String(resp.data);

    // parse xml to JS (case-insensitive handling)
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      ignoreAttrs: true,
      tagNameProcessors: [(name) => name.toLowerCase()],
    });

    // namespace-agnostic envelope/body retrieval
    const envelope = parsed["soap-env:envelope"] || parsed["soapenv:envelope"] || parsed["envelope"] || parsed;
    const body = (envelope && (envelope["soap-env:body"] || envelope["soapenv:body"] || envelope["body"])) || envelope;

    // find response node dynamically (contains "payslip" & "response")
    let responseNode = null;
    if (body && typeof body === "object") {
      for (const key of Object.keys(body)) {
        if (key.includes("payslip") && key.includes("response")) {
          responseNode = body[key];
          break;
        }
      }
      // fallback: if body has only one child, use it
      if (!responseNode) {
        const keys = Object.keys(body).filter(Boolean);
        if (keys.length === 1) responseNode = body[keys[0]];
      }
    }

    if (!responseNode) {
      return { error: "Could not locate payslip response in SAP XML", rawXml: xml, httpStatus: resp.status };
    }

    // ET_PAYSLIP_DATA can be present in different casings; try several keys
    const payslipContainer =
      responseNode.et_payslip_data ||
      responseNode.et_payslip_data ||
      responseNode["et_payslip_data"] ||
      responseNode["et_payslip_data".toLowerCase()] ||
      responseNode.ET_PAYSLIP_DATA ||
      responseNode.et_payslip_data;

    if (!payslipContainer) {
      return { message: responseNode.e_message || null, payslip: [], rawXml: xml, httpStatus: resp.status };
    }

    // items may be under .item
    let items = payslipContainer.item || payslipContainer.item || payslipContainer["item"];

    if (!items) {
      // No items
      return { message: responseNode.e_message || null, payslip: [], rawXml: xml, httpStatus: resp.status };
    }

    // normalize to array
    if (!Array.isArray(items)) items = [items];

    const normalized = items.map(normalizeItem);

    return {
      message: responseNode.e_message || null,
      payslip: normalized,
      rawXml: xml,
      httpStatus: resp.status,
    };
  } catch (err) {
    console.error("payslipservices.fetchPayslip error:", err);
    throw new Error(err.message || "Failed to fetch payslip data from SAP");
  }
};
