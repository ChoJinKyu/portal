sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("cm.currencyMgr.controller.App", {

		onInit : function () {
            // apply content density mode to root view
            // debugger;
            //this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
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
            _updateUIElements: function () {
                debugger;
                var oModel = this.oOwnerComponent.getModel("flexibleColumnLayout");
                var oUIState = this.oOwnerComponent.getHelper().getCurrentUIState();
                oModel.setData(oUIState);
            },
        
            onExit: function () {
                this.oRouter.detachRouteMatched(this.onRouteMatched, this);
            }
        


		});
	});
