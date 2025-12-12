const creditDebitService = require('../services/creditdebitservices');

exports.getCreditDebitDetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await creditDebitService.getCreditDebitService(VendorId);

    res.status(200).json({
      message: 'Credit/Debit memo data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('Credit Debit Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch credit/debit memo details',
      error: error.message
    });
  }
};
