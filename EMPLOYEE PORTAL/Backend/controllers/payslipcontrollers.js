// Backend/controllers/payslipcontrollers.js
const payslipService = require("../services/payslipservices");

exports.getPayslip = async (req, res) => {
  try {
    const empId = req.query.empId;
    if (!empId) {
      return res.status(400).json({ error: "empId query parameter is required" });
    }

    const result = await payslipService.fetchPayslip(empId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Payslip Controller Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
