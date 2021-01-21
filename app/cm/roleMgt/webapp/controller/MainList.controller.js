sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/core/routing/History",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/util/Validator",
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
  "ext/lib/util/Multilingual",
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, Validator, TablePersoController, MainListPersoService, Filter,
    FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Multilingual) {
  "use strict";

    return BaseController.extend("cm.roleMgt.controller.MainList", {

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

            oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/ROLE_MANAGEMENT"),
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
            // update the mainList's object counter after the table update
            // var sTitle,
            // oTable = oEvent.getSource(),
            // iTotalItems = oEvent.getParameter("total");
            // // only update the counter if the length is final and
            // // the table is not empty
            // if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            //     sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
            // } else {
            //     sTitle = this.getResourceBundle().getText("mainListTableTitle");
            // }

            // this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
            
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
            var tenantId = this.byId("searchTenantCombo").getSelectedKey();

            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: tenantId,
                roleCode: "code",
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

                if(this.byId("searchTenantCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchTenantCombo")) !== true) {
                    sap.m.MessageToast.show("테넌트는 필수 선택 항목입니다.");
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchTenantCombo"));
                }

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
                roleCode: oRecord.role_code
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
            oModel.read("/Role", {
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
            if (!!this.byId("searchChainCombo").getSelectedKey()) aSearchFilters.push(new Filter("chain_code", FilterOperator.EQ, this.byId("searchChainCombo").getSelectedKey()));

            if (!!this.byId("searchRoleCode").getValue()) aSearchFilters.push(new Filter("role_code", FilterOperator.EQ, this.byId("searchRoleCode").getValue()));
            if (!!this.byId("searchRoleName").getValue()) aSearchFilters.push(new Filter("role_name", FilterOperator.EQ, this.byId("searchRoleName").getValue()));
            if (!!this.byId("searchUseflag").getSelectedKey()) aSearchFilters.push(new Filter("use_flag", FilterOperator.EQ, this.byId("searchUseflag").getSelectedKey()));

            return aSearchFilters;
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "RoleMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});