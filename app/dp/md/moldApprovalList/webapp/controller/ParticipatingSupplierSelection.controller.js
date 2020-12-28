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
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalBaseController, MoldItemSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.ParticipatingSupplierSelection", {

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

            this.setModel(oViewModel, "participatingSupplierSelectionView");//change
            this.getRouter().getRoute("participatingSupplierSelection").attachPatternMatched(this._onObjectMatched, this);//change
            this.getView().setModel(new ManagedListModel(), "mdItemMaster");
            this.getView().setModel(new ManagedListModel(), "psOrgCode"); //currency 콤보박스
            
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
            var schFilter2 = [];
   
            if (this.approval_number == "New") {

            } else {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
                });
                this._bindViewCurrency("/OrgCodeLanguages", "psOrgCode", schFilter2, function (oData) {
                    console.log("OrgCodeLanguages >>>>>>", oData);
                });
            }  
        },

        _bindViewParticipating : function (sObjectPath, sModel, aFilter, callback) { 
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("participatingSupplierSelection"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },
        _bindViewCurrency : function (sObjectPath, sModel, aFilter, callback) { 
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("orgCode"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },
        /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onPsAddPress: function (oEvent) {
            console.log("oEvent>>>>");
            var oModel = this.getModel("mdItemMaster");

            console.log(" mdItemMaster >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.ItemBudgetExecution != undefined && oModel.oData.ItemBudgetExecution.length > 0) {
                oModel.oData.ItemBudgetExecution.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            console.log(" this.getModel " , this.getModel('appMaster'));

            var oArgs = {
                company_code: this.getModel('appMaster').oData.company_code,
                org_code: this.getModel('appMaster').oData.org_code,
               // mold_progress_status_code : 'DEV_RCV' ,
                mold_id_arr: mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }

            var that = this;

            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs, function (oDataMold) {
                console.log("selected data list >>>> ", oDataMold);
                if (oDataMold.length > 0) {
                    oDataMold.forEach(function (item) {
                        that._addPsTable(item);
                    })
                }
            });
        },

        /**
         * @description Mold Item row 추가 
         * @param {*} data 
         */
        _addPsTable: function (data) {
                var oTable = this.byId("psTable"),
                oModel = this.getModel("mdItemMaster"),
                mstModel = this.getModel("appMaster");
            ;
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */
            var approval_number = mstModel.oData.approval_number;
            console.log("data.oData :::", data.oData);
            oModel.addRecord({
                "approval_number": approval_number,
                "tenant_id": "L1100",
                "mold_id": String(data.oData.mold_id),
                "model": data.oData.model,
                "mold_number": data.oData.mold_number,
                "mold_sequence": data.oData.mold_sequence,
                "spec_name": data.oData.spec_name,
                "mold_item_type_code": data.oData.mold_item_type_code,
                "book_currency_code": data.oData.book_currency_code,
                "provisional_budget_amount": data.oData.provisional_budget_amount,
                "budget_amount": data.oData.budget_amount,
                "currency_code": data.oData.currency_code,
                "target_amount": data.oData.target_amount,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ParticipatingSupplier", 0);
        },

    

        /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            this.byId("dialogMolItemSelection").close();
        },

        /**
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onPsDelRow: function () {
            var psTable = this.byId("psTable")
                , detailModel = this.getModel("mdItemMaster")
                , oSelected = psTable.getSelectedIndices();
            ;
            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    detailModel.removeRecord(idx)
                    //  detailModel.markRemoved(idx)
                });
                psTable.clearSelection();

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
        /** PO Item End */

    });
});