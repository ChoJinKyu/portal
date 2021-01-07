sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/m/Label',
    'sap/m/Token',
    'sap/m/SearchField',
    "ext/lib/util/Validator"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Label, Token, SearchField, Validator) {
    "use strict";

    return BaseController.extend("ep.po.loiRequestMgt.controller.MainList", {

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


            // this.setModel(oViewModel, "mainListView");

            // // Add the mainList page to the flp routing history
            // this.addHistoryEntry({
            //     title: oResourceBundle.getText("mainListViewTitle"),
            //     icon: "sap-icon://table-view",
            //     intent: "#Template-display"
            // }, true);

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            /** Date */
            var today = new Date();

            this.getView().byId("searchRequestDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            //this.getView().byId("searchRequestDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            //this.getView().byId("searchRequestDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
        onMainTableUpdateFinished: function (oEvent) {
            // update the mainList's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("mainListTableTitle");
            }
            this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
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
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: "new",
                companyCode: "new",
                loiWriteNumber: "new"
            });
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
                //this.validator.validate( this.byId('pageSearchFormE'));
                //if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;
                
                var aSearchFilters = this._getSearchStates();
                this._applySearch(aSearchFilters);
            }
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableItemPress: function (oEvent) {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                companyCode: oRecord.company_code,
                loiWriteNumber: oRecord.loi_write_number
            });

            if (oNextUIState.layout === 'TwoColumnsMidExpanded') {
                this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            }

            var oItem = oEvent.getSource();
            oItem.setNavigated(true);
            var oParent = oItem.getParent();
            // store index of the item clicked, which can be used later in the columnResize event
            this.iIndex = oParent.indexOfItem(oItem);

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
            this.getModel("mainListView").setProperty("/headerExpanded", true);
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());

            oModel.read("/LOIRequestListView", {
                filters: aSearchFilters,
                sorters: [
                    new Sorter("loi_number", false)
                ],
                success: function (oData) {
                    oView.setBusy(false);

                }
            });

            oView.setBusy(true);
        },

        _getSearchStates: function () {
            //var sKeyword, 
            //var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";

            var loiNumberTokens = this.getView().byId("searchLoiNumberS").getTokens();
            var sLoiNumber = loiNumberTokens.map(function (oToken) {
                return oToken.getKey();
            });
            
            var requestFromDate = this.getView().byId("searchRequestDateS").getDateValue(),
                requestToDate = this.getView().byId("searchRequestDateS").getSecondDateValue(),
                status = this.getView().byId("searchStatus").getSelectedKey();

            var sRequestDepartment = this.getView().byId("searchRequestDepartmentS").getValue(),
                sRequestor = this.getView().byId("searchRequestorS").getValue();



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

            if (requestFromDate === null) {
                MessageToast.show("Request Date를 입력해 주세요");
                return false;
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
                aSearchFilters.push(new Filter("tolower(request_department_code)", FilterOperator.Contains, "'"+sRequestDepartment.toLowerCase()+"'"));
            }
            if(sRequestor && sRequestor.length > 0){
                aSearchFilters.push(new Filter("tolower(requestor_empno)", FilterOperator.Contains, "'"+sRequestor.toLowerCase()+"'"));
            }

            if (status) {
                aSearchFilters.push(new Filter("loi_request_status_name", FilterOperator.EQ, status));
            }


            console.log("aSearchFilters -----> " , aSearchFilters);
            console.log("this.getView() -----> ", this.getView());
            return aSearchFilters;
        },


        onStatusSelectionChange: function (oEvent) {
            //var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
            //    seSurffix = sSurffix === "E" ? "S" : "E",
            var oSearchStatus = this.getView().byId("searchStatus");

            oSearchStatus.setSelectedKey(oEvent.getParameter("item").getKey());
        },

        

        // _doInitTablePerso: function () {
        //     // init and activate controller
        //     this._oTPC = new TablePersoController({
        //         table: this.byId("mainTable"),
        //         componentName: "loiMgr",
        //         persoService: MainListPersoService,
        //         hasGrouping: true
        //     }).activate();
        // },

        creationDateChange: function (oEvent) {
            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
            //     seSurffix = sSurffix === "E" ? "S" : "E"

            var sFrom = oEvent.getParameter("from");
            var sTo = oEvent.getParameter("to");

            this.getView().byId("searchCreationDateS").setDateValue(sFrom);
            this.getView().byId("searchCreationDateS").setSecondDateValue(sTo);
        },



        // getFormatDate: function (date) {
        //     var year = date.getFullYear();              //yyyy
        //     var month = (1 + date.getMonth());          //M
        //     month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        //     var day = date.getDate();                   //d
        //     day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        //     return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        // }

    });
});