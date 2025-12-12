// controllers/profilecontrollers.js

const profileService = require("../services/profileservices");

exports.getProfile = async (req, res) => {
    try {
        const customerNumber = req.params.customerNumber;  // GET PARAM

        if (!customerNumber) {
            return res.status(400).json({ message: "Customer Number is required" });
        }

        const profile = await profileService.getCustomerProfile(customerNumber);

        return res.status(200).json(profile);

    } catch (err) {
        console.log("Profile Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
