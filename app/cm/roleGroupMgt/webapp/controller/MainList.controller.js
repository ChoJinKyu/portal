sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/Multilingual",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/util/Validator",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Item",
  "sap/m/TablePersoController",
  "./MainListPersoService",
], function (BaseController, Multilingual, ManagedListModel, DateFormatter, Validator, Filter, FilterOperator, Item, TablePersoController, MainListPersoService) {
  "use strict";

    return BaseController.extend("cm.roleGroupMgt.controller.MainList", {

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
					title: oi18nModel.getText("/ROLE") + oi18nModel.getText("/GROUP") + oi18nModel.getText("/MANAGEMENT"),
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
                tenantId: "code",
                roleGroupCode: "roleGroupCode",
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
            //sPath = oEvent.mParameters.rowContext.sPath,
            oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("midPage", {
                layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                roleGroupCode: oRecord.role_group_code
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
            oModel.read("/RoleGroupMgt", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(">>>> success", oData);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {
            var oSearchTenantCombo = this.byId("searchTenantCombo").getSelectedKey(),
                oSearchRoleGroupCode = this.byId("searchRoleGroupCode").getValue(),
                aSearchFilters = [];

            if (oSearchTenantCombo && oSearchTenantCombo.length > 0) {
                aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSearchTenantCombo));
            }

            if (oSearchRoleGroupCode && oSearchRoleGroupCode.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("role_group_code", FilterOperator.Contains, oSearchRoleGroupCode),
                        new Filter("role_group_name", FilterOperator.Contains, oSearchRoleGroupCode)
                    ],
                    and: false
                }));
            }

            return aSearchFilters;
        },
        
        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "RoleGroupMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});