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

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.ParticipatingSupplierSelectionCancelApproval", {

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

            this.setModel(oViewModel, "participatingSupplierSelectionCancelApprovalView");//change
            this.getRouter().getRoute("participatingSupplierSelectionCancelApproval").attachPatternMatched(this._onObjectMatched, this);//change
            this.getView().setModel(new ManagedListModel(), "mdItemMaster");
            
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage : function () {
  
            console.log(" this.approval_number "  ,  this.approval_number);
            console.log(" Cancellation "  ,  this.getView().getModel('Cancellation'));
            var schFilter = [];
            var schFilter2 = [];
   
            if (this.approval_number == "New") {
                 this._participatingEditFragment();

                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.getView().getModel('Cancellation').getProperty("/approvalNumber"))
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
                });

            } else {
                this._participatingViewFragment();
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                ];

                this._bindViewParticipating("/ParticipatingSupplier", "mdItemMaster", schFilter, function (oData) {
                    console.log("ParticipatingSupplier >>>>>>", oData);
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
            this._loadFragment("ParticipatingSupplierSelectionCancelTableEdit", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },
        _participatingViewFragment : function(){ // 협력사 선정품의랑 같은거 사용 
             console.log("_participatingEditFragment");
             var oPageSection = this.byId("participatingSupplierSelectionTableFragment");
            oPageSection.removeAllBlocks();
            this._loadFragment("ParticipatingSupplierSelectionTableView", function (oFragment) {
                oPageSection.addBlock(oFragment);
            }.bind(this));
        },

        onPagePreviewButtonPress : function(){ // 협력사 선정품의랑 같은거 사용 
            this.getView().setModel(new ManagedListModel(), "approverPreview"); 

        //    this.getModel("approverPreview").setData(this.getModel("approver").getData());
            if(this.getModel("approver").getData().Approvers != undefined){ 
                var ap = this.getModel("approver").getData().Approvers;
                for(var i = 0 ; i < ap.length -1 ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }
            
            console.log("approverPreview " , this.getModel("approverPreview").getData());
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
           // console.log("bModel.getData().length " , bModel.getData().ItemBudgetExecution.length);
            if(bModel.getData().ParticipatingSupplier != undefined && bModel.getData().ParticipatingSupplier.length > 0){
                var account_code = bModel.getData().ParticipatingSupplier[0].account_code;
                var investment_ecst_type_code =  bModel.getData().ParticipatingSupplier[0].investment_ecst_type_code;
                var accounting_department_code =  bModel.getData().ParticipatingSupplier[0].accounting_department_code;
                var import_company_code =  bModel.getData().ParticipatingSupplier[0].import_company_code;
                var project_code =  bModel.getData().ParticipatingSupplier[0].project_code;
                var import_company_org_code =  bModel.getData().ParticipatingSupplier[0].import_company_org_code;
               // var provisional_budget_amount =  bModel.getData().ParticipatingSupplier[0].provisional_budget_amount;

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
                        , account_code : account_code 
                        , investment_ecst_type_code : investment_ecst_type_code 
                        , accounting_department_code : accounting_department_code 
                        , import_company_code : import_company_code 
                        , project_code : project_code 
                        , import_company_org_code : import_company_org_code 
                        , mold_production_type_code : item.mold_production_type_code 
                        , mold_item_type_code :  item.mold_item_type_code 
                        , provisional_budget_amount : item.provisional_budget_amount 
                        , asset_type_code : item.asset_type_code 
                        , _row_state_ : "D"
                    });
                });
            }


            this._commonDataSettingAndSubmit();

        }
    });
});