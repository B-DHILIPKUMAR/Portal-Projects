// controllers/memocontrollers.js

const memoService = require("../services/memoservices");

exports.getMemo = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID is required to fetch memo details" });
    }

    const memoList = await memoService.getMemoList(customerId);

    return res.status(200).json({
      count: memoList.length,
      memos: memoList,
    });
  } catch (err) {
    console.log("Memo Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
