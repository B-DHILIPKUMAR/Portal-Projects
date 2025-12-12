// Backend/controllers/leavecontrollers.js
const leaveService = require("../services/leaveservices");

exports.getLeave = async (req, res) => {
  try {
    const empId = req.query.empId;

    if (!empId) {
      return res.status(400).json({ error: "empId is required" });
    }

    const result = await leaveService.fetchLeave(empId);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Leave Controller Error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
