const rfqService = require('../services/rfqservices');

exports.getRFQDetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await rfqService.getRFQService(VendorId);

    res.status(200).json({
      message: 'RFQ data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('RFQ Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch RFQ details',
      error: error.message
    });
  }
};
