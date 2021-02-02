sap.ui.define([
	"ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/SppUserSession",
    "ext/lib/util/SppUserSessionUtil"
],

    //
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, ManagedListModel,  Multilingual, SppUserSession, SppUserSessionUtil) {
		"use strict";

		return BaseController.extend("xx.sampleMgr.controller.SessionData", {
            
            onInit: function () {
                this.setModel(new ManagedListModel(), "sessionList");
                this.setModel(new ManagedListModel(), "userValue");

                var oSppUserSession = new SppUserSession("controller");
                this.setModel(oSppUserSession.getModel(), "USER_SESSION");

                var oMultilingual = new Multilingual();

            },

            onSearch: function() {     
                /*           
                var oView = this.getView();
                var oModel = this.getModel("sessionList");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SampleHeaders", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                */

                /*
                oModel = this.getModel("userValue");
                oModel.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/UserValue", {
                    success: function(oData){
                        oView.setBusy(false);
                    }
                });
                */
            },

            onTest: function() {
                debugger
                console.log("BaseController : " + this.getSessionUserInfo().USER_ID);
                console.log("BaseController : " + this.getSessionUserId());
                console.log("Static : " + SppUserSessionUtil.getUserInfo().LANGUAGE_CODE);
                console.log("Static : " + SppUserSessionUtil.getLanguageCode());
                console.log("Local Model : " + this.getModel("USER_SESSION").getSessionAttr("USER_ID"));                
            }

		});
	});
