// services/loginservices.js
const request = require('request');

const LOGIN_URL = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_login_rfc?sap-client=100";

exports.customerLogin = (customerId, password) => {
    return new Promise((resolve, reject) => {

        const soapBody = `
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:tns="urn:sap-com:document:sap:rfc:functions">
          <soapenv:Header/>
          <soapenv:Body>
            <tns:ZBDK_LOGIN_FM>
              <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
              <IV_PASSWORD>${password}</IV_PASSWORD>
            </tns:ZBDK_LOGIN_FM>
          </soapenv:Body>
        </soapenv:Envelope>`;

        const options = {
            method: "POST",
            url: LOGIN_URL,
            headers: {
                "Content-Type": "text/xml",
                "Authorization": "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3",
                "Cookie": "sap-usercontext=sap-client=100"
            },
            body: soapBody
        };

        request(options, (error, response) => {
            if (error) return reject(error);

            const xml = response.body;

            // Extract values EV_FLAG and EV_MESSAGE
            const flag = xml.match(/<EV_FLAG>(.*?)<\/EV_FLAG>/)?.[1];
            const msg = xml.match(/<EV_MESSAGE>(.*?)<\/EV_MESSAGE>/)?.[1];

            resolve({ flag, message: msg });
        });
    });
};




