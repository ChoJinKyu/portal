sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, Validator, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";

    return BaseController.extend("ep.po.projectMgt.controller.MainList", {

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
            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                headerExpanded: true
            });
            this.setModel(oViewModel, "mainListView");
            this.setModel(new ManagedListModel(), "list");

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
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
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("detailPage", {
                layout: oNextUIState.layout,
                tenantId: "L2100",
                companyCode: "LGCKR",
                epProjectNumber: "new"
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
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
            //console.log("####", this.getOwnerComponent().getHelper().getNextUIState(3));  
            // console.log("oNextUIState.layou======", oNextUIState.layou);
            // console.log("oRecord.tenant_id======", oRecord.tenant_id);
            // console.log("oRecord.company_code======", oRecord.company_code);
            // console.log("oRecord.ep_project_number======", oRecord.ep_project_number);
            this.getRouter().navTo("detailPage", {
                layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                companyCode: oRecord.company_code,
                epProjectNumber: oRecord.ep_project_number
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
            oModel.read("/ProjectView", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {
            var sChain = this.getView().byId("searchChain").getSelectedKey(),
                sKeyword = this.getView().byId("searchKeyword").getValue(),
                sUsage = this.getView().byId("searchUsageSegmentButton").getSelectedKey();

            var aSearchFilters = [];
            if (sChain && sChain.length > 0) {
                aSearchFilters.push(new Filter("bizunit_code", FilterOperator.EQ, sChain));
            }
            if (sKeyword && sKeyword.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("project_name", FilterOperator.Contains, sKeyword)
                    ],
                    and: false
                }));
            }
            if (sUsage != "all") {
                aSearchFilters.push(new Filter("ep_purchasing_type_code", FilterOperator.EQ, sUsage));
            }
            return aSearchFilters;
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "projectMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }


    });
});