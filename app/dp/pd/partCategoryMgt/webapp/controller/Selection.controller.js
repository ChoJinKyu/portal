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
    "ext/lib/formatter/NumberFormatter",
    "ext/lib/model/TreeListModel",
    "sap/ui/thirdparty/jquery"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, FilterType ,NumberFormatter,
    TreeListModel, jQuery) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.partCategoryMgt.controller.Selection", {

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

            this.loginUserId = "TestUser";
            this.loginUserName = "TestUser";
            this.tenant_id = "L2101";

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "details");

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

        _fnInitModel : function(){
            var date = new Date();
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var toDate = year + "/" + month + "/" + day;
            var toDate2 = year + "-" + month + "-" + day;

            //this.getView().byId("ideaDate").setText(toDate);

            var oViewModel = this.getView().getModel("master");
            oViewModel.setData({}, "/PdPartCategory");
            oViewModel.setData({
                "tenant_id": this._sTenantId,
                "company_code": null,
                "org_type_code": null,
                "org_code": null,
                "request_number": this._sRequestNumber,
                "category_group_code": this._sCategoryGroupCode,
                "approval_number": null,
                "request_title": null,
                "request_category_name": null,
                "similar_category_code": null,
                "requestor_empno": this.loginUserId,
                "request_date_time": new Date(),
                "request_desc": null,
                "attch_group_number": null,
                "progress_status_code": null,
                "creator_empno": this.loginUserId,
                "create_category_code": null,
                "update_user_id": this.loginUserId,
                "crud_type": "C"
            }, "/PdPartCategory");

            // var oViewModel2 = this.getView().getModel("details");
            // oViewModel2.setData({}, "/approvalLine");
            // oViewModel2.setData({
            //     "tenant_id": this._sTenantId,
            //     "company_code": this._sCompanyCode,
            //     "idea_number": "New",
            //     "supplier_code": this.supplier_code,
            //     "idea_progress_status_name": "NEW",
            //     "idea_create_user_id": this.loginUserId,
            //     "create_user_id": this.loginUserId,
            //     "update_user_id": this.loginUserId,
            // }, "/approvalLine");
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
            this._sCategoryGroupCode = oArgs.categoryGroupCode;
            this._sRequestNumber = oArgs.requestNumber;

            var oMasterModel = this.getModel("master");
            oMasterModel.setProperty("/PdPartCategory", {});

            // var oDetailModel = this.getModel("details");
            // oDetailModel.setProperty("/approvalLine", {});

            this.validator.clearValueState(this.byId("midObjectForm"));
            if (oArgs.requestNumber == "new") {
                
                // console.log("###신규저장");
                this._fnInitModel();
                this._sTenantId = oArgs.tenantId;
                this._sCategoryGroupCode = oArgs.categoryGroupCode;
                this._sRequestNumber = "new";
                this._toEditMode();
                //oView.byId("ideaCompany").setValue(this._sCompanyCode);
                
                //oDetailModel.setTransactionModel(this.getModel());
            } else {
                // console.log("###수정");
                this.onSearch();
            }
        },

        
