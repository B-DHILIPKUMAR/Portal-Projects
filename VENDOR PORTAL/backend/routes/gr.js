const express = require('express');
const router = express.Router();
const grController = require('../controllers/grcontrollers');

// GET GR DATA
router.get('/', grController.getGRDetails);

module.exports = router;
