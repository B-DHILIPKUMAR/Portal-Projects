const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoicecontrollers");

// Get Invoice List
router.post("/invoice/list", invoiceController.getInvoiceList);

// Get Invoice PDF
router.post("/invoice/pdf", invoiceController.downloadInvoicePDF);

module.exports = router;
