sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
	],
	// /**
    //  * @param {typeof sap.ui.core.mvc.Controller} Controller
    //  */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("cm.currencyMgr.controller.currencyMainView", {
			onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },
            onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			// Save the current route name
			this.currentRouteName = sRouteName;
			this.currentcurrency = oArguments.currency;
        },
        onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");
            //this._updateUIElements();
			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, currency: this.currentcurrency}, true);
			}
        },
        // _updateUIElements: function () {
		// 	var oModel = this.oOwnerComponent.getModel();
		// 	var oUIState = this.oOwnerComponent.getHelper().getCurrentUIState();
		// 	oModel.setData(oUIState);
        // },
        
        onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
		}
        


		});
	});
