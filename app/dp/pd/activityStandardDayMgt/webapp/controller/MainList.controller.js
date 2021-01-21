sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
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
    "ext/lib/util/ExcelUtil",
    "sap/ui/core/Fragment"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, Formatter, DateFormatter, Validator, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil, Fragment) {
    "use strict";

    return BaseController.extend("dp.pd.activityStandardDayMgt.controller.MainList", {

        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(),

        onInit: function () {
            var oViewModel = this.getResourceBundle();
            oViewModel = new JSONModel({
                headerExpanded: true,
                readMode: false,
                editMode: false
            });
            this.setModel(oViewModel, "mainListView");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");
            this.getView().setModel(this.getOwnerComponent().getModel());

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/Activity Standard Day Management"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));

            this.byId("btn_search").firePress();
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
        },

        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();
                    
                if(this.byId("searchAUCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchAUCombo")) !== true) {
                    MessageToast.show("필수 선택 항목입니다.");
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchAUCombo"));
                }
                this._applySearch(aSearchFilters);
            }
        },

        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            //oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());

            var oTable = this.byId("mainTable");
            oModel.read("/ActivityMappingNameView", {
                filters: aSearchFilters,
                success: function (oData) {
                    //oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sTenantId = "L2100",
                oSearchAUCombo = this.getView().byId("searchAUCombo").getSelectedKey(),
                oSearchPCCombo = this.getView().byId("searchPCCombo").getSelectedKey(),
                oSearchPTCombo = this.getView().byId("searchPTCombo").getSelectedKey(),
                oSearchActivity = this.getView().byId("searchActivity").getValue();

            var aSearchFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenantId)
            ];

            if (oSearchAUCombo && oSearchAUCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, oSearchAUCombo));
            }

            if (oSearchPCCombo && oSearchPCCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, oSearchPCCombo));
            }

            if (oSearchPTCombo && oSearchPTCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, oSearchPTCombo));
            }

            if (oSearchActivity && oSearchActivity.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, oSearchActivity));
            }

            // if (sProductActivity && sProductActivity.length > 0) {
            //     aSearchFilters.push(new Filter({
            //         filters: [
            //             new Filter("product_activity_code", FilterOperator.Contains, sProductActivity),
            //             new Filter("product_activity_name", FilterOperator.Contains, sProductActivity)
            //         ],
            //         and: false
            //     }));
            // }

            return aSearchFilters;
        },

        onExportPress: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId("mainTable");
            var sFileName = "Activity Mapping Management";
            var oData = this.getModel("list").getProperty("/ActivityMappingNameView");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onSearchProductActivity: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.activityStandardDayMgt.view.ProductActivity",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        handleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilters = [];
            oFilters.push(new Filter({
                filters: [
                    new Filter("product_activity_code", FilterOperator.Contains, sValue),
                    new Filter("product_activity_name", FilterOperator.Contains, sValue)
                ],
                and: false
            }));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oFilters);
        },

        handleClose: function (oEvent) {
            var productActivityCode = oEvent.mParameters.selectedItem.mAggregations.cells[0].getText();
            var productActivityName = oEvent.mParameters.selectedItem.mAggregations.cells[1].getText();

            var oTable = this.byId("mainTable");
            var idx = oTable.getSelectedContextPaths()[0].split("/")[2];
            oTable.getAggregation('items')[idx].getCells()[2].mAggregations.items[1].setValue(productActivityCode);
            oTable.getAggregation('items')[idx].getCells()[3].mAggregations.items[1].setValue(productActivityName);
        },

        _doInitTablePerso: function(){
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "activityStandardDayMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },

    });
});
