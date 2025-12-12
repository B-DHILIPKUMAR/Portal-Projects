// services/salesservices.js

const request = require("request");

const SALES_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_sales_rfc?sap-client=100";

exports.getSalesList = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_SALES>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_SALES>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: SALES_URL,
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

      // Extract <item> blocks
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml))) {
        const block = match[1];

        items.push({
          order_no: block.match(/<ORDER_NO>(.*?)<\/ORDER_NO>/)?.[1],
          order_date: block.match(/<ORDER_DATE>(.*?)<\/ORDER_DATE>/)?.[1],
          mat_code: block.match(/<MAT_CODE>(.*?)<\/MAT_CODE>/)?.[1],
          description: block.match(/<DESCRIPTION>(.*?)<\/DESCRIPTION>/)?.[1],
          order_qty: block.match(/<ORDER_QTY>(.*?)<\/ORDER_QTY>/)?.[1],
          unit: block.match(/<UNIT>(.*?)<\/UNIT>/)?.[1],
          status: block.match(/<STATUS>(.*?)<\/STATUS>/)?.[1],
          req_del_date: block.match(/<REQ_DEL_DATE>(.*?)<\/REQ_DEL_DATE>/)?.[1],
        });
      }

      resolve(items);
    });
  });
};
