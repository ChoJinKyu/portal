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
    "dp/md/util/controller/MoldItemSelection",
    "dp/md/util/controller/SupplierSelection",
    "sap/ui/core/Item",
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, MoldItemSelection, SupplierSelection
    ,Item
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;

    return BaseController.extend("dp.md.moldApprovalList.controller.ParticipatingSupplierSelection", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

        supplierSelectionPop: new SupplierSelection(),

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
            console.log("participating 호출");
            this.oThis = oThis; 
            var schFilter = [];
            var schFilter2 = [];
            this.oThis.getView().setModel(new ManagedListModel(), "psItemMaster"); //그리드 전체
            this.oThis.getView().setModel(new ManagedListModel(), "psOrgCode"); //currency 콤보박스
            if(this.oThis.approval_number == "New"){

            }else{
                 schFilter = [new Filter("approval_number", FilterOperator.EQ, this.oThis.approval_number)
                , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ]; 

                schFilter2 = [
                    new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
                    new Filter("group_code", FilterOperator.EQ, 'DP_MD_LOCAL_CURRENCY' ),
                    new Filter("language_cd", FilterOperator.EQ, 'KO' ),
                    new Filter("org_code", FilterOperator.EQ, this.oThis.company_code)
                ]; 

                this._bindView2("/ParticipatingSupplier", "psItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
                });

                this._bindView3("/OrgCodeLanguages", "psOrgCode", schFilter2, function (oData) {
                    console.log("OrgCodeLanguages >>>>>>", oData);
                });
            }
            
            this.oThis.getView().setModel(new ManagedListModel(), "appDetail");
            this.oThis.getView().setModel(new ManagedListModel(), "moldMaster");
/*
            oTransactionManager.addDataModel(this.getModel("appDetail"));
            oTransactionManager.addDataModel(this.getModel("moldMaster"));
*/
            var oPageSubSection2 = this.oThis.byId("pageSection");
            this._loadFragmentPOILocal("ParticipatingSupplierSelection", function(oFragment){
                oPageSubSection2.addBlock(oFragment);   
            })
        },

        _bindView2 : function (sObjectPath, sModel, aFilter, callback) { 
            var oView = this.oThis.getView(),
                oModel = this.oThis.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.oThis.getModel("participatingSupplierSelection"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },

        _bindView3 : function (sObjectPath, sModel, aFilter, callback) { 
            console.log("this.oThis.getModel(orgCode) ::", this.oThis.getModel("orgCode"))
            var oView = this.oThis.getView(),
                oModel = this.oThis.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.oThis.getModel("orgCode"));
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
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

                /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onPSSelectionAddPress: function (oEvent) {
            console.log("oEvent>>>>");
            var oModel = this.oThis.getModel("psItemMaster");

            console.log(" psItemMaster >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.ItemBudgetExecution != undefined && oModel.oData.ItemBudgetExecution.length > 0) {
                oModel.oData.ItemBudgetExecution.forEach(function (item) {
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
            var oTable = this.oThis.byId("psTable"),
                oModel = this.oThis.getModel("psItemMaster"),
                mstModel = this.oThis.getModel("appMaster");
            ;
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */
            var approval_number = mstModel.oData.approval_number;
            console.log(data.oData);
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
                "provisional_budget_amount": data.oData.provisional_budget_amount,
                "budget_amount": data.oData.budget_amount,
                "currency_code": data.oData.currency_code,
                "target_amount": data.oData.target_amount,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ParticipatingSupplier", 0);
        },

        onSuppValueHelpRequested: function(oEvent){

            console.log("this.getModel('oThis') :::", this.oThis)
            console.log(this.oThis.company_code)
            console.log(this.oThis.plant_code)
            var sCompanyCode  = this.oThis.company_code
            var sPlantCode = this.oThis.plant_code

            // var oView = this.getView();
            // var foo = this.getOwnerComponent().getView();
            // console.log('oView',oView);
            // console.log('foo',foo);
            
            this.supplierSelectionPop.showSupplierSelection(this.oThis, oEvent, sCompanyCode, sPlantCode);
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
        onPSSelectionDelRow: function () {
            var oTable = this.byId("psTable"),
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