sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "sap/m/TablePersoController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/ui/core/Item",
    "ext/lib/util/ExcelUtil",
    "ext/lib/formatter/Formatter"
],
    function (BaseController, Multilingual, Validator, DateFormatter, History
        , JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator
        , MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text
        , Input, Item, ExcelUtil, Formatter
    ) {
        "use strict";

        return BaseController.extend("dp.pd.productActivityMgt.controller.productActivityMgt", {

            formatter: Formatter,
            validator: new Validator(),
            dateFormatter: DateFormatter,
            loginUserId: new String,
            tenant_id: new String,
            company_code: new String,
            org_type_code: new String,
            org_code: new String,

            onInit: function () {
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                this.getView().setModel(new ManagedListModel(), "list");
                this.setModel(new ManagedListModel(), "orgMap");
                this.rowIndex = 0;
                this._doInitSearch();
                //로그인 세션 작업완료시 수정
                this.loginUserId = "TestUser";
                this.tenant_id = "L1100";
                this.company_code = "*";
                this.org_type_code = "BU";
                this.org_code = "L110010000";
                oMultilingual.attachEvent("ready", function (oEvent) {
                    var oi18nModel = oEvent.getParameter("model");
                    this.addHistoryEntry({
                        title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
                        icon: "sap-icon://table-view",
                        intent: "#Template-display"
                    }, true);
                }.bind(this));
            },

            /**
             * @private
             * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
             */
            _doInitSearch: function () {
                this.getView().setModel(this.getOwnerComponent().getModel());

                //접속자 법인 사업본부로 바꿔줘야함 로그인 세션이 공통에서 작업되면 작업해줘야 함
                this.getView().byId("searchPdOperationOrg").setSelectedKeys(['L110010000']);

            },

            onMainTablePersoButtonPressed: function (event) {
                this._oTPC.openDialog();
            },

            // Display row number without changing data
            onAfterRendering: function () {
                this.onSearch();
            },


            onSearch: function () {
                var aSearchFilters = this._getSearchStates();
                var oView = this.getView(),
                    oModel = this.getModel("list");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                //this.byId("buttonMainAddRow").setEnabled(true);
                //this.byId("buttonMainEditRow").setEnabled(true);
                this.byId("buttonMainCancelRow").setEnabled(false);
                var oTable = this.byId("mainTable");
                oModel.read("/PdProdActivityTemplate", {
                    filters: aSearchFilters,
                    success: function (oData) {
                        for (var i = 0; i < oTable.getItems().length; i++) {
                            oTable.getAggregation('items')[i].getCells()[1].getItems()[2].setValue(oTable.getAggregation('items')[i].getCells()[1].getItems()[1].getValue());
                            //oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setText("No");
                            if (oTable.getAggregation('items')[i].getCells()[4].getItems()[1].getValue() == "true") {
                                //console.log(oTable.getAggregation('items')[i].getCells()[4].getItems()[2]._buttonPressed);
                                oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setPressed(true);
                                oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setText("Yes");
                            }

                            if (oTable.getAggregation('items')[i].getCells()[5].getItems()[1].getValue() == "true") {
                                //console.log(oTable.getAggregation('items')[i].getCells()[5].getItems()[2]._buttonPressed);
                                oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setPressed(true);
                                oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setText("Active");
                            }

                            
                            oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setEnabled(false);
                            oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);

                            //console.log(oTable.getAggregation('items')[i].getCells()[4].getItems()[2].getPressed());
                            oModel.oData.PdProdActivityTemplate[i]._row_state_ = "";
                        }
                        oView.setBusy(false);
                        
                        oTable.removeSelections(true);
                    },
                    error: function (data) {
                        oView.setBusy(false);
                    }
                });


            },




            _getSearchStates: function () {
                var status = this.getView().byId("searchStatusButton").getSelectedKey();
                var aCompany = this.getView().byId("searchPdOperationOrg").getSelectedKeys();
                var aSearchFilters = [];
                if (aCompany.length > 0) {
                    var _tempFilters = [];
                    aCompany.forEach(function (item, idx, arr) {
                        _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                    });
                    aSearchFilters.push(
                        new Filter({
                            filters: _tempFilters,
                            and: false
                        })
                    );
                }
                if (status != "all") {
                    aSearchFilters.push(new Filter("active_flag", FilterOperator.EQ, status));
                }
                return aSearchFilters;
            },

            onCancel: function () {
                var oTable = this.byId("mainTable");
                var rowIndex = this.rowIndex;
                oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[1].setVisible(false);
                this.onSearch();
            },

            onSelectRow: function () {
                var [tId, mName, sEntity, aCol] = arguments;
                var oTable = this.byId(tId), //mainTable
                    oModel = this.getView().getModel(mName), //list
                    oItem = oTable.getSelectedItem();
                var idx = oItem.getBindingContextPath().split("/")[2];
                this.rowIndex = idx;
                //this.byId("buttonMainAddRow").setEnabled(false);
                //this.byId("buttonMainEditRow").setEnabled(false);
                this.byId("buttonMainCancelRow").setEnabled(true);
                oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[idx].getCells()[3].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[3].getItems()[1].setVisible(true);
            },



            onAdd: function () {
                var [tId, mName, sEntity, aCol] = arguments;
                //tableId modelName EntityName tenant_id
                var oTable = this.byId(tId), //mainTable
                    oModel = this.getView().getModel(mName); //list
                var oDataArr, oDataLength;
                if (oModel.oData) {
                    oDataArr = oModel.getProperty("/PdProdActivityTemplate");
                    oDataLength = oDataArr.length;
                }
                oModel.addRecord({
                    "tenant_id": this.tenant_id,
                    "company_code": this.company_code,
                    "org_type_code": this.org_type_code,
                    "org_code": this.org_code,
                    "product_activity_code": "",
                    "develope_event_code": null,
                    "sequence": "1",
                    "product_activity_name": "",
                    "product_activity_english_name": "",
                    "milestone_flag": null,
                    "active_flag": true,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this.loginUserId,
                    "update_user_id": this.loginUserId,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                }, "/PdProdActivityTemplate", 0);

                this.rowIndex = 0;
                //this.byId("buttonMainAddRow").setEnabled(false);
                //this.byId("buttonMainEditRow").setEnabled(false); 
                this.byId("buttonMainCancelRow").setEnabled(true);
                oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[4].getItems()[2].setEnabled(true);
                oTable.getAggregation('items')[0].getCells()[5].getItems()[2].setEnabled(true);
                oTable.setSelectedItem(oTable.getAggregation('items')[0]);

            },

            
        
            onSave: function () {
                var oModel = this.getModel("v4Proc");
                var oView = this.getView();
                var v_this = this;
                var ctx = this.byId("mainTable").getSelectedContextPaths();
                var oTable = this.byId("mainTable");

             
                //상태

                if (ctx.length > 0) {
                    var inputData = {
                        inputData : {
                            pdProdActivityTemplateType :  []
                        }
                    };
                    var now = new Date();
                    var PdProdActivityTemplateType  = [];
                    for (var i = 0; i < ctx.length; i++) {
                        var curDataH = this.getView().getModel("list").getProperty(ctx[i]);
                        var activeFlg = curDataH.active_flag;
                        if(activeFlg=="true"){
                            activeFlg = "true";
                        }else {
                            activeFlg = "false";
                        }
                        var milestoneFlg = curDataH.milestone_flag;
                        if(milestoneFlg=="true"){
                            milestoneFlg = "true";
                        }else {
                            milestoneFlg = "false";
                        }
                        var pacOri = curDataH.product_activity_code_ori;
                        if(curDataH._row_state_ == "C"){
                            pacOri = curDataH.product_activity_code
                        }
                        var seq = curDataH.sequence;
                        if(seq == "C"){
                            seq ="1";
                        }
                        PdProdActivityTemplateType.push( 
                           {
                                tenant_id : curDataH.tenant_id,
                                company_code : curDataH.company_code,
                                org_type_code : curDataH.org_type_code,
                                org_code : curDataH.org_code,
                                product_activity_code : pacOri,
                                develope_event_code : curDataH.develope_event_code,	
                                sequence : curDataH.sequence,
                                product_activity_name : curDataH.product_activity_name,	
                                product_activity_english_name : curDataH.product_activity_english_name,
                                milestone_flag : milestoneFlg,
                                active_flag : activeFlg,
                                update_user_id : curDataH.update_user_id,
                                system_update_dtm : now, 
                                crud_type_code : curDataH._row_state_,
                                update_product_activity_code : curDataH.product_activity_code
                        });

                    }


                    inputData.inputData.pdProdActivityTemplateType = PdProdActivityTemplateType;
                    //var url = oModel.sServiceUrl + "SaveProductActivity";
                    var url = "dp/pd/productActivity/webapp/srv-api/odata/v4/dp.ProductActivityV4Service/PdProductActivitySaveProc";
                    console.log(inputData);
                    var v_this = this;
                    $.ajax({
                        url: url,
                        type: "POST",
                        //datatype: "json",
                        //data: inputData,
                        data: JSON.stringify(inputData),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            v_this.onSearch();
                            //var v_returnModel = oView.getModel("returnModel").getData();
                        },
                        error: function (e) {
                            console.log(e);
                            v_this.onSearch();

                        }
                    });
                }
                MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
                    title: this.getModel("I18N").getText("/SAVE"),
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                    }).bind(this)
                })
                
            },


            onDelete: function () {
                var oTable = this.byId("mainTable"),
                    oModel = this.getModel("list"),
                    aItems = oTable.getSelectedItems(),
                    aIndices = [];

                oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(false);

                aItems.forEach(function (oItem) {
                    aIndices.push(oModel.getProperty("/PdProdActivityTemplate").indexOf(oItem.getBindingContext("list").getObject()));
                });
                aIndices = aIndices.sort(function (a, b) { return b - a; });
                aIndices.forEach(function (nIndex) {
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);
                //this.byId("searchLanguageE").setSelectedKey(oTable.getItems()[0].getCells()[1].getSelectedKey());
                oTable.setSelectedItem(aItems);

            },


            onExportPress: function (_oEvent) {
                var sTableId = _oEvent.getSource().getParent().getParent().getId();
                if (!sTableId) { return; }

                var oTable = this.byId(sTableId);
                var sFileName = "Product Activity";
                var oData = this.getModel("list").getProperty("/PdProdActivityTemplate"); //binded Data
                ExcelUtil.fnExportExcel({
                    fileName: sFileName || "SpreadSheet",
                    table: oTable,
                    data: oData
                });
            },


            onMilestoneButtonPress: function (oEvent) {
                var oTable = this.byId("mainTable");
                var oModel = this.getView().getModel("list");
                var oItem = oTable.getSelectedItem();
                if (oItem != null && oItem != undefined) {
                    var idx = oItem.getBindingContextPath().split("/")[2];
                    console.log(oTable.getAggregation('items')[idx].getCells()[4].getItems()[2]);
                    console.log(oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].getPressed());
                    oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setValue(oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].getPressed());
                    if( oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].getPressed() == true){
                        oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].setText("Yes");
                    }else{
                        oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].setText("No");
                    }
                }
            },


            onActiveButtonPress: function (oEvent) {
                var oTable = this.byId("mainTable");
                var oModel = this.getView().getModel("list");
                var oItem = oTable.getSelectedItem();
                if (oItem != null && oItem != undefined) {
                    var idx = oItem.getBindingContextPath().split("/")[2];
                    console.log(oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].getPressed());
                    oTable.getAggregation('items')[idx].getCells()[5].getItems()[1].setValue(oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].getPressed());
                    if( oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].getPressed() == true){
                        oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].setText("Active");
                    }else{
                        oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].setText("Inactive");
                    }
                }
            },


            onSelectionChange: function (oEvent) {
                var [tId, mName, sEntity, aCol] = arguments;
                var oTable = this.byId("mainTable");
                var oModel = this.getView().getModel(mName);
                var oItem = oTable.getSelectedItem();
                
                var idx = 0;
                    console.log(oTable);
                    console.log(oItem);
                if (oItem != null && oItem != undefined) {
                    idx = oItem.getBindingContextPath().split("/")[2];
                    console.log(oItem.getBindingContextPath());
                }
                this.rowIndex = idx;
                //oTable.removeSelections(true);

                for (var i = 0; i < oTable._iVisibleItemsLength; i++) {
                    oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                    //oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setEnabled(false);
                    oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);
                }

                if (oItem != null && oItem != undefined) {
                    for (var i = 0; i < oTable.getItems().length; i++) {
                        oTable.getAggregation('items')[i].getCells()[1].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[1].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                        //oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[2].setEnabled(false);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);
                    }
                    //this.byId("buttonMainAddRow").setEnabled(false);
                    //this.byId("buttonMainEditRow").setEnabled(false);
                    this.byId("buttonMainCancelRow").setEnabled(true);
                    oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idx].getCells()[3].getItems()[0].setVisible(false);
                    oTable.getAggregation('items')[idx].getCells()[3].getItems()[1].setVisible(true);
                    oTable.getAggregation('items')[idx].getCells()[4].getItems()[2].setEnabled(true);
                    oTable.getAggregation('items')[idx].getCells()[5].getItems()[2].setEnabled(true);
                }
                
               // oTable.setSelectedItem(oItem);

            }


        });
    }
);