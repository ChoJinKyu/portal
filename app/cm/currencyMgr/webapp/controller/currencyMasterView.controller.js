sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
	'sap/ui/model/Sorter',
	"sap/m/MessageBox",
	"sap/m/MessageToast",
    "sap/ui/thirdparty/jquery",
    'sap/f/library',
    "ext/lib/controller/BaseController",
    "sap/m/TablePersoController",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, fioriLibrary ,FilterType, jquery, TablePersoController, MainListPersoService, ManagedListModel) {
	"use strict";

	return BaseController.extend("cm.currency.controller.currencyMasterView", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
            this.ocurrencysTable = this.oView.byId("currencyTable");
            this.oRouter = this.getOwnerComponent().getRouter();
            //this.getView().setModel(new ManagedListModel(), "list");
            //this.onSearch();
		},
        
        onSearch: function (oEvent) {
			var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("currency_code_name", FilterOperator.Contains, sQuery)];
            }

			this.ocurrencysTable.getBinding("items").filter(oTableSearchState, "Application");
        },
        

		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", {title: "Aw, Snap!"});
        },
        onCreateAdd: function () {
            this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded" , currency: "new"});
            var oFCL = this.oView.getParent().getParent();
                    oFCL.setLayout("TwoColumnsMidExpanded");
        },


		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.ocurrencysTable.getBinding("items"),
				oSorter = new Sorter("tenant_id", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function (oEvent) {
            var oCheck = this.getView().getModel("Currency").getProperty("/true6");
            
            if(oCheck){
                var currencyPath = oEvent.getSource().getBindingContextPath(),
                currency = currencyPath.split("/").slice(-1).pop(),
                oNextUIState,
                view ;

                var oTableSearchState = [],
                sQuery = oEvent.oSource.mAggregations.cells[0].mProperties.text;
                if (sQuery && sQuery.length > 0) {
				    oTableSearchState = [new Filter("currency_code_name", FilterOperator.Contains, sQuery)];
                }
                var layout = this.oView.getParent().getParent().getLayout();

                if ( this.oView.getParent().getParent().getLayout() === "TwoColumnsMidExpanded" || 
                     this.oView.getParent().getParent().getLayout() === "OneColumn"){

                    var oFCL = this.oView.getParent().getParent();
                    oFCL.setLayout("TwoColumnsMidExpanded");
                }
			    this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded" , currency: currency});
            }
            else{
                 sap.m.MessageToast.show("수정을 완료해 주세요.");
            }
        },
	});
});