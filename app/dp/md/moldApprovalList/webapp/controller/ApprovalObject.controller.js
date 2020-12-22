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
    "dp/md/BudgetExecutionApproval",
    "dp/md/PurchaseOrderItemLocal",
    "dp/md/util/controller/MoldItemSelection"
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, BudgetExecutionApproval, PurchaseOrderItemLocal, MoldItemSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;

    return BaseController.extend("dp.md.moldApprovalList.controller.ApprovalObject", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

        budget : new BudgetExecutionApproval(),

        orderLocal : new PurchaseOrderItemLocal(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.setModel(oViewModel, "approvalObjectView");
            this.getRouter().getRoute("approvalObject").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(new ManagedModel(), "company");
            this.getView().setModel(new ManagedModel(), "plant");
            this.getView().setModel(new ManagedModel(), "appType");

            this.getView().setModel(new JSONModel(Device), "device"); // file upload 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedListModel(), "approver");
            this.getView().setModel(new ManagedListModel(), "referer");

            // search view 
            this.getView().setModel(new ManagedListModel(), "approverView");
            this.getView().setModel(new ManagedListModel(), "refererView");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("approver"));
            oTransactionManager.addDataModel(this.getModel("referer"));

            this.setRichEditor();
        },

        onAfterRendering: function () {

        },
        /**
         * 폅집기 창 
         */
        setRichEditor: function () {
            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                function (RTE, EditorType) {
                    this.oRichTextEditor = new RTE("myRTE", {
                        editorType: EditorType.TinyMCE4,
                        width: "100%",
                        height: "600px",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: "",
                        ready: function () {
                            this.addButtonGroup("styleselect").addButtonGroup("table");
                        }
                    });

                    this.getView().byId("approvalContents").addContent(this.oRichTextEditor);

                    this.oRichTextEditor.attachEvent("change", function (oEvent) {
                        this.getModel('appMaster').setProperty('/approval_contents', oEvent.getSource().getValue());
                    });
                }.bind(this));
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
            	var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    history.go(-1);
                } else {
                    this.getRouter().navTo("approvalList", {}, true);
                } 
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        /*onPageEditButtonPress: function () {
            this._toEditMode();
        },*/


		/**
		 * Event handler for saving page changes
		 * @public
		 *//*
       onPageSaveButtonPress: function () {
           var oView = this.getView(),
               me = this,
               oMessageContents = this.byId("inputMessageContents");

           if (!oMessageContents.getValue()) {
               oMessageContents.setValueState(sap.ui.core.ValueState.Error);
               return;
           }
           MessageBox.confirm("Are you sure ?", {
               title: "Comfirmation",
               initialFocus: sap.m.MessageBox.Action.CANCEL,
               onClose: function (sButton) {
                   if (sButton === MessageBox.Action.OK) {
                       oView.setBusy(true);
                       oView.getModel().submitBatch("odataGroupIdForUpdate").then(function (ok) {
                           me._toShowMode();
                           oView.setBusy(false);
                           MessageToast.show("Success to save.");
                       }).catch(function (err) {
                           MessageBox.error("Error while saving.");
                       });
                   };
               }
           });
       },
*/
		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        //onPageCancelEditButtonPress: function () {

        //},

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
            var oArgs = oEvent.getParameter("arguments");
            this._createViewBindData(oArgs);

            this.oSF = this.getView().byId("approverSearch");
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant
         */
        _createViewBindData: function (args) {
            this.tenant_id = "L1100";
            this.approval_number = args.approval_number;
            this.approval_type_code = args.approval_type_code;
            this.company_code = args.company_code;
            this.plant_code = (args.org_code == undefined ? args.plant_code : args.org_code);

            this.getModel("approvalObjectView").setProperty('/editMode', this.plant_code != undefined ? true : false);

            var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Company(tenant_id='" + this.tenant_id + "',company_code='" + this.company_code + "')", {
                filters: [],
                success: function (oData) {

                }
            });

            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("org"));

            oModel2.read("/Plant(tenant_id='" + this.tenant_id + "',company_code='" + this.company_code + "',plant_code='" + this.plant_code + "')", {
                filters: [],
                success: function (oData) {

                }
            });

            var appModel = this.getModel("appType");
            appModel.setTransactionModel(this.getModel("util"));
            appModel.read("/CodeDetails(tenant_id='" + this.tenant_id + "',group_code='DP_MD_APPROVAL_TYPE',code='" + this.approval_type_code + "')", {
                filters: [],
                success: function (oData) {
                    this._showFormFragment(oData.parent_code);
                }.bind(this)
            });

            if (this.approval_number === "New") {
                this._onApproverAddRow(0);
            } else {
                this._onRoutedThisPage(this.approval_number);
            }
        },

        _oFragments: {},
        _showFormFragment: function (fragmentName) {
            var oPageSection = this.byId("pageSection");
            oPageSection.removeAllBlocks();

            if(this.approval_type_code == "B"){
               this.budget.openFragmentApproval(this); 
            } else if(this.approval_type_code == "V"){
                this.orderLocal.openFragmentApproval(this);
            }else{
                /** 추후 공통 개발 가이드가 오면 이 함수로 호출 할 예정 */
                this._loadFragment(fragmentName, function (oFragment) {
                    oPageSection.addBlock(oFragment);
                }.bind(this))
            }
           
        },

        _onRoutedThisPage: function (approvalNumber) {
            console.log(" approvalNumber >>> " , approvalNumber);
           
            var filter = [
                new Filter("tenant_id", FilterOperator.EQ, this.tenant_id),
                new Filter("approval_number", FilterOperator.EQ, approvalNumber)
            ];

            this._bindView("/ApprovalMasters(tenant_id='" + this.tenant_id + "',approval_number='" + approvalNumber + "')", "appMaster", [], function (oData) {
                this.oRichTextEditor.setValue(oData.approval_contents);
            }.bind(this));

            this._bindView("/Approvers", "approver", filter, function (oData) { 
                console.log(" Approvers >> " , oData);
                this._onLoadApproverRow(oData.results);
            }.bind(this));

            console.log(" Approvers >>> " , approvalNumber);

            this._bindView("/Referers", "referer", filter, function (oData) {
                if (oData.results.length > 0) {
                    oData.results.forEach(function (item) {
                        this.getView().byId("refererMultiCB").mProperties.selectedKeys.push(item.referer_empno);
                    }.bind(this));
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
        _onLoadApproverRow: function (approverData) {
            var oModel = this.getModel("approver");

            /** 기존 데이터에 화살표, 휴지통 추가 */
            if (approverData.length > 0) {
                for (var i = 0; i < approverData.length; i++) {

                    if (Number(oModel.getData().Approvers[i].approve_sequence) === 1) { // 첫Line은 bottom 으로 가는 화살표만 , Data가 1Row인 경우 화살표 없음 
                        oModel.getData().Approvers[i].arrowUp = "";
                        oModel.getData().Approvers[i].arrowDown = (approverData.length > 1 && approverData[approverData.length - 1].approver_empno !== "") ? "sap-icon://arrow-bottom" : "";
                        oModel.getData().Approvers[i].editMode = false;
                        oModel.getData().Approvers[i].trashShow = true;
                    } else { // 중간 꺼는 위아래 화살표 모두
                        oModel.getData().Approvers[i].arrowUp = "sap-icon://arrow-top";
                        oModel.getData().Approvers[i].arrowDown = approverData.length - 1 === i ? "" : "sap-icon://arrow-bottom";
                        oModel.getData().Approvers[i].editMode = false;
                        oModel.getData().Approvers[i].trashShow = true;
                    }
                }
            }
            /** 마지막 Search 하는 Row 담는 작업 */
            this._onApproverAddRow(approverData.length);
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
                    approver_empno: oItem.getCells()[0].getText() ,
                    approver_name : oItem.getCells()[1].getText()
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

            this._onLoadApproverRow(approverData);
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
                        "approver_name": approverData[i -1].approver_name,
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
        },

        handleSelectionFinishReferer: function (oEvent) { // Referrer 
            oEvent.getParameter("selectedItems");
        },

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

    });
});