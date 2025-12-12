const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincontrollers');

// LOGIN API
router.get('/', loginController.vendorLogin);

module.exports = router;
