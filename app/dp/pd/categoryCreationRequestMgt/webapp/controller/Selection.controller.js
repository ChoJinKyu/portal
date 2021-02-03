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

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.Selection", {

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
            
            var oViewModel = this.getView().getModel("master");
            oViewModel.setData({}, "/pdPartCategoryCreationRequest");
            oViewModel.setData({
                "tenant_id": this._sTenantId,
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
                "create_category_code": null
            }, "/pdPartCategoryCreationRequest");

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
            oMasterModel.setProperty("/pdPartCategoryCreationRequest", {});

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

		/**
		 * 조회
		 * @public
		 */
        onSearch: function () {
            var oView = this.getView();
            var sObjectPath = "/pdPartCategoryCreationRequest(tenant_id='" + this._sTenantId + "',category_group_code='"+ this._sCategoryGroupCode + "',request_number='" + this._sRequestNumber + "')";
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

        htmlEncoding: function (value, sId) {
            return btoa(unescape(encodeURIComponent(value)))
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                v_this = this;

            var oMasterData = oMasterModel.oData;
            var oDetailsData = oDetailsModel.oData;

            var statsCode = "DRAFT";
            var progressCode = "Draft";
            var CUType = "C";

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
           
            var requestDesc = this.byId("requestDesc").getValue();
            var pdMstVal = {
                tenant_id                : oMasterData.tenant_id,
                request_number           : oMasterData.request_number,
                category_group_code      : oMasterData.category_group_code,
                approval_number          : oMasterData.approval_number,
                request_title            : oMasterData.request_title,
                request_category_name    : oMasterData.request_category_name,
                similar_category_code    : oMasterData.similar_category_code,
                requestor_empno          : oMasterData.requestor_empno,
                request_date_time        : oMasterData.request_date_time,
                request_desc             : this.htmlEncoding(requestDesc, this.byId("requestDesc").getId()),
                attch_group_number       : oMasterData.attch_group_number,
                progress_status_code     : oMasterData.progress_status_code,
                creator_empno            : oMasterData.creator_empno,
                create_category_code     : oMasterData.create_category_code,
                update_user_id           : this.loginUserId,
                crud_type_code           : CUType
            };

            var input = {
                inputData : {
                    crud_type : CUType,
                    pdMst : pdMstVal,
                    pdDtl : []
                }
            };
            
            var pdDtlVal = [];  // 결재테이블은 나중에
            
            for (var i = 0; i <  oDetailsData.getItems().length; i++) {
                pdDtlVal.push({
                });
            }

            input.inputData.pdDtl = pdDtlVal;
            
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.creationRequestV4Service/PdCreationRequestSaveProc";
            
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
                            data: JSON.stringify(input),
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
                    name: "dp.pd.categoryCreationRequestMgt.view.PartCategory",
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