const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profilecontrollers');

// GET VENDOR PROFILE
router.get('/', profileController.getVendorProfile);

module.exports = router;
