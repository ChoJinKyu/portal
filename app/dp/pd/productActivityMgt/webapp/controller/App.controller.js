sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("dp.pd.productActivityMgt.controller.App", {

		onInit : function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		},

		onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("fcl");

			var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
			}
		},

		onColumnResize: function(oEvent) {
            // This event is ideal to call scrollToIndex function of the Table
            var oMasterView = oEvent.getSource().getBeginColumnPages()[0];
			// if (oMasterView.getController().iIndex) {
			// 	var oTable = oMasterView.byId("productsTable");
			// 	oTable.scrollToIndex(oMasterView.getController().iIndex);
            // }
            
            var sLayout = this.getView().getModel("fcl").getProperty("/layout");
			if (sLayout !== 'TwoColumnsMidExpanded') {
				// var oTable = oMasterView.byId("productsTable");
				// oTable.scrollToIndex(0);
			}

		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			// Save the current route name
			this.sCurrentRouteName = sRouteName;
			this.sCurrentTenantId = oArguments.tenantId;
			this.sCurrentControlOptionCode = oArguments.controlOptionCode;
		},

		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();
			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.sCurrentRouteName, {
					layout: sLayout, 
					tenantId: this.sCurrentTenantId, 
					controlOptionCode: this.sCurrentControlOptionCode
				}, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel("fcl");
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}

	});

});