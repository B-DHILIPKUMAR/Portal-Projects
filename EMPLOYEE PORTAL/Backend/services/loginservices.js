// exports.validateUser = async (username, password) => {
//   if (username === "demo" && password === "demo123") {
//     return { message: "Login successful", user: username };
//   }

//   return { message: "Invalid credentials" };
// };


// Backend/services/loginservices.js
const axios = require("axios");
const { parseStringPromise } = require("xml2js");

// SAP endpoint (from your message)
const SAP_URL = process.env.SAP_URL || "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_login_rfc?sap-client=100";

// Authorization header: use env var SAP_AUTH if set, otherwise use the Base64 you provided
// Example value you gave: "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3"
const SAP_AUTH = process.env.SAP_AUTH || "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

// Cookie - your request included this value
const SAP_COOKIE = process.env.SAP_COOKIE || "sap-usercontext=sap-client=100";

/**
 * Build SOAP envelope for login using employee id and password
 * NOTE: ensure the tags match SAP expected names exactly.
 */
function buildLoginEnvelope(empId, password) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZEMP_FM_LOGIN>
         <I_EMP_ID>${empId}</I_EMP_ID>
         <I_PASSWORD>${password}</I_PASSWORD>
      </urn:ZEMP_FM_LOGIN>
   </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Call SAP login by passing emp id & password
 * Returns parsed response like { e_message: "...", e_status: "..." , raw: "..."}
 */
exports.callSapLogin = async (empId, password) => {
  const soapBody = buildLoginEnvelope(empId, password);

  return exports.callSapWithRawSoap(soapBody);
};

/**
 * Generic function to send raw SOAP string to SAP and parse response
 */
exports.callSapWithRawSoap = async (soapBody) => {
  try {
    const headers = {
      "Content-Type": "text/xml",
      "Authorization": SAP_AUTH,
      "Cookie": SAP_COOKIE,
    };

    const axiosOptions = {
      method: "post",
      url: SAP_URL,
      headers,
      data: soapBody,
      timeout: 20000, // 20s timeout
      validateStatus: () => true, // we'll handle status manually
    };

    const response = await axios(axiosOptions);

    const respText = response.data;

    // If response is not XML string already (axios may parse), convert to string
    const xml = typeof respText === "string" ? respText : respText.toString();

    // Parse XML
    const parsed = await parseStringPromise(xml, { explicitArray: false, ignoreAttrs: true, trim: true });

    // Navigate typical SOAP envelope structure to find ZEMP_FM_LOGINResponse
    // Path may vary depending on namespace prefixes; we'll try a few safe accesses.
    let body = parsed["soap-env:Envelope"] || parsed["soapenv:Envelope"] || parsed["Envelope"] || parsed["soap-env:Envelope"];
    if (!body) {
      // Try root's Envelope under default key
      body = parsed;
    }
    let soapBodyContent = body["soap-env:Body"] || body["soapenv:Body"] || body["Body"] || (body.Envelope && body.Envelope.Body) || body;

    // Attempt to find ZEMP_FM_LOGINResponse under any namespace
    let responseNode = null;
    if (soapBodyContent) {
      for (const key of Object.keys(soapBodyContent)) {
        if (key.toUpperCase().includes("ZEMP_FM_LOGINRESPONSE")) {
          responseNode = soapBodyContent[key];
          break;
        }
      }
      // fallback: sometimes Body contains single child which is response
      if (!responseNode) {
        const keys = Object.keys(soapBodyContent);
        if (keys.length === 1) responseNode = soapBodyContent[keys[0]];
      }
    }

    // Extract fields E_MESSAGE, E_STATUS (case-insensitive)
    let e_message = null;
    let e_status = null;
    if (responseNode) {
      for (const k of Object.keys(responseNode)) {
        const low = k.toLowerCase();
        if (low.includes("e_message") || low.includes("e-message") || low.includes("e_message".toLowerCase())) {
          e_message = responseNode[k];
        }
        if (low.includes("e_status") || low.includes("e-status") || low.includes("e_status".toLowerCase())) {
          e_status = responseNode[k];
        }
      }
      // If the keys are exactly E_MESSAGE/E_STATUS, we'll get them directly
      e_message = e_message || responseNode.E_MESSAGE || responseNode.E_MESSAGE || responseNode.EMessage || responseNode.E_MESSAGE;
      e_status = e_status || responseNode.E_STATUS || responseNode.E_STATUS || responseNode.EStatus || responseNode.E_STATUS;
    }

    // Normalize potential nested objects (if xml2js kept _ or #text)
    const normalize = (val) => {
      if (typeof val === "string") return val;
      if (!val) return null;
      if (val._) return val._;
      if (val["#text"]) return val["#text"];
      return String(val);
    };

    return {
      e_message: normalize(e_message) || null,
      e_status: normalize(e_status) || null,
      rawResponse: xml,
      httpStatus: response.status,
    };
  } catch (err) {
    console.error("callSapWithRawSoap error:", err);
    throw new Error(err.message || "SAP request failed");
  }
};
