const invoiceService = require("../services/invoiceservices");

// =============================
// GET INVOICE LIST
// =============================
exports.getInvoiceList = async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID is required" });
    }

    const invoiceList = await invoiceService.fetchInvoiceList(customerId);
    return res.status(200).json({
      success: true,
      customerId,
      invoices: invoiceList,
    });

  } catch (error) {
    console.error("❌ Error Fetching Invoice List:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// =============================
// DOWNLOAD INVOICE PDF
// =============================
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const { invoiceNumber } = req.body;
    if (!invoiceNumber) {
      return res.status(400).json({ success: false, message: "Invoice Number is required" });
    }

    const pdfBuffer = await invoiceService.fetchInvoicePDF(invoiceNumber);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${invoiceNumber}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("❌ Error Fetching Invoice PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
