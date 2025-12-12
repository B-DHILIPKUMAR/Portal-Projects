const request = require('request');
const xml2js = require('xml2js');

exports.getPaymentService = (VendorId) => {
  return new Promise((resolve, reject) => {

    const url = `http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV/ZVEN_PAYMENTSet?$filter=VendorId eq '${VendorId}'`;

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

          // If only one payment record, convert to array
          if (!Array.isArray(entries)) {
            entries = [entries];
          }

          const finalData = entries.map(item => {
            const data = item.content["m:properties"];

            return {
              VendorId: data["d:VendorId"],
              InvoiceNumber: data["d:InvoiceNumber"],
              FiscalYear: data["d:FiscalYear"],
              InvoiceDate: data["d:InvoiceDate"],
              DueDate: data["d:DueDate"],
              Amount: data["d:Amount"],
              Currency: data["d:Currency"],
              AgingDays: data["d:AgingDays"]
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
