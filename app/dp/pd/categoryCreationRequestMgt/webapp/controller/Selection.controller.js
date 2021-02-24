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
    "sap/ui/thirdparty/jquery",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "ext/lib/util/SppUserSession"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, FilterType ,NumberFormatter,
    TreeListModel, jQuery, ODataV2ServiceProvider, SppUserSession) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.Selection", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        loginUserName: new String,
        tenant_id: new String,
        companyCode: new String,
        language_cd: new String,
        employee_number: new String,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oSppUserSession = new SppUserSession();
            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

            //로그인 세션 작업완료시 수정
            this.tenant_id = this.getModel("USER_SESSION").getSessionAttr("TENANT_ID");
            this.loginUserId = this.getModel("USER_SESSION").getSessionAttr("USER_ID");
            this.companyCode = this.getModel("USER_SESSION").getSessionAttr("COMPANY_CODE");
            this.language_cd = this.getModel("USER_SESSION").getSessionAttr("LANGUAGE_CODE");
            this.employee_number = this.getModel("USER_SESSION").getSessionAttr("EMPLOYEE_NUMBER");
            this.loginUserName = this.getModel("USER_SESSION").getSessionAttr("EMPLOYEE_NAME");

            this.tenant_id = "L2101";
            this.loginUserId = "user@lgensol.com";
            this.companyCode = "LGESL";
            this.language_cd = "KO";
            this.employee_number = "9004";
            this.loginUserName = "에너지솔루션사용자";

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "details");
            this.setModel(new ManagedModel(), "processModel");

			var oViewModel = new JSONModel({
                    showMode: true,                    
                    editMode: false
				});

            this.setModel(oViewModel, "viewModel");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));
            oTransactionManager.addDataModel(this.getModel("processModel"));

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();
            this._setProcessStatus();
        },

        _setProcessStatus : function(){
            var aFilters = [
                new Filter("tenant_id", "EQ", this.tenant_id),
                new Filter("group_code", "EQ", "DP_PD_PROGRESS_STATUS"),
                new Filter("language_cd", "EQ", this.language_cd)
            ];

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/cm.util.CommonService/").read("/Code", {
                    filters: aFilters,
                    success: function(oData){
                        this.getModel("processModel").setData(oData.results);
                }.bind(this)
            });
        },

        /**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },

        onMstAddRow : function () {
            var oTable = this.byId("detailsTable");
            var oDetailsModel = this.getModel("details");
            oDetailsModel.addRecord({
                "tenant_id"         : this.tenant_id,
                "request_number"    : this._sRequestNumber,
                "approve_sequence"  : null,
                "approval_number"   : null,
                "requestor_empno"   : this.employee_number,
                "tf_flag"           : true,
                "approval_comment"  : null,
                "approve_date_time" : new Date(),
                "update_user_id"    : this.loginUserId
            }, "/PdCategoryApprovalType");
        },

        onApproverAdd : function (){
            var oDetailsModel = this.getView().getModel("details");
             oDetailsModel.addRecord({
                "tenant_id"         : this._sTenantId,
                "request_number"    : this._sRequestNumber,
                "approve_sequence"  : null,
                "approval_number"   : null,
                "requestor_empno"   : this.employee_number,
                "tf_flag"           : true,
                "approval_comment"  : null,
                "approve_date_time" : new Date(),
                "update_user_id"    : this.loginUserId
            }, "/PdCategoryApprovalType");
        },

        setApproverRemoveRow: function (oParam) {
            var oModel = this.getModel("details");
            oModel.removeRecord(oParam - 1);
        },

        onMstDeleteRow : function () {
            var oTable = this.byId("detailsTable");
            var oModel = this.getModel("details");
            var aItems = oTable.getSelectedItems();
            var aIndices = [];
            aItems.forEach(function(oItem){
                aIndices.push(oModel.getProperty("/PdCategoryApprovalType").indexOf(oItem.getBindingContext("details").getObject()));
            });
            aIndices = aIndices.sort(function(a, b){return b-a;});
            aIndices.forEach(function(nIndex){
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
        },

        /**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            
            var oView = this.getView();
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var v_this = this;

            var oMasterData = oMasterModel.oData;
            var oDetailsData = oDetailsModel.oData;
            var oDetailsTable = this.byId("detailsTable");

            var progressCode, CUType, statsCode;

            if(flag != "D" && flag == "R"){
                if(this.byId("categoryGroupCodeCombo").getSelectedKey() === "" ) {//ECM01002
                    this.byId("categoryGroupCodeCombo").setValueState("Error");
                    MessageToast.show(this.getModel("I18N").getText("/ECM01001"));
                    return;
                }

                if(this.byId("requestTitle").getValue() === "") {
                    this.byId("requestTitle").setValueState("Error");
                    MessageToast.show(this.getModel("I18N").getText("/ECM01002"));
                    return;
                }

                if(this.byId("requestCategoryName").getValue() === "") {
                    this.byId("requestCategoryName").setValueState("Error");
                    MessageToast.show(this.getModel("I18N").getText("/ECM01002"));
                    return;
                }

                if(this.byId("similarCategoryCode").getValue() === "") {
                    this.byId("similarCategoryCode").fireSearch();
                    return;
                }

                if(this.byId("richTextEditor").mBindingInfos.value.binding.oDataState.getValue()===null){
                    MessageToast.show(this.getModel("I18N").getText("/DESCRIPTION") + "\n" + this.getModel("I18N").getText("/ECM01002"));
                    return;
                }
                // if(this.byId("richTextEditor").getValue() === "") {
                //     this.byId("richTextEditor").setValueState("Error");
                //     MessageToast.show(this.getModel("I18N").getText("/ECM01002"));
                //     return;
                // }
            }
            
            if (this._sRequestNumber !== "new"){
                CUType = "U";
                
                if(flag == "D"){
                    if(!oMasterModel.isChanged() ) {
                        MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
                        return;
                    }
                    progressCode = "A";
                }else if( flag == "R"){
                    statsCode = "SUBMIT";
                    progressCode = "B";
                }else if( flag == "E") {
                    progressCode = "E";
                }else if( flag == "F") {
                    progressCode = "F";
                }else if( flag == "A") {
                    progressCode = "C";
                }else if( flag == "C") {
                    progressCode = "C";
                }else if( flag == "DL") {
                    CUType = "D";
                }
            } else {
                CUType = "C";
                statsCode = "DRAFT";
                if( flag == "D"){
                    progressCode = "A";
                }else if( flag == "R"){
                    statsCode = "SUBMIT";
                    progressCode = "B"
                }
            }
           

            var pdMstVal = {
                tenant_id                : this.tenant_id,
                request_number           : oMasterData.request_number,
                category_group_code      : oMasterData.category_group_code,
                approval_number          : oMasterData.approval_number,
                request_title            : oMasterData.request_title,
                request_category_name    : oMasterData.request_category_name,
                similar_category_code    : oMasterData.similar_category_code,
                requestor_empno          : this.employee_number,
                request_date_time        : oMasterData.request_date_time,
                request_desc             : oMasterData.request_desc,
                attch_group_number       : oMasterData.attch_group_number,
                progress_status_code     : progressCode,
                creator_empno            : this.loginUserId,
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

            for (var i = 0; i < oDetailsTable.getItems().length; i++) {
                pdDtlVal.push({
                    tenant_id: this.tenant_id,
                    request_number : oDetailsData.PdCategoryApprovalType[i].request_number,
                    approve_sequence : oDetailsData.PdCategoryApprovalType[i].approve_sequence,
                    approval_number : oDetailsData.PdCategoryApprovalType[i].approval_number,
                    requestor_empno : this.employee_number,
                    tf_flag : oDetailsData.PdCategoryApprovalType[i].tf_flag,
                    approval_comment : oDetailsData.PdCategoryApprovalType[i].approval_comment,
                    approve_date_time : oDetailsData.PdCategoryApprovalType[i].approve_date_time,
                    update_user_id : this.loginUserId,
                    crud_type_code : CUType
                });
            }

            input.inputData.pdDtl = pdDtlVal;
     
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.creationRequestV4Service/PdCreationRequestSaveProc";
            var title, confirm;
            if(flag=="DL") {    //삭제
                title = this.getModel("I18N").getText("/DELETE");
                confirm = this.getModel("I18N").getText("/NCM00003");
            } else if(flag=="E") {    //반려
                title = this.getModel("I18N").getText("/REJECT");
                confirm = this.getModel("I18N").getText("/NSP00103");
            } else if(flag=="F") {    //취소
                title = this.getModel("I18N").getText("/CANCEL");
                confirm = this.getModel("I18N").getText("/NCM00002");
            } else if(flag=="A") {    //승인
                title = this.getModel("I18N").getText("/APPROVAL");
                confirm = this.getModel("I18N").getText("/NSP00105");
            } else if(flag=="C") {    //확인&생성
                var oI18NModel = this.getModel("I18N");
                title = this.getModel("I18N").getText("/CONFIRM_CREATE");
                confirm = oI18NModel.getText("/NDP40004", [oI18NModel.getText("/CONFIRM_CREATE")]);
            }else {
                title = this.getModel("I18N").getText("/SAVE");
                confirm = this.getModel("I18N").getText("/NCM00001");
            }

			oTransactionManager.setServiceModel(this.getModel());
			MessageBox.confirm(confirm, {
				title : title,
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
                                if(rst.return_code =="OK"){
                                    if(flag == "D"){    // Draft
                                         sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "R"){  // Request
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "E"){  // REJECT
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NDP60004"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "F"){  // CANCEL
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NDP60003"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "A"){  // APPROVAL
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "DL"){ // DELETE
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01002"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "C"){  // CONFIRM_CREATE
                                        v_this.onMoveAddCreate();
                                    }
                                }else{
                                    sap.m.MessageToast.show( "error : "+rst.return_msg );
                                }
                            },
                            error: function (rst) {
                                sap.m.MessageToast.show( "error : "+rst.return_msg );
                            }
                        });
					};
				}
            });
            this.validator.clearValueState(this.byId("midObjectForm"));
        },

        onMoveAddCreate: function (oEvent) {
            this.getRouter().navTo("addCreatePage", {
                requestNumber: this._sRequestNumber,
                categoryGroupCode: this._sCategoryGroupCode
            }, true);
        },

        /**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelButtonPress: function (flag) {
            this.validator.clearValueState(this.byId("midObjectForm"));
            if(flag == "N") {
                this.onPageNavBackButtonPress.call(this);
            } else {
                this._toShowMode();
            }
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
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            var sPreviousHash = History.getInstance().getPreviousHash();
            this.getRouter().navTo("mainPage", {}, true);
        },

        _fnInitModel : function(){
            
            var oViewModel = this.getView().getModel("master");
            oViewModel.setData({}, "/pdPartCategoryCreationRequest");
            oViewModel.setData({
                "tenant_id": this.tenant_id,
                "request_number": this._sRequestNumber,
                "category_group_code": this._sCategoryGroupCode,
                "approval_number": null,
                "request_title": null,
                "request_category_name": null,
                "similar_category_code": null,
                "requestor_empno": this.employee_number,
                "request_date_time": new Date(),
                "request_desc": null,
                "attch_group_number": null,
                "progress_status_code": null,
                "creator_empno": this.loginUserId,
                "create_category_code": null
            }, "/pdPartCategoryCreationRequest");

            var oViewModel2 = this.getView().getModel("details");
            oViewModel2.setData({}, "/PdCategoryApprovalType");
            oViewModel2.setData({
                "tenant_id"         : this.tenant_id,
                "request_number"    : this._sRequestNumber,
                "approve_sequence"  : null,
                "approval_number"   : null,
                "requestor_empno"   : this.employee_number,
                "tf_flag"           : null,
                "approval_comment"  : null,
                "approve_date_time" : new Date(),
                "update_user_id"    : this.loginUserId
            }, "/PdCategoryApprovalType");
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();

            //this._sTenantId = oArgs.tenantId;
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
                //this._sTenantId = oArgs.tenantId;
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
            //var sObjectPath = "/pdPartCategoryCreationRequestView(tenant_id='" + this._sTenantId + "',request_number='" + this._sRequestNumber + "',category_group_code='"+ this._sCategoryGroupCode + "')";
            
            var oMasterModel = this.getModel("master");
            var v_this = this;
            this.statusGloCode = "";

            var aFilters = [
                new Filter("tenant_id", "EQ", this.tenant_id),
                new Filter("request_number", "EQ", this._sRequestNumber),
                new Filter("category_group_code", "EQ", this._sCategoryGroupCode)
            ];
            
            //테스트 에러로 
            //oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read("/pdPartCategoryCreationRequestView", {
                filters: aFilters,
                success: function (oData) {
                    if(oData.results.length > 0){
                        this.getModel("master").setData(oData.results[0]);
                    }
                    oView.setBusy(false);
                    this._toShowMode();
                }.bind(this)
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

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oMasterData = oMasterModel.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);

            this.byId("pageNavBackButton").setVisible(true);

            if(oMasterData.progress_status_code === 'A') {
                this.byId("pageEditButton").setVisible(true);
                this.byId("pageADeleteButton").setVisible(true);
                this.byId("pageAListButton").setVisible(true);
                this.byId("pageASaveButton").setVisible(false);
                this.byId("pageACancelButton").setVisible(false);
                this.byId("pageASubmitButton").setVisible(false);
            }
            
        },
        
        _toEditMode: function () {
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oMasterData = oMasterModel.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", false);
            this.getView().getModel("viewModel").setProperty("/editMode", true);

            this.byId("pageNavBackButton").setVisible(false);

            if(oMasterData.similar_category_code === null) {
                this.byId("similarCategoryCode").setValue("");
            }

            if(oMasterData.request_number === 'new') {
                this.byId("pageNSaveButton").setEnabled(true);
                this.byId("pageNListButton").setEnabled(true);
                this.byId("pageNSubmitButton").setEnabled(true);
            }

            if(oMasterData.progress_status_code === 'A') {
                this.byId("pageEditButton").setVisible(false);
                this.byId("pageADeleteButton").setVisible(false);
                this.byId("pageAListButton").setVisible(false);
                this.byId("pageASaveButton").setVisible(true);
                this.byId("pageACancelButton").setVisible(true);
                this.byId("pageASubmitButton").setVisible(true);
            }

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
                    new Filter("tenant_id", FilterOperator.EQ, this.tenant_id),
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
                    this.byId("diatreeTable").collapseAll();
                }).bind(this));

        },

        partCategoryPopupClose: function (oEvent) {
            this.byId("PartCategory").close();
        },

        selectPartCategoryValue: function (oEvent) {
            var row = this.getView().getModel("tree").getObject(oEvent.getParameters().rowContext.sPath);

            if(row.drill_state !== "leaf"){
                MessageToast.show(this.getModel("I18N").getText("/NDP60006"));
                return;
            } else {
                this.getModel("master").getData().similar_category_code = row.category_code;
                this.byId("similarCategoryCode").setValue(row.category_name + " [" + row.category_code + "]");
                
                this.partCategoryPopupClose();
            }
            
        },
       
        onSelectionChange: function(oEvent) {
            this.byId("categoryGroupCodeCombo").setValueState("None");
        },

        onLiveChange: function(oEvent) {
            var objPath = oEvent.oSource.mBindingInfos.value.parts[0].path;
            if(objPath == "/request_title") {
                this.byId("requestTitle").setValueState("None");
            }
            if (objPath == "/request_category_name") {
                this.byId("requestCategoryName").setValueState("None");
                
            }
        }

        
    });
});