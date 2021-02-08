sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";

    return BaseController.extend("sp.sf.fundingNotifySup.controller.MainList", {

        dateFormatter: DateFormatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                headerExpanded: true,
                mainListTableTitle: oResourceBundle.getText("mainListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "mainListView");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            // Add the mainList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("mainListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            this.setModel(new ManagedListModel(), "list");
            
            this.getRouter().getRoute("mainList").attachPatternMatched(this._onRoutedThisPage, this);

        },

        // onRenderedFirst: function () {
        //     this.byId("pageSearchButton").firePress();
        // },

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
            //MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            //var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("mainObject", {
                //layout: oNextUIState.layout,
                tenantId: "new",
                fundingNotifySupNumber: "number",
                "?query": {
                    //param1: "1111111111"
                }
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
            //var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("mainObject", {
                //layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                fundingNotifyNumber: oRecord.funding_notify_number

            });

        },

        onCreateFundingNotify: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath),
                sSupplierCode = this.byId("sSupplierCode").getSelectedKey();

            if(!!sSupplierCode){
                this.getRouter().navTo("mainCreateObject", {
                    tenantId: oRecord.tenant_id,
                    fundingNotifyNumber: oRecord.funding_notify_number,
                    supplierCode:sSupplierCode,
                    "?query": {
                        //param1: "1111111111"
                    }
                });
            }else {
                MessageBox.alert("협력사를 선택하세요.");
                return;
                // MessageBox.confirm("협력사를 선택 하지 않을 시에는 입력 됩니다.", {
                //     onClose: function (sButton) {
                //         if (sButton === MessageBox.Action.OK) {
                //              this.getRouter().navTo("mainCreateObject", {
                //                 tenantId: oRecord.tenant_id,
                //                 fundingNotifyNumber: oRecord.funding_notify_number,
                //                 supplierCode:'KR01818401',
                //                 "?query": {
                //                     //param1: "1111111111"
                //                 }
                //             });
                //         };
                //     }.bind(this)
                // })
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
            this.getModel("mainListView").setProperty("/headerExpanded", true);
            // this.byId("pageSearchButton").firePress();
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list"),
                sToday = new Date(new Intl.DateTimeFormat("ko-KR").format(new Date()));
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            
            var aSorter = [];
            aSorter.push(new Sorter("funding_notify_number", true));

            oModel.read("/SfFundingNotifyView", {
                filters: aSearchFilters,
                sorters : aSorter,
                success: function (oData) {
                    for(var i =0 ; i < oData.results.length; i++){
                        if(oData.results[i].writable_yn === "Y"){
                            //oData.results[i].btnClose = false;
                            oData.results[i].btnCreate = true;
                        }else{
                            //oData.results[i].btnClose = true;
                            oData.results[i].btnCreate = false;
                        }
                    }
                    
                    oModel.setProperty("/SfFundingNotify", oData.results);
                    oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sTitle, searchDateS, aSearchFilters = [],
                sFromDate = this.byId("searchDateS").getFrom(),
                sToDate = this.byId("searchDateS").getTo();
            
            if (!!(sTitle = this.byId("searchTitle").getValue())) {
                aSearchFilters.push(new Filter("tolower(funding_notify_title)", FilterOperator.Contains, "'"+sTitle.toLowerCase().replace("'","''")+"'"));
            };

            if(!!sFromDate || !!sToDate){
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("funding_notify_start_date", FilterOperator.BT, sFromDate, new Date(sToDate.toString())),
                        new Filter("funding_notify_end_date", FilterOperator.BT, sFromDate, new Date(sToDate.toString()))
                    ],
                    // and : false
                }));
            }
            
            return aSearchFilters;
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "fundingNotifySup",
                //persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});