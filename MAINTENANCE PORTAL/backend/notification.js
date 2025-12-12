import express from "express";
import request from "request";

const router = express.Router();

const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_MAINT_877_ODATA_SRV/ZMAINT_NOTIFYSet";

const AUTH_HEADER = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

// ✅ GET Notifications by Iwerk
router.get("/", (req, res) => {
  const { iwerk } = req.query;

  if (!iwerk) {
    return res.status(400).json({
      success: false,
      error: "Missing iwerk parameter",
    });
  }

  const url = `${SAP_URL}?$filter=Iwerk eq '${iwerk}'&$format=json`;

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

      // ✅ No records
      if (!sapResponse.d || !sapResponse.d.results) {
        return res.json({ success: true, data: [] });
      }

      // ✅ Clean & forward only required fields
      const cleaned = sapResponse.d.results.map(item => ({
        Qmnum: item.Qmnum,
        Iwerk: item.Iwerk,
        Iloan: item.Iloan,
        Equnr: item.Equnr,
        Ausvn: item.Ausvn,
        Qmtxt: item.Qmtxt,
        Priok: item.Priok,
        Erdat: item.Erdat,
        Abckz: item.Abckz,
        Strmn: item.Strmn,
        Strur: item.Strur,
        Aufnr: item.Aufnr,
        Arbplwerk: item.Arbplwerk,
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
