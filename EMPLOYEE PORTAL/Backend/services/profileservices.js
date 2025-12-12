// // // Backend/services/profileservices.js
// // const axios = require("axios");
// // const { parseStringPromise } = require("xml2js");

// // // SAP Endpoint
// // const SAP_URL =
// //   "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_profile_rfc?sap-client=100";

// // const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
// // const SAP_COOKIE = "sap-usercontext=sap-client=100";

// // function buildSOAP(empId) {
// //   return `
// // <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
// //    <soapenv:Header/>
// //    <soapenv:Body>
// //       <urn:ZEMP_FM_PROFILE>
// //          <I_EMP_ID>${empId}</I_EMP_ID>
// //       </urn:ZEMP_FM_PROFILE>
// //    </soapenv:Body>
// // </soapenv:Envelope>`;
// // }

// // exports.callSapProfile = async (empId) => {
// //   try {
// //     const soapBody = buildSOAP(empId);

// //     const response = await axios({
// //       method: "GET",               // <--- YOU WANTED GET
// //       url: SAP_URL,
// //       headers: {
// //         "Content-Type": "text/xml",
// //         Authorization: SAP_AUTH,
// //         Cookie: SAP_COOKIE,
// //       },
// //       data: soapBody,              // SOAP BODY
// //       timeout: 10000,
// //       validateStatus: () => true,
// //     });

// //     const xml = response.data;

// //     // Parse XML
// //     const parsed = await parseStringPromise(xml, {
// //       explicitArray: false,
// //       ignoreAttrs: true,
// //     });

// //     const body =
// //       parsed["soap-env:Envelope"]["soap-env:Body"] ||
// //       parsed["soapenv:Envelope"]["soapenv:Body"];

// //     // Response node
// //     const node = body["n0:ZEMP_FM_PROFILEResponse"];

// //     const profile = node.E_PROFILE_DATA;

// //     return {
// //       message: node.E_MESSAGE,
// //       profileData: profile,
// //       rawResponse: xml,
// //     };
// //   } catch (err) {
// //     console.error("SAP Profile Error:", err);
// //     throw err;
// //   }
// // };

// // Backend/services/profileservices.js
// const axios = require("axios");
// const { parseStringPromise } = require("xml2js");

// const SAP_URL = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_profile_rfc?sap-client=100";
// const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
// const SAP_COOKIE = "sap-usercontext=sap-client=100";

// function buildSOAP(empId) {
//   return `
// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
//    <soapenv:Header/>
//    <soapenv:Body>
//       <urn:ZEMP_FM_PROFILE>
//          <I_EMP_ID>${empId}</I_EMP_ID>
//       </urn:ZEMP_FM_PROFILE>
//    </soapenv:Body>
// </soapenv:Envelope>`;
// }

// exports.callSapProfile = async (empId) => {
//   try {
//     const soapBody = buildSOAP(empId);

//     const response = await axios({
//       method: "GET",
//       url: SAP_URL,
//       headers: {
//         "Content-Type": "text/xml",
//         Authorization: SAP_AUTH,
//         Cookie: SAP_COOKIE,
//       },
//       data: soapBody,
//       validateStatus: () => true,
//     });

//     const xml = response.data;

//     // 🔥 PRINT RAW XML TO TERMINAL — MOST IMPORTANT
//     console.log("\n================ RAW SAP XML ================\n");
//     console.log(xml);
//     console.log("\n=============================================\n");

//     // Parse XML
//     const parsed = await parseStringPromise(xml, {
//       explicitArray: false,
//       ignoreAttrs: false,
//       tagNameProcessors: [(n) => n.toLowerCase()],
//     });

//     const envelope =
//       parsed["soap-env:envelope"] ||
//       parsed["soapenv:envelope"] ||
//       parsed["env:envelope"] ||
//       parsed["envelope"] ||
//       parsed;

//     const body =
//       envelope["soap-env:body"] ||
//       envelope["soapenv:body"] ||
//       envelope["env:body"] ||
//       envelope["body"] ||
//       envelope;

