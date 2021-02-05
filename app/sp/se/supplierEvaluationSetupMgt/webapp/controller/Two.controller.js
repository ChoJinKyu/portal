// @ts-ignore
sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",    
    "sap/m/MessageToast",  
    "sap/m/MessageBox",
    "sap/ui/core/routing/History",
     "sap/ui/core/ValueState",
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
  
    // @ts-ignore
], function (BaseController, Multilingual, JSONModel, Filter, MessageToast, MessageBox,History,ValueState, Message, MessageType) {
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

            this.loginUserId = "TestUser" ;

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
            this.getView().byId("scaleTable").removeSelections(true);
            

            oArgs = oEvent.getParameter("arguments");
            oComponent = this.getOwnerComponent();
            oViewModel = oComponent.getModel("viewModel");
            
            oViewModel.setProperty("/App/layout", "TwoColumnsBeginExpanded");     
            
            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],

            this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
            this.company_code = oEvent.getParameter("arguments")["company_code"],            
            this.org_code = oEvent.getParameter("arguments")["org_code"],
            this.org_type_code = oEvent.getParameter("arguments")["org_type_code"],              
            this.evaluation_operation_unit_name = oEvent.getParameter("arguments")["evaluation_operation_unit_name"],    
            this.evaluation_operation_unit_code = oEvent.getParameter("arguments")["evaluation_operation_unit_code"],     
            this.evaluation_type_code = oEvent.getParameter("arguments")["evaluation_type_code"],
            this.use_flag =  oEvent.getParameter("arguments")["use_flag"];     
                                

            // // Create 버튼 눌렀을때
            // if (this.scenario_number === "New") {
            //     this.getModel("TwoView").setProperty("/isEditMode", true);
            //     this.getModel("TwoView").setProperty("/isCreateMode", true);
            //     this.getModel("TwoView").setProperty("/tansaction_code", "I");

            //     this.getModel("TwoView").setProperty("/evaluationType2", {
            //     "tenant_id":this.tenant_id,
            //     "company_code":this.company_code,
            //     "org_type_code":this.org_type_code,
            //     "org_code":this.org_code ,   
            //     "use_flag" : false,   
            //     "evaluation_operation_unit_code" : this.evaluation_operation_unit_code
            //     });


            // } else { // Detail 일때
            //     this.getModel("TwoView").setProperty("/isEditMode", false);
            //     this.getModel("TwoView").setProperty("/isCreateMode", false);  
            //     this.getModel("TwoView").setProperty("/tansaction_code", "R");       
 
             
            //     this._readEval2View();                
            //     this._readScaleView();

                  
            //     }   

                this._readAll();
            },  
            _readAll : function(){
                var oView = this.getView();
                var oModel = oView.getModel("TwoView");

                // Create 버튼 눌렀을때
            if (this.scenario_number === "New") {
                oModel.setProperty("/isEditMode", true);
                oModel.setProperty("/isCreateMode", true);
                oModel.setProperty("/tansaction_code", "I");

                oView.getModel("TwoView").setProperty("/",{
                            evaluationType2 : [],
                            scale : []
                        });
                
                

                oModel.setProperty("/evaluationType2", {
                "tenant_id":this.tenant_id,
                "company_code":this.company_code,
                "org_type_code":this.org_type_code,
                "org_code":this.org_code ,   
                "use_flag" : false,   
                "evaluation_operation_unit_code" : this.evaluation_operation_unit_code
                });


            } else { // Detail 일때
                oModel.setProperty("/isEditMode", false);
                oModel.setProperty("/isCreateMode", false);  
                oModel.setProperty("/tansaction_code", "R");       
 
             
                this._readEval2View();                
                this._readScaleView();
                
                  
                }   
                oView.byId("scaleTable").removeSelections(true);
            },
            _readEval1View : function(){

                var TwoFilters = [];  
                
                var oComponent = this.getOwnerComponent();

                
                var oView =  oComponent.byId("detail").byId("beginView").getController().getView();

                var oModel = oView.getModel("DetailView").getProperty("/evaluationType1");

                //$evaluationType1 table read
                var EvalTypeListFilters = [];      
                EvalTypeListFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                EvalTypeListFilters.push(new Filter("company_code", 'EQ', this.company_code));     
                EvalTypeListFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code));
                EvalTypeListFilters.push(new Filter("org_code", 'EQ', this.org_code));     
                EvalTypeListFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));


                oView.getModel().read("/evalTypeListView", {
                filters: EvalTypeListFilters,
                success: function (oData) {
                        oView.getModel("DetailView").setProperty("/evaluationType1",oData.results);                    

                    }.bind(this),
                    error: function () {}
                    });           
                
            },

            _readEval2View : function(){
                var oView = this.getView();
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
                        var oValues = oData.results[0];
                        // if(oData.results!=null)
                        oView.getModel("TwoView").setProperty("/evaluationType2",oValues);                              
                      
                        }.bind(this),
                    error: function () {

                    }});              
                
            },

            _readScaleView : function(){
                var oView = this.getView();
                var TwoFilters = [];      
                var oTable = oView.byId("scaleTable");
              
                TwoFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                TwoFilters.push(new Filter("company_code", 'EQ', this.company_code));                   
                TwoFilters.push(new Filter("org_code", 'EQ', this.org_code));     
                TwoFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code)); 
                TwoFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));
                TwoFilters.push(new Filter("evaluation_type_code", 'EQ', this.evaluation_type_code));

                        oView.getModel().read("/EvalGrade", {
                            filters: TwoFilters,
                            success: function (oData) {
                            
                                // if(oData.results!=null)
                                oView.getModel("TwoView").setProperty("/scale",oData.results);                      
                            
                                }.bind(this),
                            error: function () {

                        }});

                        oTable.removeSelections("true");

        }   ,
            
        /**
        * Manager Section 행 추가
        * @public
        **/            
        onScaleAdd : function(oEvent){
            var oView = this.getView().getModel("TwoView");            
            var oModel = oView.getProperty("/scale");

                oModel.push({
                    "tenant_id": this.tenant_id,
                    "company_code": this.company_code,
                    "org_type_code":  this.org_type_code,
                    "org_code":this.org_code,
                    "evaluation_operation_unit_code": this.evaluation_operation_unit_code,
                    "evaluation_type_code": this.evaluation_type_code,
                    "user_local_name": "",
                    "evaluation_grade": "",
                    "evaluation_grade_start_score": "",
                    "evaluation_grade_end_score": "",
                    "inp_apply_code": "",
                    "tansaction_code" : "I",
                    "crudFlg" : "I",
                    "rowEditable":true,
                });
                
                oView.setProperty("/manager",oModel);
            
        },
         onTableCancle : function(oEvent){
                var oView;
                var oTable = oEvent.getSource().getParent().getParent().getParent();
                oView = this.getView();
                MessageBox.warning(i18nModel.getProperty("/NPG00013"),{
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }

                        this._readScaleView();

                        oTable.removeSelections(true);
                    }.bind(this)
                });

            }
        ,
        onPressSaveBtn : function(oEvent){
            var oView = this.getView();            
            // var oRequest = oModel.getProperty("/");
            var sURLPath = "srv-api/odata/v4/sp.supEvalSetupV4Service/SaveEvaluationSetup2Proc";
            var oSaveData;
            var oComponent = this.getOwnerComponent();


            MessageBox.confirm(i18nModel.getProperty("/NCM00001"),{
                onClose: function (sAction) {
                    if(sAction === MessageBox.Action.CANCEL){
                        return;
                    }
                    if(!this._checkValidation()){
                        return;
                    }
                    if(this.scenario_number === "New")
                    oSaveData = this._getSaveData("I");
                    else
                    oSaveData = this._getSaveData("U");

                    if(!oSaveData){
                        return;
                    }
                    

                    oView.setBusy(true);
                    $.ajax({
                        url: sURLPath,
                        type: "POST",
                        data: JSON.stringify(oSaveData),
                        contentType: "application/json",
                        success: function (data) {
                        MessageBox.success(i18nModel.getProperty("/NCM01001"), {
                            onClose : function (sAction) {
                            oView.setBusy(false);     

                            if(this.scenario_number==="New"){
                                this._readEval1View();
                                            // var oView = oOwnerComponent.byId("container-supplierEvaluationSetupMgt---detail--beginView").getController().getView();
                                            // var oModel = oView.getModel("DetailView").getProperty("/evaluationType1");
                               
                                var oComponent = this.getOwnerComponent();
                                var oViewModel = oComponent.getModel("viewModel");
                                oViewModel.setProperty("/App/layout", "OneColumn");

                                            // this.getRouter().navTo("detail", {
                                            //     scenario_number: "Detail",
                                            //     tenant_id: this.tenant_id,
                                            //     company_code: this.company_code,
                                            //     org_code: this.org_code,
                                            //     org_type_code: this.org_type_code,
                                            //     evaluation_operation_unit_code : this.evaluation_operation_unit_code,
                                            //     evaluation_operation_unit_name : this.evaluation_operation_unit_name,
                                            //     use_flag : this.use_flag
                                            // });
                            }else{
                                    this._readEval2View();                
                                    this._readScaleView();
                                    this._readEval1View();

                                    this.getView().byId("scaleTable").removeSelections(true);
                                    this.getModel("TwoView").setProperty("/isEditMode", false);
                                 }

                                    
                                }.bind(this)
                            });
                        }.bind(this),
                        error: function (e) {
                                var sDetails;

                                sDetails = "";
                                try{
                                    sDetails += "<p><strong>" + e.responseJSON.error.code + "</strong></p>\n" +
                                    "<ul>" +
                                        "<li>" + e.responseJSON.error.message + "</li>" +
                                    "</ul>";
                                }catch(error){
                                    
                                }

                                MessageBox.error(e.status + " - " + e.statusText,{
                                    title: "Error",
                                    details : sDetails
                                })

                            oView.setBusy(false);
                        }


                    });
                }.bind(this)
            });            

            



        },
         /**
         * 저장시 Validation 필수값 확인
         * 
         */
         _checkValidation : function(){
            var bValid, oView, oViewModel, oArgs, aControls;
            
            oView = this.getView();
            oViewModel = oView.getModel("TwoView");
            // oArgs = oViewModel.getProperty("/Args");
            bValid = false;

            // if(this.scenario_number === "New"){
            //     aControls = oView.getControlsByFieldGroupId("newRequired");
            //     bValid = this._isValidControl(aControls);
            // }else{
                aControls = oView.getControlsByFieldGroupId("required");
                bValid = this._isValidControl(aControls);
            // }

            return bValid;
        },
         /***
         * Control 유형에 따른 필수 값 확인
         */
        _isValidControl : function(aControls){
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                bAllValid = false;
                // oI18n = this.getView().getModel("I18N");
                
            oMessageManager.removeAllMessages();
            bAllValid = aControls.every(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
                        break;
                    case "sap.m.ComboBox":
                        sValue = oControl.getSelectedKey();
                        break;
                    case "sap.m.MultiComboBox":
                        sValue = oControl.getSelectedKeys().length;
                        break;
                    default:
                        return true;
                }
                
                // if(!oControl.getProperty('enabled')) return true;
                if(!oControl.getProperty('editable')) return true;
                if(oControl.getProperty('required')){
                    if(!sValue){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(i18nModel.getText("/ECM01002"));
                        oMessageManager.addMessages(new Message({
                            message: i18nModel.getText("/ECM01002"),
                            type: MessageType.Error
                        }));
                        bAllValid = false;
                        oControl.focus();
                        return false;
                    }else{
                        oControl.setValueState(ValueState.None);
                    }
                }
                return true;
            });

            return bAllValid;
        },

        _getSaveData : function(sTransactionCode){
                var oSaveData, oUserInfo, oView, oViewModel,sHeadField;
                
                var 
                oEvalItem, oEvalTypeFields, oEvalType,
                oEvalGradeItem, oEvalGradeFields, oEvalGradeType;
                
                var scenario_number = this.scenario_number;

                //oUserInfo = this._getUserSession();
                oView = this.getView();
                oViewModel = oView.getModel("TwoView");

                        oEvalTypeFields = [
                            "tenant_id",
                            "company_code",
                            "org_type_code",
                            "org_code",
                            "evaluation_operation_unit_code",
                            "evaluation_type_code",
                            "evaluation_type_name",
                            "evaluation_type_distrb_score_rate",
                            "use_flag",
                        ];

                        oEvalGradeFields = [
                            "tansaction_code",
                            "tenant_id",
                            "company_code",
                            "org_type_code",
                            "org_code",
                            "evaluation_operation_unit_code",
                            "evaluation_type_code",
                            "evaluation_grade",
                            "evaluation_grade_start_score",
                            "evaluation_grade_end_score",
                            "inp_apply_code",
                        ];                        

                        oSaveData = {
                            EvalType : [],
                            EvalGrade : [],
                            user_id : this.loginUserId
                        }

                        oEvalType = {};

                        var oHeader = oViewModel.getProperty("/evaluationType2");

                        for(sHeadField in oHeader){
                            if( 
                                oHeader.hasOwnProperty(sHeadField) && 
                                oEvalTypeFields.indexOf(sHeadField) > -1 && 
                                oHeader[sHeadField]
                            ){
                                oEvalType[sHeadField] = oHeader[sHeadField];
                            }else if(
                                 typeof oHeader[sHeadField] === "boolean"
                            ){
                                oEvalType[sHeadField] = false;
                            }
                        }
                        var evaluation_type_code = oEvalType.evaluation_type_code;
                        // oEvalType.eval_apply_vendor_pool_lvl_no = parseInt(oEvalType.eval_apply_vendor_pool_lvl_no);                    
                        oEvalType.evaluation_type_distrb_score_rate = parseInt(oEvalType.evaluation_type_distrb_score_rate);
                        oSaveData.EvalType.push(oEvalType);

                        
                        oEvalGradeItem = oViewModel.getProperty("/scale");  
                        oEvalGradeItem.forEach(function(oRowData){

                        var oNewQunaRowData, sQunatityField;
                            oNewQunaRowData = {};

                        if(!oRowData.tansaction_code){
                                    oRowData.tansaction_code = "R";
                                }
                                for(sQunatityField in oRowData){
                                    if(
                                        oRowData.hasOwnProperty(sQunatityField) && 
                                        oEvalGradeFields.indexOf(sQunatityField) > -1 && 
                                        oRowData[sQunatityField]
                                    ){
                                        oNewQunaRowData[sQunatityField] = oRowData[sQunatityField];
                                    }
                                }
                                if(scenario_number === "New")
                                oNewQunaRowData.evaluation_type_code = evaluation_type_code;
                                oNewQunaRowData.evaluation_grade_start_score = parseInt(oNewQunaRowData.evaluation_grade_start_score);
                                oNewQunaRowData.evaluation_grade_end_score = parseInt(oNewQunaRowData.evaluation_grade_end_score);
                                // oNewQunaRowData.sort_sequence = parseInt(oNewQunaRowData.sort_sequence);                    
                                oSaveData.EvalGrade.push(oNewQunaRowData);
                            });
                            return oSaveData;

        },

        
        onScaleDelete : function(oEvent){

            var oTable, oView, oViewModel, aSelectedItems, aContxtPath, aScaleListData;
                
                oView = this.getView();
                oViewModel = oView.getModel("TwoView");
                oTable = this.byId("scaleTable");
                aScaleListData = oViewModel.getProperty("/scale");
                aSelectedItems = oTable.getSelectedItems();
                aContxtPath = oTable.getSelectedContextPaths();

                for(var i = aContxtPath.length - 1; i >= 0; i--){
                    var idx = aContxtPath[i].split("/")[2];
                    
                    if( aScaleListData[idx].crudFlg === "I" ){
                        aScaleListData.splice(idx, 1);
                    }else{
                        aScaleListData[idx].crudFlg = "D";
                        aScaleListData[idx].tansaction_code = "D"
                        aScaleListData[idx].rowEditable = false;
                    }
                }

                oTable.removeSelections(true);
                oViewModel.setProperty("/scale", aScaleListData);
                
            // var oTable = this.byId("detailValuationTable"),                
            //     oView = this.getView(),
            //     oModel = this.getModel("TwoView"),
            //     aItems = oTable.getSelectedItems(),
            //     aIndices = [];

            // if (aItems.length > 0) {
            //     MessageBox.confirm(i18nModel.getText("/NCM00003"), {
            //         title: "Comfirmation",
            //         initialFocus: sap.m.MessageBox.Action.CANCEL,
            //         onClose: function (sButton) {
            //            if (sButton === MessageBox.Action.OK) {
            //             aItems.forEach(function(oItem){
            //                 aIndices.push(oModel.getProperty("/scale").indexOf(oItem.getBindingContext("TwoView").getObject()));
            //             });
            //             aIndices.sort().reverse();
            //             //aIndices = aItems.sort(function(a, b){return b-a;});
            //             aIndices.forEach(function(nIndex){     
            //                 oModel.getProperty("/scale").splice(nIndex,1);     
            //             });

            //             oModel.setProperty("/scale",oModel.getProperty("/scale"));
            //             oView.byId("detailValuationTable").removeSelections(true);                        

            //             }
                        
                        
            //         }
            //     });

            // } else {
            //     MessageBox.error("선택된 데이터가 없습니다.");
            // }           

        },
        onSelectItem : function(oEvent){
            
                /***
                 * 2021-02-04 단일 셀렉으로 변경
                 */
                var oView, oViewModel, oSelectItem,
                oBindContxtPath, oRowData, bSeletFlg, bEditMode, aSelectAll,
                oParameters, bAllSeletFlg, sTablePath, oTable, aListData;

                oView = this.getView();
                oViewModel = oView.getModel("TwoView");
                bEditMode = oViewModel.getProperty("/isEditMode");

                if(!bEditMode){
                    return;
                }
                

                oParameters = oEvent.getParameters();
                oSelectItem = oParameters.listItem;
                oBindContxtPath = oSelectItem.getBindingContextPath();
                oRowData = oViewModel.getProperty(oBindContxtPath);
                bSeletFlg = oParameters.selected;
                bAllSeletFlg = oParameters.selectAll;

                oTable = oEvent.getSource();
                sTablePath = oTable.getBindingPath("items");
                aListData = oViewModel.getProperty(sTablePath);
                aListData.forEach(function(item){
                    if(item.crudFlg !== "I"){
                        item.rowEditable = false;
                    }
                });

                // if(
                //    (bAllSeletFlg && bSeletFlg) || 
                //     (!bAllSeletFlg && !bSeletFlg && oParameters.listItems.length > 1)
                // ){
                //     oTable = oEvent.getSource();
                //     sTablePath = oTable.getBindingPath("items");
                //     aListData = oViewModel.getProperty(sTablePath);
                    
                //     oViewModel.setProperty(sTablePath, aListData.map(function(item){

                //     if(item.crudFlg === "D"){
                //         return item;
                //     }else if(item.crudFlg === "I"){
                //         item.rowEditable = bSeletFlg;
                //         return item;
                //     }

                //     item.rowEditable = bSeletFlg;
                //     item.crudFlg = "U";
                //     item.tansaction_code = "U";
                //     return item;
                //     }));
                //         return;
                            
                // }

                if(oRowData.crudFlg === "D"){
                    return;
                }else if(oRowData.crudFlg === "I"){
                    oRowData.rowEditable = bSeletFlg;
                    oViewModel.setProperty(oBindContxtPath, oRowData);
                    return;
                }

                oRowData.rowEditable = bSeletFlg;
                oRowData.crudFlg = "U";
                oRowData.tansaction_code = "U";

                oViewModel.setProperty(oBindContxtPath, oRowData);
           

            
        }
         , onChangeEdit : function(oEvent){
            var oControl, oContext, oBindContxtPath, oBingModel, oRowData;

            oControl = oEvent.getSource();
            oContext = oControl.getBindingContext("TwoView");
            oBingModel = oContext.getModel();
            oBindContxtPath = oContext.getPath();
            oRowData = oContext.getObject();

            if(oRowData.crudFlg === "D"){
                return;
            }else if(oRowData.crudFlg === "I"){
                oBingModel.setProperty(oBindContxtPath, oRowData);
                return;
            }

            oRowData.crudFlg = "U";
            oRowData.tansaction_code = "U";

            oBingModel.setProperty(oBindContxtPath, oRowData)
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
                    that.getRouter().navTo("detail", {
                                    scenario_number: "Before",
                                    tenant_id: this.tenant_id,
                                    company_code: this.company_code,
                                    org_code: this.org_code,
                                    org_type_code: this.org_type_code,
                                    evaluation_operation_unit_code : this.evaluation_operation_unit_code,
                                    evaluation_operation_unit_name : this.evaluation_operation_unit_name,
                                    use_flag : this.use_flag
                                });
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
                               that.getRouter().navTo("detail", {
                                    scenario_number: "Before",
                                    tenant_id: that.tenant_id,
                                    company_code: that.company_code,
                                    org_code: that.org_code,
                                    org_type_code: that.org_type_code,
                                    evaluation_operation_unit_code : that.evaluation_operation_unit_code,
                                    evaluation_operation_unit_name : that.evaluation_operation_unit_name,
                                    use_flag : that.use_flag
                                });
                            }
                            else{
                                that.getRouter().navTo("detail", {}, true);
                            }                             
                        }

                    }
                });

            }
        },
        onPressLayoutChange : function(oEvent){
                var oControl, oView, oViewModel, sLayout, sIcon, sBtnScreenText;

                oControl = oEvent.getSource();
                oView = this.getView();

                var oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");

                sIcon = oControl.getIcon();

                if(sIcon === "sap-icon://full-screen"){
                    sLayout = "MidColumnFullScreen";
                    sBtnScreenText = "sap-icon://exit-full-screen";
                }else{
                    sLayout = "TwoColumnsMidExpanded";
                    sBtnScreenText = "sap-icon://full-screen";
                }

                oViewModel.setProperty("/App/layout", sLayout);
                oViewModel.setProperty("/App/btnScreen", sBtnScreenText);
                
            },
        /**
         * footer Cancel 버튼 기능
         * @public
         */
            onPageCancelEditButtonPress: function () {
            MessageBox.confirm(i18nModel.getText("/NPG00013"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {

                            this._readAll();

                        }

                    }.bind(this)
                });
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