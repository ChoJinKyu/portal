sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
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
    //  "./ApprovalList.controller",
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalList

) {
    "use strict";

    var oTransactionManager;
    //var oRichTextEditor;
    var generalInfoFragment, 
        attachmentsFragment,
        approvalLineFragment,
        itemFragment;

    return BaseController.extend("dp.md.moldApprovalList.controller.ApprovalBaseController", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        //  approvalList: new ApprovalList(),
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // 각자 fragment 에서 세팅할 테이터 
            this.approvalDetails_data = [];
            this.moldMaster_data = [];
            this.quotation_data = [];  // supplier 전용 
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
           // this._showFormFragment();
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
                if (!this._oFragments.hasOwnProperty(sPropertyName) || this._oFragments[sPropertyName] == null) {
                    return;
                }
               
              //  if(sPropertyName !== "GeneralInfo"){
                    this._oFragments[sPropertyName].destroy();
                    this._oFragments[sPropertyName] = null;
                    console.log(sPropertyName);
              //  }
            }

            //this.byId("pageApprovalLineSection").destroy();
            /*this.generalInfoFragment.destroy();
            this.attachmentsFragment.destroy();
            this.approvalLineFragment.destroy();
            this.itemFragment.destroy();*/
            //  this.approvalList.onPageReload();
            /*
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("approvalList", {}, true);
            }*/
        },

        onPageEditButtonPress: function () { // Edit 버튼 
            this._toEditMode();
        },

        onPageCancelEditButtonPress: function () { // 수정 취소 버튼 
            this._toShowMode();
        },

        // 입찰대상 협력사 취소품의 이동 
        onPageCancellationButtonPress: function () {

            /**
             * 이동시 기존거 리셋 
             */
            for (var sPropertyName in this._oFragments) {
                if (!this._oFragments.hasOwnProperty(sPropertyName) || this._oFragments[sPropertyName] == null) {
                    return;
                }
               
                this._oFragments[sPropertyName].destroy();
                this._oFragments[sPropertyName] = null;
            }

            var Cancellation = this.getView().getModel('Cancellation');
            Cancellation.setProperty("/approvalNumber", this.approval_number);
            Cancellation.setProperty("/isCreate", true);
            this.getRouter().navTo("participatingSupplierSelectionCancelApproval", {
                company_code: this.company_code
                , plant_code: this.plant_code
                , approval_type_code: "A"
                , approval_number: "New"
            });
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

            this.getView().setModel(new JSONModel(Device), "device"); // file upload 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedModel(), "moldMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
            this.getView().setModel(new ManagedListModel(), "approver");
            this.getView().setModel(new ManagedListModel(), "referer");

            // refererMultiCB 
            this.getView().setModel(new ManagedModel(), "refererMultiCB");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("moldMaster"));
            oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("approver"));
            oTransactionManager.addDataModel(this.getModel("referer"));

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

            this.tenant_id = "L1100";
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
                + "',org_type_code='" + "AU"
                + "',org_code='" + this.plant_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("orgName ", oData);
                }
            });

            var appModel = this.getModel("appType");
            appModel.setTransactionModel(this.getModel("util"));
            appModel.read("/CodeDetails(tenant_id='" + this.tenant_id + "',group_code='DP_MD_APPROVAL_TYPE',code='" + this.approval_type_code + "')", {
                filters: [],
                success: function (oData) {
                    this._showFormItemFragment(oData.parent_code);
                }.bind(this)
            });
           

            this._onRoutedThisPage(this.approval_number);

            if (this.approval_number === "New") {
                this.getModel("appMaster").setProperty("/requestor_empno", "140790"); // 나중에 세션 값 세팅 할 것 
                this.getModel("appMaster").setProperty("/request_date", this._getToday());
            }

            this._onApprovalPage(); // 이거 공통으로 각자 페이지에 하나 만듭시다 - this.approval_number 가 로드 된 후에 처리 해야 하는데 

        },

        _toEditMode: function () {
            this._onEditApproverRow();

            var oUiModel = this.getView().getModel("mode");
            oUiModel.setProperty("/editFlag", true);
            oUiModel.setProperty("/viewFlag", false);
            //this.byId("titleInput").removeStyleClass("readonlyField");

            this._toEditModeEachApproval();//품의서 별로 추가해서 처리해야 하는 내용 입력
        },

        _toShowMode: function () {
            this._onShowApproverRow();

            var oUiModel = this.getView().getModel("mode");
            oUiModel.setProperty("/editFlag", false);
            oUiModel.setProperty("/viewFlag", true);
            //this.byId("titleInput").addStyleClass("readonlyField");

            this._toShowModeEachApproval();//품의서 별로 추가해서 처리해야 하는 내용 입력
        },

        _oFragments: {},
        _showFormFragment: function () { // 이것은 init 시 한번만 호출됨 

            var oPageGeneralInfoSection = this.byId("pageGeneralInfoSection");
            oPageGeneralInfoSection.removeAllBlocks();

            generalInfoFragment = this._loadFragment("GeneralInfo", function (oFragment) {
                oPageGeneralInfoSection.addBlock(oFragment);
            }.bind(this))
        },

        _showFormItemFragment: function (fragmentFileName) {
            this._showFormFragment();
            var oPageAttachmentsSection = this.byId("pageAttachmentsSection");
            oPageAttachmentsSection.removeAllBlocks();

            attachmentsFragment = this._loadFragment("Attachments", function (oFragment) {
                oPageAttachmentsSection.addBlock(oFragment);
            }.bind(this))

            var oPageApprovalLineSection = this.byId("pageApprovalLineSection");
            oPageApprovalLineSection.removeAllBlocks();

            approvalLineFragment = this._loadFragment("ApprovalLine", function (oFragment) {
                oPageApprovalLineSection.addBlock(oFragment);
            }.bind(this));

            var oPageItemSection = this.byId("pageItemSection");
            oPageItemSection.removeAllBlocks();

            itemFragment = this._loadFragment(fragmentFileName, function (oFragment) {
                oPageItemSection.addBlock(oFragment);
            }.bind(this));

        },

        _onRoutedThisPage: function (approvalNumber) {
            console.log(" approvalNumber >>> ", approvalNumber);

            var filter = [
                new Filter("tenant_id", FilterOperator.EQ, this.tenant_id),
                new Filter("approval_number", FilterOperator.EQ, approvalNumber)
            ];

            if (approvalNumber !== "New") {
                this._bindView("/AppMaster(tenant_id='" + this.tenant_id + "',approval_number='" + approvalNumber + "')", "appMaster", [], function (oData) {

                    console.log(" oData >>> ", oData);
                    //this.oRichTextEditor.setValue(oData.approval_contents);
                }.bind(this));
            }
            this._bindView("/ApprovalDetails", "appDetail", filter, function (oData) {

            }.bind(this));

            this._bindView("/Approvers", "approver", filter, function (oData) {
                if (approvalNumber === "New") {
                    this._toEditMode();
                }
            }.bind(this));

            console.log(" Approvers >>> ", approvalNumber);
            var refererMultiCB = this.getModel('refererMultiCB');
            this._bindView("/Referers", "referer", filter, function (oData) {
                if (oData.results.length > 0) {
                    var rList = [];
                    oData.results.forEach(function (item) {
                        rList.push(item.referer_empno);
                        // this.getView().byId("refererMultiCB").mProperties.selectedKeys.push(item.referer_empno);
                    }.bind(this));
                    refererMultiCB.setProperty("/refer", rList);
                }
            }.bind(this));

            oTransactionManager.setServiceModel(this.getModel());
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

        /**
         * @description Approval Row에 add 하기 
         */
        _onEditApproverRow: function () {
            var oModel = this.getModel("approver"),
                approverData = oModel.getData().Approvers,
                rowCount = 0;

            /** 기존 데이터에 화살표, 휴지통 추가 */
            if (approverData !== undefined && approverData.length > 0) {
                rowCount = approverData.length;
                for (var i = 0; i < rowCount; i++) {

                    if (Number(oModel.getData().Approvers[i].approve_sequence) === 1) { // 첫Line은 bottom 으로 가는 화살표만 , Data가 1Row인 경우 화살표 없음 
                        oModel.getData().Approvers[i].arrowUp = "";
                        oModel.getData().Approvers[i].arrowDown = (rowCount > 1 && approverData[rowCount - 1].approver_empno !== "") ? "sap-icon://arrow-bottom" : "";
                        oModel.getData().Approvers[i].editMode = false;
                        oModel.getData().Approvers[i].trashShow = true;
                    } else { // 중간 꺼는 위아래 화살표 모두
                        oModel.getData().Approvers[i].arrowUp = "sap-icon://arrow-top";
                        oModel.getData().Approvers[i].arrowDown = rowCount - 1 === i ? "" : "sap-icon://arrow-bottom";
                        oModel.getData().Approvers[i].editMode = false;
                        oModel.getData().Approvers[i].trashShow = true;
                    }
                }
            }
            /** 마지막 Search 하는 Row 담는 작업 */
            this._onApproverAddRow(rowCount);
        },

        /**
         * @description  // Approver row 추가 (employee)
         */
        _onApproverAddRow: function (appSeq) {
            var oModel = this.getModel("approver");

            oModel.addRecord({
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "approve_sequence": (Number(appSeq) + 1) + "",
                "approver_type_code": "",
                "approver_empno": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false
            }, "/Approvers");
        },

        /**
         * @description Approval Row에 View
         */
        _onShowApproverRow: function () {
            var oModel = this.getModel("approver"),
                approverData = oModel.getData().Approvers;

            if (approverData.length > 0) {
                for (var i = 0; i < approverData.length; i++) {
                    oModel.getData().Approvers[i].arrowUp = "";
                    oModel.getData().Approvers[i].arrowDown = "";
                    oModel.getData().Approvers[i].editMode = false;
                    oModel.getData().Approvers[i].trashShow = false;
                }
                if (approverData[approverData.length - 1].approver_empno === "") {
                    oModel.removeRecord(approverData.length - 1);
                }
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
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            this.byId("dialogEmployeeSelection").close();
            // this.byId("dialogEmployeeSelection").destroy();
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress: function (oEvent) {
            var oTable = this.byId("ApproverTable");

            var aItems = oTable.getItems();
            if (aItems[aItems.length - 1].mAggregations.cells[2].mProperties.selectedKey == undefined
                || aItems[aItems.length - 1].mAggregations.cells[2].mProperties.selectedKey == "") {
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
                });
            }
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
                this._approverAddRow(obj);
            }.bind(this));
            this.onExitEmployee();
        },

        /**
         * @description Approval Row에 add 하기 
         */
        _approverAddRow: function (obj) {
            var oModel = this.getModel("approver"),
                approverData = oModel.getData().Approvers;

            /** 선택한 데이터를 담음 */
            approverData[approverData.length - 1].approver_empno = obj.oData.approver_empno;
            approverData[approverData.length - 1].approver_name = obj.oData.approver_name;

            this._onEditApproverRow();
        },

        onApproverSortUp: function (oParam) {
            var oModel = this.getModel("approver"),
                approverData = oModel.getData().Approvers;

            var nArray = [],
                actionData = {},
                reciveData = {};

            for (var i = 0; i < approverData.length - 1; i++) {
                if (oParam == approverData[i].approve_sequence) {
                    actionData = {
                        "approve_sequence": (Number(approverData[i].approve_sequence) - 1) + "",
                        "approver_type_code": approverData[i].approver_type_code,
                        "approver_empno": approverData[i].approver_empno,
                        "approver_name": approverData[i].approver_name,
                        "arrowUp": approverData[i - 1].arrowUp,
                        "arrowDown": approverData[i - 1].arrowDown,
                        "editMode": approverData[i - 1].editMode,
                        "trashShow": approverData[i - 1].trashShow
                    };
                    nArray.push(actionData);
                    reciveData = {
                        "approve_sequence": (Number(approverData[i - 1].approve_sequence) + 1) + "",
                        "approver_type_code": approverData[i - 1].approver_type_code,
                        "approver_empno": approverData[i - 1].approver_empno,
                        "approver_name": approverData[i - 1].approver_name,
                        "arrowUp": approverData[i].arrowUp,
                        "arrowDown": approverData[i].arrowDown,
                        "editMode": approverData[i].editMode,
                        "trashShow": approverData[i].trashShow
                    };
                    nArray.push(reciveData);
                    oModel.removeRecord(i);
                    oModel.removeRecord(i - 1);
                }
            }

            for (var j = 0; j < nArray.length; j++) {
                oModel.addRecord({
                    "tenant_id": this.tenant_id,
                    "approval_number": this.approval_number,
                    "approve_sequence": nArray[j].approve_sequence,
                    "approver_type_code": nArray[j].approver_type_code,
                    "approver_empno": nArray[j].approver_empno,
                    "approver_name": nArray[j].approver_name,
                    "arrowUp": nArray[j].arrowUp,
                    "arrowDown": nArray[j].arrowDown,
                    "editMode": nArray[j].editMode,
                    "trashShow": nArray[j].trashShow
                }, "/Approvers", Number(nArray[j].approve_sequence) - 1);
            }
        },

        onApproverSortDown: function (oParam) {
            var oModel = this.getModel("approver"),
                approverData = oModel.getData().Approvers;

            var nArray = [],
                actionData = {},
                reciveData = {};

            for (var i = 0; i < approverData.length - 1; i++) {
                if (oParam == approverData[i].approve_sequence) {
                    reciveData = {
                        "approve_sequence": (Number(approverData[i + 1].approve_sequence) - 1) + "",
                        "approver_type_code": approverData[i + 1].approver_type_code,
                        "approver_empno": approverData[i + 1].approver_empno,
                        "approver_name": approverData[i + 1].approver_name,
                        "arrowUp": approverData[i].arrowUp,
                        "arrowDown": approverData[i].arrowDown,
                        "editMode": approverData[i].editMode,
                        "trashShow": approverData[i].trashShow
                    };
                    nArray.push(reciveData);
                    actionData = {
                        "approve_sequence": (Number(approverData[i].approve_sequence) + 1) + "",
                        "approver_type_code": approverData[i].approver_type_code,
                        "approver_empno": approverData[i].approver_empno,
                        "approver_name": approverData[i].approver_name,
                        "arrowUp": approverData[i + 1].arrowUp,
                        "arrowDown": approverData[i + 1].arrowDown,
                        "editMode": approverData[i + 1].editMode,
                        "trashShow": approverData[i + 1].trashShow
                    };
                    nArray.push(actionData);
                    oModel.removeRecord(i + 1);
                    oModel.removeRecord(i);
                }
            }

            for (var j = 0; j < nArray.length; j++) {
                oModel.addRecord({
                    "tenant_id": this.tenant_id,
                    "approval_number": this.approval_number,
                    "approve_sequence": nArray[j].approve_sequence,
                    "approver_type_code": nArray[j].approver_type_code,
                    "approver_empno": nArray[j].approver_empno,
                    "approver_name": nArray[j].approver_name,
                    "arrowUp": nArray[j].arrowUp,
                    "arrowDown": nArray[j].arrowDown,
                    "editMode": nArray[j].editMode,
                    "trashShow": nArray[j].trashShow
                }, "/Approvers", Number(nArray[j].approve_sequence) - 1);
            }
        },

        setApproverRemoveRow: function (oParam) {
            var oModel = this.getModel("approver"),
                oTable = this.byId("ApproverTable"),
                aItems = oTable.getItems(),
                oldItems = [],
                nArray = [];

            aItems.forEach(function (oItem) {
                var item = {
                    "approver_empno": oItem.mAggregations.cells[0].mProperties.text,
                    "approve_sequence": oItem.mAggregations.cells[1].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[2].mProperties.selectedKey,
                    "approver_name": oItem.mAggregations.cells[3].mProperties.value,
                }
                oldItems.push(item);
            });

            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oParam != oldItems[i].approve_sequence) {
                    nArray.push(oldItems[i]);
                }
            }

            for (var j = oModel.getData().Approvers.length - 1; j >= 0; j--) {
                oModel.removeRecord(j);
            }

            this.setApproverData(nArray);
        },

        setApproverData: function (dataList) {
            //this.getView().setModel(new ManagedListModel(), "approver"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함
            var oModel = this.getModel("approver");
            var noCnt = 1;

            for (var i = 0; i < dataList.length; i++) {
                if (dataList.length > 0 && i == 0) { // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "tenant_id": this.tenant_id,
                        "approval_number": this.approval_number,
                        "approve_sequence": noCnt + "",
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "approver_name": dataList[i].approver_name,
                        "arrowUp": "",
                        "arrowDown": dataList.length === 1 ? "" : "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    }, "/Approvers");
                } else if (i == dataList.length - 1) {
                    oModel.addRecord({ // 마지막 꺼는 밑으로 가는거 없음  
                        "tenant_id": this.tenant_id,
                        "approval_number": this.approval_number,
                        "approve_sequence": noCnt + "",
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "approver_name": dataList[i].approver_name,
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "",
                        "editMode": false,
                        "trashShow": true
                    }, "/Approvers");

                } else {
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "tenant_id": this.tenant_id,
                        "approval_number": this.approval_number,
                        "approve_sequence": noCnt + "",
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "approver_name": dataList[i].approver_name,
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true
                    }, "/Approvers");
                }
                noCnt++;
            }

            /** 마지막 Search 하는 Row 담는 작업 */
            oModel.addRecord({
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "approve_sequence": noCnt + "",
                "approver_type_code": "",
                "approver_empno": "",
                "approver_name": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false
            }, "/Approvers");
        },

        handleSelectionChangeReferer: function (oEvent) { // Referrer 
            var referModel = this.getModel('referer');
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            var state = "Selected";
            if (!isSelected) {
                state = "Deselected";
            }

            if (state == "Selected") {
                referModel.addRecord({
                    "referer_empno": changedItem.getKey(),
                    "approval_number": this.approval_number,
                    "tenant_id": this.tenant_id
                }, "/Referers");
            } else {
                for (var i = 0; i < referModel.getData().Referers.length; i++) {
                    if (referModel.getData().Referers[i].referer_empno == changedItem.getKey()) {
                        referModel.markRemoved(i);
                    }
                }
            }
            this.setRefererList();
        },

        setRefererList: function () {
            this.getView().setModel(new ManagedModel(), "refererMultiCB");
            var refererMultiCB = this.getModel('refererMultiCB');
            var referModel = this.getModel('referer');
            if (referModel.getData().Referers.length > 0) {
                var rList = [];
                referModel.getData().Referers.forEach(function (item) {
                    rList.push(item.referer_empno);
                }.bind(this));
                refererMultiCB.setProperty("/refer", rList);
            }

        },

        handleSelectionFinishReferer: function (oEvent) { // Referrer 
            oEvent.getParameter("selectedItems");
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

            var mst = this.getModel("appMaster").getData(),
                apr = this.getModel("approver").getData(),
                ref = this.getModel("referer").getData();
            var data = {};
            var that = this;
            var approvalMaster = {
                tenant_id: this.tenant_id
                , approval_number: this.approval_number
                , company_code: this.company_code
                , org_code: this.plant_code
                , chain_code: 'DP'
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
                    aprArr.push({
                        tenant_id: that.tenant_id
                        , approval_number: that.approval_number
                        , approve_comment: item.approve_comment
                        , approve_sequence: item.approve_sequence
                        , approve_status_code: item.approve_status_code
                        , approver_type_code: item.approver_type_code
                        , approver_empno: item.approver_empno
                    });
                });
            }

            var refArr = [];
            if (ref.Referers != undefined && ref.Referers.length > 0) {
                ref.Referers.forEach(function (item) {
                    console.log("item", item);
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
                }
            }

            console.log("data>>>> ", data);

            var oView = this.getView();
            var that = this;
             MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        that.callAjax(data, "saveMoldApproval"
                            , function(result){
                                oView.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/" + result.messageCode));
                            if (result.resultCode > -1) {
                                that.onLoadThisPage(result);
                            }

                        });
                    };
                }
            });
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

        /*

        onPageDraftButtonPress: function () {
            var oView = this.getView(),
                verModel = this.getModel("approver");

            MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);

                        var approverData = verModel.getData().Approvers;

                        for (var jdx = 0; jdx < approverData.length; jdx++) {
                            delete approverData[jdx].arrowUp;
                            delete approverData[jdx].arrowDown;
                            delete approverData[jdx].editMode;
                            delete approverData[jdx].trashShow;
                        }
                        verModel.removeRecord(approverData.length - 1)

                        oTransactionManager.submit({
                            success: function (ok) {
                                oView.setBusy(false);
                                MessageToast.show("Success to save.");
                            }
                        });
                    };
                }
            });
            

        }
        */
    });
});