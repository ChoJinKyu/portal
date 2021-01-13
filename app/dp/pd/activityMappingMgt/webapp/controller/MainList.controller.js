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

    return BaseController.extend("dp.pd.activityMappingMgt.controller.MainList", {

        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(),

        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");
            this.getView().setModel(this.getOwnerComponent().getModel());

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/Activity Mapping Management"),
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
                    
                if(this.byId("searchOrgCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchOrgCombo")) !== true) {
                    MessageToast.show("필수 선택 항목입니다.");
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchOrgCombo"));
                }
                this._applySearch(aSearchFilters);
            }
        },

        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());

            this.byId("mainTableCancButton").setEnabled(false);
            this.byId("mainTableSaveButton").setEnabled(false);

            var oTable = this.byId("mainTable");
            oModel.read("/ActivityMappingNameView", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);

                    for (var i = 0; i < oTable.getItems().length; i++) {
                        // oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                        // oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);

                        oModel.oData.ActivityMappingNameView[i]._row_state_ = "";
                    }

                    oTable.removeSelections(true);

                }.bind(this)
            });
        },

        onMainTableUpdateFinished: function (oEvent) {
            // update the mainList's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("appTitle");
            //console.log(sTitle+" ["+iTotalItems+"]");
            this.byId("mainTableTitle").setText(sTitle + "[" + iTotalItems + "]");

        },

        _getSearchStates: function () {
            var sTenantId = "L1100",
                sOrgCombo = this.getView().byId("searchOrgCombo").getSelectedKey(),
                sProductActivity = this.getView().byId("searchProductActivity").getValue(),
                sActivity = this.getView().byId("searchActivity").getValue();

            var aSearchFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenantId)
            ];

            if (sOrgCombo && sOrgCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, sOrgCombo));
            }

            if (sProductActivity && sProductActivity.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("product_activity_code", FilterOperator.Contains, sProductActivity),
                        new Filter("product_activity_name", FilterOperator.Contains, sProductActivity)
                    ],
                    and: false
                }));
            }

            if (sActivity && sActivity.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("activity_code", FilterOperator.Contains, sActivity),
                        new Filter("activity_name", FilterOperator.Contains, sActivity)
                    ],
                    and: false
                }));
            }
            return aSearchFilters;
        },

        onExportPress: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            var sFileName = "Activity Mapping Management";
            var oData = this.getModel("list").getProperty("/ActivityMappingNameView");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onMainTableAddButtonPress: function () {
            var [tId, mName, sEntity, aCol] = arguments;
            var oTable = this.byId(tId),
                oModel = this.getView().getModel(mName); //list
            var oDataArr, oDataLength;
            if (oModel.oData) {
                oDataArr = oModel.getProperty("/ActivityMappingNameView");
                oDataLength = oDataArr.length;
            }

            oModel.addRecord({
                "tenant_id": "L1100",
                "company_code": "*",
                "org_type_code": "BU",
                "org_code": "L110010000",
                "activity_code": null,
                "product_activity_codeE": null,
                "activity_dependency_code": null,
                "active_flag": "true",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": "Test",
                "update_user_id": "Test",
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            }, "/ActivityMappingNameView", 0);

            this.rowIndex = 0;
            this.byId("mainTableCancButton").setEnabled(true);
            this.byId("mainTableSaveButton").setEnabled(true);

            // oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);

            oTable.getAggregation('items')[0].getCells()[5].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[5].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[6].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[6].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[7].getItems()[0].setEnabled(false);
            oTable.getAggregation('items')[0].getCells()[8].getItems()[0].setEnabled(false);

            oTable.setSelectedItem(oTable.getAggregation('items')[0]);
            this.validator.clearValueState(this.byId("mainTable"));
        },

        onMainTableCancButtonPress: function () {
            var oTable = this.byId("mainTable");
            var oModel = this.getView().getModel("list");
            var oData = oModel.oData;
            var cntMod = 0;
            for (var i = 0; i < oTable.getItems().length; i++) {
                if (oData.ActivityMappingNameView[i]._row_state_ == "C"
                    || oData.ActivityMappingNameView[i]._row_state_ == "U"
                    || oData.ActivityMappingNameView[i]._row_state_ == "D") {
                    cntMod++;
                }
            }
            if (cntMod > 0) {
                MessageBox.confirm(this.getModel("I18N").getText("/NCM00007"), {
                    title: this.getModel("I18N").getText("/EDIT_CANCEL"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            var rowIndex = this.rowIndex;
                            // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[0].setVisible(true);
                            // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[1].setVisible(false);

                            oTable.getAggregation('items')[rowIndex].getCells()[5].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[rowIndex].getCells()[5].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[rowIndex].getCells()[6].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[rowIndex].getCells()[6].getItems()[1].setVisible(false);

                            this.byId("btn_search").firePress();
                        }
                    }).bind(this)
                })
            } else {
                var rowIndex = this.rowIndex;
                // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[0].setVisible(true);
                // oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[1].setVisible(false);

                oTable.getAggregation('items')[rowIndex].getCells()[5].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[5].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[6].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[6].getItems()[1].setVisible(false);

                this.byId("btn_search").firePress();
            }
        },

        onMainTableDeleteButtonPress: function () {
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            if (oTable.getSelectedItems().length < 1) {
                MessageToast.show("선택된 데이타가 없습니다.");
                return;
            }

            for (var i = 0; i < oTable.getItems().length - 1; i++) {
                // oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                // oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);
            }

            aItems.forEach(function (oItem) {
                aIndices.push(oModel.getProperty("/ActivityMappingNameView").indexOf(oItem.getBindingContext("list").getObject()));
            });
            aIndices = aIndices.sort(function (a, b) { return b - a; });
            aIndices.forEach(function (nIndex) {
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
            oTable.setSelectedItem(aItems);
        },

        cellPress: function (oEvent) {
            console.log(oEvent);
        },

        onMainTableSaveButtonPress: function () {
            var oModel = this.getModel("activityMappingV4Service");
            var oModel2 = this.getView().getModel("list");
            var oView = this.getView();
            var v_this = this;
            var oTable = this.byId("mainTable");
            var oData = oModel2.oData;
            var input = {
                inputData: []
            };

            if (this.validator.validate(this.byId("mainTable")) !== true) return;
            var now = new Date();
            var PdActivityMappingType = [];
            for (var i = 0; i < oTable.getItems().length; i++) {
                if (oData.ActivityMappingNameView[i]._row_state_ != null && oData.ActivityMappingNameView[i]._row_state_ != "") {

                    PdActivityMappingType.push(
                        {
                            tenant_id: oData.ActivityMappingNameView[i].tenant_id,
                            company_code: oData.ActivityMappingNameView[i].company_code,
                            org_type_code: oData.ActivityMappingNameView[i].org_type_code,
                            org_code: oData.ActivityMappingNameView[i].org_code,
                            activity_code: oData.ActivityMappingNameView[i].activity_code,
                            product_activity_codeproduct_activity_code: oData.ActivityMappingNameView[i].product_activity_codeproduct_activity_code,
                            activity_dependency_code: oData.ActivityMappingNameView[i].activity_dependency_code,
                            active_flag: oData.ActivityMappingNameView[i].active_flag.toString(),
                            update_user_id: oData.ActivityMappingNameView[i].update_user_id,
                            system_update_dtm: oData.ActivityMappingNameView[i].system_update_dtm,
                            crud_type_code: oData.ActivityMappingNameView[i]._row_state_,
                            update_activity_code: oData.ActivityMappingNameView[i].update_activity_code,
                            update_product_activity_codeproduct_activity_code: oData.ActivityMappingNameView[i].update_product_activity_codeproduct_activity_code
                        }
                    );

                    input.inputData = PdActivityMappingType;
                    var url = "dp/pd/activityMapping/webapp/srv-api/odata/v4/dp.ActivityMappingV4Service/PdActivityMappingSaveProc";

                }
            }

            var v_this = this;
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: (function (sButton) {
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: JSON.stringify(input),
                        contentType: "application/json",
                        success: function (data) {
                            v_this.byId("btn_search").firePress();
                        },
                        error: function (e) {
                            v_this.byId("btn_search").firePress();
                        }
                    });
                }).bind(this)
            })
        },

        onSelectionChange: function (oEvent) {
            //var [tId, mName, sEntity, aCol] = arguments;
            var oTable = this.byId("mainTable");
            var oModel = this.getView().getModel("list");
            var oItem = oTable.getSelectedItem();
            var idxs = [];
            for (var i = 0; i < oTable.getItems().length; i++) {
                if (oTable.getAggregation('items')[i] != null && oTable.getAggregation('items')[i].getCells() != undefined) {

                    // oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                    // oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);

                    oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[5].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[6].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[6].getItems()[1].setVisible(false);
                }
            }
            if (oItem != null && oItem != undefined) {
                this.byId("mainTableCancButton").setEnabled(true);
                this.byId("mainTableSaveButton").setEnabled(true);

                for (var k = 0; k < oTable.getSelectedContextPaths().length; k++) {
                    idxs[k] = oTable.getSelectedContextPaths()[k].split("/")[2];

                    if (oTable.getAggregation('items')[idxs[k]] != null && oTable.getAggregation('items')[idxs[k]].getCells() != undefined) {

                        // oTable.getAggregation('items')[idxs[k]].getCells()[1].getItems()[0].setVisible(false);
                        // oTable.getAggregation('items')[idxs[k]].getCells()[1].getItems()[1].setVisible(true);
                        oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[0].setVisible(false);
                        oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[1].setVisible(true);
                        oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[0].setVisible(false);
                        oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[1].setVisible(true);
                        oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[0].setVisible(false);
                        oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[1].setVisible(true);

                        oTable.getAggregation('items')[idxs[k]].getCells()[5].getItems()[0].setVisible(false);
                        oTable.getAggregation('items')[idxs[k]].getCells()[5].getItems()[1].setVisible(true);
                        oTable.getAggregation('items')[idxs[k]].getCells()[6].getItems()[0].setVisible(false);
                        oTable.getAggregation('items')[idxs[k]].getCells()[6].getItems()[1].setVisible(true);

                    }
                }
            }
        },

        onSearchProductActivity: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.activityMappingMgt.view.ProductActivity",
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
            console.log(productActivityCode, productActivityName);

            var oTable = this.byId("mainTable");
            var idx = oTable.getSelectedContextPaths()[0].split("/")[2];
            oTable.getAggregation('items')[idx].getCells()[2].mAggregations.items[1].setValue(productActivityCode);
            oTable.getAggregation('items')[idx].getCells()[3].mAggregations.items[1].setValue(productActivityName);
        },

        onSearchActivity: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this._atDialog) {
                this._atDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.activityMappingMgt.view.Activity",
                    controller: this
                }).then(function (_oDialog) {
                    oView.addDependent(_oDialog);
                    return _oDialog;
                }.bind(this));
            }

            this._atDialog.then(function (_oDialog) {
                _oDialog.open();
            });
        },

        handleActivitySearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilters = [];
            oFilters.push(new Filter({
                filters: [
                    new Filter("activity_code", FilterOperator.Contains, sValue),
                    new Filter("activity_name", FilterOperator.Contains, sValue)
                ],
                and: false
            }));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oFilters);
        },

        handleActivityClose: function (oEvent) {
            var activityCode = oEvent.mParameters.selectedItem.mAggregations.cells[0].getText();
            var activityName = oEvent.mParameters.selectedItem.mAggregations.cells[1].getText();

            var oTable = this.byId("mainTable");
            var idx = oTable.getSelectedContextPaths()[0].split("/")[2];
            oTable.getAggregation('items')[idx].getCells()[5].mAggregations.items[1].setValue(activityCode);
            oTable.getAggregation('items')[idx].getCells()[6].mAggregations.items[1].setValue(activityName);
        }

    });
});
