const poService = require('../services/poservices');

exports.getPODetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await poService.getPOService(VendorId);

    res.status(200).json({
      message: 'PO data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('PO Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch PO details',
      error: error.message
    });
  }
};
