sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("Portal_projectShopFloor.controller.Dashboard", {
        onPressPlannedMonth: function () {
            this._navToOrders("Planned", "Month");
        },

        onPressProductionMonth: function () {
            this._navToOrders("Production", "Month");
        },

        onPressPlannedYear: function () {
            this._navToOrders("Planned", "Year");
        },

        onPressProductionYear: function () {
            this._navToOrders("Production", "Year");
        },

        _navToOrders: function (sType, sPeriod) {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("orders", {
                type: sType,
                period: sPeriod
            });
        }
    });
});
