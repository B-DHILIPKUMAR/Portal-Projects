// routes/inquiry.js

const express = require("express");
const router = express.Router();

const inquiryController = require("../controllers/inquirycontrollers");

// GET /inquiry/:customerId
router.get("/:customerId", inquiryController.getInquiry);

module.exports = router;
