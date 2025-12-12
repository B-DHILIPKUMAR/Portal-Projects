// controllers/inquirycontrollers.js

const inquiryService = require("../services/inquiryservices");

exports.getInquiry = async (req, res) => {
  try {
    const customerId = req.params.customerId; // GET PARAM

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required to fetch inquiries" });
    }

    const inquiries = await inquiryService.getInquiryDetails(customerId);

    return res.status(200).json({
      count: inquiries.length,
      inquiries,
    });
  } catch (err) {
    console.log("Inquiry Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
