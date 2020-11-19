sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller, ManagedListModel) {
	"use strict";

	return Controller.extend("dp.detailSpecEntry.controller.FlexibleColumnLayout", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

            // this.setModel(new ManagedListModel(), "list");
		},

		onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel();

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
            
            var sLayout = this.getView().getModel().getProperty("/layout");
			if (sLayout !== 'TwoColumnsMidExpanded') {
				var oTable = oMasterView.byId("productsTable");
				oTable.scrollToIndex(0);
			}

		},
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			// Save the current route name
			this.currentRouteName = sRouteName;
            this.currentMold = oArguments.mold;
            // this.itemType = oArguments.itemType
		},

		onStateChanged: function (oEvent) {
            console.log('onStateChanged',oEvent.getParameters())
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();

            // Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, mold: this.currentMold}, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
}, true);
