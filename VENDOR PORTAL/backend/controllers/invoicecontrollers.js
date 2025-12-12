const invoiceService = require('../services/invoiceservices');

// ✅ GET INVOICE LIST
exports.getInvoicesByVendor = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required' });
    }

    const invoices = await invoiceService.fetchInvoicesByVendor(vendorId);

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    console.error('Invoice Fetch Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Invoice fetch failed',
      error: error.message
    });
  }
};

// ✅ DOWNLOAD PDF BY BELNR
exports.getInvoicePdfByBelnr = async (req, res) => {
  try {
    const belnr = req.params.belnr;

    if (!belnr) {
      return res.status(400).json({ success: false, message: 'belnr is required' });
    }

    const pdfBuffer = await invoiceService.fetchInvoicePdfByBelnr(belnr);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice_${belnr}.pdf`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Download Error:', error);
    return res.status(500).json({
      success: false,
      message: 'PDF download failed',
      error: error.message
    });
  }
};
