const formtableService = require('../services/formtableservices');

exports.getFormTableDetails = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await formtableService.getFormTableService(VendorId);

    res.status(200).json({
      message: 'FormTable data fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('FormTable Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch FormTable details',
      error: error.message
    });
  }
};
