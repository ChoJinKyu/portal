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
                this._participatingEditFragment();
            } else {
                this._participatingViewFragment();
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                // schFilter2 = [
                //     new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
                //     new Filter("group_code", FilterOperator.EQ, 'DP_MD_LOCAL_CURRENCY' ),
                //     new Filter("language_cd", FilterOperator.EQ, 'KO' ),
                //     new Filter("org_code", FilterOperator.EQ, this.org_code)
                // ]; 

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
                });
                // this._bindViewCurrency("/OrgCodeLanguages", "psOrgCode", schFilter2, function (oData) {
                //     console.log("OrgCodeLanguages >>>>>>", oData);
                // });
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

        onSupplierSelection: function (oEvent){
                var oTable = this.byId("psTable")
                , psModel = this.getModel("mdItemMaster"); 
                var oSelected = oTable.getSelectedIndices(); 
                
                console.log(oSelected);
                
            if (oSelected.length > 0) {
                this.supplierSelection.showSupplierSelection(this, oEvent, this.company_code, this.org_code, function(data){
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
            console.log("oEvent>>>>");
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
               company_code: this.company_code ,
                org_code: this.plant_code,
                //mold_progress_status_code : 'DEV_RCV' ,
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
                    new Filter("tenant_id", FilterOperator.EQ, 'L1100' ),
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
                "tenant_id": "L1100",
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

        // onPageEditButtonPress: function () {
        //     this._participatingEditFragment();
        //     this._editMode();
        // },
        
        onPageCancelButtonPress: function () {
            this._participatingViewFragment();
            this._viewMode();
        },

        _toEditModeEachApproval : function(){ this._participatingEditFragment() } ,
        _toShowModeEachApproval : function(){ this._participatingViewFragment() } ,

        _participatingEditFragment : function(){
            console.log("_participatingEditFragment");
            var oPageSection = this.byId("participatingSupplierSelectionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("ParticipatingSupplierSelectionTableEdit", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },
        _participatingViewFragment : function(){
             console.log("_participatingEditFragment");
             var oPageSection = this.byId("participatingSupplierSelectionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("ParticipatingSupplierSelectionTableView", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },

        onPagePreviewButtonPress : function(){
            this.getView().setModel(new ManagedListModel(), "approverPreview"); 

        //    this.getModel("approverPreview").setData(this.getModel("approver").getData());
            if(this.getModel("approver").getData().Approvers != undefined){ 
                var ap = this.getModel("approver").getData().Approvers;
                for(var i = 0 ; i < ap.length -1 ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }
            
            console.log("approverPreview " , this.getModel("approverPreview").getData());

            var ref = this.getModel("referer");
            this.getView().setModel(new ManagedModel(), "refererPreview");

            var rArr = [];
            if(ref.getData().Referers != undefined && ref.getData().Referers.length >0){
                ref.getData().Referers.forEach(function(item){
                    rArr.push(item.referer_empno); 
                });
            }
            this.getModel("refererPreview").setProperty("/refArr", rArr);

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
            });

        },
        onPrvClosePress : function(){
            this.byId("participatingSupplierSelectionPreview").close();
        },
        
        onChangePayment: function (oEvent) {
            var oModel = this.getModel("moldMaster");
            /*
            approverData = verModel.getData().Approvers;*/
            console.log();
            console.log();
        },

        onPageDraftButtonPress : function () { 
            /**
             * 'DR'
            'AR'
            'IA'
            'AP'
            'RJ' */ 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR");

            this.approval_type_code = "E";
            var bModel = this.getModel("mdItemMaster");
            this.approvalDetails_data = [] ;
            this.moldMaster_data = [] ;
            this.quotation_data = [];
            var qtnArr = [];
            var that = this;
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