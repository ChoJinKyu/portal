sap.ui.define([
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
    "./ApprovalBaseController",
    "dp/md/util/controller/MoldItemSelection"
], function (DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor
    , ApprovalBaseController, MoldItemSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.BudgetExecutionApproval", {

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
            ApprovalBaseController.prototype.onInit.call(this);

            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "budgetExecutionApprovalView"); //change
            this.getRouter().getRoute("budgetExecutionApproval").attachPatternMatched(this._onObjectMatched, this);//change
            
            this.getView().setModel(new ManagedListModel(), "mdItemMaster"); 
            this.getView().setModel(new ManagedListModel(), "importPlant"); 
        },
   
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage : function () {
  
            console.log(" this.approval_number "  ,  this.approval_number);
            var schFilter = [];
            var that = this;
            if (this.approval_number == "New") {
                this._budgetEditFragment();
            } else {
                this._budgetViewFragment();
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                this._bindViewBudget("/ItemBudgetExecution", "mdItemMaster", schFilter, function (oData) {
                    console.log("ItemBudgetExecution >>>>>>", oData); 
                    that._bindComboPlant(oData.results[0].import_company_code);
                });
            }  
        },
        _bindViewBudget : function (sObjectPath, sModel, aFilter, callback) { 
                var oView = this.getView(),
                    oModel = this.getModel(sModel);
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel("budget"));
                oModel.read(sObjectPath, {
                    filters: aFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                        callback(oData);
                    }
                });
            },

        /**
         * Import Company 파라미터 받고 조회 
         * @param {*} company_code 
         */
        onBCompanyChange : function (oEvent){
            // console.log("oEvent >>> " , oEvent);
            // console.log("1 >>> " ,this.getView().byId('importCompany').getSelectedKey());
            // console.log("2 >>> " ,this.getView().byId('importCompany').mProperties.selectedKey);
            // console.log("3 >>> " ,this.getModel("mdItemMaster").getData().ItemBudgetExecution[0].import_company_code);

            var company_code = this.getModel("mdItemMaster").getData().ItemBudgetExecution[0].import_company_code;
            this.getModel("mdItemMaster").getData().ItemBudgetExecution[0].import_company_org_code = "";
            this._bindComboPlant(company_code);
        },
        _bindComboPlant : function (company_code) {
            var aFilter = [new Filter("org_type_code", FilterOperator.EQ, 'AU')
                        , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                        , new Filter("company_code", FilterOperator.EQ, company_code)
                ];

              var oView = this.getView(),
                    oModel = this.getModel("importPlant");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel("purOrg"));
                oModel.read("/Pur_Operation_Org", {
                    filters: aFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                    }
                });
        } ,

       /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onBudgetExecutionAddPress: function (oEvent) {
            console.log("oEvent>>>>");
            var oModel = this.getModel("mdItemMaster");

            console.log(" mdItemMaster >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.ItemBudgetExecution != undefined && oModel.oData.ItemBudgetExecution.length > 0) {
                oModel.oData.ItemBudgetExecution.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                company_code: this.company_code ,
                org_code: this.plant_code,
               // mold_progress_status_code : 'DEV_RCV' ,
                mold_id_arr: mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }

            var that = this;

            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs, function (oDataMold) {
                console.log("selected data list >>>> ", oDataMold);
                if (oDataMold.length > 0) {
                    oDataMold.forEach(function (item) {
                        that._addbudgetExecutionTable(item);
                    })
                }
            });
        },

        /**
        * @description participating row 추가 
        * @param {*} data 
        */
        _addbudgetExecutionTable: function (data) {
            var oTable = this.byId("budgetExecutionTable"),
                oModel = this.getModel("mdItemMaster"),
                mstModel = this.getModel("appMaster");
            ;
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */
            var approval_number = mstModel.oData.approval_number;
            oModel.addRecord({
                "tenant_id": "L1100",
                "mold_id": String(data.oData.mold_id),
                "approval_number": approval_number,
                "model": data.oData.model,
                "mold_number": data.oData.mold_number,
                "mold_sequence": data.oData.mold_sequence,
                "spec_name": data.oData.spec_name,
                "mold_item_type_code": data.oData.mold_item_type_code,
                "book_currency_code": data.oData.book_currency_code,
                "budget_amount": data.oData.budget_amount,
                "mold_production_type_code": data.oData.mold_production_type_code,
                "asset_type_code": data.oData.asset_type_code,
                "family_part_number_1": data.oData.family_part_number_1,
                "budget_exrate_date": "",
                "inspection_date": "",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ItemBudgetExecution");
        },
        /**
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onBudgetExecutionDelRow: function () {
            var budgetExecutionTable = this.byId("budgetExecutionTable")
                , detailModel = this.getModel("mdItemMaster")
                , oSelected = budgetExecutionTable.getSelectedIndices();
            ;
            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    detailModel.removeRecord(idx)
                    //  detailModel.markRemoved(idx)
                });
                budgetExecutionTable.clearSelection();

                console.log("detailModel", detailModel);
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        } ,
   
        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
            /*
            approverData = verModel.getData().Approvers;*/
            console.log();
            console.log();
        },

        onPageEditButtonPress: function () {
            this._budgetEditFragment();
            this._editMode();
        },

        onPageCancelButtonPress: function () {
            this._budgetViewFragment();
            this._viewMode();
        },

        _budgetEditFragment : function(){
            console.log("_budgetEditFragment");
            var oPageSection = this.byId("budgetExecutionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("BudgetExecutionTableEdit", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },
        _budgetViewFragment : function(){
             console.log("_budgetViewFragment");
             var oPageSection = this.byId("budgetExecutionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("BudgetExecutionTableView", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },

        onPageDraftButtonPress : function () { 
            /**
             * 'DR'
            'AR'
            'IA'
            'AP'
            'RJ' */ 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR");

            this.approval_type_code = "B";

            var bModel = this.getModel("mdItemMaster");
            this.approvalDetails_data = [] ;
            this.moldMaster_data = [] ;
            var that = this;
            console.log("bModel.getData().length " , bModel);
            if(bModel.getData().ItemBudgetExecution != undefined && bModel.getData().ItemBudgetExecution.length > 0){
                var account_code = bModel.getData().ItemBudgetExecution[0].account_code;
                var investment_ecst_type_code =  bModel.getData().ItemBudgetExecution[0].investment_ecst_type_code;
                var accounting_department_code =  bModel.getData().ItemBudgetExecution[0].accounting_department_code;
                var project_code =  bModel.getData().ItemBudgetExecution[0].project_code;
                var import_company_code = investment_ecst_type_code != "S" ? "" : bModel.getData().ItemBudgetExecution[0].import_company_code;
                var import_company_org_code = investment_ecst_type_code != "S" ? "" : bModel.getData().ItemBudgetExecution[0].import_company_org_code;

                bModel.getData().ItemBudgetExecution.forEach(function(item){
                    that.approvalDetails_data.push({
                        tenant_id : that.tenant_id 
                        , approval_number : that.approval_number 
                        , mold_id : item.mold_id 
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                    that.moldMaster_data.push({
                         tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , account_code : account_code 
                        , investment_ecst_type_code : investment_ecst_type_code 
                        , accounting_department_code : accounting_department_code 
                        , import_company_code : import_company_code 
                        , project_code : project_code 
                        , import_company_org_code : import_company_org_code 
                        , mold_production_type_code : item.mold_production_type_code 
                        , mold_item_type_code :  item.mold_item_type_code 
                        , provisional_budget_amount : item.provisional_budget_amount 
                        , asset_type_code : item.asset_type_code 
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                });

            }

            if(bModel._aRemovedRows.length > 0){
                bModel._aRemovedRows.forEach(function(item){
                    that.approvalDetails_data.push({
                        tenant_id : that.tenant_id 
                        , approval_number : that.approval_number 
                        , mold_id : item.mold_id 
                        , _row_state_ : "D"
                    });
                    that.moldMaster_data.push({
                         tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , account_code : account_code 
                        , investment_ecst_type_code : investment_ecst_type_code 
                        , accounting_department_code : accounting_department_code 
                        , import_company_code : import_company_code 
                        , project_code : project_code 
                        , import_company_org_code : import_company_org_code 
                        , mold_production_type_code : item.mold_production_type_code 
                        , mold_item_type_code :  item.mold_item_type_code 
                        , provisional_budget_amount : item.provisional_budget_amount 
                        , asset_type_code : item.asset_type_code 
                        , _row_state_ : "D"
                    });
                });
            }


            this._commonDataSettingAndSubmit();

        }




        /** PO Item End */

    });
});