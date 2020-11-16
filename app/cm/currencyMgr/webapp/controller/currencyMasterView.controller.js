sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
	'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    "sap/ui/thirdparty/jquery",
	'sap/f/library'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary ,FilterType, jquery) {
	"use strict";

	return Controller.extend("cm.currency.controller.currencyMasterView", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
            this.ocurrencysTable = this.oView.byId("currencyTable");
            this.oRouter = this.getOwnerComponent().getRouter();
		},
        
        onSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
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

                this.getOwnerComponent().getHelper().then(function (oHelper) {
				oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
                    currency: currency,
                    view : view,
                    });
                }.bind(this));
            
                var oFCL = this.oView.getParent().getParent();
                oFCL.setLayout("TwoColumnsMidExpanded");
                
                // currencyPath = oEvent.getSource().getBindingContext("currencys").getPath(),
                // currency = "Currency(tenant_id='L2100',currency_code='AED')"

			//this.oRouter.navTo("detail", {layout: "TwoColumnsMidExpanded" , currency: currency});
		}
	});
});