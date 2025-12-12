const request = require('request');
const xml2js = require('xml2js');

exports.getVendorProfileService = (VendorId) => {
  return new Promise((resolve, reject) => {

    const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_PROFILESet(VendorId='${VendorId}')`;

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
          const data = result.entry.content["m:properties"];

          const finalData = {
            VendorId: data["d:VendorId"],
            Name: data["d:Name"],
            Street: data["d:Street"],
            City: data["d:City"],
            PostalCode: data["d:PostalCode"],
            Country: data["d:Country"],
            Email: data["d:Email"],
            Telephone: data["d:Telephone"]
          };

          resolve(finalData);

        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  });
};
