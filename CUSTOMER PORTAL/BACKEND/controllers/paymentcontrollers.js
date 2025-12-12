// controllers/paymentcontrollers.js

const paymentService = require("../services/paymentservices");

exports.getPayment = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required to fetch payments" });
    }

    const paymentList = await paymentService.getPaymentList(customerId);

    return res.status(200).json({
      count: paymentList.length,
      payments: paymentList,
    });
  } catch (err) {
    console.log("Payment Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
