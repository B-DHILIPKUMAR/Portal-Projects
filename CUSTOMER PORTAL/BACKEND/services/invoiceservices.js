const request = require("request");
const xml2js = require("xml2js");

const AUTH = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

// ============================
// Fetch Invoice List from SAP
// ============================
exports.fetchInvoiceList = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:ZBDK_FM_INVOICE>
      <I_CUSTOMER_ID>${customerId}</I_CUSTOMER_ID>
    </tns:ZBDK_FM_INVOICE>
  </soapenv:Body>
</soapenv:Envelope>`;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_invoice__rfc?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        Authorization: AUTH,
        Cookie: "sap-usercontext=sap-client=100",
      },
      body: soapBody,
    };

    request(options, (err, response, body) => {
      if (err) return reject(err);

      xml2js.parseString(body, { explicitArray: false }, (error, result) => {
        if (error) return reject(error);

        try {
          const items =
            result["soap-env:Envelope"]["soap-env:Body"]["n0:ZBDK_FM_INVOICEResponse"]["E_INVOICE"]["item"];

          resolve(Array.isArray(items) ? items : [items]);
        } catch (e) {
          reject("Invalid SOAP Response for Invoice List");
        }
      });
    });
  });
};


// ============================
// Fetch Invoice PDF
// ============================
exports.fetchInvoicePDF = (invoiceNumber) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="urn:sap-com:document:sap:rfc:functions">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:ZBDK_FM_INVOICEDATA>
      <P_VBELN>${invoiceNumber}</P_VBELN>
    </tns:ZBDK_FM_INVOICEDATA>
  </soapenv:Body>
</soapenv:Envelope>`;

    const options = {
      method: "GET",
      url: "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_invoicedata__rfc?sap-client=100",
      headers: {
        "Content-Type": "text/xml",
        Authorization: AUTH,
        Cookie: "sap-usercontext=sap-client=100",
      },
      body: soapBody,
      encoding: null // PDF binary
    };

    request(options, (err, response, body) => {
      if (err) return reject(err);

      xml2js.parseString(body.toString(), { explicitArray: false }, (error, result) => {
        if (error) return reject(error);

        try {
          const pdfBase64 =
            result["soap-env:Envelope"]["soap-env:Body"]["n0:ZBDK_FM_INVOICEDATAResponse"]["X_PDF"];

          resolve(Buffer.from(pdfBase64, "base64"));
        } catch (e) {
          reject("Invalid SOAP Response for Invoice PDF");
        }
      });
    });
  });
};
