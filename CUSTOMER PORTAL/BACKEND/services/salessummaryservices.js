// services/salessummaryservices.js

const request = require("request");

const SALESSUMMARY_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_sales_summary_rfc?sap-client=100";

exports.getSalesSummary = (customerId) => {
  return new Promise((resolve, reject) => {
    const soapBody = `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:tns="urn:sap-com:document:sap:rfc:functions">
      <soapenv:Header/>
      <soapenv:Body>
        <tns:ZBDK_FM_SALESSUMMARY>
          <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        </tns:ZBDK_FM_SALESSUMMARY>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const options = {
      method: "POST",
      url: SALESSUMMARY_URL,
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

      // Extract <item> blocks from ET_OVERALL_SALES
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml))) {
        const block = match[1];

        items.push({
          billing_doc_no: block.match(/<BILLING_DOC_NO>(.*?)<\/BILLING_DOC_NO>/)?.[1],
          billing_date: block.match(/<BILLING_DATE>(.*?)<\/BILLING_DATE>/)?.[1],
          customer_id: block.match(/<CUSTOMER_ID>(.*?)<\/CUSTOMER_ID>/)?.[1],
          sales_org: block.match(/<SALES_ORG>(.*?)<\/SALES_ORG>/)?.[1],
          distribution_channel: block.match(/<DISTRIBUTION_CHANNEL>(.*?)<\/DISTRIBUTION_CHANNEL>/)?.[1],
          division: block.match(/<DIVISION>(.*?)<\/DIVISION>/)?.[1],
          currency: block.match(/<CURRENCY>(.*?)<\/CURRENCY>/)?.[1],
          net_value: block.match(/<NET_VALUE>(.*?)<\/NET_VALUE>/)?.[1],
          billing_type: block.match(/<BILLING_TYPE>(.*?)<\/BILLING_TYPE>/)?.[1],
          item_no: block.match(/<ITEM_NO>(.*?)<\/ITEM_NO>/)?.[1],
          material_no: block.match(/<MATERIAL_NO>(.*?)<\/MATERIAL_NO>/)?.[1],
          material_desc: block.match(/<MATERIAL_DESC>(.*?)<\/MATERIAL_DESC>/)?.[1],
          billed_qty: block.match(/<BILLED_QTY>(.*?)<\/BILLED_QTY>/)?.[1],
          sales_unit: block.match(/<SALES_UNIT>(.*?)<\/SALES_UNIT>/)?.[1],
        });
      }

      resolve(items);
    });
  });
};
