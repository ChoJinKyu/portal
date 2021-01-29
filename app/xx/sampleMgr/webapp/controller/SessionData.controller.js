sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, ManagedListModel) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.SessionData", {
			onInit: function () {
                this.setModel(new ManagedListModel(), "sessionList");
            },

            onSearch: function() {                
                var oView = this.getView();
                var oModel = this.getModel("sessionList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleHeaders", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
            },


		});
	});
