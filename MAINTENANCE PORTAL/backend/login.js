import fetch from "node-fetch";
import { parseString } from "xml2js";

const SAP_URL =
  "http://172.17.19.24:8000/sap/opu/odata/SAP/ZMM_MAINT_877_ODATA_SRV";

const AUTH_HEADER = "Basic SzkwMTg3NzpARGhpbGlwOTAxODc3";

export async function validateLogin(engineerId, password) {
  const url = `${SAP_URL}/ZMAINT_LOGINSet(EngineerId='${engineerId}',Password='${password}')`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
        Cookie: "sap-usercontext=sap-client=100",
      },
    });

    const xmlData = await response.text();

    return new Promise((resolve, reject) => {
      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (err) return reject("XML Parse Error");

        try {
          const props = result.entry.content["m:properties"];

          resolve({
            success: true,
            data: {
              EngineerId: props["d:EngineerId"],
              Password: props["d:Password"],
              Status: props["d:Status"],
              StatusMsg: props["d:StatusMsg"],
            },
          });
        } catch (e) {
          reject("Invalid SAP Login Response");
        }
      });
    });
  } catch (error) {
    throw new Error("Error calling SAP Login API: " + error.message);
  }
}
