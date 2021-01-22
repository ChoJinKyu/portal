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
    "dp/util/control/ui/IdeaManagerDialog"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel,FilterType,IdeaManagerDialog) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.partActivityMgt.controller.IdeaSelection", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        loginUserId: new String,
        tenant_id: new String,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {

            console.log("IdeaSelection start");
            //로그인 세션 작업완료시 수정
            this.loginUserId = "TestUser";
            this.tenant_id = "L2100";
            //법인 필터
            this.setCompanyFilter();

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedModel(), "details");
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
            var oInitData = {
                tenant_id: "L2100",
                company_code: "",
                idea_number: ""
            };
            var oViewModel = this.getModel("details");
            oViewModel.setProperty("/SupplierIdea", oInitData);
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
            this._sCompanyCode = oArgs.companyCode;
            this._sIdeaNumber = oArgs.ideaNumber;

            this.validator.clearValueState(this.byId("midObjectForm"));
            if (oArgs.ideaNumber == "new") {
                this._toEditMode();
                console.log("###신규저장");
                this._fnInitModel();
                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var toDate = year + "/" + month + "/" + day;
                var toDate2 = year + "-" + month + "-" + day;

                this.getView().byId("ideaDate").setText(toDate);
                var oDetailModel = this.getModel("details");
                oDetailModel.setData({
                    "tenant_id": this._sTenantId,
                    "company_code": this._sCompanyCode,
                    "idea_number": "1234567890",
                    "idea_date": toDate2,
                    "supplier_code": "KR01820500",
                    "idea_create_user_id": this.loginUserId,
                    "local_create_dtm": toDate2,
                    "local_update_dtm": toDate2,
                    "create_user_id": this.loginUserId,
                    "update_user_id": this.loginUserId,
                    "system_create_dtm": toDate2,
                    "system_update_dtm": toDate2
                }, "/SupplierIdea"); 
                

                oView.byId("ideaCompany").setValue(this._sCompanyCode);
                oDetailModel.setTransactionModel(this.getModel());
            } else {
                console.log("###수정");

                var sObjectPath = "/IdeaView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + this._sIdeaNumber + "')";
                var oMasterModel = this.getModel("master");
                //테스트 에러로 
                //oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function (oData) {
                        console.log("oData====", oData);
                        oView.byId("ideaCompany").setValue(oData.company_code);
                        oView.setBusy(false);
                    }
                });
                
                var sObjectPath2 = "/SupplierIdea(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + this._sIdeaNumber + "')";
                var oDetailsModel = this.getModel("details");
                
                oView.setBusy(true);
                oDetailsModel.setTransactionModel(this.getModel());
                oDetailsModel.read(sObjectPath2, {
                    success: function (oData) {
                        console.log("oData====", oData);
                        oView.setBusy(false);
                    }
                });

                this._toShowMode();
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

            if (this._sIdeaNumber !== "new"){
                if(!oDetailsModel.isChanged() ) {
                    MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                    return;
                }
            }
                
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

			oTransactionManager.setServiceModel(this.getModel());
			MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						//oView.setBusy(true);
						oTransactionManager.submit({						
							success: function(ok){
                                console.log("succ");
                                console.log(ok);
								v_this._toShowMode();
                                oView.setBusy(false);
								MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
							}
						});
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm"));

        },

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);
            this.byId("page").setProperty("showFooter", true);
            
            this.byId("pageNavBackButton").setVisible(true);
            this.byId("pageEditButton").setEnabled(true);
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
            this._toShowMode();
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
            console.log(e);
            var oView = this.getView();
            var ideaManagerId = this.getView().byId("ideaManagerId");
            ideaManagerId.setValue("");
        },




    });
});