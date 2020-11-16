sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "ext/lib/model/ManagedListModel",
    "sap/m/TablePersoController",
    "ext/lib/model/ManagedModel",
    "ext/lib/controller/BaseController",
    "./MainListPersoService",
], function (BaseController, JSONModel, Filter, FilterOperator, ManagedModel, ManagedListModel, TablePersoController, MainListPersoService ) {
	"use strict";

	return BaseController.extend("cm.currencyMgr.controller.currencyDetailView", {  
        onInit: function () {
            // debugger;
            // var oViewModel,
			// 	oResourceBundle = this.getResourceBundle();
            

			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            this.getView().setModel(new ManagedListModel(), "list");
            //
            //this.onSearch();

            //this._doInitTablePerso();
            
            

			// Model used to manipulate control states
			// oViewModel = new JSONModel({
			// 	headerExpanded: true,
			// 	mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
			// 	tableNoDataText : oResourceBundle.getText("tableNoDataText")
			// });
			// this.setModel(oViewModel, "mainListView");
            
        },
        
        _onProductMatched: function (oEvent) {
            
            var currencyViewPath;
            this._currency = oEvent.getParameter("arguments").currency || this._currency || "0";
            currencyViewPath = this._currency.split("CurrencyView").slice(-1).pop();
            currencyViewPath = "Currency" + currencyViewPath;
            this.getView().byId("CurrencyViewObjectPageSection").bindElement({
                path: "/" + currencyViewPath
            });

            this._applySearch();

            

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
                
			var sNextLayout = "closeColumn";
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
				componentName: "currencyMgr",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },

        onLngAddRow: function(){
			var oTable = this.byId("CurrencyLngTable"),
				oModel = this.getView().getModel("list");
			    oModel.addRecord({
				"tenant_id": "L2100",
				"language_code": "",
				"currency_code_name": "",
				"currency_code_desc": "",
				"currency_prefix": "",
				"currency_suffix": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, 0);
        },

        onSearch: function () {
            var predicates = [];
            //predicates.push(new Filter("language_code", FilterOperator.EQ, ""));
            this.getView()
            .setBusy(true)
            .getModel("list")
            .setTransactionModel(this.getView().getModel())
            .read("/CurrencyLng", {
                filters: predicates,
                success: (function (oData) {
                this.getView().setBusy(false);
                }).bind(this)
            });
        },

        _applySearch: function(oEvent) {
            var predicates = [];
            //predicates.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
            // var oTableSearchState = [],
			// 	sQuery = oEvent.getParameter("query");

			// if (sQuery && sQuery.length > 0) {
			// 	oTableSearchState = [new Filter("currency_code_name", FilterOperator.Contains, sQuery)];
			// }
			var oView = this.getView(),
				oModel = this.getView().getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getView().getModel());
                oModel.read("/CurrencyLng", {
				filters: predicates,
				success: function(oData){
					oView.setBusy(false);
                    }
                });
        },
        

  
        _getSearchStates: function(){
			// var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
			// 	chain = this.getView().byId("searchChain"+sSurffix).getSelectedKey(),
			// 	language = this.getView().byId("searchLanguage"+sSurffix).getSelectedKey(),
			// 	keyword = this.getView().byId("searchKeyword"+sSurffix).getValue();
				
            var aTableSearchState = [];
            
            aTableSearchState.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));

			// if (chain && chain.length > 0) {
			// 	aTableSearchState.push(new Filter("chain_code", FilterOperator.EQ, chain));
			// }
			// if (language && language.length > 0) {
			// 	aTableSearchState.push(new Filter("language_code", FilterOperator.EQ, language));
			// }
			// if (keyword && keyword.length > 0) {
			// 	aTableSearchState.push(new Filter({
			// 		filters: [
			// 			new Filter("message_code", FilterOperator.Contains, keyword),
			// 			new Filter("message_contents", FilterOperator.Contains, keyword)
			// 		],
			// 		and: false
			// 	}));
			// }
			return aTableSearchState;
        },
        onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}
        },
        
        // onMainTableUpdateFinished : function (oEvent) {
		// 	// update the mainList's object counter after the table update
		// 	var sTitle,
		// 		oTable = oEvent.getSource(),
		// 		iTotalItems = oEvent.getParameter("total");
		// 	// only update the counter if the length is final and
		// 	// the table is not empty
		// 	if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
		// 		sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
		// 	} else {
		// 		sTitle = this.getResourceBundle().getText("mainListTableTitle");
		// 	}
		// 	this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		// },
	});
});