sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/Device", // fileupload 
    "sap/ui/core/syncStyleClass",
    "sap/m/ColumnListItem",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "dp/md/util/controller/MoldItemSelection",
    "sap/ui/richtexteditor/RichTextEditor",
    //  "sap/ui/richtexteditor/EditorType"
], function (BaseController, JSONModel
    , ManagedListModel, ManagedModel, DateFormatter, Filter, FilterOperator, Fragment
    , MessageBox, MessageToast, Device, syncStyleClass, ColumnListItem
    , TransactionManager
    , Multilingual
    , Validator
    , Formatter
    , MoldItemSelection
    , RichTextEditor
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
    return BaseController.extend("dp.md.budgetExecutionApproval.controller.BudgetExecutionApproval", {
        //  formatter: Formatter,
        //  dateFormatter: DateFormatter,
        //  validator: new Validator(), 
        moldItemPop: new MoldItemSelection(),
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            this.oThis;
        },

        openFragmentApproval: function (oThis) {
            this.oThis = oThis;
            var schFilter = [];
            this.oThis.getView().setModel(new ManagedListModel(), "mdItemMaster");
            if (this.oThis.approval_number == "New") {

            } else {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.oThis.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                this._bindView("/ItemBudgetExecution", "mdItemMaster", schFilter, function (oData) {
                    console.log("ItemBudgetExecution >>>>>>", oData);
                });
            }

            var oPageSubSection = this.oThis.byId("pageSection");
            this._loadFragmentBudget("BudgetExecutionApproval", function (oFragment) {
                oPageSubSection.addBlock(oFragment);
            })
        },

        _bindView: function (sObjectPath, sModel, aFilter, callback) {
            var oView = this.oThis.getView(),
                oModel = this.oThis.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.oThis.getModel("budget"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },

        _loadFragmentBudget: function (sFragmentName, oHandler) {
            if (!this.oThis._oFragments[sFragmentName]) {
                Fragment.load({
                    id: this.oThis.getView().getId(),
                    name: "dp.md.moldApprovalList.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this.oThis._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this.oThis._oFragments[sFragmentName]);
            }

        },

        /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onBudgetExecutionAddPress: function (oEvent) {
            console.log("oEvent>>>>");
            var oModel = this.oThis.getModel("appDetail");

            console.log(" appDetail >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.ApprovalDetails != undefined && oModel.oData.ApprovalDetails.length > 0) {
                oModel.oData.ApprovalDetails.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                company_code: this.oThis.getModel('appMaster').oData.company_code,
                org_code: this.oThis.getModel('appMaster').oData.org_code,
                // mold_progress_status_code : 'DEV_RCV' ,
                mold_id_arr: mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }

            var that = this;

            this.moldItemPop.openMoldItemSelectionPop(this.oThis, oEvent, oArgs, function (oDataMold) {
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
            var oTable = this.oThis.byId("budgetExecutionTable"),
                oModel = this.oThis.getModel("mdItemMaster"),
                mstModel = this.oThis.getModel("appMaster");
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
            }, "/ItemBudgetExecution", 0);
        },
        /**
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onBudgetExecutionDelRow: function () {
            var budgetExecutionTable = this.oThis.byId("budgetExecutionTable")
                , detailModel = this.oThis.getModel("mdItemMaster")
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
        }
    });
});