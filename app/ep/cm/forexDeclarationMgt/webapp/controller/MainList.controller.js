sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    // "sap/m/TablePersoController",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.cm.forexDeclarationMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");

            // this._oTPC = new TablePersoController({
            //     customDataKey: "forexDeclarationMgt",
            //     persoService: MainListPersoService
            // }).setTable(this.byId("mainTable"));

            this.enableMessagePopover();

            // var today = new Date();

            // this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            // this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();
                var aSorter = this._getSorter();
                this._applySearch(aSearchFilters, aSorter);
            }
        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/ForexDeclarationView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {

             var loiNumberTokens = this.getView().byId("searchPoNumber").getTokens();
             var sLoiNumber = loiNumberTokens.map(function (oToken) {
                 return oToken.getKey();
             });

            var requestFromDate = this.getView().byId("searchPoDate").getDateValue(),
                requestToDate = this.getView().byId("searchPoDate").getSecondDateValue(),
                status = this.getView().byId("searchStatus").getSelectedKey();

            var sRequestDepartment = this.getView().byId("searchPurchasingDepartmentName").getValue(),
                sRequestor = this.getView().byId("searchBuyerName").getValue();

            var poName = this.getView().byId("searchPoName").getValue();

            console.log("poName -----> " , poName);


            var aSearchFilters = [];

            if (sLoiNumber.length > 0) {
                var _tempFilters = [];

                sLoiNumber.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("po_number", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (requestFromDate && requestToDate) {
                //aSearchFilters.push(new Filter("request_date", FilterOperator.BT, requestFromDate, requestToDate));
            }

            // if (sRequestDepartment && sRequestDepartment.length > 0) {
            //     aSearchFilters.push(new Filter("request_department_code", FilterOperator.EQ, sLoiNumber));
            // }
            // if (sRequestor && sRequestor.length > 0) {
            //     aSearchFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sLoiNumber));
            // }

            if(sRequestDepartment && sRequestDepartment.length > 0){
                aSearchFilters.push(new Filter("tolower(purchasing_department_code)", FilterOperator.Contains, "'"+sRequestDepartment.toLowerCase()+"'"));
            }
            if(sRequestor && sRequestor.length > 0){
                aSearchFilters.push(new Filter("tolower(buyer_empno)", FilterOperator.Contains, "'"+sRequestor.toLowerCase()+"'"));
            }

            if (status) {
                aSearchFilters.push(new Filter("forex_declare_status_code", FilterOperator.EQ, status));
            }

            if (poName && poName.length > 0) {
                 aSearchFilters.push(new Filter("po_name", FilterOperator.EQ, poName));
            }


            console.log("aSearchFilters -----> " , aSearchFilters);
            console.log("this.getView() -----> ", this.getView());

            return aSearchFilters;
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("po_number", true));
            //var aSorter = new Sorter("system_create_dtm", true);    
            return aSorter;
        },

        // _doInitTablePerso: function(){
        // 	// init and activate controller
        // 	this._oTPC = new TablePersoController({
        // 		table: this.byId("mainTable"),
        // 		componentName: "loiPublishMgt",
        // 		persoService: MainListPersoService,
        // 		hasGrouping: true
        //     }).activate();

        //     // //this.getView().setModel(new ManagedListModel(), "list");
        //     // // 개인화 - UI 테이블의 경우만 해당
        //     // this._oTPC = new TablePersoController({
        //     // customDataKey: "loiPublishMgt",
        //     // persoService: MainListPersoService
        //     // }).setTable(this.byId("mainTable"));            

        // }


    });
});