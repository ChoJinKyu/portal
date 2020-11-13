sap.ui.define([
        "xx/sampleMgr/controller/BaseController",
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

		return BaseController.extend("xx.sampleMgr.controller.SampleMgr", {
			onInit: function () {

            },
            

            onSaveSampleHeaderMultiProc : function(){
                debugger
                
                var headerBinding = this.byId("sampleHeaderList").getBinding("items");

                var headerSelectedContexts  = this.byId("sampleHeaderList").getSelectedContexts();
                var headerSelectedItems     = this.byId("sampleHeaderList").getSelectedItems();

                var oView = this.getView();
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
                            //oView.setBusy(true);
                            //oView.getModel().submitBatch("sampleHeaderGroup").then(fnSuccess, fnError);
                        } else if (sButton === MessageBox.Action.CANCEL) {
                            
                        };
                    }
                });
            }
		});
	});
