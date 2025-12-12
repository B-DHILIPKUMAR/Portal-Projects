// routes/salessummary.js

const express = require("express");
const router = express.Router();

const summaryController = require("../controllers/salessummarycontrollers");

// GET /salessummary/:customerId
router.get("/:customerId", summaryController.getSalesSummary);

module.exports = router;
