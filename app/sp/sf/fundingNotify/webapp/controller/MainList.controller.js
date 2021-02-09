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
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, Sorter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";

    return BaseController.extend("sp.sf.fundingNotify.controller.MainList", {

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

			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                headerExpanded: true,
                mainListTableTitle: oResourceBundle.getText("mainListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "mainListView");

            // Add the mainList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("mainListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);
            
            this.setModel(new ManagedListModel(), "list");
            
            this.getRouter().getRoute("mainList").attachPatternMatched(this._onRoutedThisPage, this);
            
            this._doInitTablePerso();
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
            MainListPersoService.resetPersData();
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
                fundingNotifyNumber: "number",
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
            // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
            //     sPath = oEvent.getSource().getBindingContext("list").getPath(),
            //     oRecord = this.getModel("list").getProperty(sPath);
            
            // this.getRouter().navTo("mainObject", {
            //     layout: oNextUIState.layout,
            //     tenantId: oRecord.tenant_id,
            //     fundingNotifyNumber: oRecord.funding_notify_number
            // });

            // if (oNextUIState.layout === 'TwoColumnsMidExpanded') {
            //     this.getView().getModel('mainListView').setProperty("/FsFundingNotify", false);
            // }

            // var oItem = oEvent.getSource();
            // oItem.setNavigated(true);
            // var oParent = oItem.getParent();
            // // store index of the item clicked, which can be used later in the columnResize event
            // this.iIndex = oParent.indexOfItem(oItem);
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this.getModel("mainListView").setProperty("/headerExpanded", true);
            if(oArgs.refresh==="Y"){
                this.byId("pageSearchButton").firePress();
            }
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list"),
                aSorter = [];

            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            aSorter.push(new Sorter("funding_notify_number", true));
            
            oModel.read("/SfFundingNotifyView", {
                filters: aSearchFilters,
                sorters : aSorter,
                success: function (oData) {
                    oView.setBusy(false);
                }                
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
                componentName: "fundingNotify",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});