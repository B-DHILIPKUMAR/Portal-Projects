// const loginService = require("../services/loginservices");

// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const result = await loginService.validateUser(username, password);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// Backend/controllers/logincontrollers.js
const loginService = require("../services/loginservices");

exports.loginUser = async (req, res) => {
  try {
    // Accept body either as { iEmpId, iPassword } OR allow a raw SOAP envelope string in req.body.soap (flexible)
    const { iEmpId, iPassword, soap } = req.body;

    let result;
    if (soap) {
      // If client sends a full SOAP envelope as string:
      result = await loginService.callSapWithRawSoap(soap);
    } else {
      // Otherwise use the structured fields
      if (!iEmpId || !iPassword) {
        return res.status(400).json({ message: "iEmpId and iPassword are required" });
      }
      result = await loginService.callSapLogin(iEmpId, iPassword);
    }

    // result is an object with parsed values
    return res.status(200).json(result);
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
