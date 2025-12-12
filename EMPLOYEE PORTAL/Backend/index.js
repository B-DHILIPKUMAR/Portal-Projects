// // const express = require("express");
// // const bodyParser = require("body-parser");
// // const cors = require("cors");

// // // Import Routes
// // const loginRoutes = require("./routes/login");

// // const app = express();
// // const PORT = 8000;

// // // Middlewares
// // app.use(cors());
// // app.use(bodyParser.json());

// // // Routes
// // app.use("/login", loginRoutes);

// // // Default Route
// // app.get("/", (req, res) => {
// //   res.send("Employee Portal Backend Running...");
// // });

// // // Start Server
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });


// // Backend/index.js
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");

// const loginRoutes = require("./routes/login");
// const profileRoutes = require("./routes/profile");
// const emppayRoutes = require("./routes/emppay");

// const app = express();
// const PORT = process.env.PORT || 8000;

// app.use(cors());
// app.use(bodyParser.json());

// // mount login routes
// app.use("/login", loginRoutes);
// app.use("/profile", profileRoutes);
// app.use("/emppay", emppayRoutes);

// // default
// app.get("/", (req, res) => res.send("Employee Portal Backend Running..."));

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const cors = require("cors");

const loginRoutes = require("./routes/login");
const profileRoutes = require("./routes/profile");
const emppayRoutes = require("./routes/emppay");
const leaveRoutes = require("./routes/leave");
const payslipRoutes = require("./routes/payslip");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use("/login", loginRoutes);
app.use("/profile", profileRoutes);
app.use("/emppay", emppayRoutes);
app.use("/leave", leaveRoutes);
app.use("/payslip", payslipRoutes);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

