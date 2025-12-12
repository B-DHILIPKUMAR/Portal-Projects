const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentcontrollers');

// GET PAYMENT DATA
router.get('/', paymentController.getPaymentDetails);

module.exports = router;
