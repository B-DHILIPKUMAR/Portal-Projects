const express = require('express');
const router = express.Router();
const creditDebitController = require('../controllers/creditdebitcontrollers');

// GET CREDIT / DEBIT MEMO DETAILS
router.get('/', creditDebitController.getCreditDebitDetails);

module.exports = router;
