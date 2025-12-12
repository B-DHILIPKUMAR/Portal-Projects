const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoicecontrollers');

// ✅ GET INVOICE LIST
// Example: /api?vendorId=0000100000
router.get('/', invoiceController.getInvoicesByVendor);

// ✅ DOWNLOAD PDF
// Example: /api/pdf/0000100000
router.get('/pdf/:belnr', invoiceController.getInvoicePdfByBelnr);

module.exports = router;
