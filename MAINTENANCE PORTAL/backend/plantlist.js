import express from "express";
import request from "request";

const router = express.Router();

const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_MAINT_877_ODATA_SRV/ZMAINT_PLANTSet";

const AUTH_HEADER = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

// ✅ GET Plant List
router.get("/", (req, res) => {
  const url = `${SAP_URL}?$format=json`;

  const options = {
    method: "GET",
    url: url,
    headers: {
      Authorization: AUTH_HEADER,
      Cookie: "sap-usercontext=sap-client=100",
    },
    strictSSL: false,
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    try {
      const sapResponse = JSON.parse(body);

      if (!sapResponse.d || !sapResponse.d.results) {
        return res.json({ success: true, data: [] });
      }

      // ✅ Clean response for Flutter
      const cleaned = sapResponse.d.results.map(item => ({
        MaintenanceEngineer: item.MaintenanceEngineer,
        Werks: item.Werks,
        Name1: item.Name1,
        Stras: item.Stras,
        Ort01: item.Ort01,
        Land1: item.Land1,
        Regio: item.Regio,
      }));

      res.json({
        success: true,
        data: cleaned,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Invalid JSON from SAP",
      });
    }
  });
});

export default router;