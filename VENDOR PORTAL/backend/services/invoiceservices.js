const request = require('request');
const xml2js = require('xml2js');

const SAP_BASE_URL = 'http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_VENDOR_877_ODATA_SRV';
const FORM_TABLE_ENDPOINT = '/ZVEN_FORMTABLESet';
const FORM_ODATA_ENDPOINT = '/ZVEN_FORMODATASet';

const AUTH_HEADER = 'Basic SzkwMTg3NzpARGhpbGlwOTAxODc3';
const COOKIE = 'sap-usercontext=sap-client=100';

// ✅ FETCH INVOICE LIST
exports.fetchInvoicesByVendor = (vendorId) => {
  return new Promise((resolve, reject) => {
    const url = `${SAP_BASE_URL}${FORM_TABLE_ENDPOINT}?$filter=VendorId eq '${vendorId}'`;

    const options = {
      method: 'GET',
      url,
      headers: {
        Authorization: AUTH_HEADER,
        Cookie: COOKIE
      }
    };

    request(options, (error, response) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) {
        return reject(new Error(`SAP Error: ${response.statusCode}`));
      }

      xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        let entries = result.feed.entry || [];
        if (!Array.isArray(entries)) entries = [entries];

        const invoices = entries.map(item => {
          const data = item.content['m:properties'];

          return {
            vendorId: data['d:VendorId'] || '',
            invoiceNo: data['d:InvoiceNo'] || '',
            invoiceDate: data['d:InvoiceDate'] || '',
            totalAmount: data['d:TotalAmount'] || '',
            currency: data['d:Currency'] || '',
            paymentTerms: data['d:PaymentTerms'] || '',
            poNo: data['d:PoNo'] || '',
            poItem: data['d:PoItem'] || '',
            materialNo: data['d:MaterialNo'] || '',
            description: data['d:Description'] || '',
            quantity: data['d:Quantity'] || '',
            unitPrice: data['d:UnitPrice'] || '',
            unit: data['d:Unit'] || ''
          };
        });

        resolve(invoices);
      });
    });
  });
};

// ✅ FETCH PDF BY BELNR
exports.fetchInvoicePdfByBelnr = (belnr) => {
  return new Promise((resolve, reject) => {
    const url = `${SAP_BASE_URL}${FORM_ODATA_ENDPOINT}(Belnr='${belnr}')`;

    const options = {
      method: 'GET',
      url,
      headers: {
        Authorization: AUTH_HEADER,
        Cookie: COOKIE
      }
    };

    request(options, (error, response) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) {
        return reject(new Error(`SAP PDF Error: ${response.statusCode}`));
      }

      xml2js.parseString(response.body, { explicitArray: false }, (err, result) => {
        if (err) return reject(err);

        const pdfString =
          result?.entry?.content?.['m:properties']?.['d:PdfString'];

        if (!pdfString) {
          return reject(new Error('PdfString not found in SAP response'));
        }

        const pdfBuffer = Buffer.from(pdfString, 'base64');
        resolve(pdfBuffer);
      });
    });
  });
};
