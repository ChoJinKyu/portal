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

    return BaseController.extend("ep.po.loiRequestMgt.controller.MainList", {

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
            //this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "listModel");
            //this.setModel(new JSONModel(), "mainListViewModel");

            // this.setModel(new JSONModel(), "listModel");

            // this.setModel(new JSONModel(), "loiVos");
            // this.setModel(new JSONModel(), "loiRfq");
            // this.setModel(new JSONModel(), "loiRmk");

            // oMultilingual.attachEvent("ready", function(oEvent){
            // 	var oi18nModel = oEvent.getParameter("model");
            // 	this.addHistoryEntry({
            // 		title: oi18nModel.getText("/CONTROL_OPTION_MANAGEMENT"),   //제어옵션관리
            // 		icon: "sap-icon://table-view",
            // 		intent: "#Template-display"
            // 	}, true);
            // }.bind(this));

            //this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.getRouter().getRoute("mainPage").attachPatternMatched(this.onSearch, this);

            this._oTPC = new TablePersoController({
                customDataKey: "loiRequestMgt",
                persoService: MainListPersoService
            }).setTable(this.byId("mainTable"));

            this.enableMessagePopover();

            var today = new Date();

            // this.getView().byId("searchConstDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            // this.getView().byId("searchConstDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

        },

        onSearch: function () {
            
            var aSearchFilters = this._getSearchStates();
            this._applySearch(aSearchFilters);
        },

        onStatusColor: function (statusColor) {
            if (!statusColor) return 1;
            return parseInt(statusColor);
        },

        onTableItemPress: function (oEvent) {

            // console.log("oEvent.getSource=", oEvent.getSource());

            var oViewModel = this.getModel('listModel');
            var sPath = "";

            var bindingContext = oEvent.getParameters().rowBindingContext;
            if (bindingContext) {
                sPath = oEvent.getParameters().rowBindingContext.getPath();
            } else {
                sPath = oEvent.getParameters()["row"].getBindingContext("listModel").getPath()
            }
            // console.log("sPath=", sPath);
            var oRecord = oViewModel.getProperty(sPath);
            // console.log("oRecord=", oRecord);

            this.getRouter().navTo("requestPage", {
                tenantId : oRecord.tenant_id,
                companyCode: oRecord.company_code,
                loiWriteNumber: oRecord.loi_write_number
            }, true);
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
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("requestPage", {
                //layout: oNextUIState.layout,
                tenantId: "new",
                companyCode: "new",
                loiWriteNumber: "new"
            });  
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

            this.getRouter().navTo("requestPage", {
                //layout: oNextUIState.layout,
                tenantId: rowData.tenant_id,
                companyCode: rowData.company_code,
                loiWriteNumber: rowData.loi_write_number
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
            // var oView = this.getView(),
            //     oModel = this.getModel("list"),
            //     that = this;

            var oView = this.getView();
            //var oListModel = this.getModel("listModel");
            var oModel = this.getModel();
            oView.setBusy(true);

            // Master 조회
            oModel.read("/LOIRequestListView", {
                filters: aSearchFilters,
                sorters: [
                    new Sorter("request_date", true),
                    new Sorter("loi_number", true)
                ],
                success: function (oData) {
                    console.log("oData====", oData);
                    oView.getModel("listModel").setData(oData.results);
                    oView.setBusy(false);
                }
            });
            // oView.setBusy(true);
            // oModel.setTransactionModel(this.getModel());
            // oModel.read("/UcQuotationListView", {
            //     filters: aSearchFilters,
            //     sorters: aSorter,
            //     success: function (oData) {
            //         console.log("oData====", oData);
            //         var oTable = that.byId("mainTable");
            //         oTable.clearSelection();
            //         oView.setBusy(false);
            //     }
            // });
            // oModel.setSizeLimit(500);
            

            oView.setBusy(true);
        },

        _getSearchStates: function () {
            //var sKeyword, 
            //var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";


             var oFilterModel = this.getModel("listModel"),
                oFilterModelData = oFilterModel.getData();

            var loiNumberTokens = this.getView().byId("searchLoiNumberS").getTokens();
            var sLoiNumber = loiNumberTokens.map(function (oToken) {
                return oToken.getKey();
            });
            
            var requestFromDate = this.getView().byId("searchRequestDateS").getDateValue(),
                requestToDate = this.getView().byId("searchRequestDateS").getSecondDateValue(),
                status = this.getView().byId("searchStatus").getSelectedKey();

            var sRequestDepartment = this.getView().byId("searchRequestDepartmentS").getValue(),
                sRequestor = this.getView().byId("searchRequestorS").getValue();

            var found1 = sRequestDepartment.match(/\((.*?)\)/);
            if (found1) {
                sRequestDepartment = found1[1];
            }
            var found2 = sRequestor.match(/\((.*?)\)/);
            if (found2) {
                sRequestor = found2[1];
            }

            var aSearchFilters = [];

            if (sLoiNumber.length > 0) {
                var _tempFilters = [];

                sLoiNumber.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("loi_number", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (requestFromDate && requestToDate) {
                aSearchFilters.push(new Filter("request_date", FilterOperator.BT, this.getFormatDate(requestFromDate), this.getFormatDate(requestToDate)));
            }

            if (sRequestDepartment && sRequestDepartment.length > 0) {
                aSearchFilters.push(new Filter("request_department_code", FilterOperator.EQ, sLoiNumber));
            }
            if (sRequestor && sRequestor.length > 0) {
                aSearchFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sLoiNumber));
            }

            if (status) {
                aSearchFilters.push(new Filter("loi_request_status_code", FilterOperator.EQ, status));
            }

            console.log("aSearchFilters -----> " , aSearchFilters);
            return aSearchFilters;
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("const_quotation_number", true));
            //var aSorter = new Sorter("system_create_dtm", true);    
            return aSorter;
        }

    });
});