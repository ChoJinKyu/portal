sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/UploadCollectionParameter",
    "sap/ui/Device", // fileupload 
    "sap/ui/core/syncStyleClass",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter", 
    "dp/md/util/controller/MoldItemSelection",
    "sap/ui/richtexteditor/RichTextEditor", 
    "dp/md/BudgetExecutionApproval"
  //  "sap/ui/richtexteditor/EditorType"
], function (BaseController, JSONModel, History, ManagedListModel, ManagedModel,  DateFormatter, Filter, FilterOperator, Fragment
    , MessageBox, MessageToast, UploadCollectionParameter, Device, syncStyleClass, ColumnListItem, Label
    , TransactionManager
    , Multilingual
    , Validator
    , Formatter
    , MoldItemSelection
    , RichTextEditor 
    , BudgetExecutionApproval 
    // ,EditorType
    ) {
    "use strict";
    /**
     * @description 예산집행품의 Create, update 화면 
     * @author jinseon.lee
     * @date 2020.12.01
     */
    var mainViewName = "beaCreateObjectView";

    var oTransactionManager;
    return BaseController.extend("dp.md.budgetExecutionApproval.controller.BeaCreateObject", {
        formatter: Formatter,
        dateFormatter: DateFormatter,
      //  validator: new Validator(), 
        moldItemPop: new MoldItemSelection(), 
        budget : new BudgetExecutionApproval(),
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

           /* 다국어 처리*/
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.tenant_id = 'L1100';
            this.approval_number = '';

            this.setModel(oViewModel, mainViewName);

            this.getRouter().getRoute("beaCreateObject").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("beaEditObject").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(new ManagedModel(), "company");
            this.getView().setModel(new ManagedModel(), "plant");

            this.getView().setModel(new JSONModel(Device), "device"); // file upload 

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
          //  this.getView().setModel(new ManagedListModel(), "mdItemMaster");
            this.getView().setModel(new ManagedListModel(), "Approvers"); // 승인자 
            this.getView().setModel(new ManagedListModel(), "Referer"); // 참조자 


            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("appDetail"));
            oTransactionManager.addDataModel(this.getModel("Referer"));
         //   oTransactionManager.addDataModel(this.getModel("mdItemMaster"));
            oTransactionManager.addDataModel(this.getModel("Approvers"));

            this.setRichEditor(); // 한번만 로드 
        },

        onAfterRendering: function () {

        },

        /**
         * 폅집기 창 
         */
        setRichEditor : function (){ 
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
                    
                    this.oRichTextEditor.attachEvent("change", function(oEvent){
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

        onPageCancelButtonPress: function (oEvent) {
            var oModel = this.getModel("appMaster")
                , oData = oModel.oData;

            this.getRouter().navTo("beaObject", {
                approval_number: oData.approval_number
            }, true)
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
            //this.setRichEditor();
            var oArgs = oEvent.getParameter("arguments");
            var mModel = this.getModel(mainViewName);
            console.log("[ step ] _onObjectMatched args ", oArgs);
            if (oArgs.approval_number) {
                this._onRoutedThisPage(oArgs);
                 var oPageSubSection2 = this.byId("pageChange");
                 this.budget.openFragmentApproval(this, oArgs);

            //  this._loadFragment("BudgetExecutionApproval", function(oFragment){
            //      oPageSubSection2.addBlock(oFragment);   
            //   }) 
            } else {
               
                this._onCreatePagetData(oArgs);
                this._onLoadApprovalRow();
            }
           // this._setMdMst(); // temp 데이터 
            this.oSF = this.getView().byId("searchField");
        },
        _setMdMst : function(){ 
            var oModel = this.getModel("mdItemMaster");
            // this.getView().setModel(new ManagedListModel(), "mdItemMaster"); 
             oModel.addRecord({
                "provisional_budget_amount": "553049.09",
                "investment_ecst_type_code": 'S',
                "accounting_department_code": '',
                "account_code": '18300311',
            }, "/MoldMasters", 0); 
        },
		/**
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onCreatePagetData : function (args) { 
            this.approval_number = '326857-20E-88848'; 
            var d = new Date(); 
            var oModel = this.getModel();
            var cParam = { 
                    "tenant_id": 'L1100',
                    "company_code":  args.company_code,
                    "org_type_code":  'AU' ,
                    "org_code": args.plant_code, 
                    "chain_code" : "DP",
                    "approval_type_code" : "B",
                    "requestor_empno" : "999999",
                    "approval_number" : this.approval_number,
                    "request_date" : this._getToday(),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()                     
            }
 
            this.getModel("appMaster").setData(cParam);
            this._createViewBindData(args); 
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
        /**
         * @description 초기 생성시 파라미터를 받고 들어옴 
         * @param {*} args : company , plant   
         */
        _createViewBindData: function (args) {
            console.log("[ step ] _createViewBindData args ", args);
            /** 초기 데이터 조회 */
            var company_code = args.company_code, plant_code = (args.org_code == undefined ? args.plant_code : args.org_code);
         
            this.getModel(mainViewName).setProperty('/editMode', args.org_code != undefined ? true : false ); 
            
            var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Org_Company(tenant_id='L1100',company_code='" + company_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Company oData>>> ", oData);
                }
            });

            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("org"));

            oModel2.read("/Org_Plant(tenant_id='L1100',company_code='" + company_code + "',plant_code='" + plant_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Plant oData>>> ", oData);
                }
            });

          

        },


        _onRoutedThisPage: function (args) {
            console.log("[step] _onRoutedThisPage args>>>> ", args); 
            // pageChange 
            this.approval_number = args.approval_number;
            var that = this;
            var schFilter = [new Filter("approval_number", FilterOperator.EQ, args.approval_number)
                , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
            ];

            this._bindView("/ApprovalMasters(tenant_id='L1100',approval_number='" + args.approval_number + "')"
                , "appMaster", [], function (oData) { 
                    console.log(" appMaster " , that.getModel("appMaster")); 
                that._createViewBindData(oData); // comapny , plant 조회 
                that.oRichTextEditor.setValue(oData.approval_contents);
            });

            this._bindView("/ApprovalDetails", "appDetail", schFilter, function (oData) {
                console.log("approvalDetails >>>> ", that.getModel("appDetail"));
                // that._bindView("/MoldMasters", "MoldMasterList", [
                //     new Filter("company_code", FilterOperator.EQ, sResult.company_code)
                //     , new Filter("org_code", FilterOperator.EQ, sResult.org_code)
                // ], function (oData) {
                // });
            });

            this._bindView("/Approver", "Approvers", schFilter, function (oData) {
                console.log("Approver >>>>>>", oData);
                 that._onLoadApprovalRow();
            });
   
            this._bindView("/Referers", "Referer", schFilter, function (oData) { 
                that.getView().byId("referrers");
			    if(oData.results.length > 0){ 
                    oData.results.forEach(function(rfData){
                        that.getView().byId("referrers").mProperties.selectedKeys.push(rfData.referer_empno);
                    });
                    
                }
            });
   
          
            console.log("ItemBudgetExecution >>>>>> 2 ");
            oTransactionManager.setServiceModel(this.getModel());
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
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
                oViewModel = this.getModel(mainViewName),
                oElementBinding = oView.getElementBinding();
            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("mainObjectNotFound");
                return;
            }
            oViewModel.setProperty("/busy", false);
        },
     
        _oFragments: {},
        onCheck: function () { console.log("onCheck") },

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
         * @description  // 파일 찾는 row 추가 (employee)
         */
        _onLoadApprovalRow: function () {
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("Approvers");
            if (oModel.oData.Approver == undefined || oModel.oData.Approver == null || oModel.oData.Approver.length == 0) {
                var p = {
                    approve_sequence: "1"
                }
                /** 마지막 Search 하는 Row 담는 작업 */
                this._setApprovalAddRow(p, oModel);
            }
        },
        /**
         * @description employee 이벤트 1
         */
        onSearch: function (event) {
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

            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("Approvers");
            var aItems = oTable.getItems();
            if (aItems[aItems.length - 1].mAggregations.cells[1].mProperties.selectedKey == undefined
                || aItems[aItems.length - 1].mAggregations.cells[1].mProperties.selectedKey == "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                console.group("handleEmployeeSelectDialogPress");
                var oView = this.getView();
                var oButton = oEvent.getSource();
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.md.budgetExecutionApproval.view.Employee",
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
            var that = this;
            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    user_name: oItem.getCells()[1].getText()
                    , employee_number: oItem.getCells()[0].getText()
                });
                that._approvalRowAdd(obj);
            });
            this.onExitEmployee();
        },

        /**
         * @description Approval Row에 add 하기 
         */
        _approvalRowAdd: function (obj) {
            var oTable = this.byId("ApprovalTable"),
                oModel = this.getModel("Approvers");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function (oItem) {
                //  console.log("oItem >>> " , oItem.mAggregations.cells[0].mProperties.text);
                //  console.log("oItem >>> " , oItem.mAggregations.cells[1].mProperties.selectedKey);
                //  console.log("oItem >>> " , oItem.mAggregations.cells[2].mProperties.value);
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });

            this.getView().setModel(new ManagedListModel(), "Approvers"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            oModel = this.getModel("Approvers");
            //  console.log("oldItems >>> " , oldItems);

            /** 기존 데이터를 새로 담는 작업 */
            var noCnt = 1;
            for (var i = 0; i < oldItems.length - 1; i++) { 

                var param = {
                    approve_sequence: noCnt,
                    approver_type_code: oldItems[i].approver_type_code,
                    approver_empno: oldItems[i].approver_empno
                }

                if (oldItems.length > 1 && i == 0) { // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                   this._setApprovalAddRow(param,oModel,"start");
                } else {
                   this._setApprovalAddRow(param,oModel,"middle"); 
                }
                noCnt++;
            }

            /** 신규 데이터를 담는 작업 */
            oModel.addRecord({
                "approve_sequence": noCnt,
                "approver_type_code": oldItems[oldItems.length - 1].approver_type_code, // 마지막에 select 한 내용으로 담음 
                "approver_empno": obj.oData.employee_number,
                "approve_status_code": "",
                "approve_comment": "",
                "arrowUp": noCnt == 1 ? "" : "sap-icon://arrow-top", // 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교
                "arrowDown": "",
                "editMode": false,
                "trashShow": true
            },"/Approver");
            /** 마지막 Search 하는 Row 담는 작업 */
            noCnt++; 
            this._setApprovalAddRow( {
                    approve_sequence: noCnt 
                },oModel);
        },
        onSortUp: function (oParam) {
            // console.log(" btn onSortUp >>> ", oParam);

            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function (oItem) {
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
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
            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oldItems[i].approve_sequence == actionData.approve_sequence) {
                    nArray.push(actionData);
                } else if (oldItems[i].approve_sequence == reciveData.approve_sequence) {
                    nArray.push(reciveData);
                } else {
                    nArray.push(oldItems[i])
                }
            }
            this.setApprovalData(nArray);
        },

        onSortDown: function (oParam) {
            console.log("onSortDown >>> " , oParam);
            var oTable = this.byId("ApprovalTable");
            var aItems = oTable.getItems();
            var oldItems = [];
            var that = this;
            aItems.forEach(function (oItem) {
                var item = {
                    "approve_sequence": oItem.mAggregations.cells[0].mProperties.text,
                    "approver_type_code": oItem.mAggregations.cells[1].mProperties.selectedKey,
                    "approver_empno": oItem.mAggregations.cells[2].mProperties.value,
                }
                oldItems.push(item);
            });
            console.log(" btn onSortUp >>> ", oldItems);
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
            for (var i = 0; i < oldItems.length - 1; i++) {
                if (oldItems[i].approve_sequence == actionData.approve_sequence) {
                    nArray.push(actionData);
                } else if (oldItems[i].approve_sequence == reciveData.approve_sequence) {
                    nArray.push(reciveData);
                } else {
                    nArray.push(oldItems[i])
                }
            }

            this.setApprovalData(nArray);
        },

        setApprovalRemoveRow: function (oParam) {
            var that = this;
            var oView = this.getView();
            MessageBox.confirm("Are you sure ?", { // 삭제라서 컨펌창 띄움 
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        console.log(" btn remove >>> ", oldItems);
                        var oTable = that.byId("ApprovalTable");
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
                        that.setApprovalData(nArray);
                        oView.setBusy(false);
                        MessageToast.show("Success to delete.");
                    };
                }
            });
        },
        setApprovalData: function (dataList) {
            console.log("dataList ", dataList);
            this.getView().setModel(new ManagedListModel(), "Approvers"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("Approvers");
            var noCnt = 1;
            for (var i = 0; i < dataList.length; i++) { 
                var param = {
                    approve_sequence: noCnt,
                    approver_type_code: dataList[i].approver_type_code,
                    approver_empno: dataList[i].approver_empno
                }
                if (dataList.length > 0 && i == 0) { // 첫줄은 bottom 으로 가는 화살표만 , 생성되는 1줄만일 경우는 화살표 없기 때문에 1 보다 큰지 비교 
                    this._setApprovalAddRow(param,oModel,"start");
                } else if (i == dataList.length - 1) { 
                    this._setApprovalAddRow(param,oModel,"end");
                } else { 
                    this._setApprovalAddRow(param,oModel,"middle");
                }
                noCnt++;
            }

            var p = {
                approve_sequence : noCnt
            }
            /** 마지막 Search 하는 Row 담는 작업 */ 
            this._setApprovalAddRow(p,oModel);
        },

        _setApprovalAddRow : function (oArges, oModel, rowState) {
            var param = {};
            if (rowState == "start") { // first 
                param = {
                    "approve_sequence": oArges.approve_sequence,
                    "approver_type_code": oArges.approver_type_code,
                    "approver_empno": oArges.approver_empno,
                    "approve_status_code": "",
                    "approve_comment": "",
                    "arrowUp": "",
                    "arrowDown": "sap-icon://arrow-bottom",
                    "editMode": false,
                    "trashShow": true,
                    "approval_number" : this.approval_number ,
                    "tenant_id": this.tenant_id , 
                    "local_create_dtm" : new Date(),
                    "local_update_dtm" : new Date()
                };
            } else if (rowState == "middle") { // middle 
                param = {
                    "approve_sequence": oArges.approve_sequence,
                    "approver_type_code": oArges.approver_type_code,
                    "approver_empno": oArges.approver_empno,
                    "approve_status_code": "",
                    "approve_comment": "",
                    "arrowUp": "sap-icon://arrow-top",
                    "arrowDown": "sap-icon://arrow-bottom",
                    "editMode": false,
                    "trashShow": true,
                    "approval_number" : this.approval_number ,
                    "tenant_id": this.tenant_id , 
                    "local_create_dtm" : new Date(),
                    "local_update_dtm" : new Date()
                }
            } else if (rowState == "end") {
                param = {
                    "approve_sequence": oArges.approve_sequence,
                    "approver_type_code": oArges.approver_type_code,
                    "approver_empno": oArges.approver_empno,
                    "approve_status_code": "",
                    "approve_comment": "",
                    "arrowUp": "sap-icon://arrow-top",
                    "arrowDown": "",
                    "editMode": false,
                    "trashShow": true,
                    "approval_number" : this.approval_number ,
                    "tenant_id": this.tenant_id , 
                    "local_create_dtm" : new Date(),
                    "local_update_dtm" : new Date()
                }
            } else {
                param = {
                    "approve_sequence": oArges.approve_sequence,
                    "approver_type_code": "",
                    "approver_empno": "",
                    "approve_status_code": "",
                    "approve_comment": "",
                    "arrowUp": "",
                    "arrowDown": "",
                    "editMode": true,
                    "trashShow": false,
                    "approval_number" : this.approval_number ,
                    "tenant_id": this.tenant_id , 
                    "local_create_dtm" : new Date(),
                    "local_update_dtm" : new Date()
                }
            }
            oModel.addRecord( param , "/Approver")
        },

        setSaveApprovalData : function(){

            var oTable = this.byId("ApprovalTable");
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
            var dataList = [];
            for (var i = 0; i < oldItems.length - 1; i++) {
                dataList.push(oldItems[i]);
            }
            console.log("dataList " , dataList);



            this.getView().setModel(new ManagedListModel(), "Approvers"); // oldItems 에 기존 데이터를 담아 놓고 나서 다시 모델을 리셋해서 다시 담는 작업을 함 
            var oModel = this.getModel("Approvers");
            var noCnt = 1;
            for (var i = 0; i < dataList.length; i++) {

                oModel.addRecord({
                    "approve_sequence": noCnt,
                    "approver_type_code": dataList[i].approver_type_code,
                    "approver_empno": dataList[i].approver_empno,
                    "approve_status_code": "",
                    "approve_comment": "", 
                    "local_create_dtm" : new Date() ,
                    "local_update_dtm" : new Date() ,
                    "approval_number" : this.approval_number ,
                    "tenant_id" : this.tenant_id 
                }, "/Approver");

                noCnt++;
            }
        },

        handleSelectionChangeReferrer: function (oEvent) { // Referrer 
            console.log(" handleSelectionChangeReferrer oEvent >>> " , oEvent);
            var that = this;
            var referModel = this.getModel('Referer');
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");
            console.log(" changedItem >>> " , changedItem);
            var state = "Selected";
            if (!isSelected) {
                state = "Deselected";
            }

            if(state == "Selected"){
                 referModel.addRecord({
                      "referer_empno": changedItem.getKey(), 
                      "local_create_dtm" : new Date() ,
                      "local_update_dtm" : new Date() ,
                      "approval_number" : that.approval_number ,
                      "tenant_id" : that.tenant_id 
                  }, "/Referers");
            }else{
                console.log(" referModel >>> " , referModel.getData());

                for(var i = 0 ; i < referModel.getData().Referers.length ; i++){
                    console.log(" referModel.getData().Referers[i] ", referModel.getData().Referers[i]);
                    if(referModel.getData().Referers[i].referer_empno == changedItem.getKey()){
                        referModel.markRemoved(i);
                    }
                }
            }
        },

        handleSelectionFinishReferrer: function (oEvent) { // Referrer 
           
            oEvent.getParameter("selectedItems");
    
        },

        _setCreateData: function () {
            var oModel = this.getOwnerComponent().getModel();
          
             var cParam = { 
                 "tenant_id": 'L1100',
                 "company_code": this.getModel("appMaster").oData.company_code,
                 "org_type_code": 'AU',
                 "org_code": this.getModel("appMaster").oData.org_code,
                 "approve_status_code": 'AP',
                 "chain_code": "DP",
                 "approval_type_code": "B",
                 "requestor_empno":this.getModel('appMaster').oData.requestor_empno ,
                 "approval_number": this.getModel('appMaster').oData.approval_number ,
                 "request_date": this._getToday(),
                 "local_create_dtm": new Date(),
                 "local_update_dtm": new Date(),
                 "approval_title": this.getModel('appMaster').oData.approval_title ,
                 "approval_contents" : this.getModel('appMaster').oData.approval_contents 
             }

            oTransactionManager.setServiceModel(this.getModel());

            // this.getModel('appMaster').setData(cParam, "/ApprovalMasters");
            // this.getModel('appDetail').setProperty("/");
            this.update();
            // ApprovalDetails 
        //    var dtl = this.getModel("appDetail");

        //     console.log("dtl>>> " , dtl.oData.ApprovalDetails);
   

        //     MessageBox.confirm("Are you sure ?", {
        //         title: "Comfirmation",
        //         initialFocus: sap.m.MessageBox.Action.CANCEL,
        //         onClose: function (sButton) {
        //             if (sButton === MessageBox.Action.OK) {
        //                 oView.setBusy(true);
        //                 oModel.create("/ApprovalMasters", cParam, {
        //                     groupId: "appMaster",
        //                     success: function (data) {
        //                         oView.setBusy(false);
                               
        //                     }.bind(this),
        //                     error: function (data) {
        //                         console.log('error', data)
        //                     }
        //                 });
        //                 oModel.create("/ApprovalDetails",  dtl.oData.ApprovalDetails, {
        //                     groupId: "appDetail",
        //                     success: function (data) {
        //                         oView.setBusy(false);
        //                        // MessageToast.show("Success to save.");
        //                     }.bind(this),
        //                     error: function (data) {
        //                         console.log('error', data)
        //                     }
        //                 });
        //                  MessageToast.show("Success to save.");

        //             };
        //         }
        //     });

        },

        /**
         * @description 미리보기 
         */
        onPagePreviewButtonPress : function(oEvent){
                var oView = this.getView();
                var oButton = oEvent.getSource();
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.md.budgetExecutionApproval.view.BeaObjectPreview",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                });
        },
        /**
         * @description save
         */
        onPageDraftButtonPress: function () {
            var oModel = this.getModel(mainViewName);

            if(oModel.oData.editMode){
                this.update();
            }else{
                this._setCreateData();
            }

        },

        update : function(){ 
            var that = this;
            var oView = this.getView(),
                mstModel = this.getModel("appMaster"),
                dtlModel = this.getModel("appDetail"),
                apprverModel = this.getModel("Approvers"),
                referModel = this.getModel("Referer")
                ; 

            console.log("rereferModel >> " , referModel);

            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                      
                        var appDtlData = dtlModel.getData().ApprovalDetails, 
                            approverData = apprverModel.getData().Approver;

                        for(var idx=0; idx<appDtlData.length; idx++){
                            delete dtlModel.getData().ApprovalDetails[idx].approval_type_code;
                            delete dtlModel.getData().ApprovalDetails[idx].bookCurrencyCode;
                            delete dtlModel.getData().ApprovalDetails[idx].budgetAmount;
                            delete dtlModel.getData().ApprovalDetails[idx].familyPartNumber1;
                            delete dtlModel.getData().ApprovalDetails[idx].model;
                            delete dtlModel.getData().ApprovalDetails[idx].mold_item_type_code;
                            delete dtlModel.getData().ApprovalDetails[idx].mold_sequence;
                            delete dtlModel.getData().ApprovalDetails[idx].orderSupplier;
                            delete dtlModel.getData().ApprovalDetails[idx].mold_number;
                            delete dtlModel.getData().ApprovalDetails[idx].spec_name;
                        }
    
                         console.log(" apprverModel >>> " , apprverModel);
                         console.log(" length >>> " , approverData.length);

                        for(var jdx=0; jdx<approverData.length; jdx++){
                            delete approverData[jdx].arrowUp;
                            delete approverData[jdx].arrowDown;
                            delete approverData[jdx].editMode;
                            delete approverData[jdx].trashShow;
                        }
                        apprverModel.removeRecord(approverData.length-1);
       
                        console.log(" referModel >>> " , apprverModel);
                        
                        console.log(" oTransactionManager >>> " , oTransactionManager);

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