sap.ui.define([
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
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
], function (DateFormatter, NumberFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalBaseController, MoldItemSelection
) {
    "use strict";

    //var oTransactionManager;
    //var oRichTextEditor;

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.PurchaseOrderItemLocal", {

        //dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

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
        _onApprovalPage: function () {

            this.getView().setModel(new ManagedListModel(), "purOrderItem");
            this.getView().setModel(new ManagedModel(), "payment");
            //this.getView().setModel(new ManagedListModel(), "importPlant");

            console.log(" this.approval_number ", this.approval_number);
            var schFilter = [];
            
            if (this.approval_number == "New") {
                /*var oModel = this.getModel('payment'),
                    poAmount = 0;
                
                oModel.setProperty("/purchasing_amount", poAmount);*/
                this._editablePayment(false);
            } else {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];
                
                var oModel = this.getModel('payment'),
                    poAmount = 0;
                this._bindViewPurchaseOrder("/PurchaseOrderItems", "purOrderItem", schFilter, function (oData) {
                    if (oData.results.length > 0) {
                        oData.results.forEach(function (item) {
                            poAmount = poAmount + Number(item.purchasing_amount);
                        });
                    }

                    oModel.setProperty("/split_pay_type_code", oData.results[0].split_pay_type_code);
                    oModel.setProperty("/prepay_rate", oData.results[0].prepay_rate);
                    oModel.setProperty("/progresspay_rate", oData.results[0].progresspay_rate);
                    oModel.setProperty("/rpay_rate", oData.results[0].rpay_rate);
                    oModel.setProperty("/purchasing_amount", poAmount);
                    oModel.setProperty("/currency_code", oData.results[0].currency_code);
                    
                    if(oData.results[0].split_pay_type_code === null){
                        this._editablePayment(false);
                    }
                }.bind(this));
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

        _editablePayment: function (flag) {
            this.getView().byId("splitPayTypeCode").setEnabled(flag);
            this.getView().byId("advanced").setEnabled(flag);
            this.getView().byId("part").setEnabled(flag);
            this.getView().byId("residual").setEnabled(flag);
        },

        /**
         * @description : Popup 창 : 품의서 PO Item 항목의 Add 버튼 클릭
         */
        onPoItemAddRow: function (oEvent) {
            var oModel = this.getModel("purOrderItem");

            var mIdArr = [];
            if (oModel.oData.ApprovalDetails != undefined && oModel.oData.ApprovalDetails.length > 0) {
                oModel.oData.ApprovalDetails.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                company_code: this.company_code,
                org_code: this.plant_code,
                mold_progress_status_code: 'DTL_CNF',
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
            var oModel = this.getModel("purOrderItem");

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

            var pModel = this.getModel('payment'),
                poAmount = Number(pModel.getProperty("/purchasing_amount")) + Number(data.oData.purchasing_amount);
            pModel.setProperty("/purchasing_amount", poAmount);
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
                oModel = this.getModel("purOrderItem"),
                oSelected = oTable.getSelectedIndices().reverse(),
                pModel = this.getModel('payment'),
                removePoAmt = 0;

            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    removePoAmt = oModel.getData().PurchaseOrderItems[idx].purchasing_amount;
                    oModel.removeRecord(idx);
                });

                oTable.clearSelection();
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }

            var poAmount = Number(pModel.getProperty("/purchasing_amount")) - Number(removePoAmt);
            pModel.setProperty("/purchasing_amount", poAmount);
        },

        onChangePayment: function (oEvent) {
            /*var oModel = this.getModel("purOrderItem"),
                poData = oModel.getData().PurchaseOrderItems,
                formName = oEvent.getSource().sId.split('--')[2],
                formValue = oEvent.getSource().mProperties.value;
            
            for (var idx = 0; idx < poData.length; idx++) {
                if(formName === "splitPayTypeCode"){
                    poData[idx].split_pay_type_code = formValue;
                }else if(formName === "advanced"){
                    poData[idx].prepay_rate = formValue;
                }else if(formName === "part"){
                    poData[idx].progresspay_rate = formValue;
                }else if(formName === "residual"){
                    poData[idx].rpay_rate = formValue;
                }
            }*///partialPayment
            var pModel = this.getModel("payment"),
                split_pay_type_code = pModel.getData().split_pay_type_code,
                prepay_rate =  pModel.getData().prepay_rate,
                progresspay_rate =  pModel.getData().progresspay_rate,
                rpay_rate =  pModel.getData().rpay_rate,
                purchasing_amount =  pModel.getData().purchasing_amount,
                total = Number(prepay_rate) + Number(progresspay_rate) + Number(rpay_rate);

            if(this.getView().byId("partialPayment").getSelected()){
                if(split_pay_type_code === "A"){
                    if(!(prepay_rate === null || prepay_rate === "") && !(progresspay_rate === null || progresspay_rate === "") && !(rpay_rate === null || rpay_rate === "")){
                        if(total !== purchasing_amount){
                            MessageToast.show("금액 합계가 맞지 않습니다.");
                            return;
                        }
                    }
                }else{
                    if(split_pay_type_code === null || split_pay_type_code === ""){
                        pModel.getData().split_pay_type_code = "R";
                    }
                    if(!(prepay_rate === null || prepay_rate === "") && !(progresspay_rate === null || progresspay_rate === "") && !(rpay_rate === null || rpay_rate === "")){
                        if(total !== 100){
                            MessageToast.show("Rate가 100이 아닙니다.");
                            return;
                        }
                    }
                }
            }
        },
        
        onSelectPayment: function (oEvent) {
            this._editablePayment(oEvent.getSource().mProperties.selected);
        },
        
        /**
         * @description 미리보기 버튼눌렀을 경우 
         */
        onPagePreviewButtonPress : function(){
            this.getView().setModel(new ManagedListModel(), "approverPreview"); 

            if(this.getModel("approver").getData().Approvers != undefined){  // approver 는 맨 마지막 줄이 있어서 걔는 안보여주기 위해 새로 담음 
                var ap = this.getModel("approver").getData().Approvers;
                for(var i = 0 ; i < ap.length -1 ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }
            
            console.log("onPagePreviewButtonPress >>> this._oDialog " , this._oDialogPrev);
            var oView = this.getView();

            if (!this._oDialogPrev) {
                this._oDialogPrev = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.moldApprovalList.view.BudgetExecutionApprovalPreView",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPrev.then(function (oDialog) {
                oDialog.open();
            });

        },
        onPrvClosePress : function(){
             this.byId("budgetExecutionPreview").close();
            // this.byId("budgetExecutionPreview").destroy();
        },

        onPageDraftButtonPress : function () { 
 
            /**
             * 'DR'
            'AR'
            'IA'
            'AP'
            'RJ' */ 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR");

            this._onSubmit();
        },

        _onSubmit : function () { 
            this.approval_type_code = "V";

            var oModel = this.getModel("purOrderItem"),
                pModel = this.getModel("payment"),
                split_pay_type_code = pModel.getData().split_pay_type_code,
                prepay_rate =  pModel.getData().prepay_rate,
                progresspay_rate =  pModel.getData().progresspay_rate,
                rpay_rate =  pModel.getData().rpay_rate,
                purchasing_amount =  pModel.getData().purchasing_amount,
                total = Number(prepay_rate) + Number(progresspay_rate) + Number(rpay_rate);

            this.approvalDetails_data = [] ;
            this.moldMaster_data = [] ;
            
            if(oModel.getData().PurchaseOrderItems == undefined || oModel.getData().PurchaseOrderItems.length == 0){
                MessageToast.show("item 을 하나 이상 추가하세요.");
                return;
            }

            if(this.getView().byId("partialPayment").getSelected()){
                if(split_pay_type_code === "A"){
                    if(total !== purchasing_amount){
                        MessageToast.show("금액 합계가 맞지 않습니다.");
                        return;
                    }
                }else{
                    if(total !== 100){
                        MessageToast.show("Rate가 100이 아닙니다.");
                        return;
                    }
                }
            }else{
                split_pay_type_code = null;
                prepay_rate =  null;
                progresspay_rate =  null;
                rpay_rate =  null;
            }

            if(oModel.getData().PurchaseOrderItems != undefined && oModel.getData().PurchaseOrderItems.length > 0){
                oModel.getData().PurchaseOrderItems.forEach(function(item){
                    this.approvalDetails_data.push({
                        tenant_id : this.tenant_id, 
                        approval_number : this.approval_number, 
                        mold_id : item.mold_id, 
                        _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                    this.moldMaster_data.push({
                        tenant_id : this.tenant_id,
                        mold_id : item.mold_id,
                        split_pay_type_code : split_pay_type_code,
                        prepay_rate : prepay_rate,
                        progresspay_rate : progresspay_rate,
                        rpay_rate : rpay_rate,
                        _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                }.bind(this));

            }

            if(oModel._aRemovedRows.length > 0){
                oModel._aRemovedRows.forEach(function(item){
                    this.approvalDetails_data.push({
                        tenant_id : this.tenant_id, 
                        approval_number : this.approval_number, 
                        mold_id : item.mold_id, 
                        _row_state_ : "D"
                    });
                    this.moldMaster_data.push({
                        tenant_id : this.tenant_id, 
                        mold_id : item.mold_id, 
                        split_pay_type_code : "",
                        prepay_rate : null,
                        progresspay_rate : null,
                        rpay_rate : null,
                        _row_state_ : "D"
                    });
                }.bind(this));
            }

            this._commonDataSettingAndSubmit();
        }
    });
});