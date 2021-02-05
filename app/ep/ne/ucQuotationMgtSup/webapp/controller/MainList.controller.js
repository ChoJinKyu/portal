sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/Fragment",
    "ext/lib/formatter/NumberFormatter",
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
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.ne.ucQuotationMgtSup.controller.MainList", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
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
            this.setModel(new JSONModel(), "listModel");

            // oMultilingual.attachEvent("ready", function(oEvent){
            // 	var oi18nModel = oEvent.getParameter("model");
            // 	this.addHistoryEntry({
            // 		title: oi18nModel.getText("/CONTROL_OPTION_MANAGEMENT"),   //제어옵션관리
            // 		icon: "sap-icon://table-view",
            // 		intent: "#Template-display"
            // 	}, true);
            // }.bind(this));

            this.getRouter().getRoute("mainPage").attachPatternMatched(this.onSearch, this);

            this._oTPC = new TablePersoController({
                customDataKey: "ucQuotationMgtSup",
                persoService: MainListPersoService
            }).setTable(this.byId("mainTable"));

            //this.enableMessagePopover();

            var today = new Date();
            this.getView().byId("searchConstDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 160));
            this.getView().byId("searchConstDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function () {
            
            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
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
                //var aSorter = this._getSorter();
                this._applySearch(aSearchFilters);
            }
        },


        /**
         * Cell 클릭 후 상세화면으로 이동
         */
        onCellClickPress: function(oEvent) {
            this._goDetailView(oEvent);
        },

        _goDetailView: function(oEvent){

            var oView = this.getView();
            var oTable = oView.byId("mainTable"),
                oModel = this.getView().getModel("list");
            var rowData = oEvent.getParameter('rowBindingContext').getObject();

            console.log("####rowData====", rowData);

            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: rowData.tenant_id,
                companyCode: rowData.company_code,
                constQuotationNumber: rowData.const_quotation_number
            }, true);
        },



        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel(),
                oViewModel = this.getModel("viewModel");

            oView.setBusy(true);

            // Master 조회
            oModel.read("/UcQuotationListView", {
                filters: aSearchFilters,
                sorters: [
                    new Sorter("const_start_date", false)
                ],
                success: function (oData) {
                    console.log("oData====", oData);
                    //oViewModel.getModel("listModel").setData(oData.results);

                    oViewModel.setProperty("/list", oData.results);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {

            var sSearchKeyword = this.getView().byId("searchConstName").getValue();

            var requestFromDate = this.byId("searchConstDate").getValue().substring(0, 10).replaceAll(" ", ""),
                requestToDate = this.byId("searchConstDate").getValue().substring(13).replaceAll(" ", "");


            var sSearchConstQuotationNumber = this.getView().byId("searchConstQuotationNumber").getValue(),
                status = this.getView().byId("searchStatus").getSelectedKey();
            
            console.log("sSearchKeyword==", sSearchKeyword);
            console.log("requestFromDate==", requestFromDate);
            console.log("requestToDate==", requestToDate);
            console.log("sSearchConstQuotationNumber==", sSearchConstQuotationNumber);
            console.log("status==", status);


            var aSearchFilters = [];
            if(!this.isValNull(sSearchKeyword)){
                    var aKeywordFilters = {
                        filters: [
                            new Filter("const_name", FilterOperator.Contains, sSearchKeyword)
                        ],
                        and: false
                    };
                    aSearchFilters.push(new Filter(aKeywordFilters));
                }

             if(!!requestFromDate || !!requestToDate){
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("const_start_date", FilterOperator.BT, requestFromDate, requestToDate),
                        new Filter("const_start_date", FilterOperator.BT, requestFromDate, requestToDate)
                    ],
                    and : false
                }));
            }

            if(!this.isValNull(sSearchConstQuotationNumber)){
                    var aKeywordFilters = {
                        filters: [
                            new Filter("const_quotation_number", FilterOperator.Contains, sSearchConstQuotationNumber)
                        ],
                        and: false
                    };
                    aSearchFilters.push(new Filter(aKeywordFilters));
                }

            if (status) {
                aSearchFilters.push(new Filter("quotation_status_code", FilterOperator.EQ, status));
            }


            return aSearchFilters;
        },

        // _getSorter: function () {
        //     var aSorter = [];
        //     aSorter.push(new Sorter("const_quotation_number", true));
        //     //var aSorter = new Sorter("system_create_dtm", true);    
        //     return aSorter;
        // }

    });
});