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
    "ext/lib/formatter/Formatter",
	"./ProductActivityMgtPersoService",
    "sap/ui/model/FilterType"
],
    function (BaseController, Multilingual, Validator, DateFormatter, History
        , JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator
        , MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text
        , Input, Item, ExcelUtil, Formatter, ProductActivityMgtPersoService
        , FilterType
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
                
                //로그인 세션 작업완료시 수정
                this.loginUserId = "TestUser";
                this.tenant_id = "L2100";
                this.company_code = "*";
                this.org_type_code = "BU";
                this.org_code = "BIZ00000";
                
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");
                this.getView().setModel(new ManagedListModel(), "list");
                this.setModel(new ManagedListModel(), "orgMap");
                this.rowIndex = 0;
                this._doInitSearch();
                oMultilingual.attachEvent("ready", function (oEvent) {
                    var oi18nModel = oEvent.getParameter("model");
                    this.addHistoryEntry({
                        title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
                        icon: "sap-icon://table-view",
                        intent: "#Template-display"
                    }, true);
                }.bind(this));
                this.setOrgFilter();                
                this.byId("buttonMainCancelRow").setEnabled(false);
                this.byId("buttonMainDeleteRow").setEnabled(false);
                this.byId("buttonSaveProc").setEnabled(false);
                
                //this._doInitTablePerso();
            },

            /**
             * 세션에서 받은 tenant_id 로 필터 걸어주기
             */
            setOrgFilter: function () {
                var oSelect, oBinding, aFilters;
                oSelect = this.getView().byId('searchPdOperationOrg');
                oBinding = oSelect.getBinding("items");
                aFilters = [];
                aFilters.push( new Filter("tenant_id", 'EQ', this.tenant_id) );

                //aFilters.push( new Filter("tenant_id", 'EQ', 'L2100') );
                //aFilters.push( new Filter("tenant_id", 'EQ', 'L2600') );
                oBinding.filter(aFilters, FilterType.Application); 
            },


            /**
             * @private
             * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
             */
            _doInitSearch: function () {
                this.getView().setModel(this.getOwnerComponent().getModel());

                //접속자 법인 사업본부로 바꿔줘야함 로그인 세션이 공통에서 작업되면 작업해줘야 함
                //this.getView().byId("searchPdOperationOrg").setSelectedKeys(['L110010000']);
                console.log(this.org_code);
                this.getView().byId("searchPdOperationOrg").setSelectedKey(this.org_code);
            },

            onMainTablePersoButtonPressed: function () {
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
                    success: function () {
                        for (var i = 0; i < oTable.getItems().length; i++) {
                            oTable.getAggregation('items')[i].getCells()[2].getItems()[2].setValue(oTable.getAggregation('items')[i].getCells()[2].getItems()[1].getValue());

                            if (oTable.getAggregation('items')[i].getCells()[5].getItems()[2].getPressed()) {
                                oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setText("Yes");
                            }else{
                                oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setText("No");
                            }
                            if (oTable.getAggregation('items')[i].getCells()[6].getItems()[2].getPressed()) {
                                oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setText("Active");
                            }else{
                                oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setText("Inactive");
                            }
                            
                            oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                            oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                            oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);
                            oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setEnabled(false);

                            oModel.oData.PdProdActivityTemplate[i]._row_state_ = "";
                        }
                        oView.setBusy(false);
                        
                        oTable.removeSelections(true);
                    
                    },
                    error: function () {
                        oView.setBusy(false);
                    }
                });


            },

            
            onMainTableUpdateFinished: function (oEvent) {
                var oTable = this.byId("mainTable");
                // update the mainList's object counter after the table update
                var sTitle,
                    iTotalItems = oEvent.getParameter("total");

                setTimeout((function(){
                    sTitle = this.getModel("I18N").getText("/PRODUCT")+" "+this.getModel("I18N").getText("/ACTIVITY")+" "+this.getModel("I18N").getText("/MANAGEMENT");

                    //console.log(sTitle+" ["+iTotalItems+"]");
                    this.byId("mainTableTitle").setText(sTitle+"("+iTotalItems+")");

                }).bind(this), 1100);
                
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if (oTable.getAggregation('items')[i].getCells()[5].getItems()[2].getPressed()) {
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setText("Yes");
                    }else{
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setText("No");
                    }
                    if (oTable.getAggregation('items')[i].getCells()[6].getItems()[2].getPressed()) {
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setText("Active");
                    }else{
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setText("Inactive");
                    }
                    
                }
            
            },




            _getSearchStates: function () {
                var status = this.getView().byId("searchStatusButton").getSelectedKey();
                //var aCompany = this.getView().byId("searchPdOperationOrg").getSelectedKeys();
                var aCompany = this.getView().byId("searchPdOperationOrg").getSelectedKey();
                var aSearchFilters = [];

                //일반콤보
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, aCompany));

                /*   //멀티
                if (aCompany.length > 0) {
                    var _tempFilters = [];
                    aCompany.forEach(function (item) {
                        _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                    });
                    aSearchFilters.push(
                        new Filter({
                            filters: _tempFilters,
                            and: false
                        })
                    );
                }
                */
                if (status != "all") {
                    aSearchFilters.push(new Filter("active_flag", FilterOperator.EQ, status));
                }
                return aSearchFilters;
            },

            onCancel: function () {
                var oTable = this.byId("mainTable");
                var oModel = this.getView().getModel("list");
                var oData = oModel.oData;
                var cntMod = 0;
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if(oData.PdProdActivityTemplate[i]._row_state_  == "C"
                       || oData.PdProdActivityTemplate[i]._row_state_  == "U"
                       || oData.PdProdActivityTemplate[i]._row_state_  == "D"){
                        cntMod++;
                    }
                }
                if( cntMod > 0){
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
                                this.onSearch();
                                
                                this.byId("buttonMainCancelRow").setEnabled(false);
                                this.byId("buttonMainDeleteRow").setEnabled(false);
                                this.byId("buttonSaveProc").setEnabled(false);
                                this.byId("gTableExportButton").setEnabled(true);
                            }
                        }).bind(this)
                    })
                }else{
                    var rowIndex = this.rowIndex;
                    oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[rowIndex].getCells()[2].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[rowIndex].getCells()[3].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[rowIndex].getCells()[4].getItems()[1].setVisible(false);
                    this.byId("buttonMainCancelRow").setEnabled(false);
                    this.byId("buttonMainDeleteRow").setEnabled(false);
                    this.byId("buttonSaveProc").setEnabled(false);
                    this.byId("gTableExportButton").setEnabled(true);
                    this.onSearch();
                }
            },

            onSelectRow: function () {
                var oTable = this.byId("mainTable"), //mainTable
                    oItem = oTable.getSelectedItem();
                var idx = oItem.getBindingContextPath().split("/")[2];
                this.rowIndex = idx;
                //this.byId("buttonMainAddRow").setEnabled(false);
                //this.byId("buttonMainEditRow").setEnabled(false);
                this.byId("buttonMainCancelRow").setEnabled(true);
                oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[idx].getCells()[3].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[3].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[idx].getCells()[4].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setVisible(true);
            },



            onAdd: function () {
                //tableId modelName EntityName tenant_id
                var oTable = this.byId("mainTable"), //mainTable
                    oModel = this.getView().getModel("list"); //list

                oModel.addRecord({
                    "tenant_id": this.tenant_id,
                    "company_code": this.company_code,
                    "org_type_code": this.org_type_code,
                    "org_code": this.getView().byId("searchPdOperationOrg").getSelectedKey(),
                    "product_activity_code": null,
                    "develope_event_code": null,
                    "sequence": "1",
                    "product_activity_name": null,
                    "product_activity_english_name": null,
                    "milestone_flag": false,
                    "active_flag": false,
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "create_user_id": this.loginUserId,
                    "update_user_id": this.loginUserId,
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date()
                }, "/PdProdActivityTemplate", 0);

                this.rowIndex = 0;
                this.byId("buttonMainCancelRow").setEnabled(true);
                this.byId("buttonMainDeleteRow").setEnabled(true);
                this.byId("buttonSaveProc").setEnabled(true);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
                oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);
                oTable.getAggregation('items')[0].getCells()[5].getItems()[2].setEnabled(true);
                oTable.getAggregation('items')[0].getCells()[6].getItems()[2].setEnabled(true);
                oTable.getAggregation('items')[0].getCells()[5].getItems()[2].setText("No");
                oTable.getAggregation('items')[0].getCells()[6].getItems()[2].setText("Inactive");

                

                oTable.setSelectedItem(oTable.getAggregation('items')[0]);
                this.validator.clearValueState(this.byId("mainTable"));

            },

            
        
            onSave: function () {
                var v_this = this;
                var oModel2 = this.getView().getModel("list");
                var oTable = this.byId("mainTable");
                var oData = oModel2.oData;                
                var inputData = {
                    inputData : {
                        pdProdActivityTemplateType :  []
                    }
                };
                
                if(this.validator.validate(this.byId("mainTable")) !== true){
                    MessageBox.confirm(this.getModel("I18N").getText("/ECM01002"), {
                        title: this.getModel("I18N").getText("/SAVE"),
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: (function () {
                        }).bind(this)
                    });
                }else{
                    
                    var now = new Date();
                    var PdProdActivityTemplateType  = [];
                    for (var i = 0; i < oTable.getItems().length; i++) {
                        if( oData.PdProdActivityTemplate[i]._row_state_ != null && oData.PdProdActivityTemplate[i]._row_state_ != "" ){
                            

                            var activeFlg = "false";
                            if (oTable.getAggregation('items')[i].getCells()[5].getItems()[2].getPressed()) {
                                activeFlg = "true";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                            }else {
                                activeFlg = "false";
                            }
                            var milestoneFlg = "false";
                            if (oTable.getAggregation('items')[i].getCells()[6].getItems()[2].getPressed()) {
                                milestoneFlg = "true";
                            }else {
                                milestoneFlg = "false";
                            }
                            var pacOri = oTable.getAggregation('items')[i].getCells()[2].getItems()[2].getValue();
                            if(oData.PdProdActivityTemplate[i]._row_state_  == "C"){
                                pacOri = oTable.getAggregation('items')[i].getCells()[2].getItems()[1].getValue();
                            }
                            
                            if(pacOri ==""){
                                
                                MessageBox.confirm(this.getModel("I18N").getText("/ECM01002"), {
                                    title: this.getModel("I18N").getText("/SAVE"),
                                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                                    onClose: (function () {
                                    }).bind(this)
                                });
                                //sap.m.MessageToast.show(v_this.getModel("I18N").getText("/PRODUCT")+ v_this.getModel("I18N").getText("/ACTIVITY")+ v_this.getModel("I18N").getText("/CODE") +v_this.getModel("I18N").getText("/ECM01001"));
                                return false;
                            }
                            var seq = oData.PdProdActivityTemplate[i].sequence;
                            if(oData.PdProdActivityTemplate[i]._row_state_ == "C"){
                                seq ="1";
                            }
                            PdProdActivityTemplateType.push( 
                            {
                                    tenant_id : oData.PdProdActivityTemplate[i].tenant_id,
                                    company_code : oData.PdProdActivityTemplate[i].company_code,
                                    org_type_code : oData.PdProdActivityTemplate[i].org_type_code,
                                    org_code : oData.PdProdActivityTemplate[i].org_code,
                                    product_activity_code : pacOri,
                                    develope_event_code : oData.PdProdActivityTemplate[i].develope_event_code,	
                                    sequence : seq,
                                    product_activity_name : oData.PdProdActivityTemplate[i].product_activity_name,	
                                    product_activity_english_name : oData.PdProdActivityTemplate[i].product_activity_english_name,
                                    milestone_flag : milestoneFlg,
                                    active_flag : activeFlg,
                                    update_user_id : this.loginUserId,
                                    system_update_dtm : now, 
                                    crud_type_code : oData.PdProdActivityTemplate[i]._row_state_,
                                    update_product_activity_code : oData.PdProdActivityTemplate[i].product_activity_code
                            });
                            inputData.inputData.pdProdActivityTemplateType = PdProdActivityTemplateType;
                            var url = "dp/pd/productActivity/webapp/srv-api/odata/v4/dp.ProductActivityV4Service/PdProductActivitySaveProc";
                        }
                    }
                    //console.log(inputData);
                    MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                        title: this.getModel("I18N").getText("/SAVE"),
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: (function () {
                            $.ajax({
                                url: url,
                                type: "POST",
                                //datatype: "json",
                                //data: inputData,
                                data: JSON.stringify(inputData),
                                contentType: "application/json",
                                success: function (rst) {
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    v_this.onSearch();
                                    //var v_returnModel = oView.getModel("returnModel").getData();
                                    //console.log(rst.value[0].return_code);
                                    if(rst.value[0].return_code =="OK"){
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    }else{
                                        sap.m.MessageToast.show( "error : "+rst.value[0].return_msg );
                                    }
                                },
                                error: function () {
                                    v_this.onSearch();

                                }
                            });
                        }).bind(this)
                    });
                    
                    v_this.byId("buttonMainCancelRow").setEnabled(false);
                    v_this.byId("buttonMainDeleteRow").setEnabled(false);
                    v_this.byId("buttonSaveProc").setEnabled(false);
                    v_this.byId("gTableExportButton").setEnabled(true);
                }
            },


            onDelete: function () {
                var oTable = this.byId("mainTable"),
                    oModel = this.getModel("list"),
                    aItems = oTable.getSelectedItems(),
                    aIndices = [];

                for (var i = 0; i < oTable.getItems().length-1; i++) {
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                    oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                    oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);
                    oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setEnabled(false);
                }

                aItems.forEach(function (oItem) {
                    aIndices.push(oModel.getProperty("/PdProdActivityTemplate").indexOf(oItem.getBindingContext("list").getObject()));
                });
                aIndices = aIndices.sort(function (a, b) { return b - a; });
                aIndices.forEach(function (nIndex) {
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);
                //this.byId("searchLanguageE").setSelectedKey(oTable.getItems()[0].getCells()[2].getSelectedKey());
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
                if(oEvent.getSource().getPressed() ){
                    oEvent.getSource().setText("No");
                }else{
                    oEvent.getSource().setText("Yes");
                }
            },


            onActiveButtonPress: function (oEvent) {
                if(oEvent.getSource().getPressed() ){
                    oEvent.getSource().setText("Inactive");
                }else{
                    oEvent.getSource().setText("Active");
                }
            },


            onSelectionChange: function () {
                var oTable = this.byId("mainTable");
                var oItem = oTable.getSelectedItem();
                var idxs = [];
                //oTable.removeSelections(true);
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if(oTable.getAggregation('items')[i] !=null && oTable.getAggregation('items')[i].getCells()!=undefined){

                        oTable.getAggregation('items')[i].getCells()[2].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[2].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[3].getItems()[1].setVisible(false);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[4].getItems()[1].setVisible(false);
                        //oTable.getAggregation('items')[i].getCells()[5].getItems()[0].setVisible(true);
                        oTable.getAggregation('items')[i].getCells()[5].getItems()[2].setEnabled(false);
                        oTable.getAggregation('items')[i].getCells()[6].getItems()[2].setEnabled(false);
                    }
                }
                if (oItem != null && oItem != undefined) {
                    this.byId("buttonMainCancelRow").setEnabled(true);                    
                    for(var k=0; k<oTable.getSelectedContextPaths().length; k++){
                        idxs[k] = oTable.getSelectedContextPaths()[k].split("/")[2];
                        if(oTable.getAggregation('items')[idxs[k]] !=null && oTable.getAggregation('items')[idxs[k]].getCells()!=undefined){

                            oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[0].setVisible(false);
                            oTable.getAggregation('items')[idxs[k]].getCells()[2].getItems()[1].setVisible(true);
                            oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[0].setVisible(false);
                            oTable.getAggregation('items')[idxs[k]].getCells()[3].getItems()[1].setVisible(true);
                            oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[0].setVisible(false);
                            oTable.getAggregation('items')[idxs[k]].getCells()[4].getItems()[1].setVisible(true);
                            oTable.getAggregation('items')[idxs[k]].getCells()[5].getItems()[2].setEnabled(true);
                            oTable.getAggregation('items')[idxs[k]].getCells()[6].getItems()[2].setEnabled(true);
                        }
                    }
                    this.byId("buttonMainCancelRow").setEnabled(true);
                    this.byId("buttonMainDeleteRow").setEnabled(true);
                    this.byId("buttonSaveProc").setEnabled(true);
                    this.byId("gTableExportButton").setEnabled(false);
                }else{
                    
                    var oModel2 = this.getView().getModel("list");
                    var oData = oModel2.oData;
                    var cnt = 0;
                    for (var i = 0; i < oTable.getItems().length; i++) {
                        if( oData.PdProdActivityTemplate[i]._row_state_ != null && oData.PdProdActivityTemplate[i]._row_state_ != "" ){
                            cnt++;
                        }
                    }
                    if(cnt > 0 ){
                        this.byId("buttonMainCancelRow").setEnabled(true);
                        this.byId("buttonMainDeleteRow").setEnabled(false);
                        this.byId("buttonSaveProc").setEnabled(true);
                        this.byId("gTableExportButton").setEnabled(false);
                    }else{
                        this.byId("buttonMainCancelRow").setEnabled(false);
                        this.byId("buttonMainDeleteRow").setEnabled(false);
                        this.byId("buttonSaveProc").setEnabled(false);
                        this.byId("gTableExportButton").setEnabled(true);
                    }
                    

                }
            },
            
            
            onPersoButtonPressed: function(){
                this._oTPC.openDialog();
            },

            onPersoRefresh : function() {
                ProductActivityMgtPersoService.resetPersData();
                this._oTPC.refresh();
            },

            _doInitTablePerso: function(){
                // init and activate controller
                this._oTPC = new TablePersoController({
                    table: this.byId("mainTable"),
                    componentName: "templateListViewAndObjectEdit",
                    persoService: ProductActivityMgtPersoService,
                    hasGrouping: true
                }).activate();
            }
    

        });
    }
);