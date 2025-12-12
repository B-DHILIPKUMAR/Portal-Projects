// Backend/routes/payslip.js
const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/payslipcontrollers");

// GET /payslip?empId=0000000001
router.get("/", payslipController.getPayslip);

module.exports = router;
