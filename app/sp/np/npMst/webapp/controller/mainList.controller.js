sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",    
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	//"./NpSearchService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',    
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",    
	"sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",    
    'sap/m/Label',    
    'sap/m/SearchField',
    "ext/lib/util/ValidatorUtil",
    "sap/f/library",
    "ext/lib/util/ControlUtil"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (
        BaseController,
        History,
        JSONModel,
        TreeListModel,
        TransactionManager,
        ManagedModel,    
        ManagedListModel,
        DateFormatter,
        TablePersoController,
        //NpSearchService,
        Filter,
        FilterOperator,
        Fragment,    
        Sorter,
        MessageBox,
        MessageToast,
        ColumnListItem,
        ObjectIdentifier,
        Text,
        Token,    
        Input,
        ComboBox,
        Item,
        Element,
        syncStyleClass,    
        Label,    
        SearchField,
        ValidatorUtil,
        library,
        ControlUtil
    ) {
		"use strict";
        var that;
		return BaseController.extend("np.npMst.controller.mainList", {
            //dateFormatter: DateFormatter,
			onInit: function () {
                var oViewModel,
				oResourceBundle = this.getResourceBundle();

                this.oRouter = this.getOwnerComponent().getRouter();

                oViewModel = new JSONModel({
                    headerExpanded: true,
                    mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
                    tableNoDataText : oResourceBundle.getText("tableNoDataText")
                });
                this.setModel(oViewModel, "mainListView");
                this.setModel(new ManagedListModel(), "list");
    
                //this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
                that = this;
            },

            fnSearch: function() {
                var oFilter = [];
                that.mainTable = this.byId("mainTable");
                var oDataLen = 0;
                var oView = this.getView(),
                    oModel = this.getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SpNetpriceView", {
                    filters: oFilter,
                    success: function(oData){
                        console.log(oData.results.length);
                        oView.setBusy(false);
                    }
                });
            }

		});
	});
