// const express = require("express");
// const router = express.Router();
// const loginController = require("../controllers/logincontrollers");

// router.post("/", loginController.loginUser);

// module.exports = router;


// Backend/routes/login.js
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/logincontrollers");

// POST /login (expects JSON body with iEmpId and iPassword OR reuses full SOAP body data)
router.post("/", loginController.loginUser);

module.exports = router;
