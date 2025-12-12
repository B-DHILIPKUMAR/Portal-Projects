// routes/payment.js

const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentcontrollers");

// GET /payment/:customerId
router.get("/:customerId", paymentController.getPayment);

module.exports = router;
