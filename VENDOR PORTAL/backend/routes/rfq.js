const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqcontrollers');

// GET RFQ DATA
router.get('/', rfqController.getRFQDetails);

module.exports = router;
