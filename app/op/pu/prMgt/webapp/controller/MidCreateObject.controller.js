sap.ui.define([
	"ext/lib/controller/BaseController",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
	"ext/lib/formatter/DateFormatter",
	"ext/lib/formatter/NumberFormatter",
    "ext/lib/control/ui/CodeValueHelp",
    "sap/ui/model/json/JSONModel", 
    "sap/ui/core/routing/History",
    "sap/ui/richtexteditor/RichTextEditor",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/core/Fragment",
    "sap/f/LayoutType",
    "sap/m/MessageBox",
    "sap/m/MessageToast", 
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device", // fileupload 
    "sap/ui/core/syncStyleClass" ,
    "sap/m/ColumnListItem", 
    "sap/m/Label",
    "cm/util/control/ui/EmployeeDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "dp/util/control/ui/MaterialOrgDialog",
    "op/util/control/ui/WbsDialog"
], function (BaseController, ManagedListModel, ManagedModel, Multilingual, Validator, DateFormatter, NumberFormatter, CodeValueHelp, 
            JSONModel, History, RichTextEditor, Filter, FilterOperator, Sorter,
            Fragment ,LayoutType, MessageBox, MessageToast,  UploadCollectionParameter, Device ,syncStyleClass, ColumnListItem, Label,
            EmployeeDialog, MaterialMasterDialog, MaterialOrgDialog, WbsDialog) {
            
    "use strict";
    
    var sSelectedPath;
  
    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("op.pu.prMgt.controller.MidCreateObject", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,
        validator: new Validator(),
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () { 

			// var oViewModel = new JSONModel({
			// 		busy : true,
			// 		delay : 0
            //     });                
            // this.setModel(oViewModel, "midCreateObjectView");

            //this.setModel(new JSONModel(), "viewModel");


            // view에서 사용할 메인 Model
            this.setModel(new JSONModel(), "detailModel"); 
            this.setModel(new JSONModel(), "viewModel");       
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.getRouter().getRoute("midCreate").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("midModify").attachPatternMatched(this._onObjectMatched, this);

            // 텍스트 에디터
            //this._fnSetRichEditor();

            
            
            //this.getRouter().getRoute("midCreate").attachPatternMatched(this._onObjectMatched, this);
            //this.getView().setModel(new ManagedListModel(),"company");
            //this.getView().setModel(new ManagedListModel(),"plant");
            //this.getView().setModel(new ManagedListModel(),"createlist"); // Participating Supplier
            //this.getView().setModel(new ManagedListModel(),"appList"); // apporval list 
            //this.getView().setModel(new JSONModel(Device), "device"); // file upload 
        },
        
        onBeforeRendering : function(){            
        },

        onAfterRendering: function () {
        },

        /**
		 * Binds the view to the data path.
		 */
		_onObjectMatched : function (oEvent) { 
            var oArgs = oEvent.getParameter("arguments");
                        
            if(oArgs.tenantId && oArgs.tenantId !== ""){
                this.tenantId = oArgs.tenantId;
            }else{
                this.tenantId = "L2100"
            } 

            if(oArgs.company_code && oArgs.company_code !== ""){
                this.company_code = oArgs.company_code;
            }else{
                this.company_code = "LGCKR"
            } 

            if(oArgs.pr_number && oArgs.pr_number !== ""){
                this.pr_number = oArgs.pr_number;
            }else{
                this.pr_number = "NEW"
            } 
            
            if(oArgs.vMode  && oArgs.vMode  !== ""){
                this.edit_mode = oArgs.vMode;
            }else{
                this.edit_mode = "NEW"
            }      

            // 초기 데이터 설정
            if(this.pr_number === "NEW") {
                this._fnSetCreateData(oArgs);
            }else{
                 this._fnReadPrMaster(oArgs);
                 this._fnReadPrDetail(oArgs);
            }
        },
        
        /**
         * View 항목 visible 세팅
         */
        // _fnSetVisible: function(){
        //     var that = this,
        //         oView = this.getView(),
        //         oServiceModel = this.getModel(),
        //         oViewModel = this.getModel('viewModel'),
        //         oContModel = this.getModel("contModel");
        //     var oPrMstData = oViewModel.getProperty("/PrMst");

        //     var oPrDtlVisible = {
        //         material_code: true,
        //         material_group_code: true,
        //         sloc_code: true
        //     };

        //     //구매유형 : 공사
        //     if(oPrMstData.pr_type_code_2 === "TC20003"){
        //         oPrDtlVisible.material_code = false;
        //         oPrDtlVisible.material_group_code = false;
        //         oPrDtlVisible.sloc_code = false;
        //     }

        //     oContModel.setProperty("/Pr_Dtl", oPrDtlVisible);
        // },

        /**
         * Edit Mode setting
         */
        _fnSetEditMode: function(){
            var that = this,
                oView = this.getView(),
                oViewModel = this.getModel('viewModel');
            var oPrMstData = oViewModel.getProperty("/PrMst");

            if(this.edit_mode === "NEW" || this.edit_mode === "COPY"){
                this.pr_number = "NEW";
                oPrMstData.pr_number = "NEW";
                oPrMstData.request_date = new Date();
                oViewModel.setProperty("/PrMst", oPrMstData);
            }
        },

        /**
         * 품의내용 폅집기 창 
         */
        _fnSetRichEditor : function (){ 
            var that = this,
                sHtmlValue = '';            
            var oApprovalLayout = this.getView().byId("approvalContentsTextEditor");
            var oApprovalRTE = oApprovalLayout.getContent()[0];

            if(!that.oApprovalRichTextEditor){
                sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                    function (RTE, EditorType) {
                        that.oApprovalRichTextEditor = new RTE("prCreateApprovalRTE", {
                            editorType: EditorType.TinyMCE4,
                            width: "100%",
                            height: "200px",
                            customToolbar: true,
                            showGroupFont: true,
                            showGroupLink: true,
                            showGroupInsert: true,
                            value: sHtmlValue,
                            ready: function () {
                                this.addButtonGroup("styleselect").addButtonGroup("table");
                            }
                        });
                        oApprovalLayout.addContent(that.oApprovalRichTextEditor);
                });
            } else {
                that.oApprovalRichTextEditor.setValue("");
            }                
        },

        /**
         * 구매요청 템플릿 리스트 조회
         */
        _fnGetPrTemplateList: function() {
            var that = this,
                oView = this.getView(),
                oServiceModel = this.getModel(),
                oViewModel = this.getModel('viewModel');
            var oPrMstData = oViewModel.getProperty("/PrMst");

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, oPrMstData.tenant_id),
                    new Filter("pr_type_code", FilterOperator.EQ, oPrMstData.pr_type_code),
                    new Filter("pr_type_code_2", FilterOperator.EQ, oPrMstData.pr_type_code_2),
                    new Filter("pr_type_code_3", FilterOperator.EQ, oPrMstData.pr_type_code_3)
                ];

            oServiceModel.read("/Pr_TMapView", {
                filters: aFilters,
                success: function (oData) {
                    oViewModel.setProperty("/prTemplateList", oData.results);

                    // PR 템플릿 정보 세텅
                    oData.results.some(function(oPrTemplateData){
                        if(oPrTemplateData.pr_template_number === oPrMstData.pr_template_number){
                            oPrMstData.pr_template_name =  oPrTemplateData.pr_template_name;
                            oPrMstData.pr_type_name =  oPrTemplateData.pr_type_name;
                            oPrMstData.pr_type_name_2 =  oPrTemplateData.pr_type_name_2;
                            oPrMstData.pr_type_name_3 =  oPrTemplateData.pr_type_name_3;
                            oPrMstData.pr_template_numbers = oPrTemplateData.pr_template_numbers;
                            if(!oPrTemplateData.pr_template_numbers) {
                                oPrMstData.pr_template_numbers = oPrTemplateData.pr_template_numbers1;
                            }
                            oViewModel.setProperty("/PrMst",oPrMstData);
                            return true;
                        }
                    });

                    that._fnReadPrTemplateDetail();

                },
                error: function (oErrorData) {
                }
            });
        },

        /**
         * 템플릿상세정보 조회
         */
        _fnReadPrTemplateDetail: function(){
            var that = this,
                oView = this.getView(),
                oServiceModel = this.getModel(),
                oContModel = this.getModel('contModel'),
                oViewModel = this.getModel('viewModel');
            var oPrMstData = oViewModel.getProperty("/PrMst");  
                        
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oPrMstData.tenant_id));
            aFilters.push(new Filter("txn_type_code", FilterOperator.EQ, "CREATE"));
            aFilters.push(new Filter("use_flag", FilterOperator.EQ, true));

            // 조회 대상 PR 템플릿번호
            var aPrTemplateNumber=[];   
            if(oPrMstData.pr_template_numbers && oPrMstData.pr_template_numbers != ""){
                aPrTemplateNumber = oPrMstData.pr_template_numbers.split(",");
            }
            if(aPrTemplateNumber.length > 0){
                aPrTemplateNumber.forEach(function(item, idx){
                    aFilters.push(new Filter("pr_template_number", FilterOperator.EQ, item));
                });          
            }

            oServiceModel.read("/Pr_TDtl", {
                filters: aFilters,
                success: function (oData) {
                    // PR 템플릿 상세 정보
                    if(oData.results){
                        that._fnSetVisibleModel(oData.results);
                    }
                },
                error: function (oErrorData) {
                }
            });
        },

        /**
         * Template 항목 Visible model 세팅
         */
        _fnSetVisibleModel: function(oTemplateData) {
            var that = this,
                oView = this.getView(),
                oContModel = this.getModel('contModel');

            var oContDisplayFlag={};

            oTemplateData.forEach(function(item, idx){
                var oTableName = item.table_name;
                var oColumnName = item.column_name;
                var oSetFlagData = {
                    "display_column_flag" : item.display_column_flag,
                    "hide_column_flag" : item.hide_column_flag,
                    "input_column_flag" : item.input_column_flag,
                    "mandatory_column_flag" : item.mandatory_column_flag
                };
                
                if(!oContDisplayFlag[oTableName]){
                    oContDisplayFlag[oTableName] = {};
                }
                oContDisplayFlag[oTableName][oColumnName] = oSetFlagData;
            });
            oContModel.setProperty("/DisplayFlag", oContDisplayFlag);

            //var oMATERIAL_CODEdisplay_column_flag = oContModel.getProperty("/DisplayFlag/OP_PU_PR_DTL/MATERIAL_CODE/display_column_flag");
            //console.log("DisplayFlag/OP_PU_PR_DTL/MATERIAL_CODE/display_column_flag > " + oMATERIAL_CODEdisplay_column_flag);
        },

        /**
         * 신규 생성 시 초기 데이터 세팅  
         */
        _fnSetCreateData : function(oArgs){
            var oToday = new Date();
            var oViewModel = this.getModel('viewModel');
                        
            var oNewMasterData = {
                tenant_id: this.tenantId,
                company_code: this.company_code,
                pr_number: "NEW",
                pr_type_code: oArgs.pr_type_code,
                pr_type_code_2: oArgs.pr_type_code_2,
                pr_type_code_3: oArgs.pr_type_code_3,
                pr_template_number: oArgs.pr_template_number,
                pr_create_system_code: "TEST",
                requestor_empno: "A60264",
                requestor_name: "김구매",
                requestor_department_code: "10010",
                requestor_department_name: "생산1팀",
                request_date: oToday,
                pr_create_status_code: "10",
                pr_header_text: "구매요청",
                approval_flag: false,
                approval_number: "",
                approval_contents: "",
                erp_interface_flag: false,
                erp_pr_type_code: "",
                erp_pr_number: "",
                pr_template_name: "",
                pr_type_name: "",
                pr_type_name_2: "",
                pr_type_name_3: "",
                pr_desc: "",
                update_user_id: "A60264"
            };

            oViewModel.setProperty("/PrMst", oNewMasterData);
            oViewModel.setProperty("/Pr_Dtl", []);

            // 템플릿 리스트 조회
            this._fnGetPrTemplateList();

            // 템플릿번호 리스트 조회
            //this._fnGetPrTemplateNumbers();

            // 항목 Visible setting
            //this._fnSetVisible();
        },

        _fnReadPrMaster : function(oArgs){
            var that = this;
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oArgs.tenantId));
            aFilters.push(new Filter("company_code", FilterOperator.EQ, oArgs.company_code));
            aFilters.push(new Filter("pr_number", FilterOperator.EQ, oArgs.pr_number));


            var aSorter = [];
            aSorter.push(new Sorter("pr_number", false));

            var oViewModel = this.getModel('viewModel');
            var oServiceModel = this.getModel();
            oServiceModel.read("/Pr_MstView",{
                filters : aFilters,
                sorters : aSorter,
                success : function(data){
                    if(data.results.length > 0) {
                        oViewModel.setProperty("/PrMst", data.results[0]);

                        // 품의내용
                        // if(that.oApprovalRichTextEditor){
                        //     var approval_contents = data.results[0].approval_contents;
                        //     that.oApprovalRichTextEditor.setValue(approval_contents);
                        // }

                         // 템플릿 리스트 조회
                        that._fnGetPrTemplateList();

                        // 템플릿번호 리스트 조회
                        //that._fnGetPrTemplateNumbers();

                        // 항목 Visible setting
                        //that._fnSetVisible();

                        // 화면 Edit Mode setting
                        that._fnSetEditMode();
                    }
                },
                error : function(data){
                    MessageToast.show("Pr_MstView read failed.");
                }
            });
        },

        _fnReadPrDetail : function(oArgs){
            var that = this,
                oServiceModel = this.getModel(),
                oViewModel = this.getModel('viewModel');
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oArgs.tenantId));
            aFilters.push(new Filter("company_code", FilterOperator.EQ, oArgs.company_code));
            aFilters.push(new Filter("pr_number", FilterOperator.EQ, oArgs.pr_number));
 
            var aSorter = [];
            aSorter.push(new Sorter("pr_item_number", false));

            var sExpand  = "accounts,services";
            
            oServiceModel.read("/Pr_Dtl",{
                filters : aFilters,
                sorters : aSorter,
                urlParameters : { "$expand" : sExpand }, 
                success : function(data){
                    if(data.results.length > 0) {
                        oViewModel.setProperty("/Pr_Dtl", data.results);
                    } else {
                        oViewModel.setProperty("/Pr_Dtl", []);
                    }
                    var checkdata = oViewModel.getProperty("/Pr_Dtl");

                    var oAccounts={}, oServices={};
                    var aPrDtlData = oViewModel.getProperty("/Pr_Dtl");
                    if(aPrDtlData && aPrDtlData.length > 0){
                        aPrDtlData.forEach(function(item, idx){
                            if(item.accounts.results && item.accounts.results.length > 0) {
                                //item.accounts = item.accounts.results[0]; //==> service.cds, handler를 다 바꿔야해서 보류함 
                                item.account_code = item.accounts.results[0].account_code;
                                item.cctr_code = item.accounts.results[0].cctr_code;                                
                                item.wbs_code = item.accounts.results[0].wbs_code;
                                item.asset_number = item.accounts.results[0].asset_number;
                                item.order_number = item.accounts.results[0].order_number;
                            }
                        });
                        console.log("");
                    }
                },
                error : function(data){
                    MessageToast.show("Pr_Dtl read failed.");
                }
            });
        },

        /**
         * 품목 라인 추가
         */
        onItemAddRow: function () {
            var oViewModel = this.getModel("viewModel"),
                aDetails = oViewModel.getProperty("/Pr_Dtl"),
                oToday = new Date();

            // 품목번호
            var prItemNumber = 1;
            if(aDetails) {
                prItemNumber = aDetails.length + 1
            }

            // 품목데이터 생성
            var oItem = {
                tenant_id: this.tenantId,
                company_code: this.company_code,
                pr_number: this.pr_number,
                pr_item_number: prItemNumber+""
            }
            var oNewData = this._fnSetPrDetailData(oItem);
            
            aDetails.push(oNewData);
            oViewModel.refresh();

            this.validator.clearValueState(this.byId("pritemTable"));
			this.byId("pritemTable").clearSelection();
        },

        /**
         * 품목 삭제
         */
        onItemDeleteRow: function(){
            var that = this,
                oView = this.getView(),
                oViewModel = this.getModel("viewModel"),
                aDetails = oViewModel.getProperty("/Pr_Dtl"),
                oPritemTable = oView.byId("pritemTable");

            var aSelectedIndex = oPritemTable.getSelectedIndices();
            if(aSelectedIndex.length > 0){
                aSelectedIndex.reverse();
                aSelectedIndex.forEach(function(item, idx){
                    aDetails.splice(item, 1);
                });

                //품목번호 reset
                aDetails.forEach(function(oItem, idx){
                    oItem.pr_item_number = idx+1;
                });
                oViewModel.setProperty("/Pr_Dtl", aDetails);
            }
            oPritemTable.clearSelection();
        },

        /**
         * 품목 복사
         */
        onItemCopyRow: function(){
            var that = this,
                oView = this.getView(),
                oViewModel = this.getModel("viewModel"),
                aDetails = oViewModel.getProperty("/Pr_Dtl"),
                oPritemTable = oView.byId("pritemTable");
            
            var aSelectedIndex = oPritemTable.getSelectedIndices();
            if(aSelectedIndex.length > 0){
                aSelectedIndex.forEach(function(item, idx){
                    var oNewData = that._fnSetPrDetailData(aDetails[item]);
                    aDetails.push(oNewData);
                });

                //품목번호 reset
                aDetails.forEach(function(oItem, idx){
                    oItem.pr_item_number = idx+1;
                });
                oViewModel.setProperty("/Pr_Dtl", aDetails);
            }
            oPritemTable.clearSelection();
        },

        /**
		 * Save button press
		 * @public
		 */
        onSaveButtonPress: function(){
			var oView = this.getView(),
                that = this;
                
			// var	oMessageContents = this.byId("inputMessageContents");
			// if(!oMessageContents.getValue()) {
			// 	oMessageContents.setValueState(sap.ui.core.ValueState.Error);
			// 	return;
            // }

            if(this.validator.validate(this.byId("pageSectionMain")) !== true){
                MessageToast.show(this.getModel("I18N").getText("/NCM005"));
                return;
            }
            
			MessageBox.confirm("저장 하시겠습니까 ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        that._fnPrSave("SAVE");
					};
				}
			});
        },

		/**
		 * Draft Button press
		 * @public
		 */
        onDraftButtonPress: function(){
			var oView = this.getView(),
                that = this;
            var oPrItemTable = oView.byId("pritemTable");
            
            if(this.validator.validate(this.byId("pageSectionMain")) !== true){
                MessageToast.show(this.getModel("I18N").getText("/ECM01002"));
                return;
            }
           
            
            if(!this._fnTableValidator("pritemTable")){
                return false;
            }
            
			MessageBox.confirm("임시 저장 하시겠습니까 ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        that._fnPrSave("DRAFT");
					};
				}
			});
        },

        /**
         * sap.ui.table validator
         */
        _fnTableValidator: function(tableId){
            var oView = this.getView(),
                that = this;
            var oTable = oView.byId(tableId);

            var oViewModel = this.getModel("viewModel");
            var oViewData = $.extend(true, {}, oViewModel.getData());

            var bReturn=true;
            var aViewDataPrDtl = oViewData.Pr_Dtl;
            if(aViewDataPrDtl.length > 0){
                //aViewDataPrDtl.forEach(function(item, idx){
                aViewDataPrDtl.some(function(item, idx){
                    if(item["org_code"] === null || item["org_code"] === ""){
                        var msg = that.getModel("I18N").getText("/ECM01002");
                        msg += "\r\n(" + (idx+1) + "번째 열의" + that.getModel("I18N").getText("/ORG_CODE") + ")";
                        MessageToast.show(msg);
                        bReturn = false;
                        return bReturn;
                    }
                    if(item["pr_desc"] === null || item["pr_desc"] === ""){
                        var msg = that.getModel("I18N").getText("/ECM01002");
                        msg += "\r\n(" + (idx+1) + "번째 열의" + that.getModel("I18N").getText("/PR_ITEM_NAME") + ")";
                        MessageToast.show(msg);
                        bReturn = false;
                        return bReturn;
                    }
                    if(item["price_unit"] !== null && item["price_unit"] !== "" && item["price_unit"] > 10000){
                        var msg = that.getModel("I18N").getText("/LIMIT_EXCEEDED");
                        msg += "\r\n(" + (idx+1) + "번째 열의" + that.getModel("I18N").getText("/PRICE_UNIT") + ")";
                        MessageToast.show(msg);
                        bReturn = false;
                        return bReturn;
                    }

                    console.log("item : " + item.key + " : " + item.value);
                    for(var key in item){
                        console.log("item : " + key.toUpperCase() + " : " + item[key]);                        
                    }
                });
            }

            return bReturn;


            // var aColumns = oTable.getColumns();
            // aColumns.forEach(function(oCol, idx){
            //     var sLabelText = oCol.getLabel().getText();
            //     console.log("sLabelText : " + sLabelText);

            //     var oControl = oCol.getTemplate();

            //     if(oControl){
            //         if(that.validator.validate(oControl) !== true){
            //             MessageToast.show(that.getModel("I18N").getText("/NCM005"));
            //             return;
            //         }
            //     }

            //     // if(oControl && oControl.getProperty("required")){
            //     //     if(this.validator.validate(oControl) !== true){
            //     //         MessageToast.show(this.getModel("I18N").getText("/NCM005"));
            //     //         return;
            //     //     }
            //     // }
                
            // });

        },


        
        /**
         * 구매요청 저장
         */
        _fnPrSave: function(pSaveFlag){
            var oView = this.getView();
            var that = this;
            //var oDetailModel = this.getModel("detailModel");
            //var oData = $.extend(true, {}, oDetailModel.getData());
            
            var oViewModel = this.getModel("viewModel");
            var oViewData = $.extend(true, {}, oViewModel.getData());

            if(pSaveFlag === "SAVE"){
                oViewData.PrMst.pr_create_status_code = "50";
            }else{
                oViewData.PrMst.pr_create_status_code = "10";
            }

            //대표품목명
            var pr_desc = "";
            var prDtlCnt = oViewData.Pr_Dtl.length;
            if(prDtlCnt > 0){
                if(prDtlCnt === 1){
                    pr_desc = oViewData.Pr_Dtl[0].pr_desc;
                }else{
                    pr_desc = oViewData.Pr_Dtl[0].pr_desc + ' 외 ' + (prDtlCnt-1) + "건";
                }
            }
            oViewData.PrMst.pr_desc = pr_desc;
                        
            //품의내용
            //var approvalContents = oView.byId("approvalLayout").getContent()[0].getValue();
            //oViewData.PrMst.approval_contents = approvalContents;
                

            // Master data
            var oMaster = oViewData.PrMst;

            //구매요청일
            var dateY, dateM, dateD, sRrequestDate;
            if(oMaster.request_date && oMaster.request_date != ""){
                        dateY = oMaster.request_date.getFullYear();
                        dateM = oMaster.request_date.getMonth() + 1;
                        dateD = oMaster.request_date.getDate();
                        sRrequestDate = dateY + "-" + (dateM >= 10 ? dateM : "0"+dateM) + "-" + (dateD >= 10 ? dateD : "0"+dateD);
            }else{
                sRrequestDate = "";
            }

            var oMasterData = {
                tenant_id: oMaster.tenant_id,
                company_code: oMaster.company_code,
                pr_number: oMaster.pr_number,
                pr_type_code: oMaster.pr_type_code,
                pr_type_code_2: oMaster.pr_type_code_2,
                pr_type_code_3: oMaster.pr_type_code_3,
                pr_template_number:oMaster.pr_template_number,
                pr_create_system_code: oMaster.pr_create_system_code,
                requestor_empno: oMaster.requestor_empno,
                requestor_name: oMaster.requestor_name,
                requestor_department_code: oMaster.requestor_department_code,
                requestor_department_name: oMaster.requestor_department_name,
                request_date: sRrequestDate,
                pr_create_status_code: oMaster.pr_create_status_code,
                pr_header_text: oMaster.pr_header_text,
                approval_flag: false,
                approval_number:oMaster.approval_number,
                approval_contents: oMaster.approval_contents,
                erp_interface_flag: false,
                erp_pr_type_code: oMaster.erp_pr_type_code,
                erp_pr_number: oMaster.erp_pr_number,
                pr_template_name: oMaster.pr_template_name,
                pr_type_name: oMaster.pr_type_name,
                pr_type_name_2: oMaster.pr_type_name_2,
                pr_type_name_3: oMaster.pr_type_name_3,
                pr_desc: oMaster.pr_desc,
                update_user_id: "A60264",
                details: []
            };

            // Detail data
            var drdateY, drdateM, drdateD, delivery_request_date;
            var aDetails = [];
            var aViewDataPrDtl = oViewData.Pr_Dtl;
            if(aViewDataPrDtl.length > 0){
                aViewDataPrDtl.forEach(function(item, idx){ 
                    var oDetailData = that._fnSetPrDetailData(item);
                    aDetails.push(oDetailData);
                });
            }
            oMasterData.details = aDetails;


            // 전송 데이터 세팅
            var sendData = {}, aInputData=[];
            //aInputData.push(oMasterData);
            //sendData.inputData = aInputData;
            sendData.inputData = oMasterData;


            // Call ajax
            that._fnCallAjax(
                sendData,
                "op.PrCreateV4Service",
                "SavePrCreateProc",
                function(result){
                    oView.setBusy(false);
                    if(result && result.value && result.value.length > 0 && result.value[0].return_code === "0000") {
                        that._fnNavigationMainPage();
                    }
                }
            );
        },
        
        /**
         * Ajax 호출 함수
         */
        _fnCallAjax: function (sendData, serviceName, targetName , callback) {            
            var that = this;            
            var url = "/op/pu/prMgt/webapp/srv-api/odata/v4/" + serviceName + "/" + targetName;

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(sendData),
                contentType: "application/json",
                success: function (result){                     
                    if(result && result.value && result.value.length > 0) {
                        if(result.value[0].return_code === "0000") {
                            MessageToast.show(that.getModel("I18N").getText("/" + result.value[0].return_code));
                        }
                        MessageToast.show(result.value[0].return_msg);                        
                    }
                    callback(result);
                },
                error: function(e){
                    MessageToast.show("Call ajax failed");
                    callback(e);
                }
            });
        },

        /**
         * 품목정보 세팅
         */
        _fnSetPrDetailData: function(item){
            // 납품요청일
            var drdateY, drdateM, drdateD, delivery_request_date;
            if(item.delivery_request_date && item.delivery_request_date != ""){
                drdateY = item.delivery_request_date.getFullYear();
                drdateM = item.delivery_request_date.getMonth() + 1;
                drdateD = item.delivery_request_date.getDate();
                delivery_request_date = drdateY + "-" + (drdateM >= 10 ? drdateM : "0"+drdateM) + "-" + (drdateD >= 10 ? drdateD : "0"+drdateD);
            }else{
                delivery_request_date = "";
            }

            var oPrDetailData = {
                        tenant_id           : item.tenant_id,
                        company_code        : item.company_code,
                        pr_number           : item.pr_number,
                        pr_item_number      : (item.pr_item_number) ? item.pr_item_number +"" : "",
                        org_type_code       : (item.org_type_code) ? item.org_type_code : "",
                        org_code            : (item.org_code) ? item.org_code : "", 
                        buyer_empno         : (item.buyer_empno) ? item.buyer_empno : "",
                        currency_code       : (item.currency_code) ? item.currency_code : "KRW",
                        estimated_price     : (item.estimated_price) ? item.estimated_price+"" : "", 
                        material_code       : (item.material_code) ? item.material_code : "",
                        material_group_code : (item.material_group_code) ? item.material_group_code : "",
                        pr_desc             : (item.pr_desc) ? item.pr_desc : "",                        
                        pr_quantity         : (item.pr_quantity) ? item.pr_quantity : "",
                        pr_unit             : (item.pr_unit) ? item.pr_unit : "",
                        requestor_empno     : (item.requestor_empno) ? item.requestor_empno : "A60264",
                        requestor_name      : (item.requestor_name) ? item.requestor_name : "김구매",
                        delivery_request_date: delivery_request_date,
                        purchasing_group_code: (item.purchasing_group_code) ? item.purchasing_group_code : "",
                        price_unit          : (!item.price_unit || item.price_unit === "") ? null : item.price_unit+"",
                        pr_progress_status_code: (item.pr_progress_status_code && item.pr_progress_status_code != "") ? item.pr_progress_status_code : "10",
                        remark              : (item.remark) ? item.remark : "",
                        sloc_code           : (item.sloc_code) ? item.sloc_code : "",
                        supplier_code       : (item.supplier_code) ? item.supplier_code : "",
                        item_category_code  : (item.item_category_code) ? item.item_category_code : "",
                        account_assignment_category_code : (item.account_assignment_category_code) ? item.account_assignment_category_code : "",
                        account_code        : (item.account_code) ? item.account_code : "",
                        cctr_code           : (item.cctr_code) ? item.cctr_code : "",
                        wbs_code            : (item.wbs_code) ? item.wbs_code : "",
                        asset_number        : (item.asset_number) ? item.asset_number : "",
                        order_number        : (item.order_number) ? item.order_number : ""
            }
            return oPrDetailData;
        },


         /**
         * List 화면으로 이동
         */
        _fnNavigationMainPage: function(){
            var sLayout = LayoutType.OneColumn;
            this.getRouter().navTo("mainPage", {layout: sLayout});
            
            this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
        },
                
        /**
         * 이전 화면으로 이동
         */
        onNavigationBackPress: function () {
            this._fnNavigationMainPage();
		},
        
        /**
         * Fotter : Cancel 버튼 클릭
         */
        onCancelButtonPress: function () {
            this._fnNavigationMainPage();
        },
        
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            var sFragmentName = oEvent.getSource().data("fragmentName");
            this[sFragmentName].then(function(oDialog) {
                oDialog.close();
            });
        },

        //==================== Material Code Dialog 시작 ====================        
        /**
         * 자재정보 검색 MaterialDialog.fragment open
         */
		onOpenMaterialDialog: function (oEvent) {
            sSelectedPath = oEvent.getSource().getBindingContext("viewModel").getPath();
            var that = this;
                //oViewModel = this.getModel("viewModel");
            //var oSelectedData = oViewModel.getProperty(sSelectedPath);


            if(!this.oSearchMultiMaterialMasterDialog){
                //this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                this.oSearchMultiMaterialMasterDialog = new MaterialOrgDialog({                
                    title: "Choose MaterialMaster",
                    multiSelection: false,
                    items: {
                        filters: [
                            //new Filter("tenant_id", FilterOperator.EQ, "L1100")
                            new Filter("tenant_id", FilterOperator.EQ, this.tenantId)                            
                        ]
                    }
                });
                this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent){
                    var oMaterialData = oEvent.getParameter("item");
                    var oViewModel = this.getModel("viewModel");
                    var oSelectedData = oViewModel.getProperty(sSelectedPath);

                    oSelectedData.org_code = (oMaterialData.org_code && oMaterialData.org_code !== "") ? oMaterialData.org_code:"";
                    oSelectedData.material_code = oMaterialData.material_code;
                    oSelectedData.pr_desc = (oMaterialData.material_desc && oMaterialData.material_desc !== "") ? oMaterialData.material_desc:"";
                    oSelectedData.pr_unit = (oMaterialData.base_uom_code && oMaterialData.base_uom_code !== "") ? oMaterialData.base_uom_code:"";
                    oSelectedData.buyer_empno = (oMaterialData.buyer_empno && oMaterialData.buyer_empno !== "") ? oMaterialData.buyer_empno:"";
                    oSelectedData.purchasing_group_code = (oMaterialData.purchasing_group_code && oMaterialData.purchasing_group_code !== "") ? oMaterialData.purchasing_group_code:"";                    
                    oSelectedData.material_group_code = oMaterialData.material_group_code; 

                    oViewModel.refresh();
                }.bind(that));
            }
            this.oSearchMultiMaterialMasterDialog.open();

            //var aTokens = this.byId("searchMultiMaterialMasterDialog").getTokens();
            //this.oSearchMultiMaterialMasterDialog.setTokens(aTokens);



            // var oSampleData = {
            //         "familyMaterialCode": [],
            //         "materialCode": [{"org_code": "A001", "material_code": "A001-01-01"},
            //                         {"org_code": "A002", "material_code": "A001-01-02"},
            //                         {"org_code": "A003", "material_code": "A001-01-03"},
            //                         {"org_code": "A004", "material_code": "A001-01-04"},
            //                         {"org_code": "A005", "material_code": "A001-01-05"},
            //                         {"org_code": "A005", "material_code": "A001-01-06"},
            //                         {"org_code": "A005", "material_code": "A001-01-07"},
            //                         {"org_code": "A005", "material_code": "A001-01-08"},
            //                         {"org_code": "A005", "material_code": "A001-01-09"},
            //                         {"org_code": "A005", "material_code": "A001-01-10"}]
            //         };
            // this.setModel(new JSONModel(oSampleData), "materialCodeModel");

           // oMarterialCodeModel.attachRequestCompleted(function(data) {
                // if (!this._oMaterialDialog) {
                //     this._oMaterialDialog = Fragment.load({
                //         id: oView.getId(),
                //         name: "op.pu.prMgt.view.MaterialDialog",
                //         controller: this
                //     }).then(function (oDialog) {
                //         oView.addDependent(oDialog);
                //         return oDialog;
                //     });
                // }
                // this._oMaterialDialog.then(function(oDialog) {
                //     oDialog.open();
                // });
            //}.bind(this));

            // this._oDialogTableSelect.then(function (oDialog) {
            //     oDialog.open();
            // });
        },
        
        /**
         * Material Code Dialog에서 Checkbox 선택 시
         */
        // onSelectMaterialCode: function (oEvent) {
        //     var oMaterialCodeModel = this.getModel("materialCodeModel");
        //     var oParameters = oEvent.getParameters();

        //     oMaterialCodeModel.setProperty(oParameters.listItems[0].getBindingContext("materialCodeModel").getPath()+"/checked", oParameters.selected);
        // },

        /**
         * Material Code 선택 후 apply
         */
        // onMaterialDetailApply: function (oEvent) {
        //     var aMaterialCode = this.getModel("materialCodeModel").getProperty("/materialCode");
        //     var oDetailModel = this.getModel("detailModel");
        //     var oSelectedDetail = oDetailModel.getProperty(sSelectedPath);
        //     var bChecked = false;

        //     for( var i=0; i<aMaterialCode.length; i++ ) {
        //         var oMaterialCode = aMaterialCode[i];

        //         if( oMaterialCode.checked ) {
        //             oSelectedDetail.material_code = oMaterialCode.material_code;

        //             delete oMaterialCode.checked;
        //             bChecked = true;

        //             break;
        //         }
        //     }

        //     // 선택된 Material Code가 있는지 경우
        //     if( bChecked ) {
        //         oDetailModel.refresh();
        //         this.onClose(oEvent);
        //     }
        //     // 선택된 Material Code가 없는 경우
        //     else {
        //         MessageBox.error("추가할 데이터를 선택해 주십시오.");
        //     }
        // },
        //==================== Material Code Dialog 끝 ====================
 
        //==================== WBS 검색 Dialog 시작 ====================  
		onOpenSearchWbsDialog: function (oEvent) {
            sSelectedPath = oEvent.getSource().getBindingContext("viewModel").getPath();
            var that = this;
            
            if(!this.oSearchWbsDialog){
                this.oSearchWbsDialog = new WbsDialog({
                    title: "Choose WBS Code"
                });
                this.oSearchWbsDialog.attachEvent("apply", function(oEvent){
                    var oItemData = oEvent.getParameter("item");
                    var oViewModel = that.getModel("viewModel");
                    var oSelectedData = oViewModel.getProperty(sSelectedPath);

                    if(oItemData.wbs_code && oItemData.wbs_code !== ""){
                        oSelectedData.wbs_code = oItemData.wbs_code;                    
                        oViewModel.refresh();
                    }                    
                }.bind(that));
            }
            this.oSearchWbsDialog.open();
        }, 

        //==================== 사원정보 검색 Dialog 시작 ====================  
		onOpenSearchEmpDialog: function (oEvent) {
            sSelectedPath = oEvent.getSource().getBindingContext("viewModel").getPath();
            var that = this;
                //oViewModel = this.getModel("viewModel");
            //var oSelectedData = oViewModel.getProperty(sSelectedPath);
            
            if(!this.oSearchEmpDialog){
                this.oSearchEmpDialog = new EmployeeDialog({
                    title: "Choose Employee"
                });
                this.oSearchEmpDialog.attachEvent("apply", function(oEvent){
                    var oItemData = oEvent.getParameter("item");
                    var oViewModel = that.getModel("viewModel");
                    var oSelectedData = oViewModel.getProperty(sSelectedPath);

                    if(oItemData.employee_number && oItemData.employee_number !== ""){
                        oSelectedData.buyer_empno = oItemData.employee_number;                    
                        oViewModel.refresh();
                    }
                    
                }.bind(that));
            }
            this.oSearchEmpDialog.open();
        }, 

        //==================== 단위(UOM) 검색 Dialog ====================
        onOpenUomDialog: function(oEvent){
            sSelectedPath = oEvent.getSource().getBindingContext("viewModel").getPath();
            var that = this;

            if(!this.oUomCodeValueHelp){
                this.oUomCodeValueHelp = new CodeValueHelp({
                    title: "Choose Uom",
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("group_code", FilterOperator.EQ, "CM_CHAIN_CD")
                        ],
                        sorters: [
                            new Sorter("sort_no", true)
                        ],
                        serviceName: "dp.util.MmService",
                        entityName: "Uom"
                    }
                });
                this.oUomCodeValueHelp.attachEvent("apply", function(oEvent){
                    var oViewModel = that.getModel("viewModel");
                    var oSelectedData = oViewModel.getProperty(sSelectedPath);
                    oSelectedData.buyer_empno = oEvent.getParameter("item").code;                    
                    oViewModel.refresh();
                }.bind(that));
            }
            this.oUomCodeValueHelp.open();
        },






		/* =========================================================== */
		/* event handlers                                              */
        /* =========================================================== */
		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the miainList route.
		 * @public
		 */
		//onPageNavBackButtonPress : function() {
		/*	var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("approvalList", {}, true);
			} */
		//},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},



		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function(){
			
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData : function(args){ 
           /** 초기 데이터 조회 */
            var company_code = 'LGEKR' , plant_code = 'CCZ' ;
            var appModel = this.getModel("beaCreateObjectView");
            appModel.setData({ company_code : company_code 
                                , company_name : "" 
                                , plant_code : plant_code 
                                , plant_name : "" 
                            }); 

            var oView = this.getView(),
				oModel = this.getModel("company");
	
			oModel.setTransactionModel(this.getModel("org"));
            
            var searchFilter = [];
            searchFilter.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            searchFilter.push(new Filter("company_code", FilterOperator.EQ, company_code));

            oModel.read("/Org_Company", {
                filters: searchFilter ,
				success: function(oData){ 
                   appModel.oData.company_name = oData.results[0].company_name
				}
            });
            
            var oView = this.getView(),
				oModel2 = this.getModel("plant");
                oModel2.setTransactionModel(this.getModel("org"));
            searchFilter = [];
            searchFilter.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            searchFilter.push(new Filter("plant_code", FilterOperator.EQ, plant_code));

            oModel2.read("/Org_Plant", {
                filters: searchFilter ,
				success: function(oData){   
                   appModel.oData.plant_name = oData.results[0].plant_name;
				}
            });
            console.log("oMasterModel >>> " , appModel );
        } ,

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("beaCreateObjectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("mainObjectNotFound");
				return;
			}
			oViewModel.setProperty("/busy", false);
        },
        /**
         * @description Participating Supplier 의 delete 버튼 누를시 
         */
        onPsDelRow : function(){
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;
            if(oSelected.length > 0){
                MessageBox.confirm("삭제 하시겠습니까?", {
                    title : "Comfirmation",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            oSelected.forEach(function (idx) {
                                psModel.markRemoved(idx)
                            });  
                        };
                    }.bind(this)
                });

                psTable.clearSelection();
            }else{
                 MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },
        /**
         * @description Participating Supplier 의 Supplier Select 버튼 누를시 나오는 팝업 
         *              , 테이블의 row 가 선택되어 있지 않으면 supplier 세팅 안됨 
         */
        onPsSupplier : function(){ 
            
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;

            if(oSelected.length > 0){
                    this._oSupplierDialog = sap.ui.xmlfragment("dp.bugetExecutionApproval.view.SuplierSelect", this);
                    
                    this.oSupplierModel = new JSONModel({
                        "cols": [  {
                                "label": "Supplier Code",
                                    "template": "org>company_code",
                                    "width": "25rem"
                                },
                                {
                                    "label": "Supplier Local Name",
                                    "template": "org>company_name"
                                }
                            ]
                    });
                    var path = 'org>/Org_Company';

                    this._oSupplierDialog.setTitle('Mold Item Selection');
                    this._oSupplierDialog.setKey('company_code');
                    this._oSupplierDialog.setDescriptionKey('company_name');
                    var aCols = this.oSupplierModel.getData().cols;
                    this.getView().addDependent(this._oSupplierDialog);

                    this._oSupplierDialog.getTableAsync().then(function (oTable) {
                        oTable.setModel(this.getOwnerComponent().getModel());
                        oTable.setModel(this.oSupplierModel, "columns");
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", path);
                        }
                        if (oTable.bindItems) {
                        
                            oTable.bindAggregation("items", path, function () { 
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) { 
                                        console.log(column);
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        
                        this._oSupplierDialog.update();
                    }.bind(this));

                //	this._oSupplierDialog.setTokens(this._oMultiInput.getTokens());
                    this._oSupplierDialog.open();
            }else{
                MessageBox.error("Participating Supplier 목록을 선택해주세요.");
            }
        },
	    onValueHelpOkPress: function (oEvent) { // row 에 데이터 세팅 
            var aTokens = oEvent.getParameter("tokens");
            var psTable = this.byId("psTable")
                , psModel = this.getModel("createlist") 
                , oSelected = psTable.getSelectedIndices()
            ;
            if(aTokens.length == 0){
                MessageBox.error("Supplier를 하나이상 선택해주세요.");
            }else{
                oSelected.forEach(function (idx) { 
                    psModel.getData().undefined[idx].moldSupplier1 = (aTokens[0] == undefined ?"":aTokens[0].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier2 = (aTokens[1] == undefined ?"":aTokens[1].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier3 = (aTokens[2] == undefined ?"":aTokens[2].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier4 = (aTokens[3] == undefined ?"":aTokens[3].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier5 = (aTokens[4] == undefined ?"":aTokens[4].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier6 = (aTokens[5] == undefined ?"":aTokens[5].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier7 = (aTokens[6] == undefined ?"":aTokens[6].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier8 = (aTokens[7] == undefined ?"":aTokens[7].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier9 = (aTokens[8] == undefined ?"":aTokens[8].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier10 = (aTokens[9] == undefined ?"":aTokens[9].mProperties.text);
                    
                });

                psTable.getModel("createlist").refresh(true); 
                this._oSupplierDialog.close();
            }
         
         console.log("psModel >>" , psModel);
		//	this._oMultiInput.setTokens(aTokens);	
		},
		onValueHelpCancelPress: function () {
			this._oSupplierDialog.close();
		},
		_oFragments: {},
        onCheck : function(){ console.log("onCheck") },
        
        /**
         * @description file upload 관련 
         * @date 2020-11-23
         * @param {*} oEvent 
         */
        onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			MessageToast.show("Event change triggered");
		},

		onFileDeleted: function(oEvent) {
			MessageToast.show("Event fileDeleted triggered");
		},

		onFilenameLengthExceed: function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},

		onFileSizeExceed: function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},

		onTypeMissmatch: function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},

		onStartUpload: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			var oTextArea = this.byId("TextArea");
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = cFiles + " file(s)";

			if (cFiles > 0) {
				oUploadCollection.upload();

				if (oTextArea.getValue().length === 0) {
					uploadInfo = uploadInfo + " without notes";
				} else {
					uploadInfo = uploadInfo + " with notes";
				}

				MessageToast.show("Method Upload is called (" + uploadInfo + ")");
				MessageBox.information("Uploaded " + uploadInfo);
				oTextArea.setValue("");
			}
		},

		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			setTimeout(function() {
				MessageToast.show("Event beforeUploadStarts triggered");
			}, 4000);
		},

		onUploadComplete: function(oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.byId("UploadCollection");

				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}

				// delay the success message in order to see other messages before
				MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);
		},

		onSelectChange: function(oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
        } ,
        /**
         * @description : Popup 창 : 품의서 Participating Supplier 항목의 Add 버튼 클릭
         */
        handleTableSelectDialogPress : function (oEvent) {
            console.group("handleTableSelectDialogPress");   
        
            var oView = this.getView();
            var oButton = oEvent.getSource();
			if (!this._oDialogTableSelect) {
				this._oDialogTableSelect = Fragment.load({ 
                    id: oView.getId(),
					name: "dp.budgetExecutionApproval.view.MoldItemSelection",
					controller: this
				}).then(function (oDialog) {
				    oView.addDependent(oDialog);
					return oDialog;
				}.bind(this));
            } 
            
            this._oDialogTableSelect.then(function(oDialog) { 
                oDialog.open();
			});
        },
        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
        },
         /**
         * @description  Participating Supplier Fragment Apply 버튼 클릭시 
         */
        onMoldItemSelectionApply : function(oEvent){
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){   
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , moldPartNo : oItem.getCells()[1].getText()
                });
                // console.log(" nItem >>>>> getText 1 " ,  oItem.getCells()[0].getText());   
                // console.log(" nItem >>>>> getText 2 " ,  oItem.getCells()[1].getText());   
                // console.log(" nItem >>>>> getText 3 " ,  oItem.getCells()[2].getText());   
                // console.log(" nItem >>>>> obj " ,  obj); 
                that._addPsTable(obj);  
                // oItem.getCells().forEach(function(nItem){ 
                //      console.log(" nItem >>>>> getText " , nItem.getText());    
                // });     
            });
            this.onExit();
        },
        /**
         * @description  Participating Supplier Fragment 몇개 선택 되어 있는지 표기 하기 위함
         */
        selectMoldItemChange : function(oEvent){ 
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems(); 
            var appInfoModel = this.getModel("pssaCreateObjectView");
            appInfoModel.setData({ moldItemLength : aItems == undefined ? 0 : aItems.length }); 
        },

        /**
         * @description participating row 추가 
         * @param {*} data 
         */
        _addPsTable : function (data){     
            var oTable = this.byId("psTable"),
                oModel = this.getModel("createlist");
                oModel.addRecord({
                    "model": data.oData.model,
                    "moldPartNo": data.oData.moldPartNo,
                    "moldSupplier1" : "",
                    "moldSupplier2" : "",
                    "moldSupplier3" : "",
                    "moldSupplier4" : "",
                    "moldSupplier5" : "",
                    "moldSupplier6" : "",
                    "moldSupplier7" : "",
                    "moldSupplier8" : "",
                    "moldSupplier9" : "",
                    "moldSupplier10" : "",
                });
        },

        /**
         * @description  // 파일 찾는 row 추가 (employee)
         */  
        _onLoadApprovalRow : function () {
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
                if(oModel.oData.undefined == undefined || oModel.oData.undefined == null){
                    oModel.addRecord({
                        "no": "1",
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true , 
                        "trashShow" : false 
                    });
                }
        } ,
        /**
         * @description employee 이벤트 1
         */        
        onSearch: function (event) {
			var oItem = event.getParameter("suggestionItem");
			this.handleEmployeeSelectDialogPress(event);
		},
       /**
         * @description employee 이벤트 2
         */ 
		onSuggest: function (event) {
			var sValue = event.getParameter("suggestValue"),
                aFilters = [];
                console.log("sValue>>> " , sValue ,"this.oSF>>" , this.oSF);
		},
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
           // this.byId("dialogEmployeeSelection").destroy();
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress : function (oEvent) {

            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
            var aItems = oTable.getItems();
            if(aItems[aItems.length-1].mAggregations.cells[1].mProperties.selectedKey == undefined 
                || aItems[aItems.length-1].mAggregations.cells[1].mProperties.selectedKey == ""){
                MessageToast.show("Type 을 먼저 선택해주세요.");
            }else{
                console.group("handleEmployeeSelectDialogPress");    
                var oView = this.getView();
                var oButton = oEvent.getSource();
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({ 
                        id: oView.getId(),
                        name: "dp.budgetExecutionApproval.view.Employee",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                } 
                
                this._oDialog.then(function(oDialog) {
                    oDialog.open();
                });
            }           
        },
        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply : function(){
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function(oItem){   
                var obj = new JSONModel({
                    model : oItem.getCells()[0].getText()
                    , moldPartNo : oItem.getCells()[1].getText()
                });
                that._approvalRowAdd(obj);
            });
            this.onExitEmployee();
        },

        /**
         * @description Approval Row에 add 하기 
         */
        _approvalRowAdd : function (obj){
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("appList"); 
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               //  console.log("oItem >>> " , oItem.mAggregations.cells[0].mProperties.text);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[1].mProperties.selectedKey);
               //  console.log("oItem >>> " , oItem.mAggregations.cells[2].mProperties.value);
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });

            this.getView().setModel(new ManagedListModel(),"appList"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            oModel = this.getModel("appList");
          //  console.log("oldItems >>> " , oldItems);

           /** 기존 데이터를 새로 담는 작업 */
            var noCnt = 1;
            for(var i = 0 ; i < oldItems.length-1 ; i++){ 
                if(oldItems.length > 1 && i == 0){ // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "no": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false ,
                        "trashShow" : true
                    });
                }else{
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "no": noCnt,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                }
                noCnt++;
            }

            /** 신규 데이터를 담는 작업 */
            oModel.addRecord({
                        "no": noCnt,
                        "type": oldItems[oldItems.length-1].type, // 마지막에 select 한 내용으로 담음 
                        "nameDept": obj.oData.moldPartNo,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": noCnt == 1? "":"sap-icon://arrow-top" , // 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교
                        "arrowDown": "" ,
                        "editMode": false ,
                        "trashShow" : true 
                    });
            /** 마지막 Search 하는 Row 담는 작업 */        
            noCnt++;       
            oModel.addRecord({
                        "no": noCnt,
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true ,
                        "trashShow" : false 
                    });
            
        } ,
        onSortUp : function(oParam){
           // console.log(" btn onSortUp >>> ", oParam);
      
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
            var actionData = {};
            var reciveData = {};

            for(var i = 0 ; i < oldItems.length -1 ; i++){
                if(oParam == oldItems[i].no){
                    actionData = {
                        "no": (Number(oldItems[i].no)-1) + "" ,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,   
                    };
                    reciveData = {
                        "no": (Number(oldItems[i-1].no)+1)+"" ,
                        "type": oldItems[i-1].type,
                        "nameDept": oldItems[i-1].nameDept,   
                    } 
                }
            }

            var nArray = [];
            for(var i = 0 ; i < oldItems.length-1 ; i++){
                if(oldItems[i].no == actionData.no ){
                    nArray.push(actionData);
                }else if( oldItems[i].no == reciveData.no){
                    nArray.push(reciveData);
                }else{
                    nArray.push(oldItems[i])
                }
            }  
            
            this.setApprovalData(nArray);
        } ,
        onSortDown : function(oParam){
            console.log(" btn onSortDown >>> ", oParam);
       
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function(oItem){ 
               var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                            "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                            "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
            var actionData = {};
            var reciveData = {};

            for(var i = 0 ; i < oldItems.length -1 ; i++){
                if(oParam == oldItems[i].no){
                    actionData = {
                        "no": (Number(oldItems[i].no)+1) + "" ,
                        "type": oldItems[i].type,
                        "nameDept": oldItems[i].nameDept,   
                    };
                    reciveData = {
                        "no": (Number(oldItems[i+1].no)-1)+"" ,
                        "type": oldItems[i+1].type,
                        "nameDept": oldItems[i+1].nameDept,   
                    } 
                }
            }

            var nArray = [];
            for(var i = 0 ; i < oldItems.length-1 ; i++){
                if(oldItems[i].no == actionData.no ){
                    nArray.push(actionData);
                }else if( oldItems[i].no == reciveData.no){
                    nArray.push(reciveData);
                }else{
                    nArray.push(oldItems[i])
                }
            }  
            
            this.setApprovalData(nArray);
        },
        setApprovalRemoveRow : function(oParam){ 
            var that = this;
            var oView = this.getView();
            MessageBox.confirm("Are you sure ?", { // 삭제라서 컨펌창 띄움 
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						console.log(" btn remove >>> ", oldItems);
                        var oTable = that.byId("ApprovalTable");
                        var aItems = oTable.getItems();
                        var oldItems = [];
                       
                        aItems.forEach(function(oItem){ 
                        var item = { "no" : oItem.mAggregations.cells[0].mProperties.text ,
                                        "type": oItem.mAggregations.cells[1].mProperties.selectedKey,
                                        "nameDept": oItem.mAggregations.cells[2].mProperties.value, } 
                            oldItems.push(item);
                        });
                        var nArray = [];
                        for(var i = 0 ; i < oldItems.length -1 ; i++){
                            if(oParam != oldItems[i].no){
                            nArray.push(oldItems[i]);
                            }
                        }
                        that.setApprovalData(nArray);
                        oView.setBusy(false);
                         MessageToast.show("Success to delete.");
					};
				}
			});
        }, 
        setApprovalData : function(dataList){ 
            console.log("dataList " , dataList);
            this.getView().setModel(new ManagedListModel(),"appList"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("appList");
            var noCnt = 1;
            for(var i = 0 ; i < dataList.length ; i++){ 
                if(dataList.length > 0 && i == 0){ // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false ,
                        "trashShow" : true
                    });
                }else if(i == dataList.length-1){
                    oModel.addRecord({ // 마지막 꺼는 밑으로 가는거 없음  
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                
                }else{
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "no": noCnt,
                        "type": dataList[i].type,
                        "nameDept": dataList[i].nameDept,
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "sap-icon://arrow-top" ,
                        "arrowDown": "sap-icon://arrow-bottom" ,
                        "editMode": false,
                        "trashShow" : true  
                    });
                }
                noCnt++;
            }

             /** 마지막 Search 하는 Row 담는 작업 */            
            oModel.addRecord({
                        "no": noCnt,
                        "type": "",
                        "nameDept": "",
                        "status": "",
                        "comment": "" ,
                        "arrowUp": "" ,
                        "arrowDown": "" ,
                        "editMode": true ,
                        "trashShow" : false 
                    });
        } , 

	    handleSelectionChangeReferrer: function(oEvent) { // Referrer 
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinishReferrer: function(oEvent) { // Referrer 
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});
		}

	});
});