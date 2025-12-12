// services/memoservices.js

const request = require("request");

const MEMO_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_memo_rfc?sap-client=100";

exports.getMemoList = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_MEMO>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_MEMO>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: MEMO_URL,
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
          bill_no: block.match(/<BILL_NO>(.*?)<\/BILL_NO>/)?.[1],
          bill_date: block.match(/<BILL_DATE>(.*?)<\/BILL_DATE>/)?.[1],
          bill_type: block.match(/<BILL_TYPE>(.*?)<\/BILL_TYPE>/)?.[1],
          mat_code: block.match(/<MAT_CODE>(.*?)<\/MAT_CODE>/)?.[1],
          description: block.match(/<DESCRIPTION>(.*?)<\/DESCRIPTION>/)?.[1],
          quantity: block.match(/<QUANTITY>(.*?)<\/QUANTITY>/)?.[1],
          unit: block.match(/<UNIT>(.*?)<\/UNIT>/)?.[1],
          net_amount: block.match(/<NET_AMOUNT>(.*?)<\/NET_AMOUNT>/)?.[1],
          currency: block.match(/<CURRENCY>(.*?)<\/CURRENCY>/)?.[1],
        });
      }

      resolve(items);
    });
  });
};
