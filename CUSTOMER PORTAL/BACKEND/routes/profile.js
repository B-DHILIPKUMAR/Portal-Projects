// routes/profile.js

const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profilecontrollers");

// GET /profile/:customerNumber
router.get("/:customerNumber", profileController.getProfile);

module.exports = router;
