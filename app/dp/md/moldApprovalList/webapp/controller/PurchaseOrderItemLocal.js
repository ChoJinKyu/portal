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
    "dp/md/util/controller/MoldItemSelection"
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, MoldItemSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;

    return BaseController.extend("dp.md.moldApprovalList.controller.PurchaseOrderItemLocal", {

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
            this.oThis;
        },

        openFragmentApproval : function (oThis){ 
            this.oThis = oThis; 
            var schFilter = [];
            if(this.oThis.approval_number !== "New"){
                //this._onReadOrderLocal(this.oThis.approval_number);
            }
/*
            this.oThis.getView().setModel(new ManagedListModel(), "appDetail");
            this.oThis.getView().setModel(new ManagedListModel(), "moldMaster");

            oTransactionManager.addDataModel(this.getModel("appDetail"));
            oTransactionManager.addDataModel(this.getModel("moldMaster"));
*/
            var oPageSubSection2 = this.oThis.byId("pageSection");
            this._loadFragmentPOILocal("PurchaseOrderItemLocal", function(oFragment){
                 oPageSubSection2.addBlock(oFragment);   
              }) 
        },

        _onReadOrderLocal: function (approvalNumber) {
            var filter = [
                new Filter("tenant_id", FilterOperator.EQ, this.oThis.tenant_id),
                new Filter("approval_number", FilterOperator.EQ, approvalNumber)
            ];

            this.oThis._bindView("/ApprovalDetails", "appDetail", filter, function (oData) {
                var moldIdFilter = [];
                var moldMstFilter = [];

                if (oData.results.length > 0) {
                    oData.results.forEach(function (item) {
                        moldIdFilter.push(new Filter("mold_id", FilterOperator.EQ, item.mold_id));
                    });

                    moldMstFilter.push(
                        new Filter({
                            filters: moldIdFilter,
                            and: false
                        })
                    );

                    this.oThis._bindView("/MoldMasters", "moldMaster", moldMstFilter, function (oData) {

                    }.bind(this));
                }
            }.bind(this));

            //oTransactionManager.setServiceModel(this.getModel());
        },

        _loadFragmentPOILocal : function (sFragmentName, oHandler){       
            if(!this.oThis._oFragments[sFragmentName]){
				Fragment.load({
					id: this.oThis.getView().getId(),
					name: "dp.md.moldApprovalList.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this.oThis._oFragments[sFragmentName] = oFragment;
                    if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this.oThis._oFragments[sFragmentName]);
			}

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /** PO Item Start */
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
                mold_progress_status_code: 'DEV_RCV',
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