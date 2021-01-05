sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, Multilingual, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast) {

    "use strict";

    return BaseController.extend("sp.sf.fundingNotifySup.controller.MainCreateObject", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            //this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);

        },

        onAfterRender: function(){
            this.setModel(this.getModel(), "createNotify");
        },

        onPageNavBackButtonPress : function() {
            this.getRouter().navTo("mainList", {}, true);
        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oModel = this.getModel
            
            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;
            
            oModel.read("/creatOentity", {
                //Filter : 공고번호, sub 정보
                success: function(oRetrievedResult) { /* do something */ },
                error: function(oError) { /* do something */ }
            });
        }
    })
});