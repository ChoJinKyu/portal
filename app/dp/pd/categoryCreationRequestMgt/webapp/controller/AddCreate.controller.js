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
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/core/service/ODataV2ServiceProvider"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel,FilterType,IdeaManagerDialog,NumberFormatter,ODataV2ServiceProvider) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.AddCreate", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        loginUserName: new String,
        tenant_id: new String,

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
            this.viewType = false;


            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "PdPartCategory");
            this.setModel(new ManagedModel(), "pdPartCategoryLng");
            this.setModel(new ManagedModel(), "pdActivityStdDayView");

			var oViewModel = new JSONModel({
                    showMode: true,                    
                    editMode: false
				});

            this.setModel(oViewModel, "viewModel");
            

            
            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("PdPartCategory"));
            oTransactionManager.addDataModel(this.getModel("pdPartCategoryLng"));
            oTransactionManager.addDataModel(this.getModel("pdActivityStdDayView"));

            this.getRouter().getRoute("addCreatePage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();
            console.log(oArgs);
            this._sTenantId = oArgs.tenantId;
            this._sCategoryGroupCode = oArgs.categoryGroupCode;
            this._sRequestNumber = oArgs.requestNumber;
            this._sCategory_code = oArgs.categoryCode;


            //세션에서 받아서 넣어 주어야 함
            this._sLanguageCd = "KO";
            //테스트용
            this._sCategory_code = "PC2012300001";


            if( oArgs.categoryCode =="new"){
                this.viewType = false;
            }else{
                this.viewType = true;
            }
            var oMasterModel = this.getModel("master");
            oMasterModel.setProperty("/pdPartCategoryCreationRequestView", {});

            var oPdPartCategory = this.getModel("PdPartCategory");
            var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
            var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");

            
            this.validator.clearValueState(this.byId("midObjectForm"));
            this.onSearch(oArgs.requestNumber);
        },

        

        

		/**
		 * 조회
		 * @public
		 */
        onSearch: function (requestNumber) {
            var oView = this.getView();
            var sObjectPath = "/pdPartCategoryCreationRequestView(tenant_id='" + this._sTenantId + "',request_number='" + requestNumber + "',category_group_code='" + this._sCategoryGroupCode+ "')";
            var oMasterModel = this.getModel("master");
            var v_this = this;

            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    console.log("master");
                    console.log(oData);
                    oView.setBusy(false);
                }
            });
            
            if(!this.viewType){

                var oPdPartCategory = this.getModel("PdPartCategory");
                var oPdPartCategoryLng = this.getModel("pdPartCategoryLng");
                var oPdActivityStdDayView = this.getModel("pdActivityStdDayView");
                
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId ));
                aFilters.push(new Filter("category_group_code", FilterOperator.EQ, this._sCategoryGroupCode));
                aFilters.push(new Filter("category_code", FilterOperator.EQ, this._sCategory_code));

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/PdPartCategory", {
                    filters: aFilters,
                    success: function (oData) {
                        console.log("PdPartCategory");
                        console.log(oData);
                        //var oModel = new sap.ui.model.json.JSONModel(oData.results[0]);

                        this.getModel("PdPartCategory").setData(oData.results);
                    }.bind(this)
                });

        
                var aFilters2 = [];
                aFilters2.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId ));
                aFilters2.push(new Filter("category_group_code", FilterOperator.EQ, this._sCategoryGroupCode));
                aFilters2.push(new Filter("category_code", FilterOperator.EQ, this._sCategory_code));
                // aFilters2.push(new Filter("language_cd", FilterOperator.EQ, this._sLanguageCd));

                

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.PartCategoryService/").read("/pdPartCategoryLng", {
                    filters: aFilters2,
                    success: function (oData) {
                        console.log("pdPartCategoryLng");
                        console.log(oData);
                        this.getModel("pdPartCategoryLng").setData(oData.results);
                        
                    }.bind(this)
                });

                
        
                var aFilters3 = [];
                aFilters3.push(new Filter("tenant_id", FilterOperator.EQ, this._sTenantId ));
                aFilters3.push(new Filter("category_group_code", FilterOperator.EQ, this._sCategoryGroupCode));
                // aFilters3.push(new Filter("category_group_code", FilterOperator.EQ, this._sCategoryGroupCode));
                // aFilters3.push(new Filter("category_code", FilterOperator.EQ, this._sCategory_code));

                //test용
                aFilters3.push(new Filter("category_code", FilterOperator.EQ, "PC2012300007"));

                

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.activityStdDayService/").read("/pdActivityStdDayView", {
                    filters: aFilters3,
                    success: function (oData) {
                        console.log("pdActivityStdDayView");
                        console.log(oData);
                        this.getModel("pdActivityStdDayView").setData(oData.results);
                        
                    }.bind(this)
                });

            
                v_this._toShowMode();
            }
            

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
            if (this._sRequestNumber !== "new"){
                CUType = "U";
                /*
                    진행상태에 대한 정의가 필요 하며 정의에 따른 진행상태 셋팅 필요
                    idea_progress_status_code
                    업체에서 SUBMIT인 경우 정의 필요
                */
                if( flag == "T"){
                    if(!oDetailsModel.isChanged() ) {
                        MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                        return;
                    }
                    statsCode = "DRAFT";
                }else if( flag == "R"){
                    statsCode = "SUBMIT";
                }
            }if( flag == "D"){
                CUType = "D";
                statsCode = "DELETE";
            }
            if(oData.vi_amount=="" ||  oData.vi_amount==null || parseInt(oData.vi_amount) == undefined || parseInt(oData.vi_amount) == NaN){
                oData.vi_amount = "0";
            }
            if(oData.monthly_mtlmob_quantity=="" || oData.monthly_mtlmob_quantity==null || parseInt(oData.monthly_mtlmob_quantity) == undefined || parseInt(oData.monthly_mtlmob_quantity) == NaN){
                oData.monthly_mtlmob_quantity = "0";
            }
            if(oData.monthly_purchasing_amount=="" || oData.monthly_purchasing_amount==null || parseInt(oData.monthly_purchasing_amount) == undefined || parseInt(oData.monthly_purchasing_amount) == NaN){
                oData.monthly_purchasing_amount = "0";
            }
            if(oData.annual_purchasing_amount=="" || oData.annual_purchasing_amount==null || parseInt(oData.annual_purchasing_amount) == undefined || parseInt(oData.annual_purchasing_amount) == NaN){
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
                                    if( flag == "T"){
                                        v_this.onSearch(rst.return_msg );
                                    }else if( flag == "R"){
                                        v_this.onPageNavBackButtonPress();
                                    }else if( flag == "D"){
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
            var oPartCategoryService = this.getModel("partCategoryService");
            var oData = oPartCategoryService.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);
            this.byId("page").setProperty("showFooter", true);
            
            this.byId("pageNavBackButton").setVisible(true);
            this.byId("pageEditButton").setEnabled(true);
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(false);
            this.byId("pageListButton").setEnabled(true);
            this.byId("pageSubmitButton").setEnabled(false);
            this.byId("pageDeleteButton").setEnabled(false);
        },
        
        _toEditMode: function () {
            this.getView().getModel("viewModel").setProperty("/showMode", false);
            this.getView().getModel("viewModel").setProperty("/editMode", true);
            var oMasterModel = this.getModel("master")
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageNavBackButton").setVisible(false);
            this.byId("pageEditButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(true);
            if (this._sRequestNumber !== "new"){
                this.byId("pageDeleteButton").setEnabled(true);
            }
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
            if (this._sRequestNumber !== "new"){
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

        }




        , onMilestoneButtonPress: function (oEvent) {
            if(oEvent.getSource().getPressed() ){
                oEvent.getSource().setText("No");
            }else{
                oEvent.getSource().setText("Yes");
            }
        },

        
    });
});