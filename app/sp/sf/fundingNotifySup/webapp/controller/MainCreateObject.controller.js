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

            var oViewTableModel = new JSONModel(
                {items :[]}
            );

            this.setModel(new JSONModel(), "application");

            this.getView().setModel(oViewTableModel, "localModel");

            this.getRouter().getRoute("mainCreateObject").attachPatternMatched(this._onRoutedThisPage, this);

        },

        onAfterRender: function(){
            this.setModel(this.getModel("fundingApp"), "createNotify");

            
            // for() {
            //     this.byId("VBox").addContent(new CheckBox({text: ""}));
            // }
        },

        onPageNavBackButtonPress : function() {
            this.getRouter().navTo("mainList", {}, true);
        },
        
        onInvestmentDtlAddButtonPress : function() {
            
            // var oTable = this.byId("investmentDtl");
            var oModel = this.getView().getModel("localModel"),
                oTableModel = oModel.getProperty("/items");
            
            oTableModel.push({
                            itemCode1 : "",
                            itemCode2 : "",
                            itemCode3 : "",
                            itemCode4 : "",
                            itemCode5 : ""
                        });

            oModel.setProperty("/items", oTableModel);
            
        },

        onPageSaveButtonPress : function() {
            alert("준비중");
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
            var oArgs = oEvent.getParameter("arguments");

            this._sTenantId = oArgs.tenantId;
            this._sFundingNotifyNumber = oArgs.fundingNotifyNumber;

            var oView = this.getView(),
                oModel = this.getModel("fundingApp"),
                that  = this,
                oData = {
                    funding_notify_number	: this._sFundingNotifyNumber,
                    supplier_code			: "KR01817100",
                    tenant_id				: this._sTenantId,
                    company_code			: "X",
                    org_type_code			: "X",
                    org_code				: "X",
                    funding_step_code		: "S10",
                    funding_status_code		: "110"
                };
                
                
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId));
            aFilters.push(new Filter("funding_notify_number", FilterOperator.EQ, this._sFundingNotifyNumber));

            oModel.read("/SfFundingApplication", {
                //Filter : 공고번호, sub 정보
                filters : aFilters,
                success: function(oRetrievedResult) { 
                    // if(oRetrievedResult.results.length < 1){
                        // oModel.create("/SfFundingApplication", oData, {
                        //     success: function(oCreatedEntry) {
                        //         that.getModel("application").setData(oCreatedEntry);
                        //     },
                        //     error: function(oError) {
                        //         console.log(oError);
                        //     }
                        // });
                    // }else{
                    that.getModel("application").setData(oRetrievedResult.results[0]);    
                    // }
                },
                error: function(oError) {
                    
                }
            });
        }
    })
});