sap.ui.define([
    "ext/lib/controller/BaseController",
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
            this.getRouter().attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
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
            },
            
            _onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout,
				oNextUIState;

			// If there is no layout parameter, set a default layout (normally OneColumn) TwoColumnsMidExpanded
			if (!sLayout) {
				this.getHelper().then(function(oHelper) {
					oNextUIState = oHelper.getNextUIState(0);
					oModel.setProperty("/layout", oNextUIState.layout);
				});
				return;
			}

            oModel.setProperty("/layout", sLayout);
        },
        


		});
	});
