sap.ui.define([
		"sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("cm.currencyMgr.controller.currencyMgr", {

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
                
            },

            onAfterRendering: function () {

                //debugger
                // search_use_yn
                // this.byId("search_use_yn").getBinding("items")

            },

			onSearch: function () {

                var filters = [];

                var comboBox_use_yn = "";                
                var search_currency_code = this.getView().byId("search_currency_code").getValue();

                if(this.byId("comboBox_use_yn").getSelectedItem()){
                    comboBox_use_yn = this.byId("comboBox_use_yn").getSelectedItem().getKey();
                }

                var mstBinding = this.byId("currencyTable").getBinding("items");
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");
                mstBinding.resetChanges();
                this._retrieveParam.mstParam = "";
                this._retrieveParam.dtlParam = "";
                this._retrieveParam.lngParam = "";

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);

            },

            /**
             * Code MST Button Event
             */
			// onMstAddRow : function () {
                
            //     var mstBinding = this.byId("currencyTable").getBinding("items");
            //     var oContext = mstBinding.create({
            //             "tenant_id" : "1000",
            //             "company_code" : "G100",
            //             "group_code" : "",
            //             "chain_code" : "",
            //             "group_name" : "",
            //             "group_description" : "",
            //             "use_yn" : true
            //         });

            //           /*
            //             ,
            //             "local_create_dtm" : "2020-10-13T00:00:00Z",
            //             "local_update_dtm" : "2020-10-13T00:00:00Z",
            //             "create_user_id" : "Admin",
            //             "update_user_id" : "Admin",
            //             "system_create_dtm" : "2020-10-13T00:00:00Z",
            //             "system_update_dtm" : "2020-10-13T00:00:00Z"
            //             */

            // },

			onMstCopyRow : function () {

            },

			// onMstDeleteRow : function () {

            //     var oSelected  = this.byId("currencyTable").getSelectedContexts();
            //     //this.byId("codeMstTable").getSelectedItems()

            //     if (oSelected.length > 0) {

            //         for(var idx = 0; idx < oSelected.length; idx++){
            //             //oSelected[idx].delete("$auto");

            //             var oView = this.getView();
            //             oView.setBusy(true);

            //             oSelected[idx].delete("$auto").then(function () {
            //                 oView.setBusy(false);
            //                 MessageToast.show("삭제 되었습니다.");
            //                 this.onSearch();
            //             }.bind(this), function (oError) {
            //                 oView.setBusy(false);
            //                 MessageBox.error(oError.message);
            //             });

            //         }

            //         /*
            //         var oView = this.getView();
            //         oView.setBusy(true);

            //         oSelected.getBindingContext().delete("$auto").then(function () {
            //             oView.setBusy(false);
            //             MessageToast.show("삭제 되었습니다.");
            //             this.onRefresh();
            //         }.bind(this), function (oError) {
            //             oView.setBusy(false);
            //             MessageBox.error(oError.message);
            //         });
            //         */
                    
            //     }else{
            //         MessageBox.error("선택된 행이 없습니다.");
            //     }
            // },

			// onMstSave : function () {

            //     var mstBinding = this.byId("currencyTable").getBinding("items");

            //     if (!mstBinding.hasPendingChanges()) {
            //         MessageBox.error("수정한 내용이 없습니다.");
            //         return;
            //     }

            //     var oView = this.getView();
            //     var fnSuccess = function () {
            //         oView.setBusy(false);
            //         MessageToast.show("저장 되었습니다.");
            //         this.onMstRefresh();
            //     }.bind(this);

            //     var fnError = function (oError) {
            //         oView.setBusy(false);
            //         MessageBox.error(oError.message);
            //     }.bind(this);


            //     MessageBox.confirm("저장 하시 겠습니까?", {
            //         title : "Comfirmation",
            //         initialFocus : sap.m.MessageBox.Action.CANCEL,
            //         onClose : function(sButton) {
            //             if (sButton === MessageBox.Action.OK) {
            //                 oView.setBusy(true);
            //                 oView.getModel().submitBatch("codeMstUpdateGroup").then(fnSuccess, fnError);
            //             } else if (sButton === MessageBox.Action.CANCEL) {
                            
            //             };
            //         }
            //     });
                
            // },

            onMstRefresh : function () {
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");
                var mstBinding = this.byId("currencyTable").getBinding("items");
                this.getView().setBusy(true);
                mstBinding.refresh();
                this.getView().setBusy(false);
            },

			onMstTableItemPress : function (oEvent) {

                var v_searchCond = {
                    tenant_id : oEvent.getSource().getBindingContext().getValue('tenant_id'),
                    currency_code : oEvent.getSource().getBindingContext().getValue('currency_code')
                };

                

                this.fn_searchCodeDtl(v_searchCond);

            },            

			onMstUpdateFinished : function (oEvent) {
                
                if(oEvent.getSource().getItems().length > 0){
                    var v_item = oEvent.getSource().getItems()[0];
                    var v_searchCond = {
                        tenant_id : v_item.getBindingContext().getValue('tenant_id'),
                        currency_code : v_item.getBindingContext().getValue('currency_code')
                    };

                   

                    this.fn_searchCodeDtl(v_searchCond);
                }

            }, 

            /**
             * Code DTL Button Event
             */

			fn_searchCodeDtl : function (p_searchCond) {                

                var v_tenant_id = p_searchCond.tenant_id;
                var v_currency_code = p_searchCond.currency_code;                

                if(!this.isValNull(v_tenant_id) && !this.isValNull(v_currency_code) ){
                    var filters = [];
                    filters.push(new Filter("tenant_id"   , FilterOperator.EQ, v_tenant_id));
                    filters.push(new Filter("currency_code", FilterOperator.EQ, v_currency_code));                    

                    var dtlBinding = this.byId("currencyLngTable").getBinding("items");
                    dtlBinding.resetChanges();
                    this.getView().setBusy(true);
                    dtlBinding.filter(filters);
                    this.getView().setBusy(false);

                }

                this._retrieveParam.dtlParam = p_searchCond;

            },

            onCreate : function () {
                // var dtlVal = this._retrieveParam.dtlParam;
                // var oCurrencyDetail = this.getView().byId("currencyDetail");
                // var oContext = oCurrencyDetail.create({
                //         "tenant_id" : "1000",
                //         "currency_code" : "aa",
                //         "language_code" : "",
                //         "currency_code_desc" : "",
                //         "currency_prefix" : "",
                //         "currency_suffix" : ""
                        
                //     });
                // var oCurrencyDetail = this.getView().byId("currencyDetail");
                //var oInput1 = this.getView().byId("input1");
                this.getView().byId("ipCurCode").setValue("");
                this.getView().byId("ipScale").setValue("");
                this.getView().byId("ipExScale").setValue("");                
                this.getView().byId("ipUseFlag").setValue("");                
                this.getView().byId("strtDate").setValue("");
                this.getView().byId("endDate").setValue("");

                //oCurrencyDetail.getBindingContext(). getValue("tenant_id");
                

            },

			onLngAddRow : function () {
                
                var dtlVal = this._retrieveParam.dtlParam;

                var dtlBinding = this.byId("currencyLngTable").getBinding("items");
                var oContext = dtlBinding.create({
                        "tenant_id" : dtlVal.tenant_id,
                        "currency_code" : dtlVal.currency_code,
                        "language_code" : "",
                        "currency_code_desc" : "",
                        "currency_prefix" : "",
                        "currency_suffix" : ""
                        
                    });

                        /*
                        ,
                        "local_create_dtm" : "2020-10-13T00:00:00Z",
                        "local_update_dtm" : "2020-10-13T00:00:00Z",
                        "create_user_id" : "Admin",
                        "update_user_id" : "Admin",
                        "system_create_dtm" : "2020-10-13T00:00:00Z",
                        "system_update_dtm" : "2020-10-13T00:00:00Z"
                        */
            },

			onLngCopyRow : function () {

            },

			onLngDeleteRow : function () {
                var oSelected  = this.byId("currencyLngTable").getSelectedContexts();

                if (oSelected.length > 0) {

                    for(var idx = 0; idx < oSelected.length; idx++){

                        var oView = this.getView();
                        oView.setBusy(true);

                        oSelected[idx].delete("$auto").then(function () {
                            oView.setBusy(false);
                            MessageToast.show("삭제 되었습니다.");
                            this.onLngRefresh();
                        }.bind(this), function (oError) {
                            oView.setBusy(false);
                            MessageBox.error(oError.message);
                        });

                    }
                }else{
                    MessageBox.error("선택된 행이 없습니다.");
                }
            },

			onLngSave : function () {
                var dtlBinding = this.byId("currencyLngTable").getBinding("items");

                if (!dtlBinding.hasPendingChanges()) {
                    MessageBox.error("수정한 내용이 없습니다.");
                    return;
                }

                var oView = this.getView();
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
                            oView.getModel().submitBatch("currencyLngUpdateGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },

            onLngRefresh : function () {
                var dtlBinding = this.byId("currencyLngTable").getBinding("items");
                this.getView().setBusy(true);
                dtlBinding.refresh();
                this.getView().setBusy(false);
            },           

			onDtlUpdateFinished : function (oEvent) {
                
                // if(oEvent.getSource().getItems().length > 0){
                //     var v_item = oEvent.getSource().getItems()[0];
                //     var v_searchCond = {
                //         tenant_id : v_item.getBindingContext().getValue('tenant_id'),
                //         company_code : v_item.getBindingContext().getValue('company_code'),
                //         group_code : v_item.getBindingContext().getValue('group_code'),
                //         code : v_item.getBindingContext().getValue('code')
                //     };

                //     this.fn_searchCodeLng(v_searchCond);
                // }

            },

			// onDtlTableItemPress : function (oEvent) {
                
            //     var v_searchCond = {
            //         tenant_id : oEvent.getSource().getBindingContext().getValue('tenant_id'),
            //         company_code : oEvent.getSource().getBindingContext().getValue('company_code'),
            //         group_code : oEvent.getSource().getBindingContext().getValue('group_code'),
            //         code : oEvent.getSource().getBindingContext().getValue('code')
            //     };

            //     this.fn_searchCodeLng(v_searchCond);

            // },

            /**
             * Code LNG Button Event
             */

			// fn_searchCodeLng : function (p_searchCond) {

            //     var v_tenant_id = p_searchCond.tenant_id;
            //     var v_company_code = p_searchCond.company_code;
            //     var v_group_code = p_searchCond.group_code;
            //     var v_code = p_searchCond.code;

            //     var filters = [];
            //     filters.push(new Filter("tenant_id"   , FilterOperator.EQ, v_tenant_id));
            //     filters.push(new Filter("company_code", FilterOperator.EQ, v_company_code));
            //     filters.push(new Filter("group_code"  , FilterOperator.EQ, v_group_code));
            //     filters.push(new Filter("code"  , FilterOperator.EQ, v_code));

            //     var lngBinding = this.byId("codeLngTable").getBinding("items");
            //     lngBinding.resetChanges();
            //     this.getView().setBusy(true);
            //     lngBinding.filter(filters);
            //     this.getView().setBusy(false);

            //     this._retrieveParam.lngParam = p_searchCond;

            // },

			// onLngAddRow : function () {
            //     var lngVal = this._retrieveParam.lngParam;

            //     var lngBinding = this.byId("codeLngTable").getBinding("items");
            //     var oContext = lngBinding.create({
            //             "tenant_id" : lngVal.tenant_id,
            //             "company_code" : lngVal.company_code,
            //             "group_code" : lngVal.group_code,
            //             "code" :lngVal.code,
            //             "language_cd" : "",
            //             "code_name" : ""
            //         });

            //             /*
            //             ,
            //             "local_create_dtm" : "2020-10-13T00:00:00Z",
            //             "local_update_dtm" : "2020-10-13T00:00:00Z",
            //             "create_user_id" : "Admin",
            //             "update_user_id" : "Admin",
            //             "system_create_dtm" : "2020-10-13T00:00:00Z",
            //             "system_update_dtm" : "2020-10-13T00:00:00Z"
            //             */
            // },

			onLngCopyRow : function () {

            },

			// onLngDeleteRow : function () {
            //     var oSelected  = this.byId("codeLngTable").getSelectedContexts();

            //     if (oSelected.length > 0) {

            //         for(var idx = 0; idx < oSelected.length; idx++){

            //             var oView = this.getView();
            //             oView.setBusy(true);

            //             oSelected[idx].delete("$auto").then(function () {
            //                 oView.setBusy(false);
            //                 MessageToast.show("삭제 되었습니다.");
            //                 this.onLngRefresh();
            //             }.bind(this), function (oError) {
            //                 oView.setBusy(false);
            //                 MessageBox.error(oError.message);
            //             });

            //         }
            //     }else{
            //         MessageBox.error("선택된 행이 없습니다.");
            //     }
            // },

			// onLngSave : function () {
            //     var lngBinding = this.byId("codeLngTable").getBinding("items");

            //     if (!lngBinding.hasPendingChanges()) {
            //         MessageBox.error("수정한 내용이 없습니다.");
            //         return;
            //     }

            //     var oView = this.getView();
            //     var fnSuccess = function () {
            //         oView.setBusy(false);
            //         MessageToast.show("저장 되었습니다.");
            //         this.onLngRefresh();
            //     }.bind(this);

            //     var fnError = function (oError) {
            //         oView.setBusy(false);
            //         MessageBox.error(oError.message);
            //     }.bind(this);


            //     MessageBox.confirm("저장 하시 겠습니까?", {
            //         title : "Comfirmation",
            //         initialFocus : sap.m.MessageBox.Action.CANCEL,
            //         onClose : function(sButton) {
            //             if (sButton === MessageBox.Action.OK) {
            //                 oView.setBusy(true);
            //                 oView.getModel().submitBatch("codeLngUpdateGroup").then(fnSuccess, fnError);
            //             } else if (sButton === MessageBox.Action.CANCEL) {
                            
            //             };
            //         }
            //     });
            // },

            // onLngRefresh : function () {                
            //     var lngBinding = this.byId("codeLngTable").getBinding("items");
            //     this.getView().setBusy(true);
            //     lngBinding.refresh();
            //     this.getView().setBusy(false);
            // }
            

		});
	});
