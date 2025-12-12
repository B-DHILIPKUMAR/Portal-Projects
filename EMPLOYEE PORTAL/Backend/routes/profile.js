// Backend/routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profilecontrollers");

// GET /profile?iEmpId=0000000003
router.get("/", profileController.getProfile);

module.exports = router;
