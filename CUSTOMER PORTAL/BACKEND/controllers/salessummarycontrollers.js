// controllers/salessummarycontrollers.js

const salesSummaryService = require("../services/salessummaryservices");

exports.getSalesSummary = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required to fetch sales summary" });
    }

    const summaryList = await salesSummaryService.getSalesSummary(customerId);

    return res.status(200).json({
      count: summaryList.length,
      summary: summaryList,
    });

  } catch (err) {
    console.log("Sales Summary Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
