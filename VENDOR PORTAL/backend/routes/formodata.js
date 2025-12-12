// const express = require('express');
// const router = express.Router();
// const formodataController = require('../controllers/formodatacontrollers');

// // GET FORM ODATA (PDF STRING)
// router.get('/', formodataController.getFormOdata);

// module.exports = router;
const express = require("express");
const router = express.Router();
const formodataController = require("../controllers/formodatacontrollers");

router.get("/formodata", formodataController.getFormOData);

module.exports = router;
