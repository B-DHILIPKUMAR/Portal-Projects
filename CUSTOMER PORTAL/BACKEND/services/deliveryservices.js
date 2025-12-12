// services/deliveryservices.js

const request = require("request");

const DELIVERY_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_delivery_rfc?sap-client=100";

exports.getDeliveryList = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_DELIVERY>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_DELIVERY>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: DELIVERY_URL,
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
          delivery_no: block.match(/<DELIVERY_NO>(.*?)<\/DELIVERY_NO>/)?.[1],
          delivery_date: block.match(/<DELIVERY_DATE>(.*?)<\/DELIVERY_DATE>/)?.[1],
          status: block.match(/<STATUS>(.*?)<\/STATUS>/)?.[1],
          gi_date: block.match(/<GI_DATE>(.*?)<\/GI_DATE>/)?.[1],
          mat_code: block.match(/<MAT_CODE>(.*?)<\/MAT_CODE>/)?.[1],
          description: block.match(/<DESCRIPTION>(.*?)<\/DESCRIPTION>/)?.[1],
          delivery_qty: block.match(/<DELIVERY_QTY>(.*?)<\/DELIVERY_QTY>/)?.[1],
          target_qty: block.match(/<TARGET_QTY>(.*?)<\/TARGET_QTY>/)?.[1],
          unit: block.match(/<UNIT>(.*?)<\/UNIT>/)?.[1]
        });
      }

      resolve(items);
    });
  });
};
