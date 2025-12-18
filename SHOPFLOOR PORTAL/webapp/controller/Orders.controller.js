sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, Filter, FilterOperator, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("Portal_projectShopFloor.controller.Orders", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("orders").attachPatternMatched(this._onRouteMatched, this);

            // Create local model for valid data
            var oViewModel = new JSONModel({
                items: []
            });
            this.getView().setModel(oViewModel, "viewData");

            this._aMasterData = []; // Store all data here

            // Populate Year Select (Static Range for now)
            var oYearSelect = this.getView().byId("yearSelect");
            // Note: oYearSelect might be undefined here if view not fully loaded, 
            // but usually safe in onInit or safer in _onRouteMatched if using XML view.
            // We will double check in _onRouteMatched or ensure View is instantiated.
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this._sType = oArgs.type; // "Planned" or "Production"
            this._sPeriod = oArgs.period; // "Month" or "Year"

            var oView = this.getView();
            oView.byId("ordersPage").setTitle(this._sType + " Orders - " + this._sPeriod + " Wise");

            var oMonthSelect = oView.byId("monthSelect");
            var oYearSelect = oView.byId("yearSelect");
            var oLabel = oView.byId("periodLabel");

            // Populate Years if empty (Safe check)
            if (oYearSelect && oYearSelect.getItems().length === 0) {
                var iCurrentYear = new Date().getFullYear();
                var iStartYear = iCurrentYear - 5;
                var iEndYear = iCurrentYear + 5;
                for (var i = iStartYear; i <= iEndYear; i++) {
                    oYearSelect.addItem(new sap.ui.core.Item({
                        key: i.toString(),
                        text: i.toString()
                    }));
                }
            }

            // Reset Selections
            if (oMonthSelect) oMonthSelect.setSelectedKey(null);
            if (oYearSelect) oYearSelect.setSelectedKey(null);

            // Configure View based on Period Type
            if (this._sPeriod === "Month") {
                oLabel.setText("Select Month:");
                oMonthSelect.setVisible(true);
                oYearSelect.setVisible(false);
            } else {
                oLabel.setText("Select Year:");
                oMonthSelect.setVisible(false);
                oYearSelect.setVisible(true);
            }

            // Toggle Tables (Visibility)
            if (this._sType === "Planned") {
                oView.byId("plannedTable").setVisible(true);
                oView.byId("productionTable").setVisible(false);
            } else {
                oView.byId("plannedTable").setVisible(false);
                oView.byId("productionTable").setVisible(true);
            }

            // Load ALL Data initially
            this._fetchAllData();
        },

        _fetchAllData: function () {
            // Get Logged-in User
            var oSessionModel = this.getOwnerComponent().getModel("session");
            var sUser = oSessionModel ? oSessionModel.getProperty("/User") : null;
            if (sUser) {
                sUser = sUser.toUpperCase();
            }

            if (!sUser) {
                MessageToast.show("Session expired. Please login again.");
                this.onLogout();
                return;
            }

            // Determine OData Path and User Property
            var sPath, sUserProp;
            if (this._sType === "Planned") {
                sPath = "/ZSF_PLANNEDSet";
                sUserProp = "Creator";
            } else {
                sPath = "/ZSF_PRODUCTIONSet";
                sUserProp = "Ernam";
            }

            // Prepare User Filter for Backend (Fetch ALL for user)
            var aBackendFilters = [new Filter(sUserProp, FilterOperator.EQ, sUser)];

            sap.ui.core.BusyIndicator.show();
            var oModel = this.getOwnerComponent().getModel();

            oModel.read(sPath, {
                filters: aBackendFilters,
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    var aResults = oData.results || [];

                    // Store in Master Data and View Model (Initial Display: ALL DATA)
                    this._aMasterData = aResults;
                    this.getView().getModel("viewData").setProperty("/items", aResults);

                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Fetch Error:", oError);
                    MessageToast.show("Error fetching data.");
                }
            });
        },

        onNavBack: function () {
            var oMonthSelect = this.getView().byId("monthSelect");
            var oYearSelect = this.getView().byId("yearSelect");

            var bFilterActive = ((oMonthSelect && oMonthSelect.getSelectedKey()) || (oYearSelect && oYearSelect.getSelectedKey()));

            if (bFilterActive) {
                // If filter is active, CLEAR filter and show default data
                if (oMonthSelect) oMonthSelect.setSelectedKey(null);
                if (oYearSelect) oYearSelect.setSelectedKey(null);

                this.getView().getModel("viewData").setProperty("/items", this._aMasterData);
                MessageToast.show("Filters cleared. Showing all data.");
            } else {
                // If no filter, navigate back
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("dashboard");
            }
        },

        onLogout: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("login");
        },

        onGo: function () {
            var oView = this.getView();
            var oMonthSelect = oView.byId("monthSelect");
            var oYearSelect = oView.byId("yearSelect");

            // Determine Filtering Mode and Value
            var sSelectedKey = null;
            var bIsMonthMode = (this._sPeriod === "Month");

            if (bIsMonthMode) {
                sSelectedKey = oMonthSelect.getSelectedKey();
            } else {
                sSelectedKey = oYearSelect.getSelectedKey();
            }

            if (!sSelectedKey) {
                // If nothing selected, show all data
                this.getView().getModel("viewData").setProperty("/items", this._aMasterData);
                MessageToast.show("Showing all data.");
                return;
            }

            // Determine Date Property
            var sDateProp = (this._sType === "Planned") ? "StartDate" : "Erdat";

            // Perform CLIENT-SIDE Date Filtering on Master Data
            var aFiltered = this._aMasterData.filter(function (oItem) {
                var oItemDate = oItem[sDateProp];
                if (!oItemDate) return false;

                if (bIsMonthMode) {
                    // Match Month Index (0-11)
                    // sSelectedKey is "0", "1", etc.
                    return oItemDate.getMonth() === parseInt(sSelectedKey, 10);
                } else {
                    // Match Year (2025)
                    return oItemDate.getFullYear() === parseInt(sSelectedKey, 10);
                }
            }.bind(this));

            // Update View Model with Filtered Results
            this.getView().getModel("viewData").setProperty("/items", aFiltered);

            if (aFiltered.length === 0) {
                MessageToast.show("No data found for the selected period.");
            } else {
                MessageToast.show("Found " + aFiltered.length + " matching records.");
            }
        }
    });
});
