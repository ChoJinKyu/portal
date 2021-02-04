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
    "dp/md/util/controller/MoldItemSelection",
    // "dp/md/util/controller/DeptSelection",
], function (DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor
    , ApprovalBaseController, MoldItemSelection 
    // , DeptSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;
    /**
     * @desciption  예산집행품의 
     * @date        2021.01.14 
     * @author      jinseon.lee 
     */
    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.BudgetExecutionApproval", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

      //  deptSelection: new DeptSelection(),
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
            this.getView().setModel(new ManagedListModel(), "importCompany");
            this.getView().setModel(new ManagedListModel(), "assetTypeCodeList"); // Asset Type
            this.setModel(oViewModel, "budgetExecutionApprovalView"); //change
            this.getRouter().getRoute("budgetExecutionApproval").attachPatternMatched(this._onObjectMatched, this);//change  
            this.process.setDrawProcessUI(this, "BudgetExecutionPress" , "A", 1);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage: function () {

            this.getView().setModel(new ManagedListModel(), "mdItemMaster");
            this.getView().setModel(new ManagedModel(), "mdCommon");
            this.getView().setModel(new ManagedListModel(), "importPlant");

            this._searchImportCompany();

            var schFilter = [];
            var that = this;
            // if (this.approval_number == "New") {

            //  } else {

            schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                , new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID)
            ];
            // this.getView().setModel(new ManagedModel(), "mdCommon");
            var md = this.getModel('mdCommon');
            this._bindViewBudget("/ItemBudgetExecution", "mdItemMaster", schFilter, function (oData) {
                // console.log(" ItemBudgetExecution >>> ", oData);
                if (oData.results != undefined && oData.results.length > 0) {
                    md.setProperty("/investment_ecst_type_code", oData.results[0].investment_ecst_type_code);
                    md.setProperty("/investment_ecst_type_code_nm", oData.results[0].investment_ecst_type_code_nm);
                    md.setProperty("/acq_department_code", oData.results[0].acq_department_code);
                    md.setProperty("/acq_department_code_nm", oData.results[0].acq_department_code_nm);
                    md.setProperty("/accounting_department_code", oData.results[0].accounting_department_code);
                    md.setProperty("/import_company_code", oData.results[0].import_company_code);
                    md.setProperty("/import_company_code_nm", oData.results[0].import_company_code_nm);
                    md.setProperty("/project_code", oData.results[0].project_code);
                    md.setProperty("/import_company_org_code", oData.results[0].import_company_org_code);
                    md.setProperty("/import_company_org_code_nm", oData.results[0].import_company_org_code_nm);
                    md.setProperty("/account_code", oData.results[0].account_code);
                    md.setProperty("/account_code_nm", oData.results[0].account_code_nm);
                    md.setProperty("/provisional_budget_amount", oData.results[0].provisional_budget_amount); 
                    if(oData.results[0].import_company_code != undefined && oData.results[0].import_company_code != ""){
                        that._bindComboPlant(oData.results[0].import_company_code); 
                    }
                    if(oData.results[0].investment_ecst_type_code != undefined && oData.results[0].investment_ecst_type_code != ""){
                        that._searchAssetType(oData.results[0].investment_ecst_type_code, function(oData){
                        });
                    }
                    
                } else {
                    md.setProperty("/investment_ecst_type_code", "I");
                    md.setProperty("/investment_ecst_type_code_nm", "");
                    md.setProperty("/acq_department_code", "");
                    md.setProperty("/acq_department_code_nm", "");
                    md.setProperty("/accounting_department_code", "");
                    md.setProperty("/import_company_code", "");
                    md.setProperty("/import_company_code_nm", "");
                    md.setProperty("/project_code", "");
                    md.setProperty("/import_company_org_code", "");
                    md.setProperty("/import_company_org_code_nm", "");
                    md.setProperty("/account_code", "");
                    md.setProperty("/account_code_nm", "");
                    md.setProperty("/provisional_budget_amount", ""); 
                    that._searchAssetType("I", function(oData){}); 
                }

            });
            //  }

        },

        _bindViewBudget: function (sObjectPath, sModel, aFilter, callback) {
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
        onBudgetChange : function ( oEvent ){
            this._searchAssetType(this.getModel('mdCommon').getProperty('/investment_ecst_type_code'), function(oData){

            });
        } ,
        _searchAssetType : function(parent_code,callback){ // 목록의 combo 조회  

           var aFilter = [new Filter("group_code", FilterOperator.EQ, 'DP_MD_ASSET_TYPE' )
                , new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID)
                , new Filter("parent_code", FilterOperator.EQ, parent_code)
            ];
            var oView = this.getView(),
                oModel = this.getModel("assetTypeCodeList");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("budget"));
            oModel.read("/CodeView", {
                filters: aFilter,
                success: function (oData) {
                    console.log(" oData>>> " , oData);
                    oView.setBusy(false);
                    callback(oData);
                }
            });

        },
        _searchImportCompany: function () {
            var nFilter = [
                new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID)
                , new Filter("company_code", FilterOperator.NE, this.company_code)
            ];
            // console.log("nFilter>>>>> " , nFilter);
            var oView = this.getView(),
                oModel = this.getModel("importCompany");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("org"));
            oModel.read("/Company", {
                filters: nFilter,
                success: function (oData) {
                    oView.setBusy(false);
                }
            });

        },

        /**
         * Import Company 파라미터 받고 조회 
         * @param {*} company_code 
         */
        onBCompanyChange: function (oEvent) {
            var company_code = this.getModel("mdCommon").getData().import_company_code;
            // console.log("oEvent >>>> " , oEvent);
            // console.log("getForceSelection >>>> " , this.byId('importCompany').getSelectedItem());
            this.getModel("mdCommon").getData().import_company_org_code = "";
            this._bindComboPlant(company_code);
        },

        _bindComboPlant: function (company_code) {
            var aFilter = [
                new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID)
                , new Filter("company_code", FilterOperator.EQ, company_code)
            ];

            var oView = this.getView(),
                oModel = this.getModel("importPlant");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("dpMdUtil"));
            oModel.read("/Divisions", {
                filters: aFilter,
                success: function (oData) { 
                    // console.log(" Pur_Operation_Org " , oData);
                    oView.setBusy(false); 
                }
            });
        },

        /**
          * @description moldItemSelect 공통팝업   
          * @param vThis : view page의 this 
          *       , oEvent : 이벤트 
          * ,     , oArges : company_code , org_code (필수)
          */
        onBudgetExecutionAddPress: function (oEvent) {
            var oModel = this.getModel("mdItemMaster");
            var mIdArr = [];
            if (oModel.oData.ItemBudgetExecution != undefined && oModel.oData.ItemBudgetExecution.length > 0) {
                oModel.oData.ItemBudgetExecution.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                approval_type_code: "B",
                company_code: this.company_code,
                org_code: this.plant_code,
                mold_progress_status_code: ['DEV_RCV', 'SUP_APP'],
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
                "tenant_id": this.getSessionUserInfo().TENANT_ID,
                "mold_id": String(data.mold_id),
                "approval_number": approval_number,
                "model": data.model,
                "mold_number": data.mold_number,
                "mold_sequence": data.mold_sequence,
                "spec_name": data.spec_name,
                "mold_item_type_code": data.mold_item_type_code,
                "book_currency_code": data.book_currency_code,
                "budget_amount": data.budget_amount,
                "mold_production_type_code": data.mold_production_type_code,
                "asset_type_code": data.asset_type_code,
                "family_part_number_1": data.family_part_number_1,
                "budget_exrate_date": "",
                "inspection_date": "",
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ItemBudgetExecution");

            if (oModel.getProperty("/entityName") == undefined) { // 신규시 entityName 없어서 행삭제를 못하고 있음 
                oModel.setProperty("/entityName", "ItemBudgetExecution"); 
            }
        },
        // 부서 버튼 클릭 
        onInputWithDepartmentValuePress: function(){
            this.byId("departmentDialog").open();
        },
        onDepartmentDialogApplyPress: function(oEvent){ 
            var md = this.getModel('mdCommon');
            md.setProperty("/acq_department_code", oEvent.getParameter("item").department_id);
            md.setProperty("/acq_department_code_nm", oEvent.getParameter("item").department_local_name);
            this.byId("acquisition_department").setValue(oEvent.getParameter("item").department_local_name);
        },

        // onValueHelpRequestedDept: function () {
        //     var that = this;
        //     this.deptSelection.openDeptSelectionPop(this, function (data) {
        //         //  console.log("data " , data[0]);
        //         that.setDept(data[0].oData);
        //     });
        // },
        // setDept: function (data) {
        //     var md = this.getModel('mdCommon');
        //     md.setProperty("/acq_department_code", data.department_id);
        //     md.setProperty("/acq_department_code_nm", data.department_local_name);
        // },
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
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },

        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
            /*
            approverData = verModel.getData().Approvers;*/
        },

        _toEditModeEachApproval: function () {
            // console.log(" BudgetExecutionApproval  _toEditModeEachApproval ");
        //     console.log(" this " , this.getView());
        //     this.byId("customer_po_no").removeStyleClass("readonlyField");
        //     this.byId("customer").removeStyleClass("readonlyField");
        //    this.byId("acquisition_department").removeStyleClass("readonlyField");
        //     this.byId("accounting_department").removeStyleClass("readonlyField");
        //     this.byId("importCompany").removeStyleClass("readonlyField");
        //     this.byId("projectCode").removeStyleClass("readonlyField");
        //     this.byId("importPlant").removeStyleClass("readonlyField");
        //     this.byId("account").removeStyleClass("readonlyField");

        //     var oRows = this.byId("budgetExecutionTable").getRows();

        //     oRows.forEach(function (oCell, idx) {
        //         oCell.mAggregations.cells.forEach(function (item, jdx) {
        //             if (jdx == 4 || jdx == 5 || jdx == 7 || jdx == 8) {
        //                 item.removeStyleClass("readonlyField");
        //             }
        //         });
        //     }); 
        },
        _toShowModeEachApproval: function () {
            // console.log(" BudgetExecutionApproval  _toShowModeEachApproval ");
            // this.byId("customer_po_no").addStyleClass("readonlyField");
            // this.byId("customer").addStyleClass("readonlyField");
            // this.byId("acquisition_department").addStyleClass("readonlyField");
            // this.byId("accounting_department").addStyleClass("readonlyField");
            // this.byId("importCompany").addStyleClass("readonlyField");
            // this.byId("projectCode").addStyleClass("readonlyField");
            // this.byId("importPlant").addStyleClass("readonlyField");
            // this.byId("account").addStyleClass("readonlyField");

            // var oRows = this.byId('budgetExecutionTable').getRows();

            // oRows.forEach(function (oCell, idx) {
            //     oCell.mAggregations.cells.forEach(function (item, jdx) {
            //         if (jdx == 4 || jdx == 5 || jdx == 7 || jdx == 8) {
            //             item.addStyleClass("readonlyField");
            //         }
            //     });
            // });
            
        },

        /**
         * @description 미리보기 버튼눌렀을 경우 
         */
        onPagePreviewButtonPress: function () {
            this.getView().setModel(new ManagedListModel(), "approverPreview");

            if (this.getModel("approver").getData().Approvers != undefined) {
                var ap = this.getModel("approver").getData().Approvers;

                for (var i = 0; i < ap.length; i++) {
                    this.getModel("approverPreview").addRecord(ap[i], "/Approvers");
                }
            }

            var oView = this.getView();
            var p = this.process;
            if (!this._oDialogPrev) {
                this._oDialogPrev = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.moldApprovalList.view.BudgetExecutionApprovalPreView",
                    controller: this
                }).then(function (oDialog) { 
                    oView.addDependent(oDialog);
                    p.setDrawProcessUI(this, "BudgetExecutionPressPrev" , "A", 1);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPrev.then(function (oDialog) {
                oDialog.open(); 
                oView.byId('referMultiPrev').setTokens(oView.byId("referMulti").getTokens()); // ㅔpri
            });

        },
        onPrvClosePress: function () { 
            var oView = this.getView();
            if (this._oDialogPrev) {
                this._oDialogPrev.then(function (oDialog) {
                    oView.byId('referMulti').setTokens(oView.byId("referMultiPrev").getTokens());
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogPrev = undefined;
            }
            //  this.byId("budgetExecutionPreview").close();
            // this.byId("budgetExecutionPreview").destroy();
        },

        onPageRequestButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "AR"); // 결제요청 
            this._budgetExecutionDataSetting();
        },
        onPageDraftButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 임시저장 
            this._budgetExecutionDataSetting();
        },
        onPageRequestCancelButtonPress: function () {
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 요청취소 
            this.approvalRequestCancel(); 
          //  this._budgetExecutionDataSetting();
        },
        _budgetExecutionDataSetting: function () {
            this.approval_type_code = "B";
            var bModel = this.getModel("mdItemMaster");
            var mModel = this.getModel("mdCommon");
            this.approvalDetails_data = [];
            this.moldMaster_data = [];
            this.asset_data = [];

            if (this.validator.validate(this.byId("generalInfoLayout")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode); 
                return;
            }

            if (this.validator.validate(this.byId("account")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002')); 
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode); 
                return;
            }

            if (bModel.getData().ItemBudgetExecution == undefined || bModel.getData().ItemBudgetExecution.length == 0) { 
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode); 
                MessageToast.show("item 을 하나 이상 추가하세요.");
                return;
            }
            if (this.validator.validate(this.byId("budgetExecutionTable")) !== true) { 
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode); 
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }

            var that = this;

            // 삭제 row 먼저 추가되어야 데이터가 정상 저장됨 
            if (bModel._aRemovedRows.length > 0) {
                bModel._aRemovedRows.forEach(function (item) {
                    that.approvalDetails_data.push({
                        tenant_id: that.tenant_id
                        , approval_number: that.approval_number
                        , mold_id: item.mold_id
                        , _row_state_: "D"
                    });
                    that.moldMaster_data.push({
                        tenant_id: that.tenant_id
                        , mold_id: item.mold_id
                        , account_code: account_code
                        , investment_ecst_type_code: investment_ecst_type_code
                        , acq_department_code: acq_department_code
                        , accounting_department_code: accounting_department_code
                        , import_company_code: import_company_code
                        , project_code: project_code
                        , import_company_org_code: import_company_org_code
                        , mold_production_type_code: item.mold_production_type_code
                        , mold_item_type_code: item.mold_item_type_code
                        , provisional_budget_amount: item.provisional_budget_amount
                        , asset_type_code: item.asset_type_code
                        , _row_state_: "D"
                    });
                    that.asset_data.push({
                        tenant_id: that.tenant_id
                        , mold_id: item.mold_id
                        , _row_state_: "D"
                    });
                });
            }




            if (bModel.getData().ItemBudgetExecution != undefined && bModel.getData().ItemBudgetExecution.length > 0) {

                var account_code = mModel.getData().account_code;
                var investment_ecst_type_code = mModel.getData().investment_ecst_type_code;
                var acq_department_code = mModel.getData().acq_department_code;
                var accounting_department_code = mModel.getData().accounting_department_code;
                var project_code = mModel.getData().project_code;
                var import_company_code = investment_ecst_type_code != "S" ? "" : mModel.getData().import_company_code;
                var import_company_org_code = investment_ecst_type_code != "S" ? "" : mModel.getData().import_company_org_code;

                bModel.getData().ItemBudgetExecution.forEach(function (item) {
                    that.approvalDetails_data.push({
                        tenant_id: that.tenant_id
                        , approval_number: that.approval_number
                        , mold_id: item.mold_id
                        , _row_state_: item._row_state_ == undefined ? "U" : item._row_state_
                    });
                    that.moldMaster_data.push({
                        tenant_id: that.tenant_id
                        , mold_id: item.mold_id
                        , account_code: account_code
                        , investment_ecst_type_code: investment_ecst_type_code
                        // , acq_department_code: acq_department_code
                        , accounting_department_code: accounting_department_code
                        , import_company_code: import_company_code
                        , project_code: project_code
                        , import_company_org_code: import_company_org_code
                        , mold_production_type_code: item.mold_production_type_code
                        , mold_item_type_code: item.mold_item_type_code
                        , provisional_budget_amount: item.provisional_budget_amount
                      //  , asset_type_code: item.asset_type_code
                        , _row_state_: item._row_state_ == undefined ? "U" : item._row_state_
                    });

                    that.asset_data.push({
                        tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , acq_department_code : acq_department_code
                        , asset_type_code : item.asset_type_code 
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });


                });

            }

           
            this._commonDataSettingAndSubmit();
        }
    });
});