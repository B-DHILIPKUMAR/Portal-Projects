// Backend/services/leaveservices.js
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

/**
 * Configuration - change to env vars in production
 */
const SAP_URL =
  process.env.SAP_URL_LEAVE ||
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_leave_rfc?sap-client=100";

const SAP_AUTH = process.env.SAP_AUTH || "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
const SAP_COOKIE = process.env.SAP_COOKIE || "sap-usercontext=sap-client=100";

/**
 * Build SOAP envelope for the leave RFC
 */
function buildSOAP(empId) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:ZEMP_FM_LEAVE>
      <I_EMP_ID>${empId}</I_EMP_ID>
    </urn:ZEMP_FM_LEAVE>
  </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Fetch leave data from SAP and parse it
 * Returns:
 * {
 *   message: "...",
 *   leave: [ { EMPID, SUBTYPE, ABWTG, START_DATE, END_DATE, ... }, ... ],
 *   rawXml: "..."
 * }
 */
exports.fetchLeave = async (empId) => {
  try {
    const soapBody = buildSOAP(empId);

    const resp = await axios({
      method: "GET", // your SAP endpoint accepts GET with SOAP body
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

    // Parse XML into JS (lowercase processors help namespace/case variance)
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      ignoreAttrs: true,
      tagNameProcessors: [(name) => name.toLowerCase()],
    });

    // get envelope in a namespace-insensitive way
    const envelope =
      parsed["soap-env:envelope"] ||
      parsed["soapenv:envelope"] ||
      parsed["envelope"] ||
      parsed;

    const body =
      (envelope && (envelope["soap-env:body"] || envelope["soapenv:body"] || envelope["body"])) || envelope;

    // find the response node by searching keys that contain "leave" and "response"
    let responseNode = null;
    if (body && typeof body === "object") {
      for (const k of Object.keys(body)) {
        if (k.includes("leave") && k.includes("response")) {
          responseNode = body[k];
          break;
        }
      }
      // fallback: if body has one child, use that
      if (!responseNode) {
        const keys = Object.keys(body).filter(Boolean);
        if (keys.length === 1) responseNode = body[keys[0]];
      }
    }

    if (!responseNode) {
      // Can't find structured node — return raw for debugging
      return {
        error: "SAP response structure not recognized",
        rawXml: xml,
      };
    }

    // ET_LEAVE_DATA could appear as et_leave_data or et_leave_data depending on parser
    const leaveContainer =
      responseNode.et_leave_data || responseNode.et_leave_data || responseNode.ET_LEAVE_DATA || responseNode.et_leave_data;

    if (!leaveContainer) {
      return {
        message: responseNode.e_message || null,
        leave: [],
        rawXml: xml,
      };
    }

    // items may be at leaveContainer.item or leaveContainer.Item depending on case
    let items = leaveContainer.item || leaveContainer.Item || leaveContainer["item"];

    if (!items) {
      // No items present
      return {
        message: responseNode.e_message || null,
        leave: [],
        rawXml: xml,
      };
    }

    // Ensure items is an array
    if (!Array.isArray(items)) items = [items];

    // Normalize each item (convert any nested _ or #text)
    const normalize = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      const out = {};
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === "string") out[k.toUpperCase()] = v;
        else if (v && typeof v === "object") {
          // xml2js can put text under '_' or '#text'
          out[k.toUpperCase()] = v._ || v["#text"] || (typeof v === "object" ? JSON.stringify(v) : String(v));
        } else {
          out[k.toUpperCase()] = v;
        }
      }
      return out;
    };

    const normalizedItems = items.map(normalize);

    return {
      message: (responseNode.e_message || responseNode.e_message) || null,
      leave: normalizedItems,
      rawXml: xml,
    };
  } catch (err) {
    console.error("leaveservices.fetchLeave error:", err);
    throw new Error(err.message || "Failed to fetch leave data from SAP");
  }
};
