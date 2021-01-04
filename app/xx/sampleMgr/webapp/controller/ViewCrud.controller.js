sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, ManagedListModel, MessageToast, MessageBox) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.ViewCrud", {
			onInit: function () {

                this.setModel(new ManagedListModel(), "viewList");

            },


            onSearch: function() {
                var oView = this.getView();
                var oModel = this.getModel("viewList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleViewCud", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            },

            onCreate: function() {
                var oTable = this.byId("sampleViewList");
                var oModel = this.getModel("viewList");
                oModel.addRecord({
                    "header_cd": "",
                    "header_name": "",
                    "detail_cd": "",
                    "detail_name": ""
                }, 0);
            },

            onDelete: function() {
                var oTable = this.byId("sampleViewList");
                var oModel = this.getModel("viewList");
				var aItems = oTable.getSelectedItems();
				var aIndices = [];
                aItems.forEach(function(oItem){
                    aIndices.push(oModel.getProperty("/SampleViewCud").indexOf(oItem.getBindingContext("viewList").getObject()));
                });
                aIndices = aIndices.sort(function(a, b){return b-a;});
                aIndices.forEach(function(nIndex){
                    oModel.markRemoved(nIndex);
                });
                oTable.removeSelections(true);                

                /*
                oTable.getSelectedItems().reverse().forEach(function (idx) {
                    oModel.markRemoved(idx);
                });
                */
            },


            onSave: function() {
                var oModel = this.getModel("viewList");
                var oView = this.getView();
                var v_this = this;
                
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
                                    v_this.onSearch();
                                }
                            });
                        }
                    }
                });
            }
		});
	});