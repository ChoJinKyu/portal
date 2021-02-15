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
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, FilterType ,NumberFormatter,
    TreeListModel, jQuery, ODataV2ServiceProvider) {
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

            //로그인 세션 작업완료시 수정
            this.loginUserId = "TestUser";
            this.loginUserName = "TestUser";
            this.tenant_id = "L2101";
            this.language_cd = "KO"
            this.employee_number = "9004";

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
                new Filter("tenant_id", "EQ", "L2101"),
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
                "tenant_id"         : this._sTenantId,
                "request_number"    : this._sRequestNumber,
                "approve_sequence"  : null,
                "approval_number"   : null,
                "requestor_empno"   :this.employee_number,
                "tf_flag"           : true,
                "approval_comment"  : null,
                "approve_date_time" : new Date(),
                "update_user_id"    : "17370CHEM@lgchem.com"
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
                "update_user_id"    : "17370CHEM@lgchem.com"
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
                }else if( flag == "J") {
                    progressCode = "E";
                }else if( flag == "A") {
                    progressCode = "C";
                }else if( flag == "C") {
                    progressCode = "D";
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
                tenant_id                : oMasterData.tenant_id,
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
                creator_empno            : oMasterData.creator_empno,
                create_category_code     : oMasterData.create_category_code,
                update_user_id           : "17370CHEM@lgchem.com",
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
                    tenant_id: oDetailsData.PdCategoryApprovalType[i].tenant_id,
                    request_number : oDetailsData.PdCategoryApprovalType[i].request_number,
                    approve_sequence : oDetailsData.PdCategoryApprovalType[i].approve_sequence,
                    approval_number : oDetailsData.PdCategoryApprovalType[i].approval_number,
                    requestor_empno : this.employee_number,
                    tf_flag : oDetailsData.PdCategoryApprovalType[i].tf_flag,
                    approval_comment : oDetailsData.PdCategoryApprovalType[i].approval_comment,
                    approve_date_time : oDetailsData.PdCategoryApprovalType[i].approve_date_time,
                    update_user_id : "17370CHEM@lgchem.com",
                    crud_type_code : CUType
                });
            }

            input.inputData.pdDtl = pdDtlVal;
     
            if(this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "srv-api/odata/v4/dp.creationRequestV4Service/PdCreationRequestSaveProc";
            var title, confirm;
            if(flag!="DL") {
                title = this.getModel("I18N").getText("/SAVE");
                confirm = this.getModel("I18N").getText("/NCM00001");
            } else {
                title = this.getModel("I18N").getText("/DELETE");
                confirm = this.getModel("I18N").getText("/NCM00003");
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
                                console.log(rst);
                                if(rst.return_code =="OK"){
                                    sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                    if(flag == "D"){
                                         sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "R"){
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "J"){
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "A"){
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01001"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "DL"){
                                        sap.m.MessageToast.show(v_this.getModel("I18N").getText("/NCM01002"));
                                        v_this.onPageNavBackButtonPress();
                                    }else if(flag == "C"){
                                        MessageBox.confirm("검토 완료되었습니다. \n Category를 생성을 진행하시겠습니까?", {
                                            title : "Confirmation",
                                            initialFocus : sap.m.MessageBox.Action.CANCEL,
                                            onClose : function(sButton) {
                                                if (sButton === MessageBox.Action.OK) {
                                                    v_this.onMoveAddCreate();
                                                } else {
                                                    v_this.onPageNavBackButtonPress();
                                                }
                                            }
                                        });
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
                "tenant_id": this._sTenantId,
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
                "tenant_id"         : this._sTenantId,
                "request_number"    : this._sRequestNumber,
                "approve_sequence"  : null,
                "approval_number"   : null,
                "requestor_empno"   : this.employee_number,
                "tf_flag"           : null,
                "approval_comment"  : null,
                "approve_date_time" : new Date(),
                "update_user_id"    : "17370CHEM@lgchem.com"
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
                    console.log("oData=========>",oData.results);
                    v_this._toShowMode();
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

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oData = oDetailsModel.oData;

            this.getView().getModel("viewModel").setProperty("/showMode", true);
            this.getView().getModel("viewModel").setProperty("/editMode", false);
            //this.byId("page").setProperty("showFooter", true);
            
            this.byId("pageNavBackButton").setVisible(true);
            this.byId("pageEditButton").setEnabled(true);
            
            this.byId("pageNSaveButton").setEnabled(false);
            this.byId("pageASaveButton").setEnabled(false);
            this.byId("pageNCancelButton").setEnabled(false);
            this.byId("pageACancelButton").setEnabled(false);
            this.byId("pageNListButton").setEnabled(true);
            this.byId("pageAListButton").setEnabled(true);
            this.byId("pageNSubmitButton").setEnabled(false);
            this.byId("pageASubmitButton").setEnabled(false);
        },
        
        _toEditMode: function () {
            this.getView().getModel("viewModel").setProperty("/showMode", false);
            this.getView().getModel("viewModel").setProperty("/editMode", true);
            var oMasterModel = this.getModel("master")
            //this.byId("page").setProperty("showFooter", true);
            this.byId("pageNavBackButton").setVisible(false);
            this.byId("pageEditButton").setEnabled(false);
            this.byId("pageNSaveButton").setEnabled(true);
            this.byId("pageASaveButton").setEnabled(true);
            this.byId("pageNCancelButton").setEnabled(true);
            this.byId("pageACancelButton").setEnabled(true);
            this.byId("pageNListButton").setEnabled(false);
            this.byId("pageAListButton").setEnabled(false);
            this.byId("pageNSubmitButton").setEnabled(true);
            this.byId("pageASubmitButton").setEnabled(true);
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

            if(row.drill_state !== "leaf"){
                MessageToast.show("Leaf Category만 선택할 수 있습니다.");
                return;
            } else {
                this.byId("searchField").setValue(row.category_name);
                this.byId("similarCategoryName").setText(row.category_name);
                this.byId("similarCategoryCode").setText(row.category_code);

                this.partCategoryPopupClose();
            }
            
        },
       
        

        

        
    });
});