// controllers/salescontrollers.js

const salesService = require("../services/salesservices");

exports.getSales = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required to fetch sales orders" });
    }

    const salesList = await salesService.getSalesList(customerId);

    return res.status(200).json({
      count: salesList.length,
      sales: salesList,
    });
  } catch (err) {
    console.log("Sales Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
