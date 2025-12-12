const loginService = require('../services/loginservices');

exports.vendorLogin = async (req, res) => {
  try {
    const { VendorId, Password } = req.query;

    if (!VendorId || !Password) {
      return res.status(400).json({
        message: 'VendorId and Password are required'
      });
    }

    const result = await loginService.vendorLoginService(VendorId, Password);

    res.status(200).json({
      message: 'Login successful',
      data: result
    });

  } catch (error) {
    console.error('Login Controller Error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
};
