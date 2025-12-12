const profileService = require('../services/profileservices');

exports.getVendorProfile = async (req, res) => {
  try {
    const { VendorId } = req.query;

    if (!VendorId) {
      return res.status(400).json({
        message: 'VendorId is required'
      });
    }

    const result = await profileService.getVendorProfileService(VendorId);

    res.status(200).json({
      message: 'Vendor profile fetched successfully',
      data: result
    });

  } catch (error) {
    console.error('Profile Controller Error:', error);
    res.status(500).json({
      message: 'Failed to fetch vendor profile',
      error: error.message
    });
  }
};
