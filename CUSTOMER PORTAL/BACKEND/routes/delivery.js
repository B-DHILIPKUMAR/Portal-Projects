// routes/delivery.js

const express = require("express");
const router = express.Router();

const deliveryController = require("../controllers/deliverycontrollers");

// GET /delivery/:customerId
router.get("/:customerId", deliveryController.getDelivery);

module.exports = router;