//     // 🔥 PRINT BODY KEYS (this will show EXACT SAP response structure)
//     console.log("\n============ BODY KEYS FOUND ============\n");
//     console.log(Object.keys(body));
//     console.log("\n=========================================\n");

//     // FIND RESPONSE NODE BY ANY KEY MATCHING "profile"
//     let responseNode = null;
//     for (const key of Object.keys(body)) {
//       if (key.includes("profile") && key.includes("response")) {
//         responseNode = body[key];
//       }
//     }

//     // If still not found, return debug output
//     if (!responseNode) {
//       return {
//         error: "SAP response not recognized",
//         detectedKeys: Object.keys(body),
//         rawResponse: xml
//       };
//     }

//     // Extract fields safely
//     const e_message = responseNode["e_message"] || null;
//     const e_profile = responseNode["e_profile_data"] || null;

//     return {
//       message: e_message,
//       profileData: e_profile,
//       rawResponse: xml,
//     };
//   } catch (err) {
//     console.error("SAP Profile Error:", err);
//     throw new Error(err.message);
//   }
// };


// Backend/services/profileservices.js

const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const SAP_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_profile_rfc?sap-client=100";
const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
const SAP_COOKIE = "sap-usercontext=sap-client=100";

/* --------------------------------------------------
   SOAP BODY BUILDER
-------------------------------------------------- */
function buildSOAP(empId) {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZEMP_FM_PROFILE>
         <I_EMP_ID>${empId}</I_EMP_ID>
      </urn:ZEMP_FM_PROFILE>
   </soapenv:Body>
</soapenv:Envelope>`;
}

/* --------------------------------------------------
   CLEAN FUNCTION (xml2js normalizer)
-------------------------------------------------- */
function clean(val) {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (val._) return val._.trim();
  if (val["#text"]) return val["#text"].trim();
  return String(val).trim();
}

/* --------------------------------------------------
   MAIN FUNCTION
-------------------------------------------------- */
exports.callSapProfile = async (empId) => {
  try {
    const soapBody = buildSOAP(empId);

    const response = await axios({
      method: "GET",
      url: SAP_URL,
      headers: {
        "Content-Type": "text/xml",
        Authorization: SAP_AUTH,
        Cookie: SAP_COOKIE,
      },
      data: soapBody,
      validateStatus: () => true,
    });

    const xml = response.data;

    console.log("\n================ RAW SAP XML ================\n");
    console.log(xml);
    console.log("\n=============================================\n");

    // PARSE XML
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      ignoreAttrs: false,
      tagNameProcessors: [(n) => n.toLowerCase()],
    });

    const envelope =
      parsed["soap-env:envelope"] ||
      parsed["soapenv:envelope"] ||
      parsed["env:envelope"] ||
      parsed["envelope"] ||
      parsed;

    const body =
      envelope["soap-env:body"] ||
      envelope["soapenv:body"] ||
      envelope["env:body"] ||
      envelope["body"] ||
      envelope;

    console.log("\n============ BODY KEYS FOUND ============\n");
    console.log(Object.keys(body));
    console.log("\n=========================================\n");

    /* --------------------------------------------------
       FIND RESPONSE NODE LIKE "zemp_fm_profileresponse"
    -------------------------------------------------- */
    let responseNode = null;

    for (const key of Object.keys(body)) {
      if (key.includes("zemp_fm_profile") && key.includes("response")) {
        responseNode = body[key];
        break;
      }
    }

    if (!responseNode) {
      return {
        error: "SAP response structure not recognized",
        keys: Object.keys(body),
        rawResponse: xml,
      };
    }

    const e_message = clean(responseNode["e_message"]);
    const rawProfile = responseNode["e_profile_data"] || {};

    /* --------------------------------------------------
       CLEAN ALL PROFILE FIELDS
    -------------------------------------------------- */
    const profileData = {};

    for (const key in rawProfile) {
      profileData[key] = clean(rawProfile[key]);
    }

    /* --------------------------------------------------
       RETURN CLEANED PROFILE DATA
    -------------------------------------------------- */
    return {
      message: e_message,
      profileData: profileData,
      rawResponse: xml,
    };
  } catch (err) {
    console.error("SAP Profile Error:", err);
    throw new Error(err.message);
  }
};
