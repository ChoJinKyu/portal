sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/Multilingual",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Item",
  "sap/m/TablePersoController",
  "./MainListPersoService",
], function (BaseController, Multilingual, ManagedListModel, DateFormatter, Filter, FilterOperator, Item, TablePersoController, MainListPersoService) {
  "use strict";

    return BaseController.extend("cm.userMgt.controller.MainList", {

        dateFormatter: DateFormatter,

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

            oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/USER_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
				}, true);
            }.bind(this));

            this.setModel(new ManagedListModel(), "mainListView");
            this.getModel("mainListView").setProperty("/headerExpanded", true);

            this._doInitTablePerso();
        },

        onRenderedFirst: function () {
            this.byId("searchTenantCombo").fireChange();
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
            // MainListPersoService.resetPersData();
            // this._oTPC.refresh();
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
                userId: "ID",
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

            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                userId: oRecord.user_id
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
        // _onRoutedThisPage: function () {
        //     this.getModel("mainListView").setProperty("/headerExpanded", true);
        // },

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
            oModel.read("/UserMgt", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(">>>> success", oData);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {
            var aSearchFilters = [];
            if (!!this.byId("searchTenantCombo").getSelectedKey()) aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.byId("searchTenantCombo").getSelectedKey()));
            if (!!this.byId("searchOrgCombo").getSelectedKey()) aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, this.byId("searchOrgCombo").getSelectedKey()));

            if (!!this.byId("searchUserId").getValue()) aSearchFilters.push(new Filter("user_id", FilterOperator.EQ, this.byId("searchUserId").getValue()));
            if (!!this.byId("searchUserName").getValue()) aSearchFilters.push(new Filter("user_name", FilterOperator.EQ, this.byId("searchUserName").getValue()));
            if (!!this.byId("searchEngName").getValue()) aSearchFilters.push(new Filter("user_eng_name", FilterOperator.EQ, this.byId("searchEngName").getValue()));
            if (!!this.byId("searchEmail").getValue()) aSearchFilters.push(new Filter("email", FilterOperator.EQ, this.byId("searchEmail").getValue()));
            if (!!this.byId("searchUseflag").getSelectedKey()) aSearchFilters.push(new Filter("use_flag", FilterOperator.EQ, this.byId("searchUseflag").getSelectedKey()));

            return aSearchFilters;
        },

        handleChange: function (oEvent) {
            var combo = this.byId("searchOrgCombo");
            combo.setSelectedKey(null);

            this.getModel("org");
            
            combo.bindItems({
                path: 'org>/Org_Company',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, oEvent.getSource().getSelectedKey())
                ],
                template: new Item({
                    key: "{org>company_code}", text:"{org>company_code}: {org>company_name}"
                })
            });


        },
        
        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "UserMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
            }

    });
});