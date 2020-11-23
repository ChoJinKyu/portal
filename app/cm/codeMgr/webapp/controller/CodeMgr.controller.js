sap.ui.define([
	    "ext/lib/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "ext/lib/model/ManagedListModel",
        "sap/ui/core/mvc/Controller",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, ManagedListModel) {
        "use strict";

		return BaseController.extend("cm.codeMgr.controller.CodeMgr", {

            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            },

            onInit: function () {
                this._retrieveParam = new JSONModel({
                    mstParam : "",
                    dtlParam : "",
                    lngParam : ""
                });

                this.getView().setModel(new ManagedListModel(), "CodeMasters");
                this.getView().setModel(new ManagedListModel(), "CodeDetails");
                this.getView().setModel(new ManagedListModel(), "CodeLanguages");

            },

            onAfterRendering: function () {


            },

			onSearch: function () {
                
                var oView = this.getView();
                var oModel = oView.getModel("CodeMasters");

                var filters = [];

                var search_tenant_id = "";
                var search_chain_code = "";
                var search_use_yn = "";
                var search_group_code = oView.byId("search_group_code").getValue();
                var search_group_name = oView.byId("search_group_name").getValue();
                var search_group_description = oView.byId("search_group_description").getValue();
                

                if(oView.byId("search_tenant_id").getSelectedItem()){
                    search_tenant_id = oView.byId("search_tenant_id").getSelectedItem().getKey();
                }

                if(oView.byId("search_chain_code").getSelectedItem()){
                    search_chain_code = oView.byId("search_chain_code").getSelectedItem().getKey();
                }

                if(oView.byId("search_use_yn").getSelectedItem()){
                    search_use_yn = oView.byId("search_use_yn").getSelectedItem().getKey();
                }

                // 필터 추가 
                if(!this.isValNull(search_tenant_id)){
                    filters.push(new Filter("tenant_id", FilterOperator.Contains, search_tenant_id));
                }

                if(!this.isValNull(search_chain_code)){
                    filters.push(new Filter("chain_code", FilterOperator.Contains, search_chain_code));
                }

                if(!this.isValNull(search_use_yn)){
                    filters.push(new Filter("use_yn", FilterOperator.Contains, search_use_yn));
                }

                if(!this.isValNull(search_group_code)){
                    filters.push(new Filter("group_code", FilterOperator.Contains, search_group_code));
                }

                if(!this.isValNull(search_group_name)){
                    filters.push(new Filter("group_name", FilterOperator.Contains, search_group_name));
                }

                if(!this.isValNull(search_group_description)){
                    filters.push(new Filter("group_description", FilterOperator.Contains, search_group_description));
                }

                this._retrieveParam.mstParam = "";
                this._retrieveParam.dtlParam = "";
                this._retrieveParam.lngParam = "";

                oView.setBusy(true);
                oModel.setTransactionModel(oView.getModel());
                oModel.read("/CodeMasters", {
                    filters: filters,
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });

            },

            /**
             * Code MST Button Event
             */
			onMstAddRow : function () {
                
                var oTable = this.byId("codeMstTable");
                var oModel = this.getModel("CodeMasters");
                oModel.addRecord({
                    "tenant_id" : "1000",
                    "group_code" : "",
                    "chain_code" : "",
                    "group_name" : "",
                    "group_description" : "",
                    "use_yn" : true
                }, 0);

            },

            onMstDeleteRow : function () {
                var oTable = this.byId("codeMstTable");
                var oModel = this.getModel("CodeMasters");
                var aItems = oTable.getSelectedItems();
                var aIndices = [];
                aItems.forEach(function(oItem){
                    aIndices.push(oModel.getProperty("/").indexOf(oItem.getBindingContext("CodeMasters").getObject()));
                });
                aIndices = aIndices.sort(function(a, b){return b-a;});
                aIndices.forEach(function(nIndex){
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);
            },

			onMstSave : function () {

                var oView = this.getView();
                var oModel = this.getModel("CodeMasters");

                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onMstRefresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);


                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            //oView.getModel().submitBatch("codeMstUpdateGroup").then(fnSuccess, fnError);
                            oModel.submitChanges({
                                success: function(oEvent){
                                    oView.setBusy(false);
                                    MessageToast.show("저장 되었습니다.");
                                },error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
                
            },

            onMstRefresh : function () {
                /*
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");
                var mstBinding = this.byId("codeMstTable").getBinding("items");
                this.getView().setBusy(true);
                mstBinding.refresh();
                this.getView().setBusy(false);
                */
            },

			onMstTableItemPress : function (oEvent) {
                var v_searchCond = {
                    tenant_id : oEvent.getSource().getBindingContext("CodeMasters").getProperty('tenant_id'),
                    group_code : oEvent.getSource().getBindingContext("CodeMasters").getProperty('group_code')
                };

                this.fn_searchCodeDtl(v_searchCond);
            },            

			onMstUpdateFinished : function (oEvent) {

                if(oEvent.getSource().getItems().length > 0){
                    var v_item = oEvent.getSource().getItems()[0];
                    var v_searchCond = {
                        tenant_id : v_item.getBindingContext("CodeMasters").getProperty('tenant_id'),
                        group_code : v_item.getBindingContext("CodeMasters").getProperty('group_code')
                    };

                    this.fn_searchCodeDtl(v_searchCond);
                }

            }, 

            /**
             * Code DTL Button Event
             */

			fn_searchCodeDtl : function (p_searchCond) {

                var v_tenant_id = p_searchCond.tenant_id;
                var v_group_code = p_searchCond.group_code;
                var oView = this.getView();
                var oModel = oView.getModel("CodeDetails");

                if(!this.isValNull(v_tenant_id) && !this.isValNull(v_group_code)){
                    var filters = [];
                    filters.push(new Filter("tenant_id"   , FilterOperator.EQ, v_tenant_id));
                    filters.push(new Filter("group_code"  , FilterOperator.EQ, v_group_code));

                    oView.setBusy(true);
                    oModel.setTransactionModel(oView.getModel());
                    oModel.read("/CodeDetails", {
                        filters: filters,
                        success: function(oData){
                            oView.setBusy(false);
                        }
                    });

                }

                this._retrieveParam.dtlParam = p_searchCond;

            },

			onDtlAddRow : function () {

                var dtlVal = this._retrieveParam.dtlParam;

                var oTable = this.byId("codeDtlTable");
                var oModel = this.getModel("CodeDetails");
                oModel.addRecord({
                    "tenant_id" : dtlVal.tenant_id,
                    "group_code" : dtlVal.group_code,
                    "code" : "",
                    "code_description" : "",
                    "sort_no" : "",
                    "start_date" : "",
                    "end_date" : ""
                }, 0);
            },


			onDtlDeleteRow : function () {
                var oTable = this.byId("codeDtlTable");
                var oModel = this.getModel("CodeDetails");
                var aItems = oTable.getSelectedItems();
                var aIndices = [];
                aItems.forEach(function(oItem){
                    aIndices.push(oModel.getProperty("/CodeDetails").indexOf(oItem.getBindingContext("CodeDetails").getObject()));
                });
                aIndices = aIndices.sort(function(a, b){return b-a;});
                aIndices.forEach(function(nIndex){
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);
            },

			onDtlSave : function () {

                var oView = this.getView();
                var oModel = this.getModel("CodeDetails");

                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onDtlRefresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);


                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            //oView.getModel().submitBatch("codeDtlUpdateGroup").then(fnSuccess, fnError);
                            oModel.submitChanges({
                                success: function(oEvent){
                                    oView.setBusy(false);
                                    MessageToast.show("저장 되었습니다.");
                                },error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },

            onDtlRefresh : function () {
                var dtlBinding = this.byId("codeDtlTable").getBinding("items");
                this.getView().setBusy(true);
                dtlBinding.refresh();
                this.getView().setBusy(false);
            },

			onDtlUpdateFinished : function (oEvent) {
                
                if(oEvent.getSource().getItems().length > 0){
                    var v_item = oEvent.getSource().getItems()[0];
                    var v_searchCond = {
                        tenant_id : v_item.getBindingContext("CodeDetails").getProperty('tenant_id'),
                        group_code : v_item.getBindingContext("CodeDetails").getProperty('group_code'),
                        code : v_item.getBindingContext("CodeDetails").getProperty('code')
                    };

                    this.fn_searchCodeLng(v_searchCond);
                }

            },

			onDtlTableItemPress : function (oEvent) {
                
                var v_searchCond = {
                    tenant_id : oEvent.getSource().getBindingContext("CodeDetails").getProperty('tenant_id'),
                    group_code : oEvent.getSource().getBindingContext("CodeDetails").getProperty('group_code'),
                    code : oEvent.getSource().getBindingContext("CodeDetails").getProperty('code')
                };

                this.fn_searchCodeLng(v_searchCond);

            },

            /**
             * Code LNG Button Event
             */

			fn_searchCodeLng : function (p_searchCond) {

                var v_tenant_id = p_searchCond.tenant_id;
                var v_group_code = p_searchCond.group_code;
                var v_code = p_searchCond.code;

                var oView = this.getView();
                var oModel = oView.getModel("CodeLanguages");

                if(!this.isValNull(v_tenant_id) && !this.isValNull(v_group_code) && !this.isValNull(v_code)){
                    var filters = [];
                    filters.push(new Filter("tenant_id"   , FilterOperator.EQ, v_tenant_id));
                    filters.push(new Filter("group_code"  , FilterOperator.EQ, v_group_code));
                    filters.push(new Filter("code"  , FilterOperator.EQ, v_code));


                    oView.setBusy(true);
                    oModel.setTransactionModel(oView.getModel());
                    oModel.read("/CodeLanguages", {
                        filters: filters,
                        success: function(oData){
                            oView.setBusy(false);
                        }
                    });
                }

                this._retrieveParam.lngParam = p_searchCond;

            },

			onLngAddRow : function () {
                var lngVal = this._retrieveParam.lngParam;

                var oTable = this.byId("codeLngTable");
                var oModel = this.getModel("CodeLanguages");
                oModel.addRecord({
                    "tenant_id" : lngVal.tenant_id,
                    "group_code" : lngVal.group_code,
                    "code" :lngVal.code,
                    "language_cd" : "",
                    "code_name" : ""
                }, 0);
            },


			onLngDeleteRow : function () {

                var oTable = this.byId("codeLngTable");
                var oModel = this.getModel("CodeLanguages");
                var aItems = oTable.getSelectedItems();
                var aIndices = [];
                aItems.forEach(function(oItem){
                    aIndices.push(oModel.getProperty("/CodeLanguages").indexOf(oItem.getBindingContext("CodeLanguages").getObject()));
                });
                aIndices = aIndices.sort(function(a, b){return b-a;});
                aIndices.forEach(function(nIndex){
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);

            },

			onLngSave : function () {

                var oView = this.getView();
                var oModel = this.getModel("CodeLanguages");

                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onLngRefresh();
                }.bind(this);

                var fnError = function (oError) {
                    oView.setBusy(false);
                    MessageBox.error(oError.message);
                }.bind(this);

                        

                MessageBox.confirm("저장 하시 겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            //oView.getModel().submitBatch("codeLngUpdateGroup").then(fnSuccess, fnError);

                            oModel.submitChanges({
                                success: function(oEvent){
                                    oView.setBusy(false);
                                    MessageToast.show("저장 되었습니다.");
                                },error: function (oError) {
                                    oView.setBusy(false);
                                    MessageBox.error(oError.message);
                                }
                            });
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },

            onLngRefresh : function () {                
                var lngBinding = this.byId("codeLngTable").getBinding("items");
                this.getView().setBusy(true);
                lngBinding.refresh();
                this.getView().setBusy(false);
            }
            

		});
	});
