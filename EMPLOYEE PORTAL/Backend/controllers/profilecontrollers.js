// Backend/controllers/profilecontrollers.js
const profileService = require("../services/profileservices");

exports.getProfile = async (req, res) => {
  try {
    const iEmpId = req.query.iEmpId; // GET → query param

    if (!iEmpId) {
      return res.status(400).json({ message: "iEmpId is required" });
    }

    const result = await profileService.callSapProfile(iEmpId);
    res.status(200).json(result);

  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};
