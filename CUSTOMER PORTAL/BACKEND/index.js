// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const loginRoutes = require("./routes/login");
const profileRoutes = require("./routes/profile");
const inquiryRoutes = require("./routes/inquiry");
const deliveryRoutes = require("./routes/delivery");
const memoRoutes = require("./routes/memo");
const salesRoutes = require("./routes/sales");
const paymentRoutes = require("./routes/payment");
const salesSummaryRoutes = require("./routes/salessummary");
const invoiceRoutes = require("./routes/invoice"); // NEW

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/login", loginRoutes);
app.use("/profile", profileRoutes);
app.use("/inquiry", inquiryRoutes);
app.use("/delivery", deliveryRoutes);
app.use("/memo", memoRoutes);
app.use("/sales", salesRoutes);
app.use("/payment", paymentRoutes);
app.use("/salessummary", salesSummaryRoutes); 
app.use("/invoice", invoiceRoutes); // NEW 

app.get("/", (req, res) => {
    res.send("Customer Portal Backend Running...");
});

// PORT
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
