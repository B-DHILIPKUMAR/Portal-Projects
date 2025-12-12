// routes/memo.js

const express = require("express");
const router = express.Router();

const memoController = require("../controllers/memocontrollers");

// GET /memo/:customerId
router.get("/:customerId", memoController.getMemo);

module.exports = router;
