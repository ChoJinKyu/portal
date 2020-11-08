sap.ui.define([
		"cm/currencyMgr/controller/BaseController",
        "sap/base/Log",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat",        
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/FilterType",
        "sap/ui/model/Sorter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/thirdparty/jquery",
        "sap/m/Token"        
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Log, MessageBox, MessageToast, DateFormat, Filter, FilterOperator, FilterType, Sorter, JSONModel, jquery, Token) {
		"use strict";

		return Controller.extend("cm.currencyMgr.controller.currencyMgr", {            

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
                
                this._createView();
                
            },

            onAfterRendering: function () {

                //debugger
                // search_use_yn
                // this.byId("search_use_yn").getBinding("items")

            },

            /**
             * @private
             * @see view에서 사용할 객체를 생성합니다.
             */
            _createView : function() {
                console.group("_createView");

                var oView = this.getView();

                var oUiModel = new JSONModel({ 
                            filterCommonID : "",
                            filterValue : "",
                            hasUIChanges : false,  
                            bSearch : false,
                            bNewRow : true,
                            bOldRow : false,
                            bAdd : true,
                            bDelete : false,                                                    
                            bCopy : false,
                            bModify : false,
                            bSave : true,
                            bSelect : false,
                            bCheck : false,
                            subListCount : 0,
                            bSubCheck : false,
                            bSubListTrue : false,
                            bEvent : "",

                });          

                this.setModel(oUiModel, "ui");

                console.groupEnd();
            },

			onSearch: function () {

                var filters = [];

                var comboBox_use_yn = "";                
                var search_currency_code = this.getView().byId("search_currency_code").getValue();

                if(this.byId("comboBox_use_yn").getSelectedItem()){
                    comboBox_use_yn = this.byId("comboBox_use_yn").getSelectedItem().getKey();
                }

                 // 필터 추가 
                if(!this.isValNull(search_currency_code)){
                    filters.push(new Filter("currency_code", FilterOperator.Contains, search_currency_code));
                }
                
                if(!this.isValNull(comboBox_use_yn)){
                   // filters.push(new Filter("use_flag", FilterOperator.Contains, comboBox_use_yn));
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

                var oSelectedItem = oEvent.getSource();
                var oContext = oSelectedItem.getBindingContext();
                var sPath = oContext.getPath();
                //sPath.replace("CurrencyView","Currency");
                var oCurrencyDetail = this.getView().byId("currencyDetail");
                //oProductDetailPanel.bindElement({ path: sPath, model: "Currency" });
                //oProductDetailPanel.bindElement("/Currency(tenant_id='1000',currency_code='CNY')");
                oCurrencyDetail.bindElement({ path: sPath.replace("CurrencyView","Currency")});

                oCurrencyDetail.bindElement({ path: sPath.replace("CurrencyView","Currency")
                                            , parameters: {
                                                    $$updateGroupId : 'CurrencyUpdateGroup'
                                            }});

                this.fn_searchCodeDtl(v_searchCond);

            },            

			onMstUpdateFinished : function (oEvent) {
                
                if(oEvent.getSource().getItems().length > 0){
                    var v_item = oEvent.getSource().getItems()[0];
                    var v_searchCond = {
                        tenant_id : v_item.getBindingContext().getValue('tenant_id'),
                        currency_code : v_item.getBindingContext().getValue('currency_code')
                    };

                    var oSelectedItem =  oEvent.getSource().getItems()[0];
                    var oContext = oSelectedItem.getBindingContext();
                    var sPath = oContext.getPath();
                    //sPath.replace("CurrencyView","Currency");
                    var oCurrencyDetail = this.getView().byId("currencyDetail");
                    //oProductDetailPanel.bindElement({ path: sPath, model: "Currency" });
                    //oProductDetailPanel.bindElement("/Currency(tenant_id='1000',currency_code='CNY')");
                    
                    oCurrencyDetail.bindElement({ path: sPath.replace("CurrencyView","Currency")
                                                , parameters: {
                                                    $$updateGroupId : 'CurrencyUpdateGroup'
                                                }});

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
                    //체크박스 클리어를 위해
                    var oTable = this.byId("currencyLngTable");
                    oTable.removeSelections(true);
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

            onSave : function () {                

                var oView = this.getView();
                var fnSuccess = function () {
                    oView.setBusy(false);
                    MessageToast.show("저장 되었습니다.");
                    this.onMstRefresh();
                    //this.onLngRefresh();
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
                            oView.getModel().submitBatch("CurrencyUpdateGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            },

			onLngAddRow : function () {               

                var utcDate = this._getUtcSapDate();

                var oUiModel = this.getModel("ui");
                
                var dtlVal = this._retrieveParam.dtlParam;

                var dtlBinding = this.byId("currencyLngTable").getBinding("items");
                var oContext = dtlBinding.create({
                        "tenant_id" : dtlVal.tenant_id,
                        "currency_code" : dtlVal.currency_code,
                        "language_code" : "",
                        "currency_code_name" : "",
                        "currency_code_desc" : "",
                        "currency_prefix" : "",
                        "currency_suffix" : "",
                        "local_create_dtm" : utcDate,
                        "local_update_dtm" : utcDate
                        
                });               

                    // oUiModel.setProperty("/bEvent", "AddRow"); 

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
                            this.onMstRefresh();
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
            
            _getUtcSapDate : function(){
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm"
                });
                
                var oNow = new Date();
                var utcDate = oDateFormat.format(oNow)+":00Z"; 
                console.log("utcDate",utcDate);
                return utcDate;
            },            

			onLngUpdateFinished : function (oEvent) {

                var oTable = this.byId("currencyLngTable");
                
                var aItems = oTable.getItems();

                for (var i = 0; i < aItems.length; i++) {
                    if(this.isValNull(aItems[i].getCells()[5].getValue()))
                    aItems[i].getCells()[0].setEditable(true);
                    else
                    aItems[i].getCells()[0].setEditable(false); 
                    
                }
                
                
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
