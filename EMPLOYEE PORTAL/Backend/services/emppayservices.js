// const axios = require("axios");
// const { parseStringPromise } = require("xml2js");

// const SAP_URL =
//   "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_emppay_rfc?sap-client=100";

// const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
// const SAP_COOKIE = "sap-usercontext=sap-client=100";

// function buildSOAP(empId) {
//   return `
// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
//    <soapenv:Header/>
//    <soapenv:Body>
//       <urn:ZEMP_FM_EMPPAY>
//          <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
//       </urn:ZEMP_FM_EMPPAY>
//    </soapenv:Body>
// </soapenv:Envelope>`;
// }

// exports.fetchEmpPay = async (empId) => {
//   const soapBody = buildSOAP(empId);

//   try {
//     const response = await axios({
//       method: "GET", // SAP accepts GET with body
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

//     const parsed = await parseStringPromise(xml, {
//       explicitArray: false,
//       ignoreAttrs: true,
//       tagNameProcessors: [(name) => name.toLowerCase()],
//     });

//     const envelope =
//       parsed["soap-env:envelope"] ||
//       parsed["soapenv:envelope"] ||
//       parsed["envelope"];

//     const body =
//       envelope["soap-env:body"] ||
//       envelope["soapenv:body"] ||
//       envelope["body"];

//     // Find response node
//     let responseNode = null;
//     for (const key of Object.keys(body)) {
//       if (key.includes("emppay") && key.includes("response")) {
//         responseNode = body[key];
//         break;
//       }
//     }

//     if (!responseNode) {
//       return { error: "Could not find EMPPAY response in SAP XML", raw: xml };
//     }

//     const payslip = responseNode["payslip_details"];

//     if (!payslip) {
//       return { message: "No payslip data found", rawResponse: xml };
//     }

//     let items = payslip.item;

//     // Convert single-item to array
//     if (items && !Array.isArray(items)) {
//       items = [items];
//     }

//     return {
//       payslip: items,
//       rawXml: xml,
//     };
//   } catch (err) {
//     console.error("SAP EmpPay Error:", err);
//     throw new Error("Failed to fetch Employee Pay data from SAP");
//   }
// };


// const axios = require("axios");
// const { parseStringPromise } = require("xml2js");

// const SAP_URL =
//   "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_emppay_rfc?sap-client=100";

// const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
// const SAP_COOKIE = "sap-usercontext=sap-client=100";

// function buildSOAP(empId) {
//   return `
// <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
//    <soapenv:Header/>
//    <soapenv:Body>
//       <urn:ZEMP_FM_EMPPAY>
//          <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
//       </urn:ZEMP_FM_EMPPAY>
//    </soapenv:Body>
// </soapenv:Envelope>`;
// }

// exports.fetchEmpPay = async (empId) => {
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
//       validateStatus: () => true
//     });

//     const xml = response.data;

//     const parsed = await parseStringPromise(xml, {
//       explicitArray: false,
//       ignoreAttrs: true
//     });

//     const envelope =
//       parsed["soap-env:Envelope"] ||
//       parsed["soapenv:Envelope"] ||
//       parsed["Envelope"];

//     const body =
//       envelope["soap-env:Body"] ||
//       envelope["soapenv:Body"] ||
//       envelope["Body"];

//     const responseNode =
//       body["n0:ZEMP_FM_EMPPAYResponse"] ||
//       body["ZEMP_FM_EMPPAYResponse"];

//     if (!responseNode) {
//       return { error: "SAP response not found", raw: xml };
//     }

//     let items = responseNode.PAYSLIP_DETAILS.item;

//     if (!Array.isArray(items)) items = [items];

//     return { payslip: items };
//   } catch (err) {
//     console.error("SAP emppay error:", err);
//     throw new Error("Failed to fetch SAP EmpPay");
//   }
// };


// services/emppayservices.js
const request = require("request");
const xml2js = require("xml2js");

// -----------------------------------------
// SAP AUTH + COOKIE (REQUIRED FOR BOTH CALLS)
// -----------------------------------------
const SAP_AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";
const SAP_COOKIE = "sap-usercontext=sap-client=100";

// -----------------------------------------
// ⭐ FETCH NORMAL EMPPAY DATA
// -----------------------------------------
exports.fetchEmpPay = (empId) => {
  return new Promise((resolve, reject) => {

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_FM_EMPPAY>
            <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
          </urn:ZEMP_FM_EMPPAY>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_emppay_rfc?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        Authorization: SAP_AUTH,
        Cookie: SAP_COOKIE
      },
      body: soapBody
    };

    request(options, (error, response, body) => {
      if (error) return reject(error);

      xml2js.parseString(body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          const responseNode =
            result["soap-env:Envelope"]["soap-env:Body"]["n0:ZEMP_FM_EMPPAYResponse"];

          let details = responseNode.PAYSLIP_DETAILS;

          let normalized = [];

          if (!details) {
            normalized = [];
          } else if (Array.isArray(details.item)) {
            normalized = details.item;
          } else if (details.item) {
            normalized = [details.item];
          }

          resolve({ emppay: normalized });

        } catch (e) {
          reject("Invalid SAP EMPPAY response");
        }
      });
    });
  });
};

// -----------------------------------------
// ⭐ FETCH EMPPAY PDF (BASE64 → BUFFER)
// -----------------------------------------
exports.fetchEmpPayPDF = (empId) => {
  return new Promise((resolve, reject) => {

    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:ZEMP_FM_EMPPAYPDF>
            <EMPLOYEE_ID>${empId}</EMPLOYEE_ID>
          </urn:ZEMP_FM_EMPPAYPDF>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zemp_emppaypdf_rfc?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        Authorization: SAP_AUTH,
        Cookie: SAP_COOKIE
      },
      body: soapBody,
      encoding: null // VERY IMPORTANT — SAP returns PDF as BINARY
    };

    request(options, (error, response, body) => {
      if (error) return reject(error);

      xml2js.parseString(body.toString(), { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          const responseNode =
            result["soap-env:Envelope"]["soap-env:Body"]["n0:ZEMP_FM_EMPPAYPDFResponse"];

          const pdfBase64 = responseNode.PAYSLIP_PDF;

          if (!pdfBase64 || pdfBase64.trim() === "") {
            return reject("SAP returned empty PDF (PAYSLIP_PDF missing)");
          }

          // Convert Base64 → Buffer
          const pdfBuffer = Buffer.from(pdfBase64, "base64");
          resolve(pdfBuffer);

        } catch (e) {
          reject("Failed parsing SAP EmpPay PDF: " + e.message);
        }
      });
    });
  });
};
