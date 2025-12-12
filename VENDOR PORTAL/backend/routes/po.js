const express = require('express');
const router = express.Router();
const poController = require('../controllers/pocontrollers');

// GET PO DATA
router.get('/', poController.getPODetails);

module.exports = router;
