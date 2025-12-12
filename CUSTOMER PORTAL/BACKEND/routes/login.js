// routes/login.js
const express = require("express");
const router = express.Router();

const loginController = require("../controllers/logincontrollers");

// POST → /login
router.post("/", loginController.login);

module.exports = router;
