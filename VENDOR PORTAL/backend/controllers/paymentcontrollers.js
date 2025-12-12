const paymentService = require('../services/paymentservices');

exports.getPaymentDetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await paymentService.getPaymentService(VendorId);

    res.status(200).json({
      message: 'Payment data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('Payment Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};
