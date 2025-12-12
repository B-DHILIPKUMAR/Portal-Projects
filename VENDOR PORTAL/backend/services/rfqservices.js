const request = require('request');
const xml2js = require('xml2js');

exports.getRFQService = (VendorId) => {
  return new Promise((resolve, reject) => {

    const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_RFQSet?$filter=VendorId eq '${VendorId}'`;

    const options = {
      method: 'GET',
      url: url,
      headers: {
        Authorization: 'Basic SzkwMTg3NzpARGhpbGlwOTAxODc3',
        Cookie: 'sap-usercontext=sap-client=100'
      }
    };

    request(options, function (error, response) {
      if (error) return reject(error);

      xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        try {
          let entries = result.feed.entry;

          // If only one RFQ entry, convert it into array
          if (!Array.isArray(entries)) {
            entries = [entries];
          }

          const finalData = entries.map(item => {
            const data = item.content["m:properties"];

            return {
              VendorId: data["d:VendorId"],
              RfqNumber: data["d:RfqNumber"],
              DocType: data["d:DocType"],
              PurchaseOrg: data["d:PurchaseOrg"],
              DocDate: data["d:DocDate"],
              MatNumber: data["d:MatNumber"],
              ShortText: data["d:ShortText"],
              Quantity: data["d:Quantity"],
              UnitMeasure: data["d:UnitMeasure"],
              NetPrice: data["d:NetPrice"],
              Currency: data["d:Currency"]
            };
          });

          resolve(finalData);

        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  });
};
