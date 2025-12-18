sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, UIComponent, JSONModel) {
    "use strict";

    return Controller.extend("Portal_projectShopFloor.controller.Login", {
        onLogin: function () {
            var sUser = this.getView().byId("userIdInput").getValue();
            var sPass = this.getView().byId("passwordInput").getValue();

            if (!sUser || !sPass) {
                MessageToast.show("Please enter both User ID and Password.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZSF_LOGINSet(UserId='" + sUser + "',Password='" + sPass + "')";

            // Show busy indicator (optional but good)
            sap.ui.core.BusyIndicator.show();

            oModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.Status === "S") {
                        MessageToast.show("Login Successful");

                        // Store User in Session Model
                        var oSessionModel = new JSONModel({
                            User: sUser
                        });
                        this.getOwnerComponent().setModel(oSessionModel, "session");

                        var oRouter = UIComponent.getRouterFor(this);
                        oRouter.navTo("dashboard");
                    } else {
                        MessageToast.show(oData.StatusMsg || "Login Failed");
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Login Error:", oError);
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        MessageToast.show(oResponse.error.message.value);
                    } catch (e) {
                        MessageToast.show("Login request failed. Check console for details.");
                    }
                }
            });
        }
    });
});
