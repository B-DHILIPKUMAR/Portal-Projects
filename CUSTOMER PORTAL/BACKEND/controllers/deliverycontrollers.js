// controllers/deliverycontrollers.js

const deliveryService = require("../services/deliveryservices");

exports.getDelivery = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required for delivery details" });
    }

    const deliveryList = await deliveryService.getDeliveryList(customerId);

    return res.status(200).json({
      count: deliveryList.length,
      deliveries: deliveryList,
    });
  } catch (err) {
    console.log("Delivery Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
