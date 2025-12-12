// Backend/routes/leave.js
const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leavecontrollers");

// GET /leave?empId=0000000001
router.get("/", leaveController.getLeave);

module.exports = router;
