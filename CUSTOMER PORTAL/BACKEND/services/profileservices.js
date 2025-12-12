// // services/profileservices.js
// const request = require('request');

// const PROFILE_URL = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_profile_rfc?sap-client=100";

// exports.getCustomerProfile = (customerNumber) => {
//     return new Promise((resolve, reject) => {

//         const soapBody = `
//         <?xml version="1.0" encoding="UTF-8"?>
//         <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
//                           xmlns:tns="urn:sap-com:document:sap:rfc:functions">
//           <soapenv:Header/>
//           <soapenv:Body>
//             <tns:ZBDK_FM_PROFILE>
//               <IV_KUNNR>${customerNumber}</IV_KUNNR>
//             </tns:ZBDK_FM_PROFILE>
//           </soapenv:Body>
//         </soapenv:Envelope>`;

//         const options = {
//             method: "POST",         // SOAP must always be POST
//             url: PROFILE_URL,
//             headers: {
//                 "Content-Type": "text/xml",
//                 "Authorization": "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3",
//                 "Cookie": "sap-usercontext=sap-client=100"
//             },
//             body: soapBody
//         };

//         request(options, (error, response) => {
//             if (error) return reject(error);

//             const xml = response.body;

//             const obj = {
//                 customer_number: xml.match(/<CUSTOMER_NUMBER>(.*?)<\/CUSTOMER_NUMBER>/)?.[1],
//                 name: xml.match(/<NAME>(.*?)<\/NAME>/)?.[1],
//                 street: xml.match(/<STREET>(.*?)<\/STREET>/)?.[1],
//                 city: xml.match(/<CITY>(.*?)<\/CITY>/)?.[1],
//                 country: xml.match(/<COUNTRY>(.*?)<\/COUNTRY>/)?.[1],
//                 postal: xml.match(/<POSTAL>(.*?)<\/POSTAL>/)?.[1],
//                 message: xml.match(/<EV_MESSAGE>(.*?)<\/EV_MESSAGE>/)?.[1]
//             };

//             resolve(obj);
//         });
//     });
// };



// services/profileservices.js
const request = require('request');

const PROFILE_URL = "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zbdk_profile_rfc?sap-client=100";

exports.getCustomerProfile = (customerNumber) => {
    return new Promise((resolve, reject) => {

        const soapBody = `
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:tns="urn:sap-com:document:sap:rfc:functions">
          <soapenv:Header/>
          <soapenv:Body>
            <tns:ZBDK_FM_PROFILE>
              <IV_KUNNR>${customerNumber}</IV_KUNNR>
            </tns:ZBDK_FM_PROFILE>
          </soapenv:Body>
        </soapenv:Envelope>`;

        const options = {
            method: "POST",
            url: PROFILE_URL,
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

            const obj = {
                customer_number: xml.match(/<CUSTOMER_NUMBER>(.*?)<\/CUSTOMER_NUMBER>/)?.[1],
                name: xml.match(/<NAME>(.*?)<\/NAME>/)?.[1],
                street: xml.match(/<STREET>(.*?)<\/STREET>/)?.[1],
                city: xml.match(/<CITY>(.*?)<\/CITY>/)?.[1],
                country: xml.match(/<COUNTRY>(.*?)<\/COUNTRY>/)?.[1],
                postal: xml.match(/<POSTAL>(.*?)<\/POSTAL>/)?.[1],
                message: xml.match(/<EV_MESSAGE>(.*?)<\/EV_MESSAGE>/)?.[1]
            };

            resolve(obj);
        });
    });
};
