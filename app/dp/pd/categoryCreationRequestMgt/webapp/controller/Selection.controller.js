sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/FilterType",
    "dp/util/control/ui/IdeaManagerDialog",
    "ext/lib/formatter/NumberFormatter"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel,FilterType,IdeaManagerDialog,NumberFormatter) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.Selection", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        loginUserName: new String,
        supplier_code: new String,
        supplier_local_name: new String,
        tenant_id: new String,
        statusGloCode: new String,
        supplierType: Boolean,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {

            //로그인 세션 작업완료시 수정
            this.loginUserId = "TestUser";
            this.loginUserName = "TestUser";
            this.tenant_id = "L2100";
            this.supplier_code = "KR01820500";
            this.supplier_local_name = "공급업체";
            this.supplierType = true;

            if(!this.supplierType){
                this.getView().byId('attachBlock').setVisible(true);
            }
            

            //법인 필터
            this.setCompanyFilter();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "details");
            this.setModel(new ManagedModel(), "supplierPerform");
            this.setModel(new JSONModel(), "midObjectViewModel");

			var oViewModel = new JSONModel({
                    showMode: true,                    
                    editMode: false
				});

            this.setModel(oViewModel, "viewModel");
            

            
            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();
        },

        /**
         * 세션에서 받은 tenant_id 로 필터 걸어주기
         */
        setCompanyFilter: function () {
            var oSelect, oBinding, aFilters;
            oSelect = this.getView().byId('ideaCompany');
            oBinding = oSelect.getBinding("items");
            aFilters = [];
            aFilters.push( new Filter("tenant_id", 'EQ', this.tenant_id) );
            //oBinding.filter(aFilters, FilterType.Application); 
        },
        

        _fnInitModel : function(){
            // console.log("_fnInitModel");
            
            var date = new Date();
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var toDate = year + "/" + month + "/" + day;
            var toDate2 = year + "-" + month + "-" + day;

            this.getView().byId("ideaDate").setText(toDate);
            

            var oViewModel = this.getView().getModel("master");
            oViewModel.setData({}, "/IdeaView");
            oViewModel.setData({
                "tenant_id": this._sTenantId,
                "company_code": this._sCompanyCode,
                "idea_number": "New",
				"idea_title": "",
                "idea_date": null,
				
				"idea_progress_status_code": "NEW",
				"idea_progress_status_name": "NEW",
                "supplier_code": this.supplier_code,
                "supplier_local_name": this.supplier_local_name,
                "idea_create_user_id": this.loginUserId,
				
				
                "idea_create_user_local_name": this.loginUserName,
				"bizunit_code": null,
				"bizunit_name": null,
				"idea_product_group_code": null,
				"idea_product_group_name": null,


				"idea_type_code": null,
				"idea_type_name": null,
				"idea_period_code": null,
				"idea_period_name": null,
				"idea_manager_empno": null,

				"idea_manager_local_name": null,
				"idea_part_desc": null,
				"current_proposal_contents": null,
				"change_proposal_contents": null,
				"idea_contents": null,

                "attch_group_number": null,                
				"material_code": null,
				"purchasing_uom_code": null,
				"currency_code": null,
                "vi_amount": null,
                
				"monthly_mtlmob_quantity": null,
				"monthly_purchasing_amount": null,
				"annual_purchasing_amount": null,
				"perform_contents": null

            }, "/IdeaView");
            var oViewModel2 = this.getView().getModel("details");
            oViewModel2.setData({}, "/SupplierIdea");
            oViewModel2.setData({
                "tenant_id": this._sTenantId,
                "company_code": this._sCompanyCode,
                "idea_number": "New",
                "supplier_code": this.supplier_code,
                "idea_progress_status_name": "NEW",
                "idea_create_user_id": this.loginUserId,
                "create_user_id": this.loginUserId,
                "update_user_id": this.loginUserId,
            }, "/SupplierIdea");
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sIdeaNumber = oArgs.ideaNumber;
            var oMasterModel = this.getModel("master");
            oMasterModel.setProperty("/IdeaView", {});
            var oDetailModel = this.getModel("details");
            oDetailModel.setProperty("/SupplierIdea", {});

            this.validator.clearValueState(this.byId("midObjectForm"));
            if (oArgs.ideaNumber == "new") {
                
                // console.log("###신규저장");
                this._fnInitModel();
                this._sTenantId = oArgs.tenantId;
                this._sCompanyCode = oArgs.companyCode;
                this._sIdeaNumber = "new";
                this._toEditMode();
                oView.byId("ideaCompany").setValue(this._sCompanyCode);
                oDetailModel.setTransactionModel(this.getModel());
            } else {
                // console.log("###수정");
                this.onSearch(oArgs.ideaNumber);
            }
        },

        

        

		/**
		 * 조회
		 * @public
		 */
        onSearch: function (idea_number) {
            var oView = this.getView();
            var sObjectPath = "/IdeaView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + idea_number + "')";
            var oMasterModel = this.getModel("master");
            var v_this = this;
            this.statusGloCode = "";

            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    oView.byId("ideaCompany").setValue(oData.company_code);
                    oView.setBusy(false);
                }
            });
            
            var sObjectPath2 = "/SupplierIdea(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + idea_number+ "')";
            var oDetailsModel = this.getModel("details");
            
            oView.setBusy(true);
            oDetailsModel.setTransactionModel(this.getModel());
            oDetailsModel.read(sObjectPath2, {
                success: function (oData) {
                    v_this.statusGloCode = oData.idea_progress_status_code;
                    v_this._toShowMode();
                    oView.setBusy(false);
                }
            });

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            
            var oView = this.getView(),
                oDetailsModel = this.getModel("details"),
                v_this = this;
            var oData = oDetailsModel.oData;
            var statsCode = "DRAFT";
            var CUType = "C";            
                var inputData = {
                    inputdata : {}
                };
            if (this._sIdeaNumber !== "new"){
                CUType = "U";
                /*
                    진행상태에 대한 정의가 필요 하며 정의에 따른 진행상태 셋팅 필요
                    idea_progress_status_code
                    업체에서 SUBMIT인 경우 정의 필요
                */
                if( flag == "D"){
                    if(!oDetailsModel.isChanged() ) {
                        MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                        return;
                    }
                    statsCode = "DRAFT";
                }else if( flag == "R"){
                    statsCode = "SUBMIT";
                }
            }
            if(oData.vi_amount==null){
                oData.vi_amount = "0";
            }
            if(oData.monthly_mtlmob_quantity==null){
                oData.monthly_mtlmob_quantity = "0";
            }
            if(oData.monthly_purchasing_amount==null){
                oData.monthly_purchasing_amount = "0";
            }
            if(oData.annual_purchasing_amount==null){
                oData.annual_purchasing_amount = "0";
            }

            inputData.inputdata = {
                tenant_id                            : oData.tenant_id                  ,
                company_code                         : oData.company_code               ,
                idea_number                          : oData.idea_number                ,
                idea_title                           : oData.idea_title                 ,
                idea_progress_status_code            : statsCode                         ,

                supplier_code                        : oData.supplier_code              ,
                idea_create_user_id                  : this.loginUserId                 ,
                bizunit_code                         : oData.bizunit_code               ,
                idea_product_group_code              : oData.idea_product_group_code    ,
                idea_type_code                       : oData.idea_type_code             ,

                idea_period_code                     : oData.idea_period_code           ,
                idea_manager_empno                   : oData.idea_manager_empno         ,
                idea_part_desc                       : oData.idea_part_desc             ,
                current_proposal_contents            : oData.current_proposal_contents  ,
                change_proposal_contents             : oData.change_proposal_contents   ,
                
                idea_contents                        : oData.idea_contents              ,
                attch_group_number                   : oData.attch_group_number         ,
                create_user_id                       : this.loginUserId                 ,
                update_user_id                       : this.loginUserId                 ,
                material_code                        : oData.material_code         ,
                
                purchasing_uom_code                  : oData.purchasing_uom_code         ,
                currency_code                        : oData.currency_code         ,
                vi_amount                            : oData.vi_amount         ,

                monthly_mtlmob_quantity              : oData.monthly_mtlmob_quantity         ,
                monthly_purchasing_amount            : oData.monthly_purchasing_amount         ,
                
                annual_purchasing_amount             : oData.annual_purchasing_amount         ,
                perform_contents                     : oData.perform_contents         ,
                crd_type_code                        : CUType
            }

            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.SupplierIdeaMgtV4Service/SaveIdeaProc";
            
            // console.log(inputData);
			oTransactionManager.setServiceModel(this.getModel());
			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        //oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(inputData),
                            contentType: "application/json",
                            success: function (rst) {
                                // console.log(rst);
                                if(rst.return_code =="S"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    if( flag == "D"){
                                        v_this.onSearch(rst.return_msg );
                                    }else if( flag == "R"){
                                        v_this.onPageNavBackButtonPress();
                                    }
                                }else{
                                    // console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                    // console.log("eeeeee");
                                    // console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                    v_this.onSearch(rst.return_msg );
                            }
                        });
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm"));

        },

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oData = oDetailsModel.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);
            this.byId("page").setProperty("showFooter", true);
            
            this.byId("pageNavBackButton").setVisible(true);
            if(this.statusGloCode =="DRAFT" || this.statusGloCode =="REQUEST REWRITING"){
                this.byId("pageEditButton").setEnabled(true);
            }else{
                this.byId("pageEditButton").setEnabled(false);
            }
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageListButton").setEnabled(true);
            this.byId("pageSubmitButton").setEnabled(false);
        },
        
        _toEditMode: function () {
            this.getView().getModel("viewModel").setProperty("/showMode", false);
            this.getView().getModel("viewModel").setProperty("/editMode", true);
            var oMasterModel = this.getModel("master")
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageNavBackButton").setVisible(false);
            this.byId("pageEditButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(true);
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("pageListButton").setEnabled(false);
            this.byId("pageSubmitButton").setEnabled(true);
        },

        

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageListButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            this.onPageNavBackButtonPress.call(this);
        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            if (this._sIdeaNumber !== "new"){
                this._toShowMode();
            }else{
                this.getRouter().navTo("mainPage", {}, true);
            }
        },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            var sPreviousHash = History.getInstance().getPreviousHash();
            this.getRouter().navTo("mainPage", {}, true);
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },


        processIconStr (obj , obj2){
            if(obj == obj2){
                if(obj = "아이디어"){
                    return "sap-icon://circle-task-2";
                }
            }
            return "";
        },


        
        /**
         * function : 아이디어 관리자 팝업 Call 함수
         * date : 2021/01/14
         */
        onIdeaManagerDialogPress : function(){
            
            if(!this.oSearchIdeaManagerDialog){
                this.oSearchIdeaManagerDialog = new IdeaManagerDialog({
                    title: this.getModel("I18N").getText("/SEARCH_IDEA_MANAGER"),
                    multiSelection: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.tenant_id)
                        ]
                    }
                });
                this.oSearchIdeaManagerDialog.attachEvent("apply", function(oEvent){ 
                    this.byId("ideaManager").setValue(oEvent.getParameter("item").idea_manager_name);
                    // this.byId("ideaManager").setValue(oEvent.getParameter("item").idea_manager_name+"("+oEvent.getParameter("item").idea_manager_empno+")");
                    this.byId("ideaManagerId").setValue(oEvent.getParameter("item").idea_manager_empno);
                    
                }.bind(this));
                }
            this.oSearchIdeaManagerDialog.open();

        },

        
        /**
         * 코드 체크
         */
        onNameChk : function(e) {
            // console.log(e);
            var oView = this.getView();
            var ideaManagerId = this.getView().byId("ideaManagerId");
            ideaManagerId.setValue("");
        }

    });
});