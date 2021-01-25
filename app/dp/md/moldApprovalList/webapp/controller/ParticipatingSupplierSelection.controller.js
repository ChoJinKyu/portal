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
    "dp/md/util/controller/SupplierSelection"
], function (DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ApprovalBaseController, MoldItemSelection, SupplierSelection
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;
    var supplierData =[];

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.ParticipatingSupplierSelection", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

        supplierSelection: new SupplierSelection(),
        

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
            
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage : function () {
            this.getView().setModel(new ManagedListModel(), "mdItemMaster");
            this.getView().setModel(new ManagedListModel(), "psOrgCode"); //currency 콤보박스
  
            console.log(" this.approval_number "  ,  this.approval_number);
            var schFilter = [];
            var schFilter2 = [];
   
           // if (this.approval_number == "New") {

           // } else {
                
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L2600')
                ];            
                schFilter2 = [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2600' ),
                        new Filter("group_code", FilterOperator.EQ, 'DP_MD_LOCAL_CURRENCY' ),
                        new Filter("language_cd", FilterOperator.EQ, 'KO' )
                ]; 
                this._bindViewCurrency("/OrgCodeLanguages", "psOrgCode", schFilter2, function (oData) {
                        console.log("OrgCodeLanguages >>>>>>", oData);
                });
                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
                });
               
           // }  
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

        onSupplierSelection: function (oEvent){
                var oTable = this.byId("psTable")
                , psModel = this.getModel("mdItemMaster"); 
                var oSelected = oTable.getSelectedIndices(); 
                var self = this;
                
                console.log(oSelected);
                
            if (oSelected.length > 0) {

                var param = {
                    'oThis':self,
                    'oEvent':oEvent,
                    'companyCode':self.company_code,
                    'orgCode':self.plant_code,
                    'isMulti':true
                }
                
                self.supplierSelection.showSupplierSelection(param, function(tokens){
                // this.supplierSelection.showSupplierSelection(this, oEvent, this.company_code, this.plant_code, function(data){

                    console.log(tokens);

                    var data = tokens.map(function(item){
                        return item.mProperties;
                    });

                    if(data.length > 0) {
                        supplierData=[];
                        for(var i=0; i<data.length; i++){
                            supplierData.push(data[i]);             
                        }
                        var aTokens = oEvent.getParameter("tokens");
                    }
                    console.log("supplierData :::", supplierData);
                    if(supplierData.length == 0){
                        MessageBox.error("Supplier를 하나이상 선택해주세요.");
                    }else{               
                        oSelected.forEach(function(idx){
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_1 = (supplierData[0] == undefined ?null:supplierData[0].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_2 = (supplierData[1] == undefined ?null:supplierData[1].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_3 = (supplierData[2] == undefined ?null:supplierData[2].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_4 = (supplierData[3] == undefined ?null:supplierData[3].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_5 = (supplierData[4] == undefined ?null:supplierData[4].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_6 = (supplierData[5] == undefined ?null:supplierData[5].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_7 = (supplierData[6] == undefined ?null:supplierData[6].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_8 = (supplierData[7] == undefined ?null:supplierData[7].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_9 = (supplierData[8] == undefined ?null:supplierData[8].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_10 = (supplierData[9] == undefined ?null:supplierData[9].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_11 = (supplierData[10] == undefined ?null:supplierData[10].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_12 = (supplierData[11] == undefined ?null:supplierData[11].key);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_1 = (supplierData[0] == undefined ?null:supplierData[0].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_2 = (supplierData[1] == undefined ?null:supplierData[1].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_3 = (supplierData[2] == undefined ?null:supplierData[2].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_4 = (supplierData[3] == undefined ?null:supplierData[3].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_5 = (supplierData[4] == undefined ?null:supplierData[4].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_6 = (supplierData[5] == undefined ?null:supplierData[5].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_7 = (supplierData[6] == undefined ?null:supplierData[6].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_8 = (supplierData[7] == undefined ?null:supplierData[7].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_9 = (supplierData[8] == undefined ?null:supplierData[8].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_10 = (supplierData[9] == undefined ?null:supplierData[9].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_11 = (supplierData[10] == undefined ?null:supplierData[10].text);
                            psModel.getData().ParticipatingSupplier[idx].supplier_code_nm_12 = (supplierData[11] == undefined ?null:supplierData[11].text);
                            psModel.getData().ParticipatingSupplier[idx].sequence_1 = (supplierData[0] == undefined ?null:"1");
                            psModel.getData().ParticipatingSupplier[idx].sequence_2 = (supplierData[1] == undefined ?null:"2");
                            psModel.getData().ParticipatingSupplier[idx].sequence_3 = (supplierData[2] == undefined ?null:"3");
                            psModel.getData().ParticipatingSupplier[idx].sequence_4 = (supplierData[3] == undefined ?null:"4");
                            psModel.getData().ParticipatingSupplier[idx].sequence_5 = (supplierData[4] == undefined ?null:"5");
                            psModel.getData().ParticipatingSupplier[idx].sequence_6 = (supplierData[5] == undefined ?null:"6");
                            psModel.getData().ParticipatingSupplier[idx].sequence_7 = (supplierData[6] == undefined ?null:"7");
                            psModel.getData().ParticipatingSupplier[idx].sequence_8 = (supplierData[7] == undefined ?null:"8");
                            psModel.getData().ParticipatingSupplier[idx].sequence_9 = (supplierData[8] == undefined ?null:"9");
                            psModel.getData().ParticipatingSupplier[idx].sequence_10 = (supplierData[9] == undefined ?null:"10");
                            psModel.getData().ParticipatingSupplier[idx].sequence_11 = (supplierData[10] == undefined ?null:"11");
                            psModel.getData().ParticipatingSupplier[idx].sequence_12 = (supplierData[11] == undefined ?null:"12");
                            psModel.refresh(true); 
                        });
                    }
                });
                
            } else {
                MessageBox.error("선택된 행이 없습니다.");
            }
            
        },
        /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onPsAddPress: function (oEvent) {
            var oModel = this.getModel("mdItemMaster");

            console.log(" mdItemMaster >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.ParticipatingSupplier != undefined && oModel.oData.ParticipatingSupplier.length > 0) {
                oModel.oData.ParticipatingSupplier.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }

            console.log(" this.getModel " , this.getModel('appMaster'));

            var oArgs = {
                approval_type_code: "E",
                company_code: this.company_code ,
                org_code: this.plant_code,
                mold_progress_status_code : ['DEV_RCV', 'BUD_APP'] ,
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
            var schFilter2 = [];
            schFilter2 = [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2600' ),
                    new Filter("group_code", FilterOperator.EQ, 'DP_MD_LOCAL_CURRENCY' ),
                    new Filter("language_cd", FilterOperator.EQ, 'KO' ),
                    new Filter("org_code", FilterOperator.EQ, data.company_code)
            ]; 
            this._bindViewCurrency("/OrgCodeLanguages", "psOrgCode", schFilter2, function (oData) {
                    console.log("OrgCodeLanguages >>>>>>", oData);
            }); 
            console.log(data);
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */
            var approval_number = mstModel.approval_number;
            oModel.addRecord({
                "approval_number": approval_number,
                "tenant_id": "L2600",
                "mold_id": String(data.mold_id),
                "model": data.model,
                "mold_number": data.mold_number,
                "mold_sequence": data.mold_sequence,
                "spec_name": data.spec_name,
                "mold_item_type_code": data.mold_item_type_code,
                "book_currency_code": data.book_currency_code,
                "provisional_budget_amount": data.provisional_budget_amount,
                "budget_amount": data.budget_amount,
                "currency_code": data.currency_code,
                "target_amount": data.target_amount,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/ParticipatingSupplier", 0); 

            if(oModel.getProperty("/entityName") == undefined){ // 신규시 entityName 없어서 행삭제를 못하고 있음 
                oModel.setProperty("/entityName","ParticipatingSupplier");
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
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onPsDelRow: function () {
            var psTable = this.byId("psTable")
                , detailModel = this.getModel("mdItemMaster")
                , oSelected = psTable.getSelectedIndices();
            ;

            console.log(" detailModel >>> " , detailModel);

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
        
        onPageCancelButtonPress: function () {
            this._viewMode();
        },

        _toEditModeEachApproval : function(){             
            // var oRows = this.byId("psTable").getRows();
            // oRows.forEach(function(oCell, idx){
            //    oCell.mAggregations.cells.forEach(function(item, jdx){ 
            //         if(jdx == 7 || jdx == 8){
            //              item.removeStyleClass("readonlyField");
            //         }
            //     });
            // });
         },
        _toShowModeEachApproval : function(){ 
            // var oRows = this.byId("psTable").getRows();
            // oRows.forEach(function(oCell, idx){
            //    oCell.mAggregations.cells.forEach(function(item, jdx){ 
            //         if(jdx == 7 || jdx == 8){
            //              item.addStyleClass("readonlyField");
            //         }
            //     });
            // });
            // this.byId("currency").addStyleClass("readonlyField");
            // this.byId("target_amount").addStyleClass("readonlyField");
         } ,

        onPagePreviewButtonPress : function(){
            this.getView().setModel(new ManagedListModel(), "approverPreview"); 

            if(this.getModel("approver").getData().Approvers != undefined){ 
                var ap = this.getModel("approver").getData().Approvers;
                var len = 0; 

                if(this.getView().getModel("mode").getProperty("/viewFlag")){
                    len = ap.length;
                }else{
                    len =  ap.length -1;
                }
               
                for(var i = 0 ; i < len ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }
            
            console.log("approverPreview " , this.getModel("approverPreview").getData());

            // var ref = this.getModel("referer");
            // this.getView().setModel(new ManagedModel(), "refererPreview");

            // var rArr = [];
            // if(ref.getData().Referers != undefined && ref.getData().Referers.length >0){
            //     ref.getData().Referers.forEach(function(item){
            //         rArr.push(item.referer_empno); 
            //     });
            // }
            // this.getModel("refererPreview").setProperty("/refArr", rArr);

            var oView = this.getView();

            if (!this._oDialogPreview) {
                this._oDialogPreview = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.moldApprovalList.view.ParticipatingSupplierSelectionPreView",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPreview.then(function (oDialog) {
                oDialog.open();
                oView.byId('referMultiPrev').setTokens(oView.byId("referMulti").getTokens()); // 미리보기 레퍼러 
            });

        },
        onPrvClosePress : function(){ 
             var oView = this.getView();
             if (this._oDialogPreview) {
                this._oDialogPreview.then(function (oDialog) {
                    oView.byId('referMulti').setTokens(oView.byId("referMultiPrev").getTokens()); // 이거 안하면 본화면에 표시가 안됨 
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogPreview = undefined;
            }
        },
        
        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
            /*
            approverData = verModel.getData().Approvers;*/
            console.log();
            console.log();
        },
        onPageRequestButtonPress : function (){
            this.getModel("appMaster").setProperty("/approve_status_code", "AR"); // 결제요청 
            this._sumbitDataSettingAndSend();
        } ,
        onPageDraftButtonPress : function () { 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 임시저장 
            this._sumbitDataSettingAndSend();
        } , 
        onPageRequestCancelButtonPress : function () { 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 요청취소 
            this._sumbitDataSettingAndSend();
         },

        _sumbitDataSettingAndSend : function () { 

            this.approval_type_code = "E";
            var bModel = this.getModel("mdItemMaster");
            var status = this.getModel("appMaster").getProperty("/approve_status_code");
            var appNum = this.getModel("appMaster").getProperty("/approval_number");
            console.log("bModel ::::", bModel.getData().ParticipatingSupplier);
            console.log("statust ::::", status);
            console.log("appNum ::::", appNum);
            this.approvalDetails_data = [] ;
            this.moldMaster_data = [] ;
            this.quotation_data = [];
            var qtnArr = [];
            var that = this;
 
            if(that.validator.validate(that.byId("generalInfoLayout") ) !== true){
                MessageToast.show( that.getModel('I18N').getText('/ECM01002') );
                return;
            }
            if(that.validator.validate(that.byId("account") ) !== true){
                MessageToast.show( that.getModel('I18N').getText('/ECM01002') );
                return;
            }
            
            if(bModel.getData().ParticipatingSupplier == undefined || bModel.getData().ParticipatingSupplier.length == 0){
                MessageToast.show("item 을 하나 이상 추가하세요.");
                // 벨리데이션 발생시 결제상태를 임시저장으로 원복시킴
                this.getModel("appMaster").setProperty("/approve_status_code", "DR");
                return;
            }

            if(bModel.getData().ParticipatingSupplier != undefined && bModel.getData().ParticipatingSupplier.length > 0){
                var amount_err = 0;
                var supplier_err = 0;
                bModel.getData().ParticipatingSupplier.forEach(function(item){
                    if(item.target_amount > item.provisional_budget_amount){
                        amount_err = amount_err+1;
                    }
                    if(item.supplier_code_1 == null){
                        supplier_err = amount_err+1;
                    }
                });
                // if(amount_err > 0){
                //     MessageToast.show("목표가가 투자예산 금액을 초과하였습니다.");
                //     return;
                // }
                if(supplier_err > 0){
                    MessageToast.show("협력사를 하나 이상 추가하세요.");
                    return;
                }

            }
            if(that.validator.validate(that.byId("psTable")) !== true){
                MessageToast.show( that.getModel('I18N').getText('/ECM01002') );
                return;
            }

            if(bModel.getData().ParticipatingSupplier != undefined && bModel.getData().ParticipatingSupplier.length > 0){

                bModel.getData().ParticipatingSupplier.forEach(function(item){
                    console.log(item);
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_1
                        ,sequence : parseInt(item.sequence_1)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_2
                        ,sequence : parseInt(item.sequence_2)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_3
                        ,sequence : parseInt(item.sequence_3)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_4
                        ,sequence : parseInt(item.sequence_4)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_5
                        ,sequence : parseInt(item.sequence_5)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_6
                        ,sequence : parseInt(item.sequence_6)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_7
                        ,sequence : parseInt(item.sequence_7)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_8
                        ,sequence : parseInt(item.sequence_8)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_9
                        ,sequence : parseInt(item.sequence_9)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_10
                        ,sequence : parseInt(item.sequence_10)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_11
                        ,sequence : parseInt(item.sequence_11)
                    })
                    that.quotation_data.push({
                        mold_id : item.mold_id
                        ,approval_number : that.approval_number 
                        ,supplier_code : item.supplier_code_12
                        ,sequence : parseInt(item.sequence_12)
                    })
                    
                    that.approvalDetails_data.push({
                        tenant_id : that.tenant_id 
                        , approval_number : that.approval_number 
                        , mold_id : item.mold_id 
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                    that.moldMaster_data.push({
                         tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , mold_item_type_code : item.mold_item_type_code
                        , book_currency_code : item.book_currency_code
                        , provisional_budget_amount : item.provisional_budget_amount
                        , currency_code : item.currency_code
                        , target_amount : item.target_amount
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
                        , mold_item_type_code : item.mold_item_type_code
                        , book_currency_code : item.book_currency_code
                        , provisional_budget_amount : item.provisional_budget_amount
                        , currency_code : item.currency_code
                        , target_amount : item.target_amount
                        , _row_state_ : "D"
                    });
                });
            }


            this._commonDataSettingAndSubmit();

        }
    });
});