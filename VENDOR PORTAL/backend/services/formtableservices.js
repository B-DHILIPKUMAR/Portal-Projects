const request = require('request');
const xml2js = require('xml2js');

exports.getFormTableService = (VendorId) => {
  return new Promise((resolve, reject) => {

    const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_FORMTABLESet?$filter=VendorId eq '${VendorId}'`;

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
          // ✅ HANDLE EMPTY FEED SAFELY
          if (!result.feed || !result.feed.entry) {
            return resolve([]);   // ✅ RETURN EMPTY ARRAY IF NO DATA
          }

          let entries = result.feed.entry;

          if (!Array.isArray(entries)) {
            entries = [entries];
          }

          const finalData = entries.map(item => {
            const data = item.content["m:properties"];

            return {
              VendorId: data["d:VendorId"] || '',
              FormId: data["d:FormId"] || '',
              FormName: data["d:FormName"] || '',
              CreatedDate: data["d:CreatedDate"] || ''
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
