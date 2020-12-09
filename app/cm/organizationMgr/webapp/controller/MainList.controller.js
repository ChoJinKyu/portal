sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
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
    "sap/ui/model/json/JSONModel",
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, TablePersoController, MainListPersoService,
    Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, JSONModel) {
    "use strict";

    // var oTransactionManager;
    var _aValidTabKeys = ["Tenant", "Company", "Plant", "Purchasing", "Unit", "Division"];

    return BaseController.extend("cm.organizationMgr.controller.MainList", {

        formatter: Formatter,

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
            this.setModel(new JSONModel({
                selectedTabKey: "",
                tenant_id: "",
                company_code: "",
                add: "",
            }), "view");
            var oRouter = this.getRouter();



            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));

            oRouter.getRoute("mainList").attachMatched(this._onRouteMatched, this);

            //this._doInitTablePerso();
            this.enableMessagePopover();
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView, oQuery;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            oQuery = oArgs["?query"];
            if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) {
                oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
            } else {
                this.getRouter().navTo("mainList", {
                    "?query": {
                        tab: _aValidTabKeys[0]
                    }
                }, false /*history*/);
            }
        },

        onSelectedKey: function (oEvent) {
            var oCtx = this.getView().getBindingContext();
            var selectedKey = oEvent.getParameter("selectedKey");
            this.getRouter().navTo("mainList", {
                "?query": {
                    tab: oEvent.getParameter("selectedKey")
                }
            }, false /*without history*/);
            this.validator.clearValueState(this.byId("page"));
            this._applySearch(null, selectedKey);

        },

        onRenderedFirst: function () {
            //this.byId("pageSearchButton").firePress();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


		/**
		 * Event handler when a page state changed
		 * @param {sap.ui.base.Event} oEvent the page stateChange event
		 * @public
		 */
        onPageStateChange: function (oEvent) {
            debugger;
        },


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table updateFinished event
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
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            var selectedKey = this.getView().getModel("view").getProperty("/selectedTabKey"),
                vSelectKey = selectedKey + "Table";
            if (this.getView().byId("search_tenant")) {
                if (this.validator.validate(this.byId("search_tenant")) !== true) {
                    if (this.getView().byId("search_company")) {
                        if (this.validator.validate(this.byId("search_company")) !== true) {
                            return;
                        }
                    }
                    return;
                } else if (this.getView().byId("search_company")) {
                    if (this.validator.validate(this.byId("search_company")) !== true) {
                        return;
                    }
                }
            }

            var forceSearch = function () {
                var aTableSearchState = this._getSearchStates();
                this._applySearch(aTableSearchState, selectedKey);
            }.bind(this);

            if (this.getModel("list").isChanged() === true) {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM0003"), {
                    title: this.getModel("I18N").getText("/SEARCH"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            forceSearch();
                        }
                    }.bind(this)
                });
            } else {
                forceSearch();
            }
            this.getModel("view").setProperty("/add", selectedKey);
        },

        onMainTableAddButtonPress: function (oEvent) {
            var vSelectKey = this.getView().oParent.mProperties.key + "Table",
                oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                tenant_id = this.getModel("view").getProperty("/tenant_id"),
                company_code = this.getModel("view").getProperty("/company_code");

            // tenant_id : "",
            // company_code : "",

            switch (vSelectKey) {
                case "TenantTable":
                    console.group("TenantTab");
                    oModel.addRecord({
                        "tenant_id": "",
                        "tenant_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Tenant", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;

                case "CompanyTable":
                    console.group("Company");
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "company_code": "",
                        "company_name": "",
                        "use_flag": false,
                        "erp_type_code": "",
                        "currency_code": "",
                        "country_code": "",
                        "language_code": "",
                        "affiliate_code": "",
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Company", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;

                case "PurchasingTable":
                    console.group("Purchasing");
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "purchase_org_code": "",
                        "purchase_org_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Purchasing", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;

                case "PlantTable":
                    console.group("Plant");
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "company_code": company_code,
                        "plant_code": "",
                        "plant_name": "",
                        "use_flag": false,
                        "purchase_org_code": "",
                        "bizdivision_code": "",
                        "au_code": "",
                        "hq_au_code": "",
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Plant", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;

                case "UnitTable":
                    console.group("Unit");
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "bizunit_code": "",
                        "bizunit_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Unit", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;

                case "DivisionTable":
                    console.group("Division");
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "bizdivision_code": "",
                        "bizdivision_name": "",
                        "bizunit_code": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Division", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    console.groupEnd();
                    return 0;
            }
        },

        onMainTableDeleteButtonPress: function () {
            var selectedKey = this.getModel("view").getProperty("/selectedTabKey"),
                vKeyTable = selectedKey + "Table",
                vKeyService = "/Org_" + selectedKey,
                oTable = this.byId(vKeyTable),
                oModel = this.getModel("list"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];
            aItems.forEach(function (oItem) {
                aIndices.push(oModel.getProperty(vKeyService).indexOf(oItem.getBindingContext("list").getObject()));
            });
            aIndices = aIndices.sort(function (a, b) { return b - a; });
            aIndices.forEach(function (nIndex) {
                //oModel.removeRecord(nIndex);
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
            this.validator.clearValueState(this.byId("mainTable"));
        },

        onMainTableSaveButtonPress: function () {
            var oModel = this.getModel("list"),
                oView = this.getView(),
                vSelectKeyTable = this.getModel("view").getProperty("/selectedTabKey") + "Table";

            if (!oModel.isChanged()) {
                MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
                return;
            }

            if (this.validator.validate(this.byId(vSelectKeyTable)) !== true) {
                return;
            }

            MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oModel.submitChanges({
                            success: function (oEvent) {
                                oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                            }.bind(this)
                        });
                    };
                }.bind(this)
            });

        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
        _applySearch: function (aTableSearchState, selectedKey) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            var oTable = "/Org_" + selectedKey;
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read(oTable, {
                filters: aTableSearchState,
                // sorters: [
                // 	new Sorter("chain_code"),
                // 	new Sorter("message_code"),
                // 	new Sorter("language_code", true)
                // ],
                success: function (oData) {
                    //this.validator.clearValueState(this.byId("mainTable"));
                    oView.setBusy(false);
                }.bind(this)
            });
            // ,
            // 	sorters: [
            // 		new Sorter("chain_code"),
            // 		new Sorter("message_code"),
            // 		new Sorter("language_code", true)
            // 	]
            // oTransactionManager.setServiceModel(this.getModel());
        },

        _getSearchStates: function () {
            var oModel = this.getModel("list");
            // 	oView = this.getView();

            var tenant,
                company,
                keyword = this.getView().byId("midTableSearchField").getValue(),
                selectedKey = this.getModel("view").getProperty("/selectedTabKey"),
                nameFilter;
            // tenant_id : "",
            // company_code : "",
            if (!oModel.isChanged()) {
                MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
                return;
            }


            if (this.getView().byId("search_tenant")) {
                tenant = this.getView().byId("search_tenant").getSelectedKey();
                this.getView().getModel("view").setProperty("/tenant_id", this.byId("search_tenant").getSelectedKey());
            }
            if (this.getView().byId("search_company")) {
                company = this.getView().byId("search_company").getSelectedKey();
                this.getView().getModel("view").setProperty("/company_code", this.byId("search_company").getSelectedKey());
            }
            // "Tenant", "Company", "Plant", "Purchasing",  "Unit", "Division"
            if (selectedKey == "Tenant" || selectedKey == "Company" || selectedKey == "Plant" || selectedKey == "Purchasing") {
                nameFilter = selectedKey + "_name";
                nameFilter = nameFilter.toLowerCase();
            } else if (selectedKey == "Unit" || selectedKey == "Division") {
                nameFilter = "biz" + selectedKey + "_name";
                nameFilter = nameFilter.toLowerCase();
            }
            var aTableSearchState = [];
            if (tenant && tenant.length > 0) {
                aTableSearchState.push(new Filter("tenant_id", FilterOperator.EQ, tenant));
            }
            if (company && company.length > 0) {
                aTableSearchState.push(new Filter("company_code", FilterOperator.EQ, company));
            }
            if (keyword && keyword.length > 0) {
                var aKeywordFilters = {
                    filters: [
                        new Filter(nameFilter, FilterOperator.Contains, keyword)
                    ],
                    and: false
                };
                aTableSearchState.push(new Filter(aKeywordFilters));
            }
            return aTableSearchState;
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "cm.organizationMgr",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        },
        onTenantChange: function (oEvent) {
            // var sTenant = oEvent.getSource().getSelectedKey();
            var oContModel = this.getModel("view");
            var sTenant = oContModel.getProperty("/tenant_id");
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenant)
            ];
            var oItemTemplate = new sap.ui.core.ListItem({
                key: "{company_code}",
                text: "{company_name}",
                additionalText: "{company_code}"
            });



            var oChain = this.byId("search_company");
            oChain.setSelectedKey(null);
            oChain.bindItems("/Org_Company", oItemTemplate, null, aFilters);
        }
    });
});