// services/inquiryservices.js
const request = require("request");

const INQUIRY_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_inquiry_rfc?sap-client=100";

exports.getInquiryDetails = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_INQUIRY>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_INQUIRY>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: INQUIRY_URL,
      headers: {
        "Content-Type": "text/xml",
        Authorization: "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3",
        Cookie: "sap-usercontext=sap-client=100",
      },
      body: soapBody,
    };

request(options, (error, response) => {
  if (error) return reject(error);

  const xml = response.body;

  console.log("XML RESPONSE ===>\n", xml);   // ← ADD THIS

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml))) {
    const block = match[1];

    items.push({
      inquiryNo: block.match(/<INQUIRY_NO>(.*?)<\/INQUIRY_NO>/)?.[1],
      itemDate: block.match(/<ITEM_DATE>(.*?)<\/ITEM_DATE>/)?.[1],
      matCode: block.match(/<MAT_CODE>(.*?)<\/MAT_CODE>/)?.[1],
      description: block.match(/<DESCRIPTION>(.*?)<\/DESCRIPTION>/)?.[1],
      orderQty: block.match(/<ORDER_QTY>(.*?)<\/ORDER_QTY>/)?.[1],
      unit: block.match(/<UNIT>(.*?)<\/UNIT>/)?.[1],
      status: block.match(/<STATUS>(.*?)<\/STATUS>/)?.[1],
      reqDelDate: block.match(/<REQ_DEL_DATE>(.*?)<\/REQ_DEL_DATE>/)?.[1],
    });
  }

  resolve(items);
});

  });
};
