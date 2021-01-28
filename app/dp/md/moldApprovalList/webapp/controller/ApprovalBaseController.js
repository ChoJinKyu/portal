sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "dp/md/util/controller/EmployeeDeptDialog",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/core/routing/History",
    "sap/ui/Device", // fileupload 
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/richtexteditor/RichTextEditor",
    "./ApprovalList.controller", 
    "sap/ui/model/Sorter",
    "sap/m/Token",
    "sap/ui/core/dnd/DragInfo",
	"sap/ui/core/dnd/DropInfo",
	"sap/ui/core/dnd/DropPosition",
	"sap/ui/core/dnd/DropLayout",
	"sap/f/dnd/GridDropInfo",
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator, EmployeeDeptDialog, 
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalList,
    Sorter, Token, DragInfo , DropInfo ,DropPosition, DropLayout, GridDropInfo 
) {
    "use strict";

    return BaseController.extend("dp.md.moldApprovalList.controller.ApprovalBaseController", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        approvalList: new ApprovalList(),
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () { 
            this.firstStatusCode = "";
            // 각자 fragment 에서 세팅할 테이터 
            this.approvalDetails_data = [];
            this.moldMaster_data = [];
            this.quotation_data = [];  // supplier 전용 
            this.asset_data = [];  // budget 과 mold Receipt 

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            
            //this._showFormFragment();
        },

        onAfterRendering: function () {
            console.log(" >>>> onAfterRendering");

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
        onPageNavBackButtonPress: function () {
            this._toShowMode();
            this.getRouter().navTo("approvalList", {}, true); // X 버튼 누를시 묻지도 따지지도 않고 리스트로 감 

            for (var sPropertyName in this._oFragments) {
                if (this._oFragments.hasOwnProperty(sPropertyName) && this._oFragments[sPropertyName] !== null) {                
                    //if(!(sPropertyName === "GeneralInfo" || sPropertyName === "Attachments" || sPropertyName === "ApprovalLine")){
                    this._oFragments[sPropertyName].destroy();
                    this._oFragments[sPropertyName] = null;
                    console.log(sPropertyName);
                    //}
                }
            }
            this.approvalList.onBackToList();
        },

        onPageEditButtonPress: function () { // Edit 버튼 
            this._toEditMode();
        },

        onPageCancelEditButtonPress: function () { // 수정 취소 버튼 
            this._toShowMode();
        },

        // 입찰대상 협력사 취소품의 이동 
        onPageCancellationButtonPress: function () {

            var Cancellation = this.getView().getModel('Cancellation');
            Cancellation.setProperty("/approvalNumber", this.approval_number);
            Cancellation.setProperty("/isCreate", true);
            this.getRouter().navTo("pssCancelApproval", {
                company_code: this.company_code
                , plant_code: this.plant_code
                , approval_type_code: "A"
                , approval_number: "New"
            });

            /**
             * 이동시 기존거 리셋 
             */
            for (var sPropertyName in this._oFragments) {
                if (!this._oFragments.hasOwnProperty(sPropertyName) || this._oFragments[sPropertyName] == null) {
                    return;
                }
               
              //  if(sPropertyName !== "GeneralInfo"){
                    this._oFragments[sPropertyName].destroy();
                    this._oFragments[sPropertyName] = null;
                    console.log(sPropertyName);
              //  }
            }

            console.log(" onPageCancellationButtonPress ");

           
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onObjectMatched: function (oEvent) {

            /**
             * init 에서 해당 모델을 선언하면 create 계속 연속 했을때 기존 데이터가 남아있어서
             * 비정상적으로 나옴 
             */

            this.getView().setModel(new ManagedModel(), "company");
            this.getView().setModel(new ManagedModel(), "plant");
            this.getView().setModel(new ManagedModel(), "appType");
            this.getView().setModel(new ManagedModel(), "oEmployee");

            this.getView().setModel(new JSONModel(Device), "device"); // file upload 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedModel(), "moldMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
            this.getView().setModel(new ManagedListModel(), "approver");
            this.getView().setModel(new ManagedListModel(), "referer");

            // refererMultiCB  사용 안함 
           //  this.getView().setModel(new ManagedModel(), "refererMultiCB");

            var oArgs = oEvent.getParameter("arguments");
            console.log(oArgs);
            this._createViewBindData(oArgs);

            this.oSF = this.getView().byId("approverSearch");
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant
         */
        _createViewBindData: function (args) { 

            console.log("args>>>>> " , args);

            this.tenant_id = "L2600";
            this.approval_number = args.approval_number;
            this.approval_type_code = args.approval_type_code;
            this.company_code = args.company_code;
            this.plant_code = (args.org_code == undefined ? args.plant_code : args.org_code);

            var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Company(tenant_id='" + this.tenant_id + "',company_code='" + this.company_code + "')", {
                filters: [],
                success: function (oData) {

                }
            });

            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("purOrg"));

            oModel2.read("/Pur_Operation_Org(tenant_id='" + this.tenant_id
                + "',company_code='" + this.company_code
                + "',org_type_code='" + "PL"
                + "',org_code='" + this.plant_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("orgName ", oData);
                }
            });

            var appModel = this.getModel("appType");
            appModel.setTransactionModel(this.getModel("dpMdUtil"));
            appModel.read("/CodeDetails(tenant_id='" + this.tenant_id + "',group_code='DP_MD_APPROVAL_TYPE',code='" + this.approval_type_code + "')", {
                filters: [],
                success: function (oData) {
                    this._showFormItemFragment(oData.parent_code);
                }.bind(this)
            });
           

            this._onRoutedThisPage(this.approval_number);

            if (this.approval_number === "New") {
                this.getModel("appMaster").setProperty("/requestor_empno", '6975'); // 나중에 세션 값 세팅 할 것 
                this.getModel("appMaster").setProperty("/request_date", this._getToday());
            }

            this._onApprovalPage(); // 이거 공통으로 각자 페이지에 하나 만듭시다 - this.approval_number 가 로드 된 후에 처리 해야 하는데 


            //this.byId("pageGeneralInfoSection").focus();
        },

        _toEditMode: function () {
          //  this._onEditApproverRow();

            var oUiModel = this.getView().getModel("mode");
            oUiModel.setProperty("/editFlag", true);
            oUiModel.setProperty("/viewFlag", false);
            this._toButtonStatus();
            this._toEditModeEachApproval();//품의서 별로 추가해서 처리해야 하는 내용 입력
        },

        _toShowMode: function () {
           // this._onShowApproverRow();

            var oUiModel = this.getView().getModel("mode");
            oUiModel.setProperty("/editFlag", false);
            oUiModel.setProperty("/viewFlag", true);
            this._toButtonStatus();
            this._toShowModeEachApproval();//품의서 별로 추가해서 처리해야 하는 내용 입력
        },

       _toButtonStatus : function(){ 
            /**
             * 'DR'	'임시저장'	'L1100'
            'AR'	'결재요청'	'L1100'
            'IA'	'결재중'	'L1100'
            'AP'	'결재완료'	'L1100'
            'RJ'	'반려'	'L1100'
            */
            var oUiModel = this.getView().getModel("mode"); 
            var oModel = this.getModel("appMaster");
            if(oUiModel.getData().editFlag){
                 if(oModel.getData().approve_status_code == 'DR'){ // 임시저장 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", true);
                    oUiModel.setProperty("/btnDraftFlag", true);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", true);
                }else if(oModel.getData().approve_status_code == 'AR'){ // 결재완료 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", true);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else if(oModel.getData().approve_status_code == 'IA'){ // 결재중 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else if(oModel.getData().approve_status_code == 'AP'){ // 결재완료
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else if(oModel.getData().approve_status_code == 'RJ'){ // 반려
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else{ // new 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", true);
                    oUiModel.setProperty("/btnDraftFlag", true);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", true);
                }
            }else{
               if(oModel.getData().approve_status_code == 'DR'){ // 임시저장 
                    oUiModel.setProperty("/btnEditFlag", true);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", true);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", true);
                }else if(oModel.getData().approve_status_code == 'AR'){ // 결재완료 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", true);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else if(oModel.getData().approve_status_code == 'IA'){ // 결재중 
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else if(oModel.getData().approve_status_code == 'RJ'){ // 반려
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);    
                }else if(oModel.getData().approve_status_code == 'AP'){ // 결재완료
                    oUiModel.setProperty("/btnEditFlag", false);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }else{ // new 
                   oUiModel.setProperty("/btnEditFlag", true);
                    oUiModel.setProperty("/btnCancelFlag", false);
                    oUiModel.setProperty("/btnDraftFlag", false);
                    oUiModel.setProperty("/btnRequestCancelFlag", false);
                    oUiModel.setProperty("/btnRequestFlag", false);
                }  
            }
       } ,

        _oFragments: {},
        _showFormFragment: function () { // 이것은 init 시 한번만 호출됨 
            var oPageGeneralInfoSection = this.byId("pageGeneralInfoSection"); 
            console.log("oPageGeneralInfoSection >> " , oPageGeneralInfoSection);
            oPageGeneralInfoSection.removeAllBlocks();
            this._loadFragment("GeneralInfo", function (oFragment) {
                oPageGeneralInfoSection.addBlock(oFragment);
            }.bind(this))
        
            var oPageAttachmentsSection = this.byId("pageAttachmentsSection");
            oPageAttachmentsSection.removeAllBlocks();

            this._loadFragment("Attachments", function (oFragment) {
                oPageAttachmentsSection.addBlock(oFragment);
            }.bind(this))

            var oPageApprovalLineSection = this.byId("pageApprovalLineSection");
            oPageApprovalLineSection.removeAllBlocks();

            this._loadFragment("ApprovalLine", function (oFragment) {
                oPageApprovalLineSection.addBlock(oFragment);

                var referMulti = this.byId("referMulti");
                var tokens = [] ;
               
                var refer = this.getModel("referer");
                if(refer.getData().Referers != undefined && refer.getData().Referers.length > 0){
                    refer.getData().Referers.forEach(function(item){ 
                     //   console.log("item>>> " , item);
                        var oToken = new Token();
                        oToken.setKey(item.referer_empno);
                        oToken.setText(item.referer_name);
                        tokens.push(oToken);
                    });
                    referMulti.setTokens(tokens);
                }
            }.bind(this));
        },

        _showFormItemFragment: function (fragmentFileName) {
            this._showFormFragment();
            var oPageItemSection = this.byId("pageItemSection");
            oPageItemSection.removeAllBlocks();

            this._loadFragment(fragmentFileName, function (oFragment) {
                oPageItemSection.addBlock(oFragment);
                
                /*if (this.approval_number === "New") {
                    this._toEditMode();
                }*/
            }.bind(this));

        },

        _onRoutedThisPage: function (approvalNumber) {
            var filter = [
                new Filter("tenant_id", FilterOperator.EQ, this.tenant_id),
                new Filter("approval_number", FilterOperator.EQ, approvalNumber)
            ];

            if (approvalNumber !== "New") {
                this._bindView("/AppMaster(tenant_id='" + this.tenant_id + "',approval_number='" + approvalNumber + "')", "appMaster", [], function (oData) {
                    this.firstStatusCode = oData.approve_status_code; // 저장하시겠습니까? 하고 취소 눌렀을 경우 다시 되돌리기 위해서 처리 
                    this._toButtonStatus(); 

                    if(oData.approval_type_code == 'E'){
                        this._pssRequestCancelBtn();
                    }

                }.bind(this));
            }else{
                 this._toButtonStatus();
            }
            this._bindView("/ApprovalDetails", "appDetail", filter, function (oData) {

            }.bind(this));
            
            this._bindView("/Approvers", "approver", filter, function (oData) {
                 this.setSelectedApproval(0);
                 if (oData.results.length < 1) {
                    this.onApproverAdd(0);
                 }
            }.bind(this));

           // var refererMultiCB = this.getModel('refererMultiCB');
           
            var oView = this.getView();
            this._bindView("/Referers", "referer", filter, function (oData) {
            //     if (oData.results.length > 0) {
            //       //  var rList = [];
                   
            //         oData.results.forEach(function (item) { 
   
            //           //  rList.push(item.referer_empno); 
            //             // this.getView().byId("refererMultiCB").mProperties.selectedKeys.push(item.referer_empno);
            //         }.bind(this));
                  
            //   //  refererMultiCB.setProperty("/refer", rList);
            //     }
            }.bind(this));
        },

        onInputWithEmployeeValuePress: function(oEvent){
            var index = oEvent.getSource().getBindingContext("approver").getPath().split('/')[2];
     
            if (this.getModel("approver").getData().Approvers[index].approver_type_code === "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                this.onInputWithEmployeeValuePress["row"] = index;

                this.byId("employeeDialog").open();
            }
        },

        onEmployeeDialogApplyPress: function(oEvent){
            var employeeNumber = oEvent.getParameter("item").employee_number,
                userName = oEvent.getParameter("item").user_local_name,
                departmentLocalName = oEvent.getParameter("item").department_local_name,
                oModel = this.getModel("approver"),
                rowIndex = this.onInputWithEmployeeValuePress["row"];

            oModel.setProperty("/Approvers/"+rowIndex+"/approver_empno", employeeNumber);
            oModel.setProperty("/Approvers/"+rowIndex+"/approver_name", userName + " / " + departmentLocalName);
        },

       onMultiInputWithEmployeeValuePress: function(){ 
          
            if(!this.oEmployeeMultiSelectionValueHelp){
               this.oEmployeeMultiSelectionValueHelp = new EmployeeDeptDialog({
                    title: "Choose Referer",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2600")
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("referMulti").setTokens(oEvent.getSource().getTokens());
                 
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("referMulti").getTokens());
        },

        _loadFragment: function (sFragmentName, oHandler) {
            if (!this._oFragments[sFragmentName]) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "dp.md.moldApprovalList.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        },

        _bindView: function (sObjectPath, sModel, aFilter, callback) {
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },

        /**
         * @description file upload 관련 
         * @date 2020-11-23
         * @param {*} oEvent 
         */
        onChange: function (oEvent) {
            var oUploadCollection = oEvent.getSource();
            // Header Token
            var oCustomerHeaderToken = new UploadCollectionParameter({
                name: "x-csrf-token",
                value: "securityTokenFromModel"
            });
            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            MessageToast.show("Event change triggered");
        },

        onFileDeleted: function (oEvent) {
            MessageToast.show("Event fileDeleted triggered");
        },

        onFilenameLengthExceed: function (oEvent) {
            MessageToast.show("Event filenameLengthExceed triggered");
        },

        onFileSizeExceed: function (oEvent) {
            MessageToast.show("Event fileSizeExceed triggered");
        },

        onTypeMissmatch: function (oEvent) {
            MessageToast.show("Event typeMissmatch triggered");
        },

        onStartUpload: function (oEvent) {
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

        onBeforeUploadStarts: function (oEvent) {
            // Header Slug
            var oCustomerHeaderSlug = new UploadCollectionParameter({
                name: "slug",
                value: oEvent.getParameter("fileName")
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            setTimeout(function () {
                MessageToast.show("Event beforeUploadStarts triggered");
            }, 4000);
        },

        onUploadComplete: function (oEvent) {
            var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
            setTimeout(function () {
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

        onSelectChange: function (oEvent) {
            var oUploadCollection = this.byId("UploadCollection");
            oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
        },

        /**
         * @description Approval Line Event 
         * @param {*} oEvent 
         */
        /**
         * 드래그시작
         */
        onDragStartTable: function (oEvent) {
            console.log(" *** start >> onDragStart", oEvent);
            console.log(" *** target", oEvent.getParameter("target"));

            var oDraggedRow = oEvent.getParameter("target");
            var oDragSession = oEvent.getParameter("dragSession");
            console.log(" *** oDragSession", oDragSession);
            oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext("approver"));
            console.log(" *** end >> onDragStart");
        },
        /**
         * 드래그 도착위치 
         */
        onDragDropTable: function (oEvent) {
            console.log(" ***  start >> onDragDrop", oEvent);
            //  var oSwap = this.byId("ApproverTable").getSelectedItems();
            var oDragSession = oEvent.getParameter("dragSession");
            //    console.log(" *** oDragSession" , oDragSession );
            //    console.log(" *** getDropControl" , oDragSession.getDropControl() );
            //    console.log(" *** getDropInfo" , oDragSession.getDropInfo() );
            //    console.log(" *** getTextData" , oDragSession.getTextData() );
            //    console.log(" *** getDropControl" , oDragSession.getDropControl().mAggregations );
            //    console.log(" *** getDropPosition" , oDragSession.getDropPosition() );
            //    console.log(" *** draggedRowContext" ,  oDragSession.getComplexData("draggedRowContext") );

            // After 
            var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");
            if (!oDraggedRowContext) {
                return;
            }

            var data = oDragSession.getDropControl().mAggregations.cells;
            var dropPosition = {
                approver_empno: data[0].mProperties.text
                , approve_sequence: data[1].mProperties.text
                , approver_type_code: data[2].mProperties.text
                , approver_name: data[3].mProperties.text
                , approve_status_code: data[4].mProperties.text
                , approve_comment: data[5].mProperties.text
            };

            var approver = this.getView().getModel('approver');
            var item = this.getModel("approver").getProperty(oDraggedRowContext.getPath()); // 내가 선택한 아이템 

            console.log("dropPosition >>>> ", dropPosition);
            console.log("item >>>> ", item);


            var sequence = 0;
            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                if (approver.getData().Approvers[i].approve_sequence == item.approve_sequence) { // 선택한 아이템 위치의 데이터 삭제
                    approver.removeRecord(i);
                }
            }

            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                if (approver.getData().Approvers[i].approve_sequence == dropPosition.approve_sequence) { // 드래그가 도착한 위치의 상단 시퀀스  
                    if (oDragSession.getDropPosition() == 'After') {
                        sequence = i + 1;
                    } else {
                        sequence = i;
                    }
                }
            }

            approver.addRecord({
                "tenant_id": item.tenant_id,
                "approval_number": item.approval_number,
                "approve_sequence": item.approve_sequence,
                "approver_type_code": item.approver_type_code,
                "approver_empno": item.approver_empno,
                "approver_name": item.approver_name,
                "selRow": item.selRow,
            }, "/Approvers", sequence); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 

            // 시퀀스 순서 정렬 
            this.setOrderByApproval();
            console.log(" ***  end >> onDragDrop");
        },
        onListMainTableUpdateFinished: function (oEvent) {
            var item = this.byId("ApproverTable").getSelectedItems();
            console.log("//// onListMainTableUpdateFinished", oEvent);

        },
        onApproverAdd : function (oParam){
             console.log("//// onApproverAdd", oParam);
            var approver = this.getView().getModel('approver');
             approver.addRecord({
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "approve_sequence": "",
                "approver_type_code": "",
                "approver_empno": "",
                "approver_name": "",
                "selRow": true,
            }, "/Approvers", oParam); // 드래그가 도착한 위치에 내가 선택한 아이템  담기 
            this.setOrderByApproval();
            this.setSelectedApproval(String(Number(oParam)+1));
        },
        onItemApprovalPress : function (oEvent) {

         var sPath = oEvent.getSource().getBindingContext("approver").getPath(),
            oRecord = this.getModel("approver").getProperty(sPath);

            //  console.log("//// onApproverItemPress", oRecord);
            // console.log("//// onApproverItemPress oEvent", oEvent);
            // console.log("//// onApproverItemPress sPath", sPath);
        
           this.setSelectedApproval(String(oRecord.approve_sequence));   
        },
        // 삭제 
        setApproverRemoveRow: function (oParam) {
            var oModel = this.getModel("approver");
            oModel.removeRecord(oParam - 1);
            this.setOrderByApproval();
        },
        // 시퀀스 정렬 
        setOrderByApproval: function () {
            var approver = this.getModel("approver");
            for (var i = 0; i < approver.getData().Approvers.length; i++) {
                approver.getData().Approvers[i].approve_sequence = String(i + 1);
            }
            this.getModel("approver").refresh(true);
        },
        // 선택행 플래그 정리  
        setSelectedApproval : function (row) { 
             var approver = this.getModel("approver");
              for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(row == approver.getData().Approvers[i].approve_sequence){
                     approver.getData().Approvers[i].selRow = true;
                  }else{
                     approver.getData().Approvers[i].selRow = false;
                  }
            }
            console.log(" setSelectedApproval " , approver);
            this.getModel("approver").refresh(true);
        } ,

        getApprovalSeletedRow : function () {
            var approver = this.getModel("approver");
            var row = 0;
            for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(approver.getData().Approvers[i].selRow){
                    row = i;
                  }
            }
            return row;
        } ,

        /**
         * @description employee 이벤트 1
         */
        onApproverSearch: function (event) {
            var oItem = event.getParameter("suggestionItem");
            this.handleEmployeeSelectDialogPress(event);
        },
        /**
          * @description employee 이벤트 2
          */
        onSuggest: function (event) {
            var sValue = event.getParameter("suggestValue"),
                aFilters = [];
            console.log("sValue>>> ", sValue, "this.oSF>>", this.oSF);
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress: function (oEvent) { 

            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
            var that = this;
     
            console.log(" row " , row);

            if (approver.getData().Approvers[row].approver_type_code == undefined
                || approver.getData().Approvers[row].approver_type_code == "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                var oView = this.getView();
                console.log("handleEmployeeSelectDialogPress >>> this._oDialog ", this._oDialog);
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.md.moldApprovalList.view.Employee",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                    that.byId("btnEmployeeSrch").firePress();
                });
            }
        },
        /**
         * @description employee 팝업에서 search 버튼 누르기 
         */
        onEmployeeSearch: function () {

            var aSearchFilters = [];
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600'));
            var employee = this.byId('employSearch').getValue().trim();
            if (employee != undefined && employee != "" && employee != null) {
                var nFilters = [];

                nFilters.push(new Filter("approver_name", FilterOperator.Contains, String(employee)));
                nFilters.push(new Filter("employee_number", FilterOperator.Contains, String(employee)));

                var oInFilter = {
                    filters: nFilters,
                    and: false
                };
                aSearchFilters.push(new Filter(oInFilter));
            }

            this._bindView("/RefererSearch", "oEmployee", aSearchFilters, function (oData) {
                console.log("/RefererSearch ", oData);
            }.bind(this));

           // console.log(" oEmployee ", this.getModel('oEmployee'));

        },

        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply: function () {
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();

            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    approver_empno: oItem.getCells()[0].getText(),
                    approver_name: oItem.getCells()[1].getText()
                });
               this._setApprvalItemSetting( obj.oData ); 
            }.bind(this));
            this.onExitEmployee();
        },
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            if (this._oDialog) {
                this._oDialog.then(function (oDialog) {
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialog = undefined;
            }
        },
        _setApprvalItemSetting : function(obj){
      //  console.log("_setApprvalItemSetting  " , obj);
            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
              for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(row == i){
                     approver.getData().Approvers[i].approver_empno = obj.approver_empno;
                     approver.getData().Approvers[i].approver_name = obj.approver_name;
                  }
            }
             this.getModel("approver").refresh(true);
        },
        /**
         * today
         * @private
         * @return yyyy-mm-dd
         */
        _getToday: function () {
            var date_ob = new Date();
            var date = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();

            console.log(year + "-" + month + "-" + date);
            return year + "" + month + "" + date;
        },

        _commonDataSettingAndSubmit: function () {
            var that = this;
             
            this.setModel(new ManagedListModel(),'referer');
            var referModel = this.getModel('referer');
            var multi = this.byId("referMulti").getTokens();
            if(multi != undefined && multi.length > 0){
                multi.forEach(function(item){ 
                   // console.log(item);
                    referModel.addRecord({
                        "referer_empno": item.getKey(),
                        "approval_number": that.approval_number,
                        "tenant_id": that.tenant_id
                    }, "/Referers");
                });
            }

            var mst = this.getModel("appMaster").getData(),
                apr = this.getModel("approver").getData(),
                ref = this.getModel("referer").getData();
            var data = {};
            
            var approvalMaster = {
                tenant_id: this.tenant_id
                , approval_number: this.approval_number
                , company_code: this.company_code
                , org_code: this.plant_code
                , chain_code: 'DP' 
                , org_type_code : 'PL' 
                , approval_type_code: this.approval_type_code
                , approval_title: mst.approval_title
                , approval_contents: mst.approval_contents
                , approve_status_code: mst.approve_status_code
                , requestor_empno: mst.requestor_empno
                , request_date: this._getToday()
                , create_user_id: mst.requestor_empno
                , update_user_id: mst.requestor_empno
                , local_create_dtm: new Date()
                , local_update_dtm: new Date()
            };

            var aprArr = [];
            if (apr.Approvers != undefined && apr.Approvers.length > 0) {
                apr.Approvers.forEach(function (item) { 
                    if(item.approver_empno != "" && item.approver_empno != undefined){
                        aprArr.push({
                            tenant_id: that.tenant_id
                            , approval_number: that.approval_number
                            , approve_comment: item.approve_comment
                            , approve_sequence: item.approve_sequence
                            , approve_status_code: item.approve_status_code
                            , approver_type_code: item.approver_type_code
                            , approver_empno: item.approver_empno
                        });
                    }
                    
                });
            }

            var refArr = [];
            if (ref.Referers != undefined && ref.Referers.length > 0) {
                ref.Referers.forEach(function (item) {
                   // console.log("item", item);
                    if (item._row_state_ != "D") {
                        refArr.push({
                            tenant_id: that.tenant_id
                            , approval_number: that.approval_number
                            , referer_empno: item.referer_empno
                        });
                    }

                });
            }


            data = {
                inputData: {
                    approvalMaster: approvalMaster
                    , approvalDetails: this.approvalDetails_data
                    , approver: aprArr
                    , moldMaster: this.moldMaster_data
                    , referer: refArr
                    , quotation: this.quotation_data 
                    , asset : this.asset_data 
                }
            }

           // console.log("data>>>> ", data);

            var msg = this.getModel("I18N").getText("/NCM00001") ;
            var isOk = false;
            if(this.firstStatusCode == "AR" && this.getModel('appMaster').getProperty("/approve_status_code") == "DR"){ 
                isOk = true;
                msg = "요청 취소 하시겠습니까?";
            }else if(this.getModel('appMaster').getProperty("/approve_status_code") == "AR"){

                if(aprArr.length == 0){ 
                    isOk = false;
                     msg = "Approval Line 을 추가해 주세요.";   
                }else{
                    isOk = true;
                    msg = "결제 요청 하시겠습니까?";
                }
            }else{
                isOk = true;
            }

            if(isOk){

                var oView = this.getView();
                var that = this;
                MessageBox.confirm(msg, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) { 
                            this.firstStatusCode = that.getModel('appMaster').getProperty("/approve_status_code");
                            oView.setBusy(true);
                            that.callAjax(data, "saveMoldApproval"
                                , function(result){
                                    oView.setBusy(false);
                                    MessageToast.show(that.getModel("I18N").getText("/" + result.messageCode));
                                if (result.resultCode > -1) {
                                    that.onLoadThisPage(result);
                                }
                            });
                        }else{
                            // this.firstStatusCode   
                            that.getModel("appMaster").setProperty("/approve_status_code", that.firstStatusCode);
                        };
                    }
                });
            }else{
                MessageToast.show(msg);
                that.getModel("appMaster").setProperty("/approve_status_code", that.firstStatusCode);
            }
        },

        callAjax: function (data, fn , callback) {
            console.log("send data >>>> ", data);
            var url = "/dp/md/moldApprovalList/webapp/srv-api/odata/v4/dp.MoldApprovalV4Service/" + fn;

            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (result) { 
                    callback(result);
                },
                error: function (e) {
                    callback(e);
                }
            });
        },
        onLoadThisPage: function (param) {
            this.approval_number = param.approval_number;  //  저장후  this.approval_number 를 세팅 하여 한번 저장 후에는 업데이트 처리 되도록 !! 
            this._onRoutedThisPage(param.approval_number);
            this._onApprovalPage();
            this._toShowMode();
        }
    });
});