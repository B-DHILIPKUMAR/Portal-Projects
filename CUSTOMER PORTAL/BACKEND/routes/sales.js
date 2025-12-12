// routes/sales.js

const express = require("express");
const router = express.Router();

const salesController = require("../controllers/salescontrollers");

// GET /sales/:customerId
router.get("/:customerId", salesController.getSales);

module.exports = router;
