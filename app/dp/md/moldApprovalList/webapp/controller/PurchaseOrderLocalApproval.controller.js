sap.ui.define([
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
    "./ApprovalBaseController",
    "dp/md/util/controller/MoldItemSelection"
], function (NumberFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, ApprovalBaseController, MoldItemSelection
) {
    "use strict";

    //var oTransactionManager;

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.PurchaseOrderItemLocal", {

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
            this.getView().setModel(new ManagedListModel(), "payment");
            this.getView().setModel(new ManagedModel(), "amount");
            
            var schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number),
                             new Filter("tenant_id", FilterOperator.EQ, 'L2600')];
            
            var oModel = this.getModel('amount'),
                poAmount = 0,
                currencyCode = "";
            this._bindViewPurchaseOrder("/PurchaseOrderItems", "purOrderItem", schFilter, function (oData) {
                //var splitPayTypeCode = null;
                if (oData.results.length > 0) {
                    oData.results.forEach(function (item) {
                        poAmount = poAmount + Number(item.purchasing_amount);
                    });
                    //splitPayTypeCode = oData.results[0].split_pay_type_code;
                    currencyCode = oData.results[0].currency_code;
                    //oModel.setProperty("/split_pay_type_code", splitPayTypeCode);
                    //oModel.setProperty("/prepay", oData.results[0].prepay);
                    //oModel.setProperty("/progresspay", oData.results[0].progresspay);
                    //oModel.setProperty("/rpay", oData.results[0].rpay);
                }

                oModel.setProperty("/purchasing_amount", poAmount);
                oModel.setProperty("/currency_code", currencyCode);
                //oModel.setProperty("/partial_payment", splitPayTypeCode === null ? false : true);
                
            }.bind(this));

            this._bindViewPurchaseOrder("/Payments", "payment", schFilter, function (oData) {
                
                
            }.bind(this));
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

        _toEditModeEachApproval: function(){
            // this.getView().byId("advanced").removeStyleClass("readonlyField");
            // this.getView().byId("part").removeStyleClass("readonlyField");
            // this.getView().byId("residual").removeStyleClass("readonlyField");

            //this.getView().byId("poItemTable").setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		},

		_toShowModeEachApproval: function(){
            // this.getView().byId("advanced").addStyleClass("readonlyField");
            // this.getView().byId("part").addStyleClass("readonlyField");
            // this.getView().byId("residual").addStyleClass("readonlyField");
            
            //this.getView().byId("poItemTable").setSelectionMode(sap.ui.table.SelectionMode.None);
		},

        /**
         * @description : Popup 창 : 품의서 PO Item 항목의 Add 버튼 클릭
         */
        onPoItemAddRow: function (oEvent) {
            var oModel = this.getModel("purOrderItem");

            var mIdArr = [];
            if (oModel.oData.PurchaseOrderItems != undefined && oModel.oData.PurchaseOrderItems.length > 0) {
                oModel.oData.PurchaseOrderItems.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            var oArgs = {
                approval_type_code          : "V",
                company_code                : this.company_code,
                org_code                    : this.plant_code,
                mold_progress_status_code   : ['DTL_CNF'],
                mold_id_arr                 : mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }

            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs, function (oDataMold) {
                console.log("selected data list >>>> ", oDataMold);
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
                "mold_id": String(data.mold_id),
                "model": data.model,
                "mold_number": data.mold_number,
                "mold_sequence": data.mold_sequence,
                "spec_name": data.spec_name,
                "mold_item_type_code": data.mold_item_type_code,
                "book_currency_code": data.book_currency_code,
                "provisional_budget_amount": data.provisional_budget_amount,
                "currency_code": data.currency_code,
                "purchasing_amount": data.purchasing_amount,
                "supplier_code": data.supplier_code,
                "target_amount": data.target_amount,
                "mold_production_type_code": data.mold_production_type_code,
                "family_part_number_1": data.family_part_number_1,
                "account_code": data.account_code
            }, "/PurchaseOrderItems", 0);
            //this.validator.clearValueState(this.byId("poItemTable"));

            var pModel = this.getModel('amount'),
                poAmount = Number(pModel.getData().purchasing_amount) + Number(data.purchasing_amount);
            pModel.setProperty("/purchasing_amount", poAmount);
            if(pModel.getProperty("/currency_code") === ""){
                pModel.setProperty("/currency_code", data.currency_code);
            }
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
                pModel = this.getModel('amount'),
                removePoAmt = 0;

            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    removePoAmt = removePoAmt + oModel.getData().PurchaseOrderItems[idx].purchasing_amount;
                    oModel.removeRecord(idx);
                });

                oTable.clearSelection();
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }

            var poAmount = Number(pModel.getProperty("/purchasing_amount")) - Number(removePoAmt);
            pModel.setProperty("/purchasing_amount", poAmount);
            if(oModel.getData().PurchaseOrderItems.length == 0){
                pModel.setProperty("/currency_code", "");
            }
        },

        /**
         * @description : Payment 항목의 Add 버튼 클릭
         */
        onPaymentAddRow: function (oEvent) {
            var oModel = this.getModel("payment"),
                iModel = this.getModel("purOrderItem");

            var mIdArr = [];
            if (iModel.oData.PurchaseOrderItems === undefined || iModel.oData.PurchaseOrderItems.length < 1) {
                MessageToast.show("분할결제할 Item이 없습니다.");
                return;
            }

            oModel.addRecord({
                "tenant_id": this.tenant_id,
                "approval_number": this.approval_number,
                "pay_sequence": oModel.oData.Payments.length + 1,
                "split_pay_type_code": (oModel.oData.Payments.length > 0 ? oModel.oData.Payments[0].split_pay_type_code : 'R'),
                "pay_rate": "",
                "pay_price": ""
            }, "/Payment");
        },

        /**
         * @description Payment 의 delete 버튼 누를시 
         */
        onPaymentDelRow: function () {
            var oTable = this.byId("paymentTable"),
                oModel = this.getModel("payment"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            if (aItems.length > 0) {
                aItems.forEach(function (oItem) {
                    aIndices.push(oModel.getProperty("/Payments").indexOf(oItem.getBindingContext("payment").getObject()));
                });
                
                aIndices.reverse().forEach(function (nIndex) {
                    oModel.removeRecord(nIndex);
                });

                oTable.removeSelections(true);

                for (var i = 0; i < oModel.getData().Payments.length; i++) {
                    oModel.getData().Payments[i].pay_sequence = i + 1;
                }
                oModel.refresh(true);
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        },

        splitPayTypeChange: function (oEvent) {
            var oModel = this.getModel("payment"),
                payment = oModel.getData().Payments,
                sSelectedKey = oModel.getProperty(oEvent.getSource().getBindingInfo("selectedKey").binding.getContext().getPath()).split_pay_type_code;


            if(payment.length > 1){
                payment[0].pay_rate = null;
                payment[0].pay_price = null;
                for(var idx = 1; idx < payment.length; idx++){
                    payment[idx].split_pay_type_code = sSelectedKey;
                    payment[idx].pay_rate = null;
                    payment[idx].pay_price = null;
                }
            }
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
                    poData[idx].prepay = formValue;
                }else if(formName === "part"){
                    poData[idx].progresspay = formValue;
                }else if(formName === "residual"){
                    poData[idx].rpay = formValue;
                }
            }*///partialPayment
            var pModel = this.getModel("payment"),
                split_pay_type_code = pModel.getData().split_pay_type_code,
                prepay =  pModel.getData().prepay,
                progresspay =  pModel.getData().progresspay,
                rpay =  pModel.getData().rpay,
                purchasing_amount =  pModel.getData().purchasing_amount,
                total = Number(prepay) + Number(progresspay) + Number(rpay);

            if(this.getView().byId("partialPayment").getSelected()){
                if(split_pay_type_code === "A"){
                    if(prepay !== undefined && progresspay !== undefined && rpay !== undefined){
                        if(!(prepay === null || prepay === "") && prepay >= total){
                            MessageToast.show("선급금이 Total 금액 미만이어야 합니다.");
                            return;
                        }else if(!(progresspay === null || progresspay === "") && progresspay >= total){
                            MessageToast.show("중도금이 Total 금액 미만이어야 합니다.");
                            return;
                        }else if(!(rpay === null || rpay === "") && rpay >= total){
                            MessageToast.show("잔금이 Total 금액 미만이어야 합니다.");
                            return;
                        }
                        if(!(prepay === null || prepay === "") && !(progresspay === null || progresspay === "") && !(rpay === null || rpay === "")){
                            if(total !== purchasing_amount){
                                MessageToast.show("금액 합계가 맞지 않습니다.");
                                return;
                            }
                        }
                    }
                }else{
                    if(split_pay_type_code === null || split_pay_type_code === ""){
                        pModel.getData().split_pay_type_code = "R";
                    }
                    if(prepay !== undefined && progresspay !== undefined && rpay !== undefined){
                        if(!(prepay === null || prepay === "") && prepay >= 100){
                            MessageToast.show("선급금 비율이 100미만이어야 합니다.");
                            return;
                        }else if(!(progresspay === null || progresspay === "") && progresspay >= 100){
                            MessageToast.show("중도금 비율이 100미만이어야 합니다.");
                            return;
                        }else if(!(rpay === null || rpay === "") && rpay >= 100){
                            MessageToast.show("잔금 비율이 100미만이어야 합니다.");
                            return;
                        }
                        if(!(prepay === null || prepay === "") && !(progresspay === null || progresspay === "") && !(rpay === null || rpay === "")){
                            if(total !== 100){
                                MessageToast.show("Rate가 100이 아닙니다.");
                                return;
                            }
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

            if(this.getModel("approver").getData().Approvers != undefined){ 
                var ap = this.getModel("approver").getData().Approvers;
                var len = 0; 

                if(this.getView().getModel("mode").getProperty("/editFlag")){
                    len = ap.length - 1;
                }else{
                    len =  ap.length;
                }
                for(var i = 0 ; i < len ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }
            
            var oView = this.getView();

            if (!this._oDialogPrev) {
                this._oDialogPrev = Fragment.load({
                    id: this.getView().getId(),
                    name: "dp.md.moldApprovalList.view.PurchaseOrderLocalPreview",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPrev.then(function (oDialog) {
                oDialog.open();
                oView.byId('referMultiPrev').setTokens(oView.byId("referMulti").getTokens());
            });

        },
        onPrvClosePress : function(){
            var oView = this.getView();
            if (this._oDialogPrev) {
                this._oDialogPrev.then(function (oDialog) {
                    oView.byId('referMulti').setTokens(oView.byId("referMultiPrev").getTokens());
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogPrev = undefined;
            }
        },

        onPageDraftButtonPress : function () {
            var status = this.getModel("appMaster").getProperty("/approve_status_code");
            if(!(status === undefined || status === "DR")){
                MessageToast.show( "Draft 상태 또는 신규일 때만 임시저장이 가능합니다." );
                return;
            }
            
            this._onSubmit("DR");/** Draft */
        },

        onPageRequestCancelButtonPress : function () {
            if(this.getModel("appMaster").getProperty("/approve_status_code") !== "AR"){
                MessageToast.show( "Request 상태일 때만 Request Cancel 가능합니다." );
                return;
            }
            
            this._onSubmit("DR");/** Draft */
        },

        onPageRequestButtonPress : function () {
            var oModel = this.getModel("purOrderItem"),
                status = this.getModel("appMaster").getProperty("/approve_status_code");
                
            if(!(status === undefined || status === "DR")){
                MessageToast.show( "Draft 상태 또는 신규일 때만 Request 가능합니다." );
                return;
            }
            
            if(oModel.getData().PurchaseOrderItems.length === 0){
                MessageToast.show("item 을 하나 이상 추가하세요.");
                return;
            }

            this._onSubmit("AR");/** Approval Request */
        },

        _onSubmit : function (approveStatusCode) {
            if(this.validator.validate( this.byId("generalInfoLayout") ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM01002') );
                return;
            }

            var oModel = this.getModel("purOrderItem"),
                orderItems = oModel.getData().PurchaseOrderItems,
                aModel = this.getModel("amount"),
                purchasing_amount =  aModel.getData().purchasing_amount,
                pModel = this.getModel("payment"),
                payments = pModel.getData().Payments,
                total = 0;
                /*split_pay_type_code = pModel.getData().split_pay_type_code,
                prepay =  pModel.getData().prepay,
                progresspay =  pModel.getData().progresspay,
                rpay =  pModel.getData().rpay,
                total = Number(prepay) + Number(progresspay) + Number(rpay);*/

            if(orderItems.length > 1){
                var accountCode = orderItems[0].account_code,
                    supplierCode = orderItems[0].supplier_code,
                    currencyCode = orderItems[0].currency_code;
                for(var idx = 1; idx < orderItems.length; idx++){
                    /*if(accountCode !== orderItems[idx].account_code){
                        MessageToast.show("계정코드가 같지 않습니다.");
                        return;
                    }*/
                    if(supplierCode !== orderItems[idx].supplier_code){
                        MessageToast.show("업체가 같지 않습니다.");
                        return;
                    }
                    if(currencyCode !== orderItems[idx].currency_code){
                        MessageToast.show("통화가 같지 않습니다.");
                        return;
                    }
                }
            }

            if(payments.length > 1){
                var splitPayTypeCode = payments[0].split_pay_type_code;

                for(var idx = 0; idx < payments.length; idx++){
                    if(splitPayTypeCode === 'A'){
                        total = total + Number(payments[idx].pay_price);
                    }else{
                        total = total + Number(payments[idx].pay_rate);
                    }
                }

                if(splitPayTypeCode === 'A' && total !== purchasing_amount){
                    MessageToast.show("금액 합계가 맞지 않습니다.");
                    return;
                }else if(splitPayTypeCode === 'R' && total !== 100){
                    MessageToast.show("Rate가 100이 아닙니다.");
                    return;
                }
            }
/*
            if(this.getView().byId("partialPayment").getSelected()){
                if(split_pay_type_code === "A"){
                    if(prepay >= total){
                        MessageToast.show("선급금이 Total 금액 미만이어야 합니다.");
                        return;
                    }else if(progresspay >= total){
                        MessageToast.show("중도금이 Total 금액 미만이어야 합니다.");
                        return;
                    }else if(rpay >= total){
                        MessageToast.show("잔금이 Total 금액 미만이어야 합니다.");
                        return;
                    }
                    if(total !== purchasing_amount){
                        MessageToast.show("금액 합계가 맞지 않습니다.");
                        return;
                    }
                }else{
                    if(prepay >= 100){
                        MessageToast.show("선급금 비율이 100미만이어야 합니다.");
                        return;
                    }else if(progresspay >= 100){
                        MessageToast.show("중도금 비율이 100미만이어야 합니다.");
                        return;
                    }else if(rpay >= 100){
                        MessageToast.show("잔금 비율이 100미만이어야 합니다.");
                        return;
                    }
                    if(total !== 100){
                        MessageToast.show("Rate가 100이 아닙니다.");
                        return;
                    }
                }
            }else{          
                split_pay_type_code = null;
                prepay =  null;
                progresspay =  null;
                rpay =  null;
            }
*/
            this.approval_type_code = "V";

            this.getModel("appMaster").setProperty("/approve_status_code", approveStatusCode);

            this.approvalDetails_data = [];
            this.payment_data = [];
            
            // 삭제 row 부터 추가되어야 정상 저장됨 
            if(oModel._aRemovedRows.length > 0){
                oModel._aRemovedRows.forEach(function(item){
                    this.approvalDetails_data.push({
                        tenant_id : this.tenant_id, 
                        approval_number : this.approval_number, 
                        mold_id : item.mold_id, 
                        _row_state_ : "D"
                    });
                }.bind(this));
            }

            if(orderItems.length > 0){//orderItems != undefined && 
                orderItems.forEach(function(item){
                    this.approvalDetails_data.push({
                        tenant_id : this.tenant_id, 
                        approval_number : this.approval_number, 
                        mold_id : item.mold_id, 
                        _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                }.bind(this));

            }

            if(payments.length > 0){
                payments.forEach(function(item){
                    this.payment_data.push({
                        tenant_id : this.tenant_id, 
                        approval_number : this.approval_number, 
                        pay_sequence : String(item.pay_sequence), 
                        split_pay_type_code : item.split_pay_type_code,
                        pay_rate : item.pay_rate,
                        pay_price : item.pay_price
                    });
                }.bind(this));

            }


            this._commonDataSettingAndSubmit();
        }
    });
});