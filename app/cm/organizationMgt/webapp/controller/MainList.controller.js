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
    "sap/ui/core/ListItem"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, TablePersoController, MainListPersoService,
    Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, JSONModel, ListItem) {
    "use strict";

    // var _aValidTabKeys = ["Tenant", "Company", "Plant", "Purchasing", "Unit", "Division"];

    return BaseController.extend("cm.organizationMgt.controller.MainList", {

        formatter: Formatter,
// "Tenant", "Company", "Plant", "Purchasing", "Unit", "Division"
        formatterVbox: (function(){
			return {
				visibleTenant: function(oData){
                    switch (oData)
                    {
                        case "Tenant": return false;
                        case "Company": return true;
                        case "Plant": return true;
                        case "Purchasing": return true;
                        case "Unit": return true;
                        case "Division": return true;
                    }
					return ;
                },
                visibleCompany: function(oData){
                    switch (oData)
                    {
                        case "Tenant": return false;
                        case "Company": return true;
                        case "Plant": return true;
                        case "Purchasing": return false;
                        case "Unit": return false;
                        case "Division": return false;
                    }
					return ;
				},
			}
        })(),

        formatterRequired: (function(){
			return {
				visibleRequired: function(oData){
                    switch (oData)
                    {
                        case "Company": return false;
                        case "Plant": return true;
                    }
					return ;
                }
			}
        })(),

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

            // oQuery = oArgs["?query"];
            // if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) {
            //     oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
            // } else {
            //     this.getRouter().navTo("mainList", {
            //         "?query": {
            //             tab: _aValidTabKeys[0]
            //         }
            //     }, false /*history*/);
            // }
        },

        onSelectedKey: function (oEvent) {
            var aTableSearchState = [];
            aTableSearchState.push(new Filter("tenant_id", FilterOperator.EQ, "NotTenant"));
            var oCtx = this.getView().getBindingContext();
            var selectedKey = oEvent.getParameter("selectedKey");
            // this.getRouter().navTo("mainList", {
            //     "?query": {
            //         tab: oEvent.getParameter("selectedKey")
            //     }
            // }, false /*without history*/);

        },

        _clearValueState : function (){
            this.validator.clearValueState(this.byId("page"));
            this.validator.clearValueState(this.byId("search_companyE"));
            this.validator.clearValueState(this.byId("search_companyS"));
            this.validator.clearValueState(this.byId("search_tenantS"));
            this.validator.clearValueState(this.byId("search_tenantE"));
        },

        _valueCheck : function (selectedKey) {

             if ( selectedKey === "Unit" || selectedKey === "Division" || selectedKey === "Purchasing" || selectedKey === "Company") {
                if (this.getView().byId("search_tenant")) {
                if (this.validator.validate(this.byId("search_tenant")) !== true) {
                    return "return";
                    } 
                }  
            } else if (selectedKey === "Plant" ) {
                if (this.getView().byId("search_tenant")) {
                if (this.validator.validate(this.byId("search_tenant")) !== true) {
                    if (this.getView().byId("search_company")) {
                        if (this.validator.validate(this.byId("search_company")) !== true) {
                            return "return";
                        }
                    }
                    return "return";
                } else if (this.getView().byId("search_company")) {
                    if (this.validator.validate(this.byId("search_company")) !== true) {
                        return "return";
                        }
                    }
                }
            }
        },
                

        onRenderedFirst: function () {
            this.getView().byId("tenant").fireEvent();
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
                vSelectKey = selectedKey + "Table",
                vReturn;

            vReturn = this._valueCheck(selectedKey);
            if(vReturn === "return"){
                return;
            }
            var forceSearch = function () {
                var aTableSearchState = this._getSearchStates();
                this._applySearch(aTableSearchState, selectedKey);
            }.bind(this);

            if (this.getModel("list").isChanged() === true) {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00005"), {
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


        onMainTableAddButtonPress: function () {
            var vSelectKey = this.getModel("view").getProperty("/selectedTabKey") + "Table",
                oModel = this.getModel("list"),
                tenant_id = this.getModel("view").getProperty("/tenant_id"),
                company_code = this.getModel("view").getProperty("/company_code");

            switch (vSelectKey) {
                case "TenantTable":
                    oModel.addRecord({
                        "tenant_id": "",
                        "tenant_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Tenant", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    return 0;

                case "CompanyTable":
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
                    return 0;

                case "PurchasingTable":
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "purchase_org_code": "",
                        "purchase_org_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Purchasing", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    return 0;

                case "PlantTable":
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
                    return 0;

                case "UnitTable":
                    oModel.addRecord({
                        "tenant_id": tenant_id,
                        "bizunit_code": "",
                        "bizunit_name": "",
                        "use_flag": false,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Org_Unit", 0);
                    this.validator.clearValueState(this.byId(vSelectKey));
                    return 0;

                case "DivisionTable":
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
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
            this.validator.clearValueState(this.byId("mainTable"));
        },

        onMainTableSaveButtonPress: function () {
            
            var oModel = this.getModel("list"),
                oView = this.getView(),
                vSelectKeyTable = this.getModel("view").getProperty("/selectedTabKey") + "Table";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oModel.submitChanges({
                            success: function (oEvent) {
                                MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                                oView.setBusy(false);
                                this.byId("pageSearchButton").firePress();
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
                success: function (oData) {
                    oView.setBusy(false);
                }.bind(this)
            });
        },
        _getSearchStates: function () {
            var tenant,
                company,
                selectedKey = this.getModel("view").getProperty("/selectedTabKey"),
                nameFilter;

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
            if(selectedKey == "Company" || selectedKey == "Plant"){
                if (company && company.length > 0) {
                    aTableSearchState.push(new Filter("company_code", FilterOperator.EQ, company));
                }
            }
            return aTableSearchState;
        },

        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("mainTable"),
                componentName: "cm.organizationMgt",
                persoService: MainListPersoService,
                hasGrouping: true
            }).activate();
        },
        onTenantChange: function (oEvent) {
            var oContModel = this.getModel("view");
            var sTenant = oContModel.getProperty("/tenant_id");
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenant)
            ];
            var oItemTemplate = new ListItem({
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