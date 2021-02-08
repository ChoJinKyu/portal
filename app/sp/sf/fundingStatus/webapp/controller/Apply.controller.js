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
    "sap/m/MessageToast",
    "jquery.sap.global",
    "sap/m/CheckBox",
    "sap/ui/core/ValueState",
	"sap/ui/core/message/Message",
    "sap/ui/core/MessageType"
], function (BaseController, Multilingual, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, jQuery, CheckBox, ValueState, Message, MessageType) {

    "use strict";

    return BaseController.extend("sp.sf.fundingStatus.controller.Apply", {
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // var oMultilingual = new Multilingual();
            // this.setModel(oMultilingual.getModel(), "I18N");

            // var oViewTableModel = new JSONModel(
            //     { items: [] }
            // );

            // this.setModel(new JSONModel(), "applicationSup");
            // this.setModel(new JSONModel(), "transactionDivision");
            // this.setModel(new JSONModel(), "contModel");

            // this.getView().setModel(oViewTableModel, "localModel");

            // var oAppSupModel = this.getOwnerComponent().getModel("fundingApp");

            // this._onComCodeListView(oAppSupModel);
            // this._onTransactionDivision(oAppSupModel);
            // this.getOwnerComponent().getModel("viewModel").setProperty("/detail/checkModel", []);
            this._onComCodeListView();
            this.getRouter().getRoute("Apply").attachPatternMatched(this._onRoutedThisPage, this);

        },

        onAfterRendering: function (oEvent) {
            this.getModel("viewModel");
        },

        /**
         * When it routed to this page from the other page.
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onRoutedThisPage: function (oEvent) {
                      
        }

        //동적 체크박스 
        , _onComCodeListView: function () {
            var that = this,
                sParmaModel=this.getModel("viewModel"),
                oDataModel = this.getOwnerComponent().getModel(),
                sTenant_id = "L1100",
                sGroup_code = "SP_SF_FUNDING_REASON_CODE",
                sChain_code = "SP",
                aFilters = [];

            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenant_id));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, sGroup_code));
            aFilters.push(new Filter("language_cd", FilterOperator.EQ, "KO"));

            oDataModel.read("/ComCodeListView", {
                //Filter : 테넌트, 언어, 콤보내용
                filters: aFilters,
                success: function (oData) {
                    for (var i = 0; i < oData.results.length; i++) {
                        that.byId("checkBoxContent").addItem(new CheckBox({ text: oData.results[i].code + ". " + oData.results[i].code_name, editable:false ,selected: "{viewModel>/detailControll/checkModel/" + i + "}" }));
                    };
                },
                error: function (oError) {
                    
                }
            });
        },

        onOpenInvestmentDtl: function(oEvent){
            var oView = this.getView(),
                oModel = this.getModel("viewModel"),
                oDataModel = this.getOwnerComponent().getModel(),
                bFilters = [],
                cFilters = [],
                that = this,
                rowPath,
                sInvestment_plan_sequence;

                rowPath = oEvent.getSource().getParent().getBindingContext("viewModel").getPath()
                sInvestment_plan_sequence = this.getModel("viewModel").getProperty(rowPath + "/investment_plan_sequence")
                

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.sf.fundingStatus.view.InvestPlan",
                    controller: this
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            };
            
            bFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oModel.getProperty("/Detail/Apply").funding_appl_number));
            bFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, sInvestment_plan_sequence));

            this.pDialog.then(function (oDialog) {
                
                //투자계획 팝업 마스터 조회
                oDataModel.read("/InvestPlanMstView", {
                    filters: bFilters,
                    success: function (oRetrievedResult) {
                        
                        that.getModel("viewModel").setProperty("/Detail/Apply/popUpInvestPlanMst", oRetrievedResult.results[0]);

                        cFilters.push(new Filter("funding_appl_number", FilterOperator.EQ, oRetrievedResult.results[0].funding_appl_number));
                        cFilters.push(new Filter("investment_plan_sequence", FilterOperator.EQ, oRetrievedResult.results[0].investment_plan_sequence));

                        //투자계획 팝업 디테일 조회
                        oDataModel.read("/InvestPlanDtlView", {
                            filters: cFilters,
                            success: function (Result) {
                                that.getModel("viewModel").setProperty("/Detail/Apply/popUpInvestPlanDtl", Result.results);
                            },
                            error: function (oError) {

                            }
                        })
                    },
                    error: function (oError) {

                    }
                });
                oDialog.open();
            });
        }

        , onCreatePopupClose: function(){
            this.byId("investmentPlanDetails").close();
        }
        // , _formatChange: function(sValue){
        //     var test;
            
        //     if(sValue){
        //         test = sValue.toString().subString(0,4);
        //     }else{
        //         test = sValue;
        //     }


        //     return test;
        // }
        
    })
});