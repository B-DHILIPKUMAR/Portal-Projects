// const express = require("express");
// const router = express.Router();
// const emppayController = require("../controllers/emppaycontrollers");

// // GET /emppay?empId=0000000001
// router.get("/", emppayController.getEmpPay);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const emppayController = require("../controllers/emppaycontrollers");

// // GET /emppay?empId=0000000001
// router.get("/", emppayController.getEmpPay);

// module.exports = router;



const express = require("express");
const router = express.Router();
const emppayController = require("../controllers/emppaycontrollers");

// Get normal EmpPay details
router.get("/", emppayController.getEmpPay);

// ⭐ New PDF download route
// GET /emppay/pdf?empId=0000000001
router.get("/pdf", emppayController.downloadEmpPayPDF);

module.exports = router;
