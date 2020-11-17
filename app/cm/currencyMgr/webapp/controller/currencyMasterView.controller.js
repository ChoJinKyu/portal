sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
	'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    "sap/ui/thirdparty/jquery",
    'sap/f/library',
    "ext/lib/controller/BaseController",
    "sap/m/TablePersoController",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary ,FilterType, jquery, TablePersoController, MainListPersoService, ManagedListModel) {
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

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.ocurrencysTable.getBinding("items"),
				oSorter = new Sorter("tenant_id", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function (oEvent) {
            
			var currencyPath = oEvent.getSource().getBindingContextPath(),
                currency = currencyPath.split("/").slice(-1).pop(),
                oNextUIState,
                view ;

                var oTableSearchState = [],
                sQuery = oEvent.oSource.mAggregations.cells[0].mProperties.text;
                if (sQuery && sQuery.length > 0) {
				    oTableSearchState = [new Filter("currency_code_name", FilterOperator.Contains, sQuery)];
                }
                

                this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
                    currency: currency,
                    view : view,
                    });
                }.bind(this));
                var layout = this.oView.getParent().getParent().getLayout();

                if ( this.oView.getParent().getParent().getLayout() === "TwoColumnsMidExpanded" || 
                     this.oView.getParent().getParent().getLayout() === "OneColumn"){

                    var oFCL = this.oView.getParent().getParent();
                    oFCL.setLayout("TwoColumnsMidExpanded");
                }
                //debugger;

                //this._applySearch(oTableSearchState);
                
                
                // currencyPath = oEvent.getSource().getBindingContext("currencys").getPath(),
                // currency = "Currency(tenant_id='L2100',currency_code='AED')"

			    this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded" , currency: currency});
        },
        _applySearch: function(oTableSearchState) {
          
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

        }
	});
});