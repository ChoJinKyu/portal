sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, ManagedListModel, MessageToast, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.SampleMgr", {
			onInit: function () {

                this.setModel(new ManagedListModel(), "headerList");
                this.setModel(new ManagedListModel(), "detailList");

            },


            onSearch: function() {
                var oView = this.getView();
                var oModel = this.getModel("headerList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleHeaders", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            },

            onCreate: function() {
                var oTable = this.byId("sampleHeaderList");
                var oModel = this.getModel("headerList");
                oModel.addRecord({
                    "cd": "",
                    "name": ""
                }, 0);
            },

            onSave: function() {
                var oModel = this.getModel("headerList");
                var oView = this.getView();
                
                MessageBox.confirm("Are you sure ?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oView.setBusy(true);
                            oModel.submitChanges({
                                success: function(oEvent){
                                    oView.setBusy(false);
                                    MessageToast.show("Success to save.");
                                }
                            });
                        };
                    }
                });
            },

            onSampleMultiHeaderProc: function() {

                var oModel = this.getModel();
                var oView = this.getView(); 

                debugger

                var contextPaths = this.byId("sampleHeaderList").getSelectedContextPaths();
                if(contextPaths.length > 0){
                    var procInput = {
                         multi_key: "PROC"
                    };

                    var headers = [];

                    for(var i = 0 ; i < contextPaths.length; i ++){
                        var contextPath = contextPaths[i];
                        var curData = this.getView().getModel("headerList").getProperty(contextPath);
                        //curData.__metadata.type = "xx.SampleMgrService.SampleHeaderForMulti";
                        //headers.push(curData);

                        headers.push({
                            header_id: curData.header_id,
                            cd: curData.cd,
                            name: curData.name
                        });
                    }
                    procInput.headers = headers;

                    oModel.create("/SampleMultiHeaderProc", procInput, 
                        {
                            success: function (resp) {
                                oView.setBusy(false);
                                MessageToast.show("저장 되었습니다.");
                                debugger
                            }
                            ,error: function (oError) {
                                oView.setBusy(false);
                                MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                
                            }
                        }
                    );

                }

            },


            onSearchDetail: function() {
                var oView = this.getView();
                var oModel = this.getModel("detailList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleDetails", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            }
            

		});
	});