//PdPartCategory(tenant_id='L2101',category_group_code='CO',category_code='PC2012300002')
        

		/**
		 * 조회
		 * @public
		 */
        onSearch: function () {
            var oView = this.getView();
            var sObjectPath = "/PdPartCategory(tenant_id='" + this._sTenantId + "',category_group_code='"+ this._sCategoryGroupCode + "',request_number='" + this._sRequestNumber + "')";
            //var sObjectPath = "/IdeaView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + idea_number + "')";
            var oMasterModel = this.getModel("master");
            var v_this = this;
            this.statusGloCode = "";

            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    //oView.byId("ideaCompany").setValue(oData.company_code);
                    oView.setBusy(false);
                }
            });
            
            // var sObjectPath2 = "/approvalLine(tenant_id='" + this._sTenantId + "',org_type_code='" + this._sOrgTypeCode + 
            //                     "',category_group_code'"+ this._sCategoryGroupCode + "',category_code='" + categoryCode + "')";
            // var oDetailsModel = this.getModel("details");
            
            //oView.setBusy(true);
            // oDetailsModel.setTransactionModel(this.getModel());
            // oDetailsModel.read(sObjectPath2, {
            //     success: function (oData) {
            //         //v_this.statusGloCode = oData.idea_progress_status_code;
            //         v_this._toShowMode();
            //         oView.setBusy(false);
            //     }
            // });

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            
            var oView = this.getView(),
                //oDetailsModel = this.getModel("details"),
                oMasterModel = this.getModel("master"),
                v_this = this;
            var oData = oMasterModel.oData;
            var statsCode = "DRAFT";
            var progressCode = "Draft";
            var CUType = "C";            
                var inputData = {
                    ProcInputType : {}
                };
            if (this._sRequestNumber !== "new"){
                CUType = "U";
                
                if( flag == "D"){
                    if(!oMasterModel.isChanged() ) {
                        MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                        return;
                    }
                    statsCode = "DRAFT";
                    progressCode = "A";
                }else if( flag == "R"){
                    statsCode = "SUBMIT";
                    progressCode = "B"
                }
            }
            
            inputData.ProcInputType = {
                tenant_id                : oData.tenant_id,
                company_code             : oData.company_code,
                org_type_code            : oData.org_type_code,
                org_code                 : oData.org_code,
                request_number           : oData.request_number,
                category_group_code      : oData.category_group_code,
                approval_number          : oData.approval_number,
                request_title            : oData.request_title,
                request_category_name    : oData.request_category_name,
                similar_category_code    : oData.similar_category_code,
                requestor_empno          : oData.requestor_empno,
                request_date_time        : oData.request_date_time,
                request_desc             : oData.request_desc,
                attch_group_number       : oData.attch_group_number,
                progress_status_code     : oData.progress_status_code,
                creator_empno            : oData.creator_empno,
                create_category_code     : oData.create_category_code,
                crud_type                : CUType
            }

            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.creationRequestV4Service/PdCreationRequestSaveProc";
            
            console.log("inputData", inputData);

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
                                console.log(rst);
                                if(rst.return_code =="S"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    if( flag == "D"){
                                        v_this.onSearch(rst.return_msg );
                                    }else if( flag == "R"){
                                        v_this.onPageNavBackButtonPress();
                                    }
                                }else{
                                    console.log(rst);
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                    console.log("eeeeee");
                                    console.log(rst);
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

        onSearchPartCategory: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this.treeDialog) {
                this.treeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.partCategoryMgt.view.PartCategory",
                    controller: this
                }).then(function (tDialog) {
                    oView.addDependent(tDialog);
                    return tDialog;
                }.bind(this));
            }

            this.treeDialog.then(function (tDialog) {
                tDialog.open();
                this.onDialogTreeSearch();
            }.bind(this));
        },

        onDialogTreeSearch: function (oEvent) {

            var treeFilter = [];

            treeFilter.push(new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101"),
                    new Filter("category_group_code", FilterOperator.EQ, "CO")
                ],
                and: false
            }));
            
            this.treeListModel = new TreeListModel(this.getView().getModel());
            this.treeListModel
                .read("/pdPartCategoryView", {
                     filters: treeFilter
                })
                // 성공시
                .then((function (jNodes) {
                    this.getView().setModel(new JSONModel({
                        "pdPartCategoryView": {
                            "nodes": jNodes
                        }
                    }), "tree");
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                }).bind(this));

        },

        partCategoryPopupClose: function (oEvent) {
            this.byId("PartCategory").close();
        },

        selectPartCategoryValue: function (oEvent) {
            var row = this.getView().getModel("tree").getObject(oEvent.getParameters().rowContext.sPath);

            this.getView().byId("searchField").setValue(row.category_name);
            this.getView().byId("similarCategoryCode").setValue(row.category_code);

            this.partCategoryPopupClose();
        },


    });
});