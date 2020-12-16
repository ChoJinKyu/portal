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
    "dp/util/controller/MoldItemSelection"
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, MoldItemSelection) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;
    var company_code,
        plant_code,
        approvalNumber;

    return BaseController.extend("dp.orderApprovalLocal.controller.PoaCreateObject", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

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

            this.setModel(oViewModel, "poaCreateObjectView");
            this.getRouter().getRoute("poaCreateObject").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("poaEditObject").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(new ManagedModel(), "company");
            this.getView().setModel(new ManagedModel(), "plant");

            this.getView().setModel(new JSONModel(Device), "device"); // file upload 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
            this.getView().setModel(new ManagedListModel(), "moldMaster");
            this.getView().setModel(new ManagedListModel(), "approver");
            this.getView().setModel(new ManagedListModel(), "referer");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("appDetail"));
            oTransactionManager.addDataModel(this.getModel("moldMaster"));
            oTransactionManager.addDataModel(this.getModel("approver"));
            //oTransactionManager.addDataModel(this.getModel("referer"));
            
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
            /*	var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    history.go(-1);
                } else {
                    this.getRouter().navTo("approvalList", {}, true);
                } */
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },


		/**
		 * Event handler for saving page changes
		 * @public
		 */
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

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function () {

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
            var oArgs = oEvent.getParameter("arguments");
            this._createViewBindData(oArgs);

            this.oSF = this.getView().byId("approverSearch");
        },
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant
         */
        _createViewBindData: function (args) {
            company_code = args.company_code, 
            plant_code = (args.org_code == undefined ? args.plant_code : args.org_code);

            this.getModel("poaCreateObjectView").setProperty('/editMode', plant_code != undefined ? true : false ); 
            
            var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Org_Company(tenant_id='L1100',company_code='" + company_code + "')", {
                filters: [],
                success: function (oData) {
                    
                }
            });

            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("org"));

            oModel2.read("/Org_Plant(tenant_id='L1100',company_code='" + company_code + "',plant_code='" + plant_code + "')", {
                filters: [],
                success: function (oData) {
                    
                }
            });

            approvalNumber = args.approval_number;
            
            if (approvalNumber) {
                this._onRoutedThisPage(approvalNumber);
            } else {
                this._onApproverAddRow(0);
            }
        },

        _onRoutedThisPage: function (approvalNumber) {
            var filter = [
                new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
                new Filter("approval_number", FilterOperator.EQ, approvalNumber)
            ];

            this._bindView("/ApprovalMasters(tenant_id='L1100',approval_number='" + approvalNumber + "')", "appMaster", [], function (oData) {
                this.oRichTextEditor.setValue(oData.approval_contents);
            }.bind(this));

            this._bindView("/ApprovalDetails", "appDetail", filter, function (oData) {
                var moldIdFilter = [];
                var moldMstFilter = [];

                if(oData.results.length > 0){
                    oData.results.forEach(function(item){
                        moldIdFilter.push(new Filter("mold_id", FilterOperator.EQ, item.mold_id ));
                    });

                    moldMstFilter.push(
                        new Filter({
                            filters: moldIdFilter,
                            and: false
                        })
                    );
                    
                    this._bindView("/MoldMasters", "moldMaster", moldMstFilter, function (oData) {
                        
                    }.bind(this));
                }
            }.bind(this));

            this._bindView("/Approvers", "approver", filter, function (oData) {
                this._onLoadApproverRow(oData.results);
            }.bind(this));

            this._bindView("/Referers", "referer", filter, function (oData) {
                
            }.bind(this));

            oTransactionManager.setServiceModel(this.getModel());
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
                        oModel.getData().Approvers[i].arrowDown = (approverData.length > 1 && approverData[approverData.length-1].approver_empno !== "") ? "sap-icon://arrow-bottom" : "";
                        oModel.getData().Approvers[i].editMode = false;
                        oModel.getData().Approvers[i].trashShow = true;
                    } else { // 중간 꺼는 위아래 화살표 모두
                        oModel.getData().Approvers[i].arrowUp = "sap-icon://arrow-top";
                        oModel.getData().Approvers[i].arrowDown = approverData.length-1 === i ? "" : "sap-icon://arrow-bottom";
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
            if (oModel.oData.undefined == undefined || oModel.oData.undefined == null) {
                console.log(oModel);
            }
            oModel.addRecord({
                "tenant_id": "L1100",
                "approval_number": approvalNumber,
                "approve_sequence": (Number(appSeq) + 1) + "",
                "approver_type_code": "",
                "approver_empno": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
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

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel("poaCreateObjectView"),
                oElementBinding = oView.getElementBinding();
            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("mainObjectNotFound");
                return;
            }
            oViewModel.setProperty("/busy", false);
        },
        /**
         * @description Purchase Order Item 의 delete 버튼 누를시 
         */
        onPoItemDelRow: function () {
            var oTable = this.byId("poItemTable"),
                oModel = this.getModel("appDetail"),
                oSelected = oTable.getSelectedIndices().reverse();

            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    oModel.removeRecord(idx)
                });

                oTable.clearSelection();
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },
/*
        onValueHelpOkPress: function (oEvent) { // row 에 데이터 세팅 
            var aTokens = oEvent.getParameter("tokens");
            var poItemTable = this.byId("poItemTable")
                , psModel = this.getModel("appDetail")
                , oSelected = poItemTable.getSelectedIndices()
                ;
            if (aTokens.length == 0) {
                MessageBox.error("Supplier를 하나이상 선택해주세요.");
            } else {
                oSelected.forEach(function (idx) {
                    psModel.getData().undefined[idx].moldSupplier1 = (aTokens[0] == undefined ? "" : aTokens[0].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier2 = (aTokens[1] == undefined ? "" : aTokens[1].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier3 = (aTokens[2] == undefined ? "" : aTokens[2].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier4 = (aTokens[3] == undefined ? "" : aTokens[3].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier5 = (aTokens[4] == undefined ? "" : aTokens[4].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier6 = (aTokens[5] == undefined ? "" : aTokens[5].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier7 = (aTokens[6] == undefined ? "" : aTokens[6].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier8 = (aTokens[7] == undefined ? "" : aTokens[7].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier9 = (aTokens[8] == undefined ? "" : aTokens[8].mProperties.text);
                    psModel.getData().undefined[idx].moldSupplier10 = (aTokens[9] == undefined ? "" : aTokens[9].mProperties.text);

                });

                poItemTable.getModel("appDetail").refresh(true);
                this._oSupplierDialog.close();
            }

            console.log("psModel >>", psModel);
            //	this._oMultiInput.setTokens(aTokens);	
        },
        onValueHelpCancelPress: function () {
            this._oSupplierDialog.close();
        },
        _oFragments: {},
        onCheck: function () { console.log("onCheck") },
*/
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
         * @description : Popup 창 : 품의서 Participating Supplier 항목의 Add 버튼 클릭
         */
        onPoItemAddRow: function (oEvent) {
            var oModel = this.getModel("appDetail");

            var mIdArr = [];
            if(oModel.oData.ApprovalDetails != undefined && oModel.oData.ApprovalDetails.length >0){
                oModel.oData.ApprovalDetails.forEach(function(item){
                    mIdArr.push(item.mold_id);
                });
            }
            
            var oArgs = {
                company_code: company_code,
                org_code: plant_code,
                mold_progress_status_code : 'DEV_RCV',
                mold_id_arr : mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }
            
            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs, function (oDataMold) {
                if (oDataMold.length > 0) {
                    oDataMold.forEach(function (item) {
                        this._addMoldItemTable(item);
                    }.bind(this))
                }
            }.bind(this));
        },

        /**
         * @description Mold Item row 추가 
         * @param {*} data 
         */
        _addMoldItemTable: function (data) {
            var oModel = this.getModel("appDetail");

            oModel.addRecord({
                "tenant_id": "L1100",
                "approval_number": approvalNumber,
                "mold_id": data.oData.mold_id+"",
                "model": data.oData.model,
                "mold_number": data.oData.mold_number,
                "mold_sequence": data.oData.mold_sequence,
                "spec_name": data.oData.spec_name,
                "mold_item_type_code": data.oData.mold_item_type_code,
                "book_currency_code": data.oData.book_currency_code,
                "provisional_budget_amount": data.oData.provisional_budget_amount,
                "currency_code": data.oData.currency_code,
                "purchasing_amount": data.oData.purchasing_amount,
                "supplier_code": data.oData.supplier_code,
                "target_amount": data.oData.target_amount,
                "mold_production_type_code": data.oData.mold_production_type_code,
                "family_part_number_1": data.oData.family_part_number_1,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ApprovalDetails", 0);
            //this.validator.clearValueState(this.byId("poItemTable"));
        },

        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
        },
        /**
        * @description  Participating Supplier Fragment Apply 버튼 클릭시 
        */
        /*onMoldItemSelectionApply: function (oEvent) {
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    mold_id: oItem.getCells()[0].getText(),
                    model: oItem.getCells()[1].getText(),
                    moldNo: oItem.getCells()[2].getText(),
                    moldSequence: oItem.getCells()[3].getText(),
                    specName: oItem.getCells()[4].getText(),
                    moldItemType: oItem.getCells()[5].getText(),
                    book_currency_code: oItem.getCells()[6].getText(),
                    budgetAmount: oItem.getCells()[7].getText()
                });

                that._addMoldItemTable(obj);

            });
            this.onExit();
        },
*/
        /**
         * @description  Participating Supplier Fragment 몇개 선택 되어 있는지 표기 하기 위함
         */
        /*selectMoldItemChange: function (oEvent) {
            var oTable = this.byId("moldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var appInfoModel = this.getModel("poaCreateObjectView");
            appInfoModel.setData({ moldItemLength: aItems == undefined ? 0 : aItems.length });
        },*/

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
            if (aItems[aItems.length - 1].mAggregations.cells[1].mProperties.selectedKey == undefined
                || aItems[aItems.length - 1].mAggregations.cells[1].mProperties.selectedKey == "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                var oView = this.getView();
                
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.orderApprovalLocal.view.Employee",
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
                    approver_empno: oItem.getCells()[0].getText()
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
            approverData[approverData.length-1].approver_empno = obj.oData.approver_empno;
            
            this._onLoadApproverRow(approverData);
        },

        onSortUp: function (oParam) {
            var oTable = this.byId("ApproverTable");
            var aItems = oTable.getItems();
            var oldItems = [];

            aItems.forEach(function (oItem) {
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });
            
            var actionData = {};
            var reciveData = {};

            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oParam == oldItems[i].approve_sequence) {
                    actionData = {
                        "approve_sequence": (Number(oldItems[i].approve_sequence) - 1) + "",
                        "approver_type_code": oldItems[i].approver_type_code,
                        "approver_empno": oldItems[i].approver_empno,
                    };
                    reciveData = {
                        "approve_sequence": (Number(oldItems[i - 1].approve_sequence) + 1) + "",
                        "approver_type_code": oldItems[i - 1].approver_type_code,
                        "approver_empno": oldItems[i - 1].approver_empno,
                    }
                }
            }

            var nArray = [];
            for (var j = 0; j < oldItems.length - 1; j++) {
                if (oldItems[j].approve_sequence == actionData.approve_sequence) {
                    nArray.push(actionData);
                } else if (oldItems[j].approve_sequence == reciveData.approve_sequence) {
                    nArray.push(reciveData);
                } else {
                    nArray.push(oldItems[j])
                }
            }

            this.setApproverData(nArray);
        },

        onSortDown: function (oParam) {
            var oTable = this.byId("ApproverTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            
            aItems.forEach(function (oItem) {
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });
            
            var actionData = {};
            var reciveData = {};

            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oParam == oldItems[i].approve_sequence) {
                    actionData = {
                        "approve_sequence": (Number(oldItems[i].approve_sequence) + 1) + "",
                        "approver_type_code": oldItems[i].approver_type_code,
                        "approver_empno": oldItems[i].approver_empno,
                    };
                    reciveData = {
                        "approve_sequence": (Number(oldItems[i + 1].approve_sequence) - 1) + "",
                        "approver_type_code": oldItems[i + 1].approver_type_code,
                        "approver_empno": oldItems[i + 1].approver_empno,
                    }
                }
            }

            var nArray = [];
            for (var j = 0; j < oldItems.length - 1; j++) {
                if (oldItems[j].approve_sequence == actionData.approve_sequence) {
                    nArray.push(actionData);
                } else if (oldItems[j].approve_sequence == reciveData.approve_sequence) {
                    nArray.push(reciveData);
                } else {
                    nArray.push(oldItems[j])
                }
            }

            this.setApproverData(nArray);
        },
        setApproverRemoveRow: function (oParam) {
            var oTable = this.byId("ApproverTable");
            var aItems = oTable.getItems();
            var oldItems = [];

            aItems.forEach(function (oItem) {
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });
            var nArray = [];
            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oParam != oldItems[i].approve_sequence) {
                    nArray.push(oldItems[i]);
                }
            }
            this.setApproverData(nArray);
        },

        setApproverData: function (dataList) {
            this.getView().setModel(new ManagedListModel(), "approver"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("approver");
            var noCnt = 1;

            for (var i = 0; i < dataList.length; i++) {
                if (dataList.length > 0 && i == 0) { // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    oModel.addRecord({
                        "approve_sequence": noCnt,
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "arrowUp": "",
                        "arrowDown": dataList.length === 1 ? "" : "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Approvers");
                } else if (i == dataList.length - 1) {
                    oModel.addRecord({ // 마지막 꺼는 밑으로 가는거 없음  
                        "approve_sequence": noCnt,
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "",
                        "editMode": false,
                        "trashShow": true,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Approvers");

                } else {
                    oModel.addRecord({ // 중간 꺼는 위아래 화살표 모두 
                        "approve_sequence": noCnt,
                        "approver_type_code": dataList[i].approver_type_code,
                        "approver_empno": dataList[i].approver_empno,
                        "arrowUp": "sap-icon://arrow-top",
                        "arrowDown": "sap-icon://arrow-bottom",
                        "editMode": false,
                        "trashShow": true,
                        "local_create_dtm": new Date(),
                        "local_update_dtm": new Date()
                    }, "/Approvers");
                }
                noCnt++;
            }

            /** 마지막 Search 하는 Row 담는 작업 */
            oModel.addRecord({
                "tenant_id": "L1100",
                "approval_number": approvalNumber,
                "approve_sequence": noCnt,
                "approver_type_code": "",
                "approver_empno": "",
                "arrowUp": "",
                "arrowDown": "",
                "editMode": true,
                "trashShow": false,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/Approvers");
        },

        handleSelectionChangeReferer: function (oEvent) { // Referrer 
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            var state = "Selected";
            if (!isSelected) {
                state = "Deselected";
            }

            /*MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
                width: "auto"
            });*/
        },

        handleSelectionFinishReferer: function (oEvent) { // Referrer 
            var selectedItems = oEvent.getParameter("selectedItems");
            var messageText = "Event 'selectionFinished': [";

            for (var i = 0; i < selectedItems.length; i++) {
                messageText += "'" + selectedItems[i].getText() + "'";
                if (i != selectedItems.length - 1) {
                    messageText += ",";
                }
            }

            messageText += "]";

            /*MessageToast.show(messageText, {
                width: "auto"
            });*/
        },

        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
            /*oModel.getData().Approvers[jdx].local_create_dtm = new Date();
            approverData = verModel.getData().Approvers;*/
            console.log();
            console.log();
        },

        onPageDraftButtonPress: function () {
            var oView = this.getView(),
                mstModel = this.getModel("appMaster"),
                dtlModel = this.getModel("appDetail"),
                moldModel = this.getModel("moldMaster"),
                verModel = this.getModel("approver");
            
            MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);

                        var appDtlData = dtlModel.getData().ApprovalDetails,
                            approverData = verModel.getData().Approvers,
                            moldMstData = moldModel.getData().MoldMasters;

                        //oTransactionManager.addDataModel(verModel);

                        for (var idx = 0; idx < appDtlData.length; idx++) {
                            delete appDtlData[idx].model;
                            delete appDtlData[idx].mold_number;
                            delete appDtlData[idx].mold_sequence;
                            delete appDtlData[idx].spec_name;
                            delete appDtlData[idx].mold_item_type_code;
                            delete appDtlData[idx].book_currency_code;
                            delete appDtlData[idx].provisional_budget_amount;
                            delete appDtlData[idx].currency_code;
                            delete appDtlData[idx].purchasing_amount;
                            delete appDtlData[idx].supplier_code;
                            delete appDtlData[idx].target_amount;
                            delete appDtlData[idx].mold_production_type_code;
                            delete appDtlData[idx].family_part_number_1;
                        }

                        for (var mdx = 0; mdx < moldMstData.length; mdx++) {
                            moldMstData[mdx].split_pay_flag = oView.byId("partialPayment").mProperties.selected;
                            moldMstData[mdx].prepay_rate = oView.byId("advanced").mProperties.value;
                            moldMstData[mdx].progresspay_rate = oView.byId("part").mProperties.value;
                            moldMstData[mdx].rpay_rate = oView.byId("residual").mProperties.value;
                        }

                        for (var jdx = 0; jdx < approverData.length; jdx++) {
                            delete approverData[jdx].arrowUp;
                            delete approverData[jdx].arrowDown;
                            delete approverData[jdx].editMode;
                            delete approverData[jdx].trashShow;
                        }
                        verModel.removeRecord(approverData.length-1)

                        console.log(oTransactionManager);
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