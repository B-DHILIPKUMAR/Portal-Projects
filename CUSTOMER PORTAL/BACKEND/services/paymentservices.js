// services/paymentservices.js

const request = require("request");

const PAYMENT_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_payment_rfc?sap-client=100";

exports.getPaymentList = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_PAYMENT>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_PAYMENT>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: PAYMENT_URL,
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

      // Extract <item> from ET_PAYMENT_LIST
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml))) {
        const block = match[1];

        items.push({
          billing_doc_no: block.match(/<BILLING_DOC_NO>(.*?)<\/BILLING_DOC_NO>/)?.[1],
          billing_date: block.match(/<BILLING_DATE>(.*?)<\/BILLING_DATE>/)?.[1],
          due_date: block.match(/<DUE_DATE>(.*?)<\/DUE_DATE>/)?.[1],
          net_value: block.match(/<NET_VALUE>(.*?)<\/NET_VALUE>/)?.[1],
          currency: block.match(/<CURRENCY>(.*?)<\/CURRENCY>/)?.[1],
          aging_days: block.match(/<AGING_DAYS>(.*?)<\/AGING_DAYS>/)?.[1]?.trim(),
        });
      }

      resolve(items);
    });
  });
};
