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

            var oViewTableModel = new JSONModel();
            this.getView().setModel(oViewTableModel, "localModel");

            //this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);

        },

        onAfterRender: function(){
            this.setModel(this.getModel(), "createNotify");
        },

        onPageNavBackButtonPress : function() {
            this.getRouter().navTo("mainList", {}, true);
        },
        
        onInvestmentDtlAddButtonPress : function() {
            
            var oTable = this.byId("investmentDtl");
            var oModel = this.getView().getModel("localModel");
            oModel.setData({items :[{
                "itemCode1" : "1",
                "itemCode2" : "",
                "itemCode3" : "",
                "itemCode4" : "",
                "itemCode5" : ""
            }]});
        },

        onInvestmentPlanAddButtonPress : function(oEvent) {
            var oView = this.getView();


            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.sf.fundingNotifySup.view.DialogCreate",
                    controller: this
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.pDialog.then(function (oDialog) {
                oDialog.open();
                
            });
        },

        onCreatePopupClose : function() {
            this.byId("investmentPlanDetails").close();
        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oModel = this.getModel("");
            
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