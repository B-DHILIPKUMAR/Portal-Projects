// const formodataService = require('../services/formodataservices');

// exports.getFormOdata = async (req, res) => {
//   try {
//     const { Belnr } = req.query;

//     if (!Belnr) {
//       return res.status(400).json({
//         message: 'Belnr is required'
//       });
//     }

//     const result = await formodataService.getFormOdataService(Belnr);

//     res.status(200).json({
//       message: 'Form OData fetched successfully',
//       data: result
//     });

//   } catch (error) {
//     console.error('Form OData Controller Error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch Form OData',
//       error: error.message
//     });
//   }
// };
const xml2js = require("xml2js");
const formodataService = require("../services/formodataservices");

exports.getFormOData = async (req, res) => {
  try {
    const { Belnr } = req.query;

    if (!Belnr) {
      return res.status(400).json({
        message: "Belnr is required"
      });
    }

    const sapResponse = await formodataService.getFormODataFromSAP(Belnr);

    xml2js.parseString(sapResponse, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "XML Parsing Failed",
          error: err.message
        });
      }

      try {
        const pdfBase64 =
          result?.entry?.content?.["m:properties"]?.["d:PdfString"];

        if (!pdfBase64) {
          return res.status(404).json({
            message: "PDF data not found"
          });
        }

        const pdfBuffer = Buffer.from(pdfBase64, "base64");

        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${Belnr}.pdf"`,
          "Content-Length": pdfBuffer.length
        });

        res.send(pdfBuffer);
      } catch (error) {
        res.status(500).json({
          message: "PDF Extraction Failed",
          error: error.message
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Form OData",
      error: error.message
    });
  }
};
