const express = require('express');
const router = express.Router();
const formtableController = require('../controllers/formtablecontrollers');

// GET FORMTABLE DATA
router.get('/', formtableController.getFormTableDetails);

module.exports = router;
