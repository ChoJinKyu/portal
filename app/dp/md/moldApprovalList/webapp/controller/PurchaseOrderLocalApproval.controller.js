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

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.PurchaseOrderItemLocal", {

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

            this.setModel(oViewModel, "purchaseOrderLocalApprovalView");//change
            this.getRouter().getRoute("purchaseOrderLocalApproval").attachPatternMatched(this._onObjectMatched, this);//change

            //this.getView().setModel(new ManagedListModel(), "moldMaster");
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /** PO Item Start */
        _onApprovalPage: function () {

            this.getView().setModel(new ManagedListModel(), "purOrderItem");
            this.getView().setModel(new ManagedModel(), "payment");
            //this.getView().setModel(new ManagedListModel(), "importPlant");

            console.log(" this.approval_number ", this.approval_number);
            var schFilter = [];
            //var that = this;
            if (this.approval_number == "New") {
                // ApprovalBaseController.prototype.onInit.call(this);

                //this._budgetEditFragment();
            } else {
                //this._budgetViewFragment();
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];
                // this.getView().setModel(new ManagedModel(), "mdCommon");
                var md = this.getModel('payment');
                this._bindViewPurchaseOrder("/PurchaseOrderItems", "purOrderItem", schFilter, function (oData) {console.log("oData >>>>>>", oData);
                    md.setProperty("/split_pay_type_code", oData.results[0].split_pay_type_code);
                    md.setProperty("/prepay_rate", oData.results[0].prepay_rate);
                    md.setProperty("/progresspay_rate", oData.results[0].progresspay_rate);
                    md.setProperty("/rpay_rate", oData.results[0].rpay_rate);
                    //console.log("md >>>>>>", md);
                    //that._bindComboPlant(oData.results[0].import_company_code);
                });
            }
        },
        _bindViewPurchaseOrder: function (sObjectPath, sModel, aFilter, callback) {
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("purchaseOrder"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },

        /**
         * @description : Popup 창 : 품의서 PO Item 항목의 Add 버튼 클릭
         */
        onPoItemAddRow: function (oEvent) {
            var oModel = this.getModel("appDetail");

            var mIdArr = [];
            if (oModel.oData.ApprovalDetails != undefined && oModel.oData.ApprovalDetails.length > 0) {
                oModel.oData.ApprovalDetails.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                company_code: this.company_code,
                org_code: this.plant_code,
                mold_progress_status_code: 'ORD_APP',
                mold_id_arr: mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
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
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "mold_id": data.oData.mold_id + "",
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
                "family_part_number_1": data.oData.family_part_number_1
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