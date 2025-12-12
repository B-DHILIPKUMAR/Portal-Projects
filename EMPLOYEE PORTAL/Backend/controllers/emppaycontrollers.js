// const emppayService = require("../services/emppayservices");

// exports.getEmpPay = async (req, res) => {
//   try {
//     const empId = req.query.empId;

//     if (!empId) {
//       return res.status(400).json({ error: "empId is required" });
//     }

//     const result = await emppayService.fetchEmpPay(empId);

//     return res.status(200).json(result);
//   } catch (err) {
//     console.error("EmpPay Controller Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// const emppayService = require("../services/emppayservices");

// exports.getEmpPay = async (req, res) => {
//   try {
//     const empId = req.query.empId;

//     if (!empId) {
//       return res.status(400).json({ error: "empId is required" });
//     }

//     const result = await emppayService.fetchEmpPay(empId);

//     return res.status(200).json(result);
//   } catch (err) {
//     console.error("EmpPay Controller Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



const emppayService = require("../services/emppayservices");

exports.getEmpPay = async (req, res) => {
  try {
    const empId = req.query.empId;

    if (!empId) {
      return res.status(400).json({ error: "empId is required" });
    }

    const result = await emppayService.fetchEmpPay(empId);

    return res.status(200).json(result);
  } catch (err) {
    console.error("EmpPay Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ⭐ NEW METHOD FOR PDF DOWNLOAD
exports.downloadEmpPayPDF = async (req, res) => {
  try {
    const empId = req.query.empId;

    if (!empId) {
      return res.status(400).json({ message: "empId is required" });
    }

    const pdfBuffer = await emppayService.fetchEmpPayPDF(empId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=emppay_${empId}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("Error fetching EmpPay PDF:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message || error });
  }
};
