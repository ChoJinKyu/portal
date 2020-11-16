sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "ext/lib/model/ManagedListModel",
], function (Controller, JSONModel, Filter, FilterOperator, ManagedListModel ) {
	"use strict";

	return Controller.extend("cm.currencyMgr.controller.currencyDetailView", {
        onInit: function () {
            

			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            //debugger;
            this.setModel(new ManagedListModel(), "list");

			//this._doInitTablePerso();
            
        },
        
        _onProductMatched: function (oEvent) {
            
            var currencyViewPath;
            this._currency = oEvent.getParameter("arguments").currency || this._currency || "0";
            currencyViewPath = this._currency.split("CurrencyView").slice(-1).pop();
            currencyViewPath = "Currency" + currencyViewPath;
            this.getView().byId("CurrencyViewObjectPageSection").bindElement({
                path: "/" + currencyViewPath
            });

            // var oTableSearchState = [],
			// 	sQuery = oEvent.getParameter("query");
            // this.ocurrencysTable = this.oView.byId("CurrencyLngTable");
			// if (sQuery && sQuery.length > 0) {
			// 	oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
			// }

			// this.ocurrencysTable.getBinding("items").filter(oTableSearchState, "Application");

            //this.getView().getModel('Currency').setProperty("/layout",oEvent.getParameter("arguments").layout);
            // currency = currencyPath.split("/").slice(-1).pop();

            // CurrencyView
            
		},


		onEditToggleButtonPress: function() {
            var oUiModel = this.getView().getModel("Currency"),
			    oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();
            oUiModel.setProperty("/true4", !bCurrentShowFooterState);
            oObjectPage.setShowFooter(!bCurrentShowFooterState);
        },

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
        },

        handleFullScreen: function () {
            var oUiModel = this.getView().getModel("Currency");
            oUiModel.setProperty("/true1", false);
            oUiModel.setProperty("/true2", true);
            var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout("MidColumnFullScreen");
                
			var sNextLayout = "MidColumnFullScreen";//this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, currency: this._currency});
		},

		handleExitFullScreen: function () {
            var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout("TwoColumnsMidExpanded");
            var oUiModel = this.getView().getModel("Currency");
                oUiModel.setProperty("/true1", true);
                oUiModel.setProperty("/true2", false);
			var sNextLayout = "exitFullScreen"; 
			this.oRouter.navTo("detail", {layout: sNextLayout, currency: this._currency});
		},

		handleClose: function () {
            var oFCL = this.oView.getParent().getParent();
            oFCL.setLayout("OneColumn");
            var oUiModel = this.getView().getModel("Currency"),
                oObjectPage = this.getView().byId("ObjectPageLayout");
            oUiModel.setProperty("/true1", true);
            oUiModel.setProperty("/true2", false);
            oUiModel.setProperty("/true4", false);
            oObjectPage.setShowFooter(false);
                
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
        },
        
        onFooterCancelButton: function () {
            var oUiModel = this.getView().getModel("Currency"),
                oObjectPage = this.getView().byId("ObjectPageLayout");

            oUiModel.setProperty("/true4", false);
            oObjectPage.setShowFooter(false);
        },

        _doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("CurrencyLngTable"),
				componentName: "msgMgr",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}
	});
});