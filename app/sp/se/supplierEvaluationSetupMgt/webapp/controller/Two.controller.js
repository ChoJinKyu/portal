// @ts-ignore
sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",    
    "sap/m/MessageToast",  
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
  
    // @ts-ignore
], function (BaseController, Multilingual, JSONModel, Filter, MessageToast, MessageBox,History) {
    "use strict";

    var i18nModel; //i18n 모델
    return BaseController.extend("sp.se.supplierEvaluationSetupMgt.controller.Two", {

        onInit: function () {
           
            //MainView 넘어온 데이터 받기 -> DetailMatched
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oRouter.getRoute("two").attachPatternMatched(this._onDetailMatched, this);

             // I18N 모델 
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            i18nModel = this.getModel("I18N");

            //TwoView Model
            var oViewModel = new JSONModel();
            this.setModel(oViewModel, "TwoView");


        }
        , _onDetailMatched: function (oEvent) {
            var oArgs, oComponent, oViewModel, oHeader;
            var oView = this.getView();

            this.getView().getModel("TwoView").setProperty("/",{
                            evaluationType2 : [],
                            scale : []
                        });
            this.getView().byId("detailValuationTable").removeSelections(true);
            

            oArgs = oEvent.getParameter("arguments");
            oComponent = this.getOwnerComponent();
            oViewModel = oComponent.getModel("viewModel");
            
            oViewModel.setProperty("/App/layout", "TwoColumnsMidExpanded");     
            
            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],

            this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
            this.company_code = oEvent.getParameter("arguments")["company_code"],            
            this.org_code = oEvent.getParameter("arguments")["org_code"],
            this.org_type_code = oEvent.getParameter("arguments")["org_type_code"],  
            this.evaluation_operation_unit_code = oEvent.getParameter("arguments")["evaluation_operation_unit_code"],         
            this.evaluation_type_code = oEvent.getParameter("arguments")["evaluation_type_code"];                                     
                       

            // Create 버튼 눌렀을때
            if (this.scenario_number === "New") {
                this.getModel("TwoView").setProperty("/isEditMode", true);
                this.getModel("TwoView").setProperty("/isCreate", true);

            } else { // Detail 일때
                this.getModel("TwoView").setProperty("/isEditMode", false);
                this.getModel("TwoView").setProperty("/isCreate", false);     
 
             
                var TwoFilters = [];      
              
                TwoFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                TwoFilters.push(new Filter("company_code", 'EQ', this.company_code));                   
                TwoFilters.push(new Filter("org_code", 'EQ', this.org_code));     
                TwoFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code)); 
                TwoFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));
                TwoFilters.push(new Filter("evaluation_type_code", 'EQ', this.evaluation_type_code));
                      
                oView.getModel().read("/EvalType", {
                    filters: TwoFilters,
                    success: function (oData) {
                    
                        // if(oData.results!=null)
                        oView.getModel("TwoView").setProperty("/evaluationType2",oData.results[0]);                      
                      
                        }.bind(this),
                    error: function () {

                    }});                    

                oView.getModel().read("/EvalGrade", {
                    filters: TwoFilters,
                    success: function (oData) {
                    
                        // if(oData.results!=null)
                        oView.getModel("TwoView").setProperty("/scale",oData.results);                      
                      
                        }.bind(this),
                    error: function () {

                }});

               }              
            }

            ,/**
        * Manager Section 행 추가
        * @public
        **/            
        onEvalAdd : function(oEvent){
            var oView = this.getView().getModel("TwoView");            
            var oModel = oView.getProperty("/scale");
			oModel.unshift({
	            "tenant_id": this.tenant_id,
                "company_code": this.company_code,
                "org_type_code":  this.org_type_code,
                "org_code":this.org_code,
                "evaluation_operation_unit_code": "",
                "evaluation_type_code": "",
                "user_local_name": "",
                "evaluation_grade": "",
                "evaluation_grade_start_score": "",
                "evaluation_grade_end_score": "",
                "inp_apply_code": "",
                "crudFlg" : "C"
            });
           oView.setProperty("/manager",oModel);
            },

        
        onEvalDelete : function(oEvent){

            var oTable = this.byId("detailValuationTable"),                
                oView = this.getView(),
                oModel = this.getModel("TwoView"),

                aItems = oTable.getSelectedItems(),
                aIndices = [];

            var that = this;
            var sendData = {}, aInputData=[];

            sendData.inputData = aInputData;

            console.log("delPrList >>>>", aIndices);

            if (aItems.length > 0) {
                MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aItems.forEach(function(oItem){
                            aIndices.push(oModel.getProperty("/scale").indexOf(oItem.getBindingContext("TwoView").getObject()));
                        });
                        aIndices.sort().reverse();
                        //aIndices = aItems.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){     
                            oModel.getProperty("/scale").splice(nIndex,1);                      
                           
                        });

                            oModel.setProperty("/scale",oModel.getProperty("/scale"));
                       
                            oView.byId("detailValuationTable").removeSelections(true);                        

                        } else if (sButton === MessageBox.Action.CANCEL) { 

                        }; 
                        
                        
                    }
                });

            } else {
                MessageBox.error("선택된 데이터가 없습니다.");
            }           

        }

        ,/**
        * 메인화면으로 이동
        * @public
        */
        onNavToBack: function () {
            var that = this;
            
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (that.getModel("TwoView").getProperty("/isEditMode") === false) {
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    history.back();
                } else {
                    
                }

            } else {
                MessageBox.confirm(i18nModel.getText("/NPG00013"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {

                            if (sPreviousHash !== undefined) {
                                // eslint-disable-next-line sap-no-history-manipulation
                                history.go(-1);
                            } else {
                                that.getRouter().navTo("detail", {}, true);
                            }                             
                        }

                    }
                });

            }
        },
        /**
         * footer Cancel 버튼 기능
         * @public
         */
            onPageCancelEditButtonPress: function () {
            this.onNavToBack();
        },

            onPageEditButtonPress: function () {
            this._toEditMode();
            },

        /**
        * Edit모드일 때 설정 
        * @private
        */
            _toEditMode: function () {
                this.getModel("TwoView").setProperty("/isEditMode", true);                
                
            },


        });
    });