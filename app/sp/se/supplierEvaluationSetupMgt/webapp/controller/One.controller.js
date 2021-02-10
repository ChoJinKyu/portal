sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Multilingual",
    "sap/ui/core/Item",
    "sap/ui/core/ValueState",
    "sap/ui/core/message/Message",
    "sap/ui/core/MessageType",
    "sap/m/SegmentedButtonItem"

], function (BaseController, History, MessageBox, MessageToast, Filter,JSONModel, 
    Multilingual, Item, ValueState, Message, MessageType , SegmentedButtonItem
    ) {
    "use strict";


    var i18nModel; //i18n 모델
    return BaseController.extend("sp.se.supplierEvaluationSetupMgt.controller.One", {

        onInit: function () {
            var oView, oViewModel, oMultilingual, oOwnerComponent;
            oView = this.getView();

            // I18N 모델 
            oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            i18nModel = this.getModel("I18N");

            //Detail Controller,View -> One Controller 변경 
            oViewModel = new JSONModel();
            this.setModel(oViewModel, "DetailView");
            
            //MainView 넘어온 데이터 받기 -> DetailMatched
            oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

            // 로그인 세션 작업완료시 수정해야함!
            this.loginUserId = "TestUser" ;
            this.tenant_id = "L2100";
            this.company_code = "LGCKR";  
            
            this.language_cd ="KO"; 
            this.orgTypeCode = "BU";
            this.orgCode = "BIZ00100";

            // 자주쓸것같은 Filter
            // var aSearchFilters = [];                
            //     aSearchFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
            //     aSearchFilters.push(new Filter("company_code", 'EQ', this.company_code)); 

            // search filed init
        },

        /**
        * Manager Table 행 추가
        * @public
        **/            
        onManagerAdd : function(oEvent){
            var oModel = this.getView().getModel("DetailView");            
            var oItem = oModel.getProperty("/manager");

                oItem.push({
                "tenant_id": this.tenant_id,
                    "company_code": this.company_code,
                    "org_type_code":  this.org_type_code,
                    "org_code":this.org_code,
                    "evaluation_operation_unit_code": this.evaluation_operation_unit_code,
                    "transaction_code" : "I",
                    "crudFlg" : "I",
                    "rowEditable":true
                });
                    // //add시 필요한값?
                    // "evaluation_op_unt_person_empno": "",
                    // "user_local_name": "",
                    // "department_local_name": "",
                    // "evaluation_execute_role_code": "",

                oModel.setProperty("/manager",oItem);

                
                    // // "ext/lib/model/ManagedListModel" 쓸떄
                    // 	var oModel = this.getModel("supEvalSetupModel");
                    // 	oModel.addRecord({
                    //         "tenant_id": this.tenant_id,
                    //         "company_code": this.company_code,
                    //         "org_type_code":  this.org_type_code,
                    //         "org_code":this.org_code,
                    //         "evaluation_operation_unit_code": "",
                    //         "evaluation_op_unt_person_empno": "",
                    //         "user_local_name": "",
                    //         "department_local_name": "",
                    //         "evaluation_execute_role_code": ""
                    //     }, "/managerListView", 0);
                    // 	this.validator.clearValueState(this.byId("managerTable"));
                    //  	this.byId("managerTable").clearSelection();		
            },

        onTableDelete : function(oEvent){

            var oView, oViewModel, oTable, oComponent,
             aSelectedItems, aContxtPath, ListData, bSelect;
                
                oView = this.getView();
                oViewModel = oView.getModel("DetailView");
                oTable = oEvent.getSource().getParent().getParent().getParent();

                oComponent = this.getOwnerComponent();
                // oTable = this.byId("managerTable");
                //var bTwoViewEditCheck = oComponent.byId("detail").byId("beginView").byId("managerTable");

                // 현재뷰의 테이블중 삭제할 테이블 구분
                bSelect = oTable.getId() === oComponent.byId("detail").byId("beginView").byId("managerTable").getId();
                
                if(bSelect)
                ListData = oViewModel.getProperty("/manager");
                else
                ListData = oViewModel.getProperty("/quantitative");
                
                aSelectedItems = oTable.getSelectedItems();
                aContxtPath = oTable.getSelectedContextPaths();
                for(var i = aContxtPath.length - 1; i >= 0; i--){
                    var idx = aContxtPath[i].split("/")[2]; // get Index
                    
                    if( ListData[idx].crudFlg === "I" ){  // create-> 즉시 삭제
                        ListData.splice(idx, 1);
                    }else{                                // read  -> 삭제하겠다는 표시만
                        ListData[idx].crudFlg = "D"         
                        ListData[idx].transaction_code = "D"
                        //ListData[idx].rowEditable = false;
                    }
                }

                oTable.removeSelections(true);

                if(bSelect)
                oViewModel.setProperty("/manager", ListData);
                else
                oViewModel.setProperty("/quantitative", ListData);

                

                // var oTable = this.byId("managerTable"),                
                //     oView = this.getView(),
                //     oModel = this.getModel("DetailView"),
                //     aItems = oTable.getSelectedItems(),
                //     aIndices = [];

                // if (aItems.length > 0) {
                //     MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                //         title: "Comfirmation",
                //         initialFocus: sap.m.MessageBox.Action.CANCEL,
                //         onClose: function (sButton) {
                //            if (sButton === MessageBox.Action.OK) {
                //             aItems.forEach(function(oItem){
                //                 aIndices.push(oModel.getProperty("/manager").indexOf(oItem.getBindingContext("DetailView").getObject()));
                //             });
                //             aIndices.sort().reverse();
                //             //aIndices = aItems.sort(function(a, b){return b-a;});
                //             aIndices.forEach(function(nIndex){     
                //                 oModel.getProperty("/manager").splice(nIndex,1);     
                //             });

                //             oModel.setProperty("/manager",oModel.getProperty("/manager"));
                //             oView.byId("managerTable").removeSelections(true);                        

                //             }
                            
                //         }
                //     });

                // } else {
                //     MessageBox.error("선택된 데이터가 없습니다.");
                // }           

        },
        
        _getSaveData : function(sTransactionCode){
                var oSaveData, oUserInfo, oView, oViewModel,sHeadField;
                
                var 
                oMstItem, oMstFields, oMstType,
                oVpItem, oVpFields, oVpType,
                oManagerItem, oManagerFields, oManagerType,
                oQunatityItem, oQunatityFields, oQunatityType;
                
                var scenario_number = this.scenario_number;

                //oUserInfo = this._getUserSession();
                oView = this.getView();
                oViewModel = oView.getModel("DetailView");

                // oHeader = oViewModel.getProperty("/Detail/Header");
                // oArgs = oViewModel.getProperty("/Args");
                
                // if(oArgs.new === "Y"){
                //     oNewHeader = oViewModel.getProperty("/Detail/NewHeader");
                //     sLevel = oArgs.level;
                //     oSaveData = {
                //         "tenant_id" : oHeader.tenant_id,
                //         "company_code" : oHeader.company_code,
                //         "org_type_code" : oHeader.org_type_code,
                //         "org_code" : oHeader.org_code,
                //         "evaluation_operation_unit_code" : oHeader.evaluation_operation_unit_code,
                //         "evaluation_type_code" : oHeader.evaluation_type_code,
                //         "parent_evaluation_article_code" : "",
                //         "evaluation_article_name" : oNewHeader.evaluation_article_name,
                //         "evaluation_article_lvl_attr_cd" : oNewHeader.evaluation_article_lvl_attr_cd,
                //         "user_id" : oUserInfo.loginUserId
                //           };
                //     return oSaveData;
                //      }

                        oMstFields = [
                            "tenant_id",
                            "company_code",
                            "org_type_code",
                            "org_code",
                            "evaluation_operation_unit_code",
                            "evaluation_operation_unit_name",
                            "distrb_score_eng_flag",
                            "evaluation_request_mode_code",
                            "evaluation_request_approval_flag",
                            "operation_plan_flag",
                            "eval_apply_vendor_pool_lvl_no",
                            "use_flag",

                            // tenant_id: "L2100"
                            // company_code: "LGCKR"
                            // org_type_code: "BU"
                            // org_code: "BIZ00100"
                            // evaluation_operation_unit_code: "RAW_MATERIAL"
                            // evaluation_operation_unit_name: "원자재"
                            // distrb_score_eng_flag: true    
                            // evaluation_request_mode_code: ""
                            // evaluation_request_approval_flag: false
                            // operation_plan_flag: false
                            // eval_apply_vendor_pool_lvl_no: "3"
                            // use_flag: true
                            
                            
                            // language_cd: "KO"    
                            // vendor_pool_operation_unit_code: "RAW_MATERIAL"
                            // vendor_pool_operation_unit_name: "원자재"
                        ];
                        oVpFields = [
                            "vendor_pool_operation_unit_code"
                        ];
                        oManagerFields = [
                            "transaction_code",
                            "tenant_id",
                            "company_code",
                            "org_type_code",
                            "org_code",
                            "evaluation_operation_unit_code",
                            "evaluation_op_unt_person_empno",
                            "evaluation_execute_role_code",
                        ];
                        oQunatityFields = [
                            "transaction_code",
                            "tenant_id",
                            "company_code",
                            "org_type_code",
                            "org_code",
                            "evaluation_operation_unit_code",
                            "qttive_item_code",
                            "qttive_item_name",
                            "qttive_item_uom_code",
                            "qttive_item_measure_mode_code",
                            "qttive_item_desc",
                            "sort_sequence",
                        ];

                        oSaveData = {
                            OperationUnitMst : [],
                            VpOperationUnit : [],
                            Mangers : [],
                            Quantitative : [],
                            user_id : this.loginUserId
                        }

                        oMstType = {};

                        var oHeader = oViewModel.getProperty("/OperationUnitMst");

                        for(sHeadField in oHeader){
                            if( 
                                oHeader.hasOwnProperty(sHeadField) && 
                                oMstFields.indexOf(sHeadField) > -1 && 
                                oHeader[sHeadField]
                            ){
                                oMstType[sHeadField] = oHeader[sHeadField];
                            }else if(
                                 typeof oHeader[sHeadField] === "boolean"
                            ){
                                oMstType[sHeadField] = false;
                            }
                        }
                        var evaluation_operation_unit_code = oMstType.evaluation_operation_unit_code;
                        oMstType.eval_apply_vendor_pool_lvl_no = parseInt(oMstType.eval_apply_vendor_pool_lvl_no);                    
                        oSaveData.OperationUnitMst.push(oMstType);

                        var oView = this.getView();
                        var oModel = oView.getModel("DetailView");

                        var oKeys = oView.byId("searchMultiComboCode").getSelectedKeys();
                        
                        // var sCustomkeys = oKeys.join(",");
                        
                        // oModel.setProperty("/vpOperationUnit",
                            
                        // );
                        

                        // oVpItem = oViewModel.getProperty("/vpOperationUnit");                        
                        // oVpType = {};
                        // for(sHeadField in oVpItem){
                        //     if( 
                        //         oVpItem.hasOwnProperty(sHeadField) && 
                        //         oVpFields.indexOf(sHeadField) > -1 && 
                        //         oVpItem[sHeadField]
                        //     ){
                        //         oVpType[sHeadField] = oVpItem[sHeadField];
                        //     }
                        // }

                      
                        oSaveData.VpOperationUnit = oKeys.map(function(unitCode){
                                var obj ={};
                                obj.vendor_pool_operation_unit_code = unitCode;
                                return obj;
                        });


                        oManagerItem = oViewModel.getProperty("/manager");  
                        oManagerItem.forEach(function(oRowData){

                        var oNewRowData, sManagerField;
                            oNewRowData = {};

                        if(!oRowData.transaction_code){
                                    oRowData.transaction_code = "R";
                                }
                                for(sManagerField in oRowData){
                                    if(
                                        oRowData.hasOwnProperty(sManagerField) && 
                                        oManagerFields.indexOf(sManagerField) > -1 && 
                                        oRowData[sManagerField]
                                    ){
                                        oNewRowData[sManagerField] = oRowData[sManagerField];
                                    }
                                }
                                if(scenario_number === "New")
                                oNewRowData.evaluation_operation_unit_code = evaluation_operation_unit_code;
                                oSaveData.Mangers.push(oNewRowData);
                            });
                        
                        oQunatityItem = oViewModel.getProperty("/quantitative");  
                        oQunatityItem.forEach(function(oRowData){

                        var oNewQunaRowData, sQunatityField;
                            oNewQunaRowData = {};

                        if(!oRowData.transaction_code){
                                    oRowData.transaction_code = "R";
                                }
                                for(sQunatityField in oRowData){
                                    if(
                                        oRowData.hasOwnProperty(sQunatityField) && 
                                        oQunatityFields.indexOf(sQunatityField) > -1 && 
                                        oRowData[sQunatityField]
                                    ){
                                        oNewQunaRowData[sQunatityField] = oRowData[sQunatityField];
                                    }
                                }
                                if(scenario_number === "New")
                                oNewQunaRowData.evaluation_operation_unit_code = evaluation_operation_unit_code;
                                    
                                oNewQunaRowData.sort_sequence = parseInt(oNewQunaRowData.sort_sequence);                    
                                oSaveData.Quantitative.push(oNewQunaRowData);
                            });

                            return oSaveData;

        },
        // onChangeVP : function(oEvent){
        //     var oView = this.getView();
        //     var oModel = oView.getModel("DetailView");

        //     var oKeys = oEvent.getSource().getSelectedKeys();
        //     var sCustomkeys = oKeys.join(",");
            
        //     oModel.setProperty("/vpOperationUnit/vendor_pool_operation_unit_code",sCustomkeys);
        //     // this.getView().getModel("DetailView").setProperty("/OperationUnitMst/distrb_score_eng_flag", oEvent.getSource().getSelectedKey());
            

        // },

        onPressSaveBtn : function(oEvent){
            var oView = this.getView();
            var oModel = oView.getModel("DetailView");
            // var oRequest = oModel.getProperty("/");
            var sURLPath = "srv-api/odata/v4/sp.supEvalSetupV4Service/SaveEvaluationSetup1Proc";
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

                               this.getRouter().navTo("main");
                              
                            }else{
                                this._readAll();
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
            oViewModel = oView.getModel("DetailView");
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
                    sValue,oContext;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                        sValue = oControl.getValue();
                        oContext = oControl.getBinding("value");
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


                if(oContext&&oContext.getType()){
                    try{
                        oContext.getType().validateValue(sValue);
                    }catch(e){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText(e.message);
                        oControl.focus();
                        return false;
                    }
                    oControl.setValueState(ValueState.None);
                }else if(sEleName === "sap.m.ComboBox"){
                    if(!sValue && oControl.getValue()){
                        oControl.setValueState(ValueState.Error);
                        oControl.setValueStateText("올바른 값을 선택해 주십시오.");
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
         /**
         * ValueState 초기화
         */
        _clearValueState : function(aControls){
             aControls.forEach(function(oControl){
                var sEleName = oControl.getMetadata().getElementName(),
                    sValue;
                
                switch(sEleName){
                    case "sap.m.Input":
                    case "sap.m.TextArea":
                    case "sap.m.ComboBox":
                    case "sap.m.MultiComboBox":    
                        break;
                    default:
                        return;
                }
                oControl.setValueState(ValueState.None);
                oControl.setValueStateText();
            });
        },


        /**
        * Manager Section 행 삭제
        * @public
        */
        // onUIManagerDelete : function(oEvent){

            // 1. 맨밑에꺼 하나씩 차례대로
            // var oModel = this.getView().getModel("testModel").getData();	

            // var iLength = oModel.table.length;
            
			// oModel.table.splice(iLength-1,iLength);			
            // this.getView().getModel("testModel").setData(oModel);
            
            // 2. 혼자 생각해서 선택삭제
            // var oModel = this.getView().getModel("testModel");

            // var oTable = this.getView().byId("managerTable");
            // // var bSort = oTable.getBindingInfo("rows").binding.aSorters[0].bDescending;
            // var iSelectedIndex = oTable.getSelectedIndices().sort().reverse()// select된 index를 가져온다.  	ex [2,3,6]
                
            // // if(bSort)
			// // iSelectedIndex.reverse(); 
			// var iSize = iSelectedIndex.length;					// 선택된 배열길이
			
			// for(var i=0; i<iSize; i++){ // 선택된것은 모두삭제 => 선택된 길이만큼 반복
				
			// 	var sPath = oTable.getContextByIndex(iSelectedIndex[i]).sPath;
			// 	// 해당 index의 Path를 구한다.
				
			// 	var oItem = oModel.getProperty(sPath);
			// 	// Path를통해 객체에 접근
				
			// 	var iIndex = oModel.getData().table.findIndex( oFind=> oFind.user_local_name==oItem.user_local_name);
			// 	// sPath의 인스턴스를 통해 해당 인스턴스를가진 index를 구함
				
			// 	oModel.getData().table.splice(iIndex,1);
			// 	// oViewData 인덱스를 참고해 삭제
				
			// }
		    //   this.getView().getModel("testModel").setData(oModel.getData());
			//   this.getView().byId("managerTable").clearSelection();

            // 3. copy and paste

        //     var oTable = this.byId("managerTable"),                
        //         oView = this.getView(),
        //         oModel = this.getModel("DetailView"),  
        //         aItems = oTable.getSelectedIndices(),
        //         aIndices = [];

        //     var that = this;
        //     var sendData = {}, aInputData=[];

        //     sendData.inputData = aInputData;

        //     console.log("delPrList >>>>", aIndices);

        //     if (aItems.length > 0) {
        //         MessageBox.confirm(("삭제하시겠습니까?"), {
        //             title: "Comfirmation",
        //             initialFocus: sap.m.MessageBox.Action.CANCEL,
        //             onClose: function (sButton) {
        //                if (sButton === MessageBox.Action.OK) {
        //                 aIndices = aItems.sort(function(a, b){return b-a;});
        //                 aIndices.forEach(function(nIndex){     
        //                     oModel.getProperty("/manager").splice(nIndex,1);
                            
        //                 });

        //                     oModel.setProperty("/manager",oModel.getProperty("/manager"));
                       
        //                 oView.byId("managerTable").clearSelection();                        

        //                 } 
                        
                        
        //             }
        //         });

        //     } else {
        //         MessageBox.error("선택된 데이터가 없습니다.");
        //     }
    
        // },


        
        /**
        * quantitativeTable Section 행 추가
        * @public
        **/            
        onQunAdd : function(oEvent){
            var oView = this.getView().getModel("DetailView");            
            var oModel = oView.getProperty("/quantitative");

                oModel.push({
                "tenant_id": this.tenant_id,
                    "company_code": this.company_code,
                    "org_type_code":  this.org_type_code,
                    "org_code":this.org_code,  
                    "evaluation_operation_unit_code": this.evaluation_operation_unit_code,
                    "qttive_item_code": "",
                    "qttive_item_name": "",
                    "qttive_item_uom_code": "",
                    "qttive_item_measure_mode_code": "",
                    "qttive_item_desc": "",
                    "sort_sequence": 1,
                    "transaction_code":"I",
                    "crudFlg" : "I",
                    "rowEditable":true
                });
          
                oView.setProperty("/quantitative",oModel);

            },
            

        // onQunDelete : function(oEvent){
           
        //     var oTable, oView, oViewModel, aSelectedItems, aContxtPath, aQunListData;
                
        //         oView = this.getView();
        //         oViewModel = oView.getModel("DetailView");
        //         oTable = this.byId("quantitativeTable");
        //         aQunListData = oViewModel.getProperty("/quantitative");
        //         aSelectedItems = oTable.getSelectedItems();
        //         aContxtPath = oTable.getSelectedContextPaths();
        //         for(var i = aContxtPath.length - 1; i >= 0; i--){
        //             var idx = aContxtPath[i].split("/")[2];
                    
        //             if( aQunListData[idx].crudFlg === "I" ){
        //                 aQunListData.splice(idx, 1);
        //             }else{
        //                 aQunListData[idx].crudFlg = "D"
        //                 aQunListData[idx].transaction_code = "D"
        //                 aQunListData[idx].rowEditable = false;
        //             }
        //         }

        //         oTable.removeSelections(true);
        //         oViewModel.setProperty("/quantitative", aQunListData);

        // },
        /***
        * quantitativeTable 재조회
        */
        onTableCancle : function(oEvent){
                var oView;
                var oTable = oEvent.getSource().getParent().getParent().getParent();
                var oComponent = this.getOwnerComponent();
                
                oView = this.getView();
                MessageBox.warning(i18nModel.getProperty("/NPG00013"),{
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        if(sAction === MessageBox.Action.CANCEL){
                            return;
                        }

                        if(oTable.getId() === oComponent.byId("detail").byId("beginView").byId("managerTable").getId())
                        this._readManagerListView();                        
                        else
                        this._readQttiveItemListView();

                        oTable.removeSelections(true);
                    }.bind(this)
                });

            }
        ,

        onSelectItem : function(oEvent){

                /***
                 * 2021-02-04 단일 셀렉으로 변경
                 */

                var oView, oViewModel, oSelectItem,
                oBindContxtPath, oRowData, bSeletFlg, bEditMode, aSelectAll,
                oParameters, bAllSeletFlg, sTablePath, oTable, aListData;

                oView = this.getView();
                oViewModel = oView.getModel("DetailView");
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
                //     item.transaction_code = "U";

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
                oRowData.transaction_code = "U";

                oViewModel.setProperty(oBindContxtPath, oRowData);
           

            
        },
          onChangeEdit : function(oEvent){
            var oControl, oContext, oBindContxtPath, oBingModel, oRowData;

            oControl = oEvent.getSource();
            oContext = oControl.getBindingContext("DetailView");
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
            oRowData.transaction_code = "U";

            oBingModel.setProperty(oBindContxtPath, oRowData)
        },
        /**
        * quantitativeTable Section 행 삭제
        * @public
        */
        // onUIQunDelete : function(oEvent){

        //     var oTable = this.byId("quantitativeTable"),                
        //         oView = this.getView(),
        //         oModel = this.getModel("DetailView"),
        //         data = {},
        //         oSelected = [],
        //         delPrData = [],
        //         chkArr = [],
        //         chkRow = "",
        //         j=0,
               
        //         aItems = oTable.getSelectedIndices(),
        //         aIndices = [];

        //     var that = this;
        //     var sendData = {}, aInputData=[];

        //     sendData.inputData = aInputData;

        //     console.log("delPrList >>>>", aIndices);

        //     if (aItems.length > 0) {
        //         MessageBox.confirm(("삭제하시겠습니까?"), {
        //             title: "Comfirmation",
        //             initialFocus: sap.m.MessageBox.Action.CANCEL,
        //             onClose: function (sButton) {
        //                if (sButton === MessageBox.Action.OK) {
        //                 aIndices = aItems.sort(function(a, b){return b-a;});
        //                 aIndices.forEach(function(nIndex){     
        //                     oModel.getProperty("/quantitative").splice(nIndex,1);                      
                           
        //                 });

        //                     oModel.setProperty("/quantitative",oModel.getProperty("/quantitative"));
                       
        //                     oView.byId("quantitativeTable").clearSelection();                        

        //                 } else if (sButton === MessageBox.Action.CANCEL) { 

        //                 }; 
                        
                        
        //             }
        //         });

        //     } else {
        //         MessageBox.error("선택된 데이터가 없습니다.");
        //     }           

        // },

        
        /**
        * Manager Section 담당자 Search Filed
        * @public
        */
        onSearch: function (event) {
			var oItem = event.getParameter("suggestionItem");
			if (oItem) {
				MessageToast.show("Search for: " + oItem.getText());
			} else {
				MessageToast.show("Search is fired!");
			}
		},
        onSuggest: function (event) {
            var oView = this.getView();
            var oSF = oView.byId("searchField");

			var sValue = event.getParameter("suggestValue"),
				aFilters = [];
			if (sValue) {
				aFilters = [
					new Filter([
						new Filter("ProductId", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						}),
						new Filter("deppartment_local_name", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						})
					], false)
				];
			}
                oSF.suggest();
            },

        
        /**
        * 메인화면으로 이동
        * @public
        */
        onNavToBack: function () {
            var that = this;
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (that.getModel("DetailView").getProperty("/isEditMode") === false) {
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    that.getRouter().navTo("main", {}, true);
                } else {
                    that.getRouter().navTo("main", {}, true);
                }

            } else {
                MessageBox.confirm(i18nModel.getText("/NPG00013"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {

                            if (sPreviousHash !== undefined) {
                                // eslint-disable-next-line sap-no-history-manipulation
                                that.getRouter().navTo("main", {}, true);
                            } else {
                                that.getRouter().navTo("main", {}, true);
                            }                             
                        }

                    }
                });

            }
        },
        /** Two view로 Navigate 기능 
            * @public
            */
            onNavTwo: function (oEvent) {
               
                var oContext = oEvent.getSource().getBindingContext("DetailView");
                var oModel = oContext.getModel();
                var oItem = oModel.getProperty(oContext.getPath());                
                
                 var tenant_id = oItem.tenant_id,
                     company_code = oItem.company_code,
                     org_code = oItem.org_code ,
                     org_type_code = oItem.org_type_code,                     
                     evaluation_operation_unit_code = oItem.evaluation_operation_unit_code,
                     evaluation_type_code = oItem.evaluation_type_code
                     
                var oComponent = this.getOwnerComponent();
                var oViewModel = oComponent.getModel("viewModel");
                var layout = oViewModel.getProperty("/App/layout");

                 var bTwoViewEditCheck = oComponent.byId("detail").byId("detailView").getModel("TwoView").getData().isEditMode;
                 // var oModel = oView.getModel("DetailView").getProperty("/evaluationType1");
                               

                    if( (layout === "TwoColumnsMidExpanded" || layout === "TwoColumnsBeginExpanded")&& bTwoViewEditCheck ){
                    MessageBox.confirm(i18nModel.getText("/NPG00013"), {
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            if (sAction === MessageBox.Action.OK) {

                                    this.getRouter().navTo("two", {
                                    scenario_number: "Detail",
                                    tenant_id: tenant_id,
                                    company_code: company_code,
                                    org_code: org_code,
                                    org_type_code: org_type_code,
                                    evaluation_operation_unit_code : evaluation_operation_unit_code,
                                    evaluation_operation_unit_name : this.evaluation_operation_unit_name,
                                    evaluation_type_code : evaluation_type_code,
                                    use_flag : this.use_flag
                                    });
                    
                            }

                        }.bind(this)
                    });
                    }else{
                                    this.getRouter().navTo("two", {
                                    scenario_number: "Detail",
                                    tenant_id: tenant_id,
                                    company_code: company_code,
                                    org_code: org_code,
                                    org_type_code: org_type_code,
                                    evaluation_operation_unit_code : evaluation_operation_unit_code,
                                    evaluation_operation_unit_name : this.evaluation_operation_unit_name,
                                    evaluation_type_code : evaluation_type_code,
                                    use_flag : this.use_flag
                                    });
                            }


                    
            },

             onCreateTwo: function (oEvent) { 

                    this.getRouter().navTo("two", {
                        scenario_number: "New",
                        tenant_id: this.tenant_id,
                        company_code: this.company_code,
                        org_code: this.org_code,
                        org_type_code: this.org_type_code,
                        evaluation_operation_unit_code : this.evaluation_operation_unit_code,
                        evaluation_operation_unit_name : this.evaluation_operation_unit_name,
                        evaluation_type_code :" ",
                        use_flag : this.use_flag
                        
                    });
                    
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


        /**
         * Employee Code Dilog
         * 
         */
        onInputWithEmployeeValuePress: function(oEvent){
            this.byId("employeeDialog").open();
            // this.byId("managerTable").mAggregations.rows[0].mAggregations.cells[1].setProperty("value","test123");
            // oEvent.getSource().setValue("12343");
            //고유한아이디를 customdate에 넣어놓고 
            //oEvent.getSource().getId
            this.byId("employeeDialog").data("inputWithEmployeeValueHelp",oEvent.getSource());
        },
         onEmployeeDialogApplyPress: function(oEvent){

            var oParameter = oEvent.getParameter("item");
            var oSelectedItem = this.byId("employeeDialog").data("inputWithEmployeeValueHelp");

            oSelectedItem.setValue(oParameter.user_local_name);

            // var employee_number = oParameter.employee_number;
            var department_local_name = oParameter.department_local_name;
            var employee_number = oParameter.employee_number;

            var oTableCon = oSelectedItem.getBindingContext("DetailView");

            oTableCon.getModel().setProperty(oTableCon.getPath()+"/department_local_name",department_local_name);
            oTableCon.getModel().setProperty(oTableCon.getPath()+"/evaluation_op_unt_person_empno",employee_number);
            
        },

        // onUIEmployeeDialogApplyPress: function(oEvent){
        //     // this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        //     //this.byId("test").setValue(oEvent.getParameter("item").user_local_name);

        //     var oParameter = oEvent.getParameter("item");
        //     var oSelectedItem = this.byId("employeeDialog").data("inputWithEmployeeValueHelp");

        //         oSelectedItem.setValue(oParameter.user_local_name);

        //     var employee_number = oParameter.employee_number;
        //     var department_local_name = oParameter.department_local_name;

        //     // var oTable = this.byId("managerTable");

        //     var oTableCon = oSelectedItem.getParent().getRowBindingContext();

        //     oTableCon.getModel().setProperty(oTableCon.getPath()+"/department_local_name",department_local_name);

        //     //var oTableCon = oEvent.getSource().getParent().getParent().getRowBindingContext();
            
        //     //oTableCon.getModel().setProperty(oTableCon.getPath()+"/department_local_name",sValue)            


        // },

        
          /**
         * 
         * 담당자 Person 콤보박스 및 변경에따른 부서 binding
         * @public
         */
        onChangePerson: function (oEvent) {
           
            var oSelectedkey = oEvent.getSource().getSelectedKey();
            var oSelected = oEvent.getSource().getSelectedItem().getBindingContext();
            var oModel = oSelected.getModel();
            var sValue = oModel.getProperty(oSelected.getPath()).department_local_name;
                 
            var oTable = this.byId("managerTable");
            var oTableCon = oEvent.getSource().getParent().getParent().getRowBindingContext();

            //oEvent.getSource().oParent.oParent.getRowBindingContext();
            
            oTableCon.getModel().setProperty(oTableCon.getPath()+"/department_local_name",sValue);

        },
        
        _onDetailMatched: function (oEvent) {

            
            var oView = this.getView();

            var oArgs, oComponent, oViewModel;

                oArgs = oEvent.getParameter("arguments");
                oComponent = this.getOwnerComponent();
                oViewModel = oComponent.getModel("viewModel");
                
                oViewModel.setProperty("/App/layout", "OneColumn");
               // oViewModel.setProperty("/App/layout", sAppLayout === "OneColumn" ? "TwoColumnsMidExpanded" : sAppLayout);
                

            oView.setBusy(true);

            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],
            this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
            this.company_code = oEvent.getParameter("arguments")["company_code"],            
            this.org_code = oEvent.getParameter("arguments")["org_code"];
            this.org_type_code = oEvent.getParameter("arguments")["org_type_code"];
            this.evaluation_operation_unit_code = oEvent.getParameter("arguments")["evaluation_operation_unit_code"];
            this.evaluation_operation_unit_name = oEvent.getParameter("arguments")["evaluation_operation_unit_name"],            
            this.use_flag = oEvent.getParameter("arguments")["use_flag"];                                     
            this.evaluation_request_mode_code = oEvent.getParameter("arguments")["evaluation_request_mode_code"];

            
            if (this.scenario_number === "Before") {
                oView.setBusy(false);
                return;
            }

                
            this.getView().getModel("DetailView").setProperty("/",{
                                OperationUnitMst : [],                                
                                manager : [],
                                evaluationType1 : [],
                                quantitative : [],
                                vpOperationUnit : { vendor_pool_operation_unit_code : [] }
                            });
            this.getView().byId("managerTable").removeSelections(true);
            this.getView().byId("quantitativeTable").removeSelections(true);

            this._readAll();

            var aControls = oView.getControlsByFieldGroupId("required");
            this._clearValueState(aControls);                
            
             oView.setBusy(false);
         },
         onCheckLevel : function(oEvent){

            //var Keys =  oEvent.getSelectedKeys();
          
            var iKeys = oEvent.getSource().getSelectedKeys().join(",");
            
            var url = `srv-api/odata/v4/sp.supEvalSetupV4Service/VpLevelChipView(tenant_id='${this.tenant_id}',org_code='${this.org_code}',op_unit_code='${iKeys}')/Set`;
            
                 
            var oSegmentedButton = this.getView().byId("vendor_pool_lvl");

			$.ajax({
				url: url,
				type: "GET",
				datatype: "json",
				contentType: "application/json",
				success: function(data){
                    
                    oSegmentedButton.destroyItems();
                    for(var i=0;i<data.value.length;i++){
                                oSegmentedButton.addItem(
                                    new SegmentedButtonItem({ 
                                        text : data.value[i].level_name, 
                                        key : data.value[i].level_no
                                    })
                                );
                            }
                    // oSegmentedButton.setSelectedKey(data.value.length);
					
				},
				error: function(req){
					
				}
			});

            
            

            


         },
         _readAll : function(){
            var oView = this.getView();
            var oModel = this.getModel("DetailView");

            // Create 버튼 눌렀을때
            if(this.scenario_number === "New") {

                 this.getView().getModel("DetailView").setProperty("/",{
                                OperationUnitMst : [],                                
                                manager : [],
                                evaluationType1 : [],
                                quantitative : [],
                                vpOperationUnit : { vendor_pool_operation_unit_code : [] }
                            });
                            
                oModel.setProperty("/isEditMode", true);
                oModel.setProperty("/isCreateMode", true);
                oModel.setProperty("/transaction_code", "I");

                oModel.setProperty("/OperationUnitMst", {
                "tenant_id":this.tenant_id,
                "company_code":this.company_code,
                "org_type_code":this.org_type_code,
                "org_code":this.org_code,
                "use_flag" : false,
                "distrb_score_eng_flag" : false,
                "operation_plan_flag" : false,
                "evaluation_request_approval_flag" : false,
                "evaluation_request_mode_code" : this.evaluation_request_mode_code,      
                "eval_apply_vendor_pool_lvl_no" : 0         
                });

                
                // this.getModel("DetailView").setProperty("/OperationUnitMst/tenant_id", this.tenant_id);
                // this.getModel("DetailView").setProperty("/OperationUnitMst/company_code", this.company_code);

                

            } else{ // Detail 일때
                oModel.setProperty("/isEditMode", false);
                oModel.setProperty("/isCreateMode", false); 
                oModel.setProperty("/transaction_code", "R");        

                this._readOperationUnitMst();
                this._readManagerListView();
                this._readEvalTypeListView();
                this._readQttiveItemListView(); 


                // 키값 파라미터가 모두있고 단건일때 이렇게도 쓰인다.
                // var s = oView.getModel().crateKey("/OpUnitView",{
                //     tenant_id : this.tenant_id,
                //     ...
                // })
             }

             
                oView.byId("managerTable").removeSelections(true);
                oView.byId("quantitativeTable").removeSelections(true);
          
        },
         _readManagerListView : function(){

            var oView = this.getView();

            //Manager Table read
            var oManagerListFilters = [];      
            oManagerListFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
            oManagerListFilters.push(new Filter("company_code", 'EQ', this.company_code));     
            oManagerListFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code));
            oManagerListFilters.push(new Filter("org_code", 'EQ', this.org_code));     
            oManagerListFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));

            oView.getModel().read("/managerListView", {
            filters: oManagerListFilters,
            success: function (oData) {

                oView.getModel("DetailView").setProperty("/manager",oData.results);                    
                //this.getView().getModel("DetailView").setData(oManager);            
                
                }.bind(this),
                error: function () {
                }
                });

            
        },
        _readEvalTypeListView : function(){

            var oView = this.getView();

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
            _readQttiveItemListView : function(){            
              //$quantitative table read
              var oView = this.getView();

              var QttiveItemListFilters = [];      
              QttiveItemListFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
              QttiveItemListFilters.push(new Filter("company_code", 'EQ', this.company_code));     
              QttiveItemListFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code));
              QttiveItemListFilters.push(new Filter("org_code", 'EQ', this.org_code));     
              QttiveItemListFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));

                oView.getModel().read("/QttiveItem", {
                filters: QttiveItemListFilters,
                success: function (oData) {
                        oView.getModel("DetailView").setProperty("/quantitative",oData.results);
                        

                    }.bind(this),
                    error: function () {}
                    });              
                
                
            },
                
        _readOperationUnitMst : function(){
                var oView = this.getView();

                var OpUnitViewFilters = [];      
                OpUnitViewFilters.push(new Filter("language_cd", 'EQ', this.language_cd));
                OpUnitViewFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                OpUnitViewFilters.push(new Filter("company_code", 'EQ', this.company_code));     
                OpUnitViewFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code));
                OpUnitViewFilters.push(new Filter("org_code", 'EQ', this.org_code));     
                OpUnitViewFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));

                // if(!this.getModel("DetailView").getProperty("/isEditMode")){
                    oView.getModel().read("/OpUnitView", {
                    filters: OpUnitViewFilters,
                    success: function (oData) {
                        // 단건이면 oData가 Object , 다건이면 Array -> oData.value or oData.results[i].value
                        // filter하면 array

                        if(oData.results[0]!=null){
                        var oValues = oData.results[0];
                        // var oOperationUnit2 =  this.getModel("DetailView");
                        
                        oView.getModel("DetailView").setProperty("/OperationUnitMst",oValues);       
                        
                        if(oValues.vendor_pool_operation_unit_code !== null){
                        oView.getModel("DetailView").setProperty("/vpOperationUnit/vendor_pool_operation_unit_code", oValues.vendor_pool_operation_unit_code.split(","));
                        
                        var iLvl = Number(oView.getModel("DetailView").getProperty("/OperationUnitMst").eval_apply_vendor_pool_lvl_no);
                        

                        if(iLvl < 3)
                        iLvl = 3;

                         var oSegmentedButton = this.getView().byId("vendor_pool_lvl");
                            oSegmentedButton.destroyItems();
                            for(var i=0;i<iLvl;i++){
                                        oSegmentedButton.addItem(
                                            new SegmentedButtonItem({ 
                                                text : (i+1)+" Level", 
                                                key : (i+1)
                                            })
                                        );
                                    }
                            oSegmentedButton.setSelectedKey(iLvl);
                        }


                        // var oVPCombo = this.byId("searchMultiComboCode");
                        // var sKey = this.getModel("DetailView").getProperty("/vpOperationUnit/vendor_pool_operation_unit_code").split(",");                        
                        // oVPCombo.setSelectedKeys(sKey);

                            };

                        }.bind(this),
                       error: function () {}
                    });
            // };
        },
         
            /**
             * footer Edit 버튼 기능
             * Edit모드로 변경
             * @public
             */
            onPageEditButtonPress: function () {
                this._toEditMode();
                this.getView().getModel("DetailView").setProperty("/transaction_code","U");
                
            },

            /**
            * Edit모드일 때 설정 
            * @private
            */
            _toEditMode: function () {
                this.getModel("DetailView").setProperty("/isEditMode", true);                
                
            },

    });
});