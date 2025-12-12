// controllers/logincontrollers.js
const loginService = require("../services/loginservices");

exports.login = async (req, res) => {
    try {
        const { customerId, password } = req.body;

        if (!customerId || !password) {
            return res.status(400).json({ message: "Customer ID & Password required" });
        }

        const result = await loginService.customerLogin(customerId, password);

        return res.status(200).json({
            status: result.flag,
            message: result.message
        });

    } catch (err) {
        console.log("Login Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
