// const request = require('request');
// const xml2js = require('xml2js');

// exports.getFormOdataService = (Belnr) => {
//   return new Promise((resolve, reject) => {

//     const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_FORMODATASet(Belnr='${Belnr}')`;

//     const options = {
//       method: 'GET',
//       url: url,
//       headers: {
//         Authorization: 'Basic SzkwMTg3NzpARGhpbGlwOTAxODc3',
//         Cookie: 'sap-usercontext=sap-client=100'
//       }
//     };

//     request(options, function (error, response) {
//       if (error) return reject(error);

//       xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
//         if (err) return reject(err);

//         try {
//           const data = result.entry.content["m:properties"];

//           const finalData = {
//             Belnr: data["d:Belnr"],
//             PdfString: data["d:PdfString"]   // ✅ Full Base64 PDF String
//           };

//           resolve(finalData);

//         } catch (parseError) {
//           reject(parseError);
//         }
//       });
//     });
//   });
// };
const request = require("request");

exports.getFormODataFromSAP = (belnr) => {
  return new Promise((resolve, reject) => {
    const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_FORMODATASet(Belnr='${belnr}')`;

    const options = {
      method: "GET",
      url: url,
      timeout: 20000,
      headers: {
        Authorization: "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3",
        Cookie: "sap-usercontext=sap-client=100"
      }
    };

    request(options, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response.body);
    });
  });
};
