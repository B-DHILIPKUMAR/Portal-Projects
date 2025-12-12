import express from "express";
import request from "request";

const router = express.Router();

const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_MAINT_877_ODATA_SRV/ZMAINT_WORKORDERSet";

const AUTH_HEADER = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

// ✅ GET Workorders by Plant (Werks)
router.get("/", (req, res) => {
  const { werks } = req.query;

  if (!werks) {
    return res.status(400).json({
      success: false,
      error: "Missing werks parameter",
    });
  }

  const url = `${SAP_URL}?$filter=Werks eq '${werks}'&$format=json`;

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

      // ✅ Clean only required fields
      const cleaned = sapResponse.d.results.map(item => ({
        Aufnr: item.Aufnr,
        Auart: item.Auart,
        Ktext: item.Ktext,
        Erdat: item.Erdat,
        Autyp: item.Autyp,
        Bukrs: item.Bukrs,
        Sowrk: item.Sowrk,
        Werks: item.Werks,
        Kappl: item.Kappl,
        Kalsm: item.Kalsm,
        Vaplz: item.Vaplz,
        Kostl: item.Kostl,
        Phas0: item.Phas0,
        Phas1: item.Phas1,
        Phas2: item.Phas2,
        Phas3: item.Phas3,
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
