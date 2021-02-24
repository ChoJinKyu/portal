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
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/core/syncStyleClass",
    "ext/lib/util/SppUserSession"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, Formatter, DateFormatter, Validator, TablePersoController, MainListPersoService, Filter, FilterOperator,
     MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil, Fragment, Sorter, syncStyleClass, SppUserSession) {
    "use strict";

    return BaseController.extend("dp.pd.activityMappingMgt.controller.MainList", {

        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(),
        oOrgCode: null,
        loginUserId: new String,
        tenant_id: new String,
        companyCode: new String,
        language_cd: new String,

        onInit: function () {
            var oViewModel = this.getResourceBundle();
            oViewModel = new JSONModel({
                headerExpanded: true,
                readMode: false,
                editMode: false
            });
            this.setModel(oViewModel, "mainListView");

            var oSppUserSession = new SppUserSession();
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

            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

            //로그인 세션 작업완료시 수정
            this.tenant_id = this.getModel("USER_SESSION").getSessionAttr("TENANT_ID");
            this.loginUserId = this.getModel("USER_SESSION").getSessionAttr("USER_ID");
            this.companyCode = this.getModel("USER_SESSION").getSessionAttr("COMPANY_CODE");
            this.language_cd = this.getModel("USER_SESSION").getSessionAttr("LANGUAGE_CODE");

            this.tenant_id = "L2101";
            this.loginUserId = "user@lgensol.com";
            this.companyCode = "LGESL";
            this.language_cd = "KO";

            //this.byId("btn_search").firePress();
            //this._doInitTablePerso();

            this.byId("mainTableDelButton").setEnabled(false);
            this.byId("mainTableCancButton").setEnabled(false);
            this.byId("mainTableSaveButton").setEnabled(false);
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
                var aSorter = this._getSorter();
                    
                if(this.byId("searchCompanyCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchCompanyCombo")) !== true) {
                    MessageToast.show(this.getModel("I18N").getText("/ECM01001"));
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchCompanyCombo"));
                }

                if(this.byId("searchAUCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchAUCombo")) !== true) {
                    MessageToast.show(this.getModel("I18N").getText("/ECM01001"));
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchAUCombo"));
                }

                this._applySearch(aSearchFilters, aSorter);
            }
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("local_update_dtm", true));
            return aSorter;
        },

        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());

            this.byId("mainTableCancButton").setEnabled(false);

            var oTable = this.byId("mainTable");
            oModel.read("/ActivityMappingNameView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    oView.setBusy(false);

                    for (var i = 0; i < oTable.getItems().length; i++) {
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

                        oTable.getAggregation('items')[i].getCells()[9].setText(oModel.oData.ActivityMappingNameView[i].product_activity_code);
                        oTable.getAggregation('items')[i].getCells()[10].setText(oModel.oData.ActivityMappingNameView[i].activity_code);

                        oModel.oData.ActivityMappingNameView[i]._row_state_ = "";                        
                    }

                    oTable.removeSelections(true);

                    this.oOrgCode = this.byId("searchAUCombo").getSelectedKey();

                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sCompanyCombo = this.getView().byId("searchCompanyCombo").getSelectedKey(),
                sAuCombo = this.getView().byId("searchAUCombo").getSelectedKey(),
                sProductActivity = this.getView().byId("searchProductActivity").getValue(),
                sActivity = this.getView().byId("searchActivity").getValue();

            var aSearchFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this.tenant_id)
            ];

            if (sCompanyCombo && sCompanyCombo.length > 0) {
                aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, sCompanyCombo));
            }

            if (sAuCombo && sAuCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, sAuCombo));
            }

            if (sProductActivity && sProductActivity.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("tolower(product_activity_code)", FilterOperator.Contains, "'" + sProductActivity.toLowerCase().replace("'","''") + "'"),
                        new Filter("tolower(product_activity_name)", FilterOperator.Contains, "'" +  sProductActivity.toLowerCase().replace("'","''") + "'")
                    ],
                    and: false
                }));
            }

            if (sActivity && sActivity.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("tolower(activity_code)", FilterOperator.Contains, "'" +  sActivity.toLowerCase().replace("'","''") + "'"),
                        new Filter("tolower(activity_name)", FilterOperator.Contains, "'" +  sActivity.toLowerCase().replace("'","''") + "'")
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

            var sFileName = "Activity Mapping Management_"+ this._getDTtype();
            var oData = this.getModel("list").getProperty("/ActivityMappingNameView");
            
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onMainTableAddButtonPress: function () {
            var oTable = this.byId("mainTable"),
                oModel = this.getView().getModel("list"); //list
            var oDataArr, oDataLength;
            if (oModel.oData) {
                oDataArr = oModel.getProperty("/ActivityMappingNameView");
                oDataLength = oDataArr.length;
            }

            var oData = oModel.oData;
            for (var i = 0; i < oTable.getItems().length; i++) {
                if (oData.ActivityMappingNameView[i]._row_state_ == "U") {
                   oTable.removeSelections(true);
                }
            }
            
            oModel.addRecord({
                "tenant_id": this.tenant_id,
                "company_code": this.companyCode,
                "org_type_code": "AU",  // AU
                "org_code": this.byId("searchAUCombo").getSelectedKey(),
                "activity_code": null,
                "product_activity_code": null,
                "activity_dependency_code": null,
                "active_flag": "true",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date(),
                "create_user_id": this.loginUserId,
                "update_user_id": this.loginUserId,
                "system_create_dtm": new Date(),
                "system_update_dtm": new Date()
            }, "/ActivityMappingNameView", 0);

            this.rowIndex = 0;
            this.byId("mainTableCancButton").setEnabled(true);
            this.byId("mainTableDelButton").setEnabled(true);
            this.byId("mainTableSaveButton").setEnabled(true);

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

                            this.byId("mainTableSaveButton").setEnabled(false);
                            this.byId("mainTableDelButton").setEnabled(false);
                            this.byId("mainTableCancButton").setEnabled(false);
                            this.byId("rTableExportButton").setEnabled(true);

                        }
                    }).bind(this)
                })
            } else {
                var rowIndex = this.rowIndex;

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

                this.byId("mainTableSaveButton").setEnabled(false);
                this.byId("mainTableDelButton").setEnabled(false);
                this.byId("mainTableCancButton").setEnabled(false);
                this.byId("rTableExportButton").setEnabled(true);
            }
        },

        onMainTableDeleteButtonPress: function () {
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            for (var i = 0; i < oTable.getItems().length - 1; i++) {
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

        onMainTableSaveButtonPress: function () {
            var oModel2 = this.getView().getModel("list");
            var v_this = this;
            var oTable = this.byId("mainTable");
            var oData = oModel2.oData;
            var input = {
                inputData: []
            };

            var org_code_c, product_activity_code_c, activity_dependency_code_c, activity_code_c;
            var org_code_u, product_activity_code_u, activity_dependency_code_u, activity_code_u;
            // 신규, 수정 일때 중복 체크
            for(var z=0; z < oTable.getItems().length; z++) {
                if(oData.ActivityMappingNameView[z]._row_state_ == "C") {
                    org_code_c = oData.ActivityMappingNameView[z].org_code;
                    product_activity_code_c = oData.ActivityMappingNameView[z].product_activity_code;
                    activity_code_c = oData.ActivityMappingNameView[z].activity_code;
                }

                if(oData.ActivityMappingNameView[z]._row_state_ == "U") {
                    org_code_u = oData.ActivityMappingNameView[z].org_code;
                    product_activity_code_u = oData.ActivityMappingNameView[z].product_activity_code;
                    activity_code_u = oData.ActivityMappingNameView[z].activity_code;
                }

                if(org_code_c != undefined && org_code_u != undefined && product_activity_code_c != undefined && product_activity_code_u != undefined &&
                    activity_code_c != undefined && activity_code_u != undefined &&
                    org_code_c == org_code_u && product_activity_code_c == product_activity_code_u && activity_code_c == activity_code_u) {
                        sap.m.MessageToast.show(this.getModel("I18N").getText("/NDP60005"));
                        return;
                }
            }

            if(this.validator.validate(this.byId("mainTable")) !== true){
                MessageBox.confirm(this.getModel("I18N").getText("/ECM01002"), {
                    title: this.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function () {
                    }).bind(this)
                });
            }else{
                var now = new Date();
                var PdActivityMappingType = [];
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if (oData.ActivityMappingNameView[i]._row_state_ != null && oData.ActivityMappingNameView[i]._row_state_ != "") {

                        PdActivityMappingType.push({
                            tenant_id: this.tenant_id,
                            company_code: this.companyCode,
                            org_type_code: oData.ActivityMappingNameView[i].org_type_code,
                            org_code: oData.ActivityMappingNameView[i].org_code,
                            activity_code: oData.ActivityMappingNameView[i].activity_code,
                            product_activity_code: oData.ActivityMappingNameView[i].product_activity_code,
                            activity_dependency_code: oData.ActivityMappingNameView[i].activity_dependency_code,
                            active_flag: oData.ActivityMappingNameView[i].active_flag.toString(),
                            update_user_id: this.loginUserId,
                            system_update_dtm: now,
                            crud_type_code: oData.ActivityMappingNameView[i]._row_state_,
                            update_activity_code: oData.ActivityMappingNameView[i].activity_code_org,
                            update_product_activity_code: oData.ActivityMappingNameView[i].product_activity_code_org
                        });

                        input.inputData = PdActivityMappingType;
                        var url = "dp/pd/activityMapping/webapp/srv-api/odata/v4/dp.ActivityMappingV4Service/PdActivityMappingSaveProc";
                    }
                }
                
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
                                sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                v_this.byId("btn_search").firePress();
                                if(data.value[0].return_code =="OK"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                }else{
                                    sap.m.MessageToast.show(data.value[0].return_msg);
                                }
                            },
                            error: function (e) {
                                v_this.byId("btn_search").firePress();
                            }
                        });
                    }).bind(this)
                });
                this.byId("mainTableSaveButton").setEnabled(false);
                this.byId("mainTableDelButton").setEnabled(false);
                this.byId("mainTableCancButton").setEnabled(false);
                this.byId("rTableExportButton").setEnabled(true);
            }
        },

        onSelectionChange: function (oEvent) {
            var oTable = this.byId("mainTable");
            var oItem = oTable.getSelectedItem();
            var idxs = [];
            for (var i = 0; i < oTable.getItems().length; i++) {
                if (oTable.getAggregation('items')[i] != null && oTable.getAggregation('items')[i].getCells() != undefined) {
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

                for (var k = 0; k < oTable.getSelectedContextPaths().length; k++) {
                    idxs[k] = oTable.getSelectedContextPaths()[k].split("/")[2];
                    if (oTable.getAggregation('items')[idxs[k]] != null && oTable.getAggregation('items')[idxs[k]].getCells() != undefined) {
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
                this.byId("mainTableSaveButton").setEnabled(true);
                this.byId("mainTableDelButton").setEnabled(true);
                this.byId("mainTableCancButton").setEnabled(true);
                this.byId("rTableExportButton").setEnabled(false);
                //this.byId("mainTablePersoButton").setEnabled(false);
            } else {
                var oModel2 = this.getView().getModel("list");
                var oData = oModel2.oData;
                var cnt = 0;
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if( oData.ActivityMappingNameView[i]._row_state_ != null && oData.ActivityMappingNameView[i]._row_state_ != "" ){
                        cnt++;
                    }
                }
                if(cnt > 0 ){
                    this.byId("mainTableCancButton").setEnabled(true);
                    this.byId("mainTableDelButton").setEnabled(false);
                    this.byId("mainTableSaveButton").setEnabled(true);
                    this.byId("rTableExportButton").setEnabled(false);
                    //this.byId("mainTablePersoButton").setEnabled(false);
                }else{
                    this.byId("mainTableCancButton").setEnabled(false);
                    this.byId("mainTableDelButton").setEnabled(false);
                    this.byId("mainTableSaveButton").setEnabled(false);
                    this.byId("rTableExportButton").setEnabled(true);
                    //this.byId("mainTablePersoButton").setEnabled(true);
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
                    new Filter("activity_name", FilterOperator.Contains, sValue)
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
                var aFilters = [
                    new Filter("org_code", FilterOperator.EQ, this.oOrgCode),
                ];
                var oItemTemplate = new sap.m.ColumnListItem({
                    cells : [
                        new sap.m.Text({text:"{activity_code}"}),
                        new sap.m.Text({text:"{activity_name}"})
                    ]
                });

                _oDialog.bindItems("/PdPartActivityTemplateView", oItemTemplate, null, aFilters);
                _oDialog.open();
            }.bind(this));
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
        },

        _doInitTablePerso: function(){
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "activityMappingMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },

        _getDTtype: function (StartFlag, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
 
            let sReturnValue = iYear + this._getPreZero(iMonth) + this._getPreZero(iDate);                      

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        }

    });
});
