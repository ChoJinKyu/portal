// @ts-ignore
sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/ui/core/Fragment",
    "ext/lib/model/TransactionManager",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/core/Item"

    // @ts-ignore
], function (BaseController, History, MessageBox, MessageToast, Filter, FilterOperator, FilterType, Sorter, JSONModel, ColumnListItem,
    Fragment, TransactionManager, Formatter, Validator, Multilingual, ManagedModel, ManagedListModel,
    Item
    ) {
    "use strict";


    var i18nModel; //i18n 모델
    return BaseController.extend("sp.se.supplierEvaluationSetupMgt.controller.One", {

        formatter: Formatter,
        validator: new Validator(),

        onInit: function () {

            var oView = this.getView();

            // I18N 모델 
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            i18nModel = this.getModel("I18N");

            //DetailView Model
            var oViewModel = new JSONModel();
            this.setModel(oViewModel, "DetailView");

            //this.setModel(oViewModel, "ManagerView");
            //this.getView().setModel(new JSONModel(),"supEvalSetupModel");
	        // this.getView().setModel("DetailView").setData({	           
               
            //     vendor_pool_operation_unit_code : [],
            //                     manager : {},
            //                     evaluationType1 : [],
            //                     evaluationType2 : [],
            //                     quantitative : []
            // });

            
            //MainView 넘어온 데이터 받기 -> DetailMatched
            var oOwnerComponent = this.getOwnerComponent();
            this.oRouter = oOwnerComponent.getRouter();
            this.oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

            // 로그인 세션 작업완료시 수정해야함!
            this.tenant_id = "L2100";
            this.company_code = "LGCKR";    
            this.language_cd ="KO"; 

            // 자주쓸것같은 Filter
            var aSearchFilters = [];                
                aSearchFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                aSearchFilters.push(new Filter("company_code", 'EQ', this.company_code));        
      
            // search filed init
            this.oSF = oView.byId("searchField");

        },

        /**
        * Manager Section 행 추가
        * @public
        **/            
        onManagerAdd : function(oEvent){
            var oView = this.getView().getModel("DetailView");            
            var oModel = oView.getProperty("/manager");
			oModel.unshift({
	           "tenant_id": this.tenant_id,
                "company_code": this.company_code,
                "org_type_code":  this.org_type_code,
                "org_code":this.org_code,
                "evaluation_operation_unit_code": "",
                "evaluation_op_unt_person_empno": "",
                "user_local_name": "",
                "department_local_name": "",
                "evaluation_execute_role_code": "",
                "crudFlg" : "I"
            });
           oView.setProperty("/manager",oModel);
                
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

        onManagerDelete : function(oEvent){

            var oTable = this.byId("managerTable"),                
                oView = this.getView(),
                oModel = this.getModel("DetailView"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            if (aItems.length > 0) {
                MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aItems.forEach(function(oItem){
                            aIndices.push(oModel.getProperty("/manager").indexOf(oItem.getBindingContext("DetailView").getObject()));
                        });
                        aIndices.sort().reverse();
                        //aIndices = aItems.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){     
                            oModel.getProperty("/manager").splice(nIndex,1);     
                        });

                        oModel.setProperty("/manager",oModel.getProperty("/manager"));
                        oView.byId("managerTable").removeSelections(true);                        

                        }
                        
                    }
                });

            } else {
                MessageBox.error("선택된 데이터가 없습니다.");
            }           

        },
        /**
        * Manager Section 행 삭제
        * @public
        */
        onUIManagerDelete : function(oEvent){

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

            var oTable = this.byId("managerTable"),                
                oView = this.getView(),
                oModel = this.getModel("DetailView"),  
                aItems = oTable.getSelectedIndices(),
                aIndices = [];

            var that = this;
            var sendData = {}, aInputData=[];

            sendData.inputData = aInputData;

            console.log("delPrList >>>>", aIndices);

            if (aItems.length > 0) {
                MessageBox.confirm(("삭제하시겠습니까?"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aIndices = aItems.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){     
                            oModel.getProperty("/manager").splice(nIndex,1);
                            
                        });

                            oModel.setProperty("/manager",oModel.getProperty("/manager"));
                       
                        oView.byId("managerTable").clearSelection();                        

                        } 
                        
                        
                    }
                });

            } else {
                MessageBox.error("선택된 데이터가 없습니다.");
            }
    
        },


        
        /**
        * quantitativeTable Section 행 추가
        * @public
        **/            
        onQunAdd : function(oEvent){
            var oView = this.getView().getModel("DetailView");            
            var oModel = oView.getProperty("/quantitative");
			oModel.unshift({
	           "tenant_id": this.tenant_id,
                "company_code": this.company_code,
                "org_type_code":  this.org_type_code,
                "org_code":this.org_code,  
                "evaluation_operation_unit_code": "",
                "qttive_item_code": "",
                "qttive_item_name": "",
                "qttive_item_uom_code": "",
                "qttive_item_measure_mode_code": "",
                "qttive_item_desc": "",
                "sort_sequence": "",
                "crudFlg":"I"
            });
           oView.setProperty("/quantitative",oModel);

            },

        onQunDelete : function(oEvent){

            var oTable = this.byId("quantitativeTable"),                
                oView = this.getView(),
                oModel = this.getModel("DetailView"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            if (aItems.length > 0) {
                MessageBox.confirm(i18nModel.getText("/NCM00003"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aItems.forEach(function(oItem){
                            aIndices.push(oModel.getProperty("/quantitative").indexOf(oItem.getBindingContext("DetailView").getObject()));
                        });
                        aIndices.sort().reverse();
                        //aIndices = aItems.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){     
                            oModel.getProperty("/quantitative").splice(nIndex,1);     
                        });

                        oModel.setProperty("/quantitative",oModel.getProperty("/quantitative"));
                        oView.byId("quantitativeTable").removeSelections(true);                        

                        }
                        
                    }
                });

            } else {
                MessageBox.error("선택된 데이터가 없습니다.");
            }           

        },

        /**
        * quantitativeTable Section 행 삭제
        * @public
        */
        onUIQunDelete : function(oEvent){

            var oTable = this.byId("quantitativeTable"),                
                oView = this.getView(),
                oModel = this.getModel("DetailView"),
                data = {},
                oSelected = [],
                delPrData = [],
                chkArr = [],
                chkRow = "",
                j=0,
               
                aItems = oTable.getSelectedIndices(),
                aIndices = [];

            var that = this;
            var sendData = {}, aInputData=[];

            sendData.inputData = aInputData;

            console.log("delPrList >>>>", aIndices);

            if (aItems.length > 0) {
                MessageBox.confirm(("삭제하시겠습니까?"), {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                       if (sButton === MessageBox.Action.OK) {
                        aIndices = aItems.sort(function(a, b){return b-a;});
                        aIndices.forEach(function(nIndex){     
                            oModel.getProperty("/quantitative").splice(nIndex,1);                      
                           
                        });

                            oModel.setProperty("/quantitative",oModel.getProperty("/quantitative"));
                       
                        oView.byId("quantitativeTable").clearSelection();                        

                        } else if (sButton === MessageBox.Action.CANCEL) { 

                        }; 
                        
                        
                    }
                });

            } else {
                MessageBox.error("선택된 데이터가 없습니다.");
            }           

        },

        
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
                this.oSF.suggest();
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
                    history.go(-1);
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
                                history.go(-1);
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
                
                    this.getRouter().navTo("two", {
                        scenario_number: "Detail",
                        tenant_id: tenant_id,
                        company_code: company_code,
                        org_code: org_code,
                        org_type_code: org_type_code,
                        evaluation_operation_unit_code : evaluation_operation_unit_code,
                        evaluation_type_code : evaluation_type_code
                    });

            },

             onCreateTwo: function (oEvent) { 

                    this.getRouter().navTo("two", {
                        scenario_number: "New",
                        tenant_id: this.tenant_id,
                        company_code: this.company_code,
                        org_code: this.org_code,
                        org_type_code: this.org_type_code,
                        evaluation_operation_unit_code : this.evaluation_operation_unit_code,
                        evaluation_type_code :" "
                    });
                    
                },

        /**
         * footer Cancel 버튼 기능
         * @public
         */
            onPageCancelEditButtonPress: function () {
            this.onNavToBack();
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
            this.byId("employeeDialog").data("inputWithEmployeeValueHelp",oEvent.getSource())
        },
         onEmployeeDialogApplyPress: function(oEvent){

            var oParameter = oEvent.getParameter("item");
            var oSelectedItem = this.byId("employeeDialog").data("inputWithEmployeeValueHelp");

            oSelectedItem.setValue(oParameter.user_local_name);

            // var employee_number = oParameter.employee_number;
            var department_local_name = oParameter.department_local_name;

            var oTableCon = oSelectedItem.getBindingContext("DetailView");

            oTableCon.getModel().setProperty(oTableCon.getPath()+"/department_local_name",department_local_name);

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
                
            this.getView().getModel("DetailView").setProperty("/",{
                vendor_pool_operation_unit_code : [],
                                manager : [],
                                evaluationType1 : [],
                                quantitative : []
                            });

            // oView.getModel().refresh(true);
            // oView.getModel("DetailView").refresh(true);
            oView.setBusy(true);

            this.scenario_number = oEvent.getParameter("arguments")["scenario_number"],
            this.tenant_id = oEvent.getParameter("arguments")["tenant_id"],
            this.company_code = oEvent.getParameter("arguments")["company_code"],            
            this.org_code = oEvent.getParameter("arguments")["org_code"];
            this.org_type_code = oEvent.getParameter("arguments")["org_type_code"];
            this.evaluation_operation_unit_code = oEvent.getParameter("arguments")["evaluation_operation_unit_code"];
            this.evaluation_operation_unit_name = oEvent.getParameter("arguments")["evaluation_operation_unit_name"],            
            this.use_flag = oEvent.getParameter("arguments")["use_flag"];                                     
                       
            // Create 버튼 눌렀을때
            if (this.scenario_number === "New") {
                this.getModel("DetailView").setProperty("/isEditMode", true);
                this.getModel("DetailView").setProperty("/isCreateMode", true);

            } else { // Detail 일때
                this.getModel("DetailView").setProperty("/isEditMode", false);
                this.getModel("DetailView").setProperty("/isCreateMode", false);              

 
                // 키값 파라미터가 모두있고 단건일때 이렇게도 쓰인다.
                // var s = oView.getModel().crateKey("/OpUnitView",{
                //     tenant_id : this.tenant_id,
                //     ...
                // })

                // 키값 이외에 임의의 필터를 줄때                
                var OpUnitViewFilters = [];      
                OpUnitViewFilters.push(new Filter("language_cd", 'EQ', this.language_cd));
                OpUnitViewFilters.push(new Filter("tenant_id", 'EQ', this.tenant_id));
                OpUnitViewFilters.push(new Filter("company_code", 'EQ', this.company_code));     
                OpUnitViewFilters.push(new Filter("org_type_code", 'EQ', this.org_type_code));
                OpUnitViewFilters.push(new Filter("org_code", 'EQ', this.org_code));     
                OpUnitViewFilters.push(new Filter("evaluation_operation_unit_code", 'EQ', this.evaluation_operation_unit_code));

                if(!this.getModel("DetailView").getProperty("/isEditMode")){
                oView.getModel().read("/OpUnitView", {
                    filters: OpUnitViewFilters,
                    success: function (oData) {
                        // 단건이면 oData가 Object , 다건이면 Array -> oData.value or oData.results[i].value
                        // filter하면 array

                        if(oData.results[0]!=null){
                        var oValues = oData.results[0];
                        var oOperationUnit2 =  this.getModel("DetailView");
                        
                        //운영단위코드 evaluation_operation_unit_code
                        oOperationUnit2.setProperty("/evaluation_operation_unit_code", oValues.evaluation_operation_unit_code);

                        //운영단위명 evaluation_operation_unit_name
                        oOperationUnit2.setProperty("/evaluation_operation_unit_name", oValues.evaluation_operation_unit_name);

                        //배점설계여부 distrb_score_eng_flag
                        oOperationUnit2.setProperty("/distrb_score_eng_flag", oValues.distrb_score_eng_flag);

                        //발의품의여부 evaluation_request_approval_flag
                        oOperationUnit2.setProperty("/evaluation_request_approval_flag", oValues.evaluation_request_approval_flag);
                        
                        //운영전략수립여부 operation_plan_flag
                        oOperationUnit2.setProperty("/operation_plan_flag", oValues.operation_plan_flag);

                        //사용여부 use_flag
                        oOperationUnit2.setProperty("/use_flag", oValues.use_flag);  
                    
                        //평가대상 V/P레벨 eval_apply_vendor_pool_lvl_no
                        oOperationUnit2.setProperty("/eval_apply_vendor_pool_lvl_no", oValues.eval_apply_vendor_pool_lvl_no);

                        // V/P운영단위 vendor_pool_operation_unit_code 
                        oOperationUnit2.setProperty("/vendor_pool_operation_unit_code", oValues.vendor_pool_operation_unit_code);
                        
                        var oVPCombo = this.byId("searchMultiComboCode");
                        var sKey = this.getModel("DetailView").getProperty("/vendor_pool_operation_unit_code").split(",");                        
                        // oVPCombo.setSelectedKeys(sKey);

                            
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

                        //$evaluationType1 table read

                        oView.getModel().read("/evalTypeListView", {
                        filters: oManagerListFilters,
                        success: function (oData) {
                                oView.getModel("DetailView").setProperty("/evaluationType1",oData.results);
                                

                            }.bind(this),
                            error: function () {

                             }
                          });

                        //$quantitative table read

                        oView.getModel().read("/QttiveItem", {
                        filters: oManagerListFilters,
                        success: function (oData) {
                                oView.getModel("DetailView").setProperty("/quantitative",oData.results);
                                

                            }.bind(this),
                            error: function () {

                             }
                          });                              
                             }
                        }.bind(this),
                    error: function () {
                    }

                   

                });

                }

             }
             
             oView.setBusy(false);
         },

         /**
             * footer Edit 버튼 기능
             * Edit모드로 변경
             * @public
             */
            onPageEditButtonPress: function () {
                this._toEditMode();
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