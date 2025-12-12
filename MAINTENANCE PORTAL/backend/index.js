import express from "express";
import cors from "cors";

import { validateLogin } from "./login.js";
import notificationRoutes from "./notification.js";
import plantlistRoutes from "./plantlist.js";
import workorderRoutes from "./workorder.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/notifications", notificationRoutes);
app.use("/api/plants", plantlistRoutes);
app.use("/api/workorders", workorderRoutes);


// LOGIN API
app.get("/api/login", async (req, res) => {
  const { engineerId, password } = req.query;


  if (!engineerId || !password) {
    return res.status(400).json({
      success: false,
      error: "Engineer ID & Password are required",
    });
  }

  try {
    const result = await validateLogin(engineerId, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Maintenance Server running at http://localhost:${PORT}`);
});
