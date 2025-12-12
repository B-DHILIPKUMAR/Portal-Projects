const grService = require('../services/grservices');

exports.getGRDetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await grService.getGRService(VendorId);

    res.status(200).json({
      message: 'GR data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('GR Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch GR details',
      error: error.message
    });
  }
};
