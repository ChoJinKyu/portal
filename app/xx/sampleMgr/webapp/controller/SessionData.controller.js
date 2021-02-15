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

                var oSppUserSession = new SppUserSession();
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
                
                var userId1 = this.getSessionUserId();  // BaseController의 function 사용
                var userId2 = this.getSessionUserInfo().USER_ID; // JSON 중 USER_ID 사용

                var langCd1 = SppUserSessionUtil.getLanguageCode();
                var LangCd2 = SppUserSessionUtil.getUserInfo().LANGUAGE_CODE; 

                var curCode1 = this.getModel("USER_SESSION").getSessionAttr("CURRENCY_CODE");

                var tenantId = this.getSessionTenantId();  // BaseController의 function 사용
                var tenantId2 = SppUserSessionUtil.getTenantId(); // JSON 중 USER_ID 사용

                debugger
                console.log("BaseController : " + userId1);
                console.log("BaseController JSON : " + userId2);
                console.log("Static : " + langCd1);
                console.log("Static JSON : " + LangCd2);
                console.log("Local Model : " + curCode1);

                console.log("Local Model : " + tenantId);
                console.log("Local Model : " + tenantId2);
            }

		});
	});
