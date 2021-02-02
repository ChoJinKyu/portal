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
    'sap/m/SearchField',
    "sap/m/Token",
    "dp/md/util/controller/DeptSelection", 
    "dp/md/util/controller/ProcessUI", 

], function (DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor
    , ApprovalBaseController, MoldItemSelection , SearchField , Token , DeptSelection , ProcessUI
) {
    "use strict";
    /**
     * @description Remodel & Repair Completion Report / 개조 & 수리 완료 보고
     * @date 2021.02.01
     * @author jinseon.lee 
     */
    var oTransactionManager;
    var oRichTextEditor;

    return ApprovalBaseController.extend("dp.md.moldApprovalList.controller.RrcrReport", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        moldItemPop: new MoldItemSelection(),

        deptSelection : new DeptSelection(),
        process : new ProcessUI(), 
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

            this.setModel(oViewModel, "rrcrReportView"); //change
            this.getRouter().getRoute("rrcrReport").attachPatternMatched(this._onObjectMatched, this);//change
           
        },
    
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
		
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onApprovalPage : function () { 
            this.process.setDrawProcessUI(this, "processFlow" , "B" , 6); 
            this.getView().setModel(new ManagedListModel(), "mdRecepit");

            // console.log(" mode "  ,  this.getView().getModel("mode"));
            var schFilter = [];
            var that = this;
          //  if (this.approval_number == "New") {
     
          //  } else {
                schFilter = [new Filter("approval_number", FilterOperator.EQ, this.approval_number)
                    , new Filter("tenant_id", FilterOperator.EQ, 'L2600')
                ];
                this._bindViewRecepit("/MoldRecepit", "mdRecepit", schFilter, function (oData) {
                    // console.log("data>>>> ", oData);
                 });
           // }  
        },

        _bindViewRecepit : function (sObjectPath, sModel, aFilter, callback) { 
                var oView = this.getView(),
                    oModel = this.getModel(sModel);
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel("recepit"));
                oModel.read(sObjectPath, {
                    filters: aFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                        callback(oData);
                    }
                });
            },


        _toEditModeEachApproval : function(){ 
            // console.log(" Mold RecepitApproval  _toEditModeEachApproval ");
            
        //   var oRows = this.byId("moldRecepitTable").getRows();
        //     oRows.forEach(function(oCell, idx){
        //        oCell.mAggregations.cells.forEach(function(item, jdx){ 
        //            // console.log("item>>> " , item , ">>> jdx " , jdx);
        //             if(jdx == 12){
        //                  item.removeStyleClass("readonlyField");
        //             }
        //         });
        //     });

         },
        _toShowModeEachApproval : function(){ 
            // console.log(" Mold RecepitApproval  _toShowModeEachApproval ");
        //    var oRows = this.byId("moldRecepitTable").getRows();
        //     oRows.forEach(function(oCell, idx){
        //        oCell.mAggregations.cells.forEach(function(item, jdx){ 
        //            // console.log("item>>> " , item , ">>> jdx " , jdx);
        //             if(jdx == 12){
        //                  item.addStyleClass("readonlyField");
        //             }
        //         });
        //     });
         } ,
      
       /**
         * @description moldItemSelect 공통팝업   
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code (필수)
		 */
        onMoldRecepitAddPress: function (oEvent) {
            // console.log("oEvent>>>>");
            var oModel = this.getModel("mdRecepit");

            // console.log(" mdRecepit >>>> ", oModel);

            var mIdArr = [];
            if (oModel.oData.MoldRecepit != undefined && oModel.oData.MoldRecepit.length > 0) {
                oModel.oData.MoldRecepit.forEach(function (item) {
                    mIdArr.push(item.mold_id);
                });
            }
            // MOLD_PROGRESS_STATUS_CODE = 'RCV_CNF' 
            // MOLD_PURCHASING_TYPE_CODE = 'L'  
            var oArgs = { 
                approval_type_code : "I",
                company_code: this.company_code ,
                org_code: this.plant_code,
                mold_progress_status_code : ['RCV_CNF'] , 
                mold_purchasing_type_code : 'L' ,
                mold_id_arr: mIdArr  // 화면에 추가된 mold_id 는 조회에서 제외 
            }

            var that = this;

            this.moldItemPop.openMoldItemSelectionPop(this, oEvent, oArgs, function (oDataMold) {
                // console.log("selected data list >>>> ", oDataMold);
                if (oDataMold.length > 0) {
                    oDataMold.forEach(function (item) {
                        that._addMoldItemTable(item);
                    })
                }
            });
        },

        /**
        * @description participating row 추가 
        * @param {*} data 
        */
        _addMoldItemTable: function (data) {
            var oTable = this.byId("moldRecepitTable"),
                oModel = this.getModel("mdRecepit"),
                mstModel = this.getModel("appMaster");
            ;
            /** add record 시 저장할 model 과 다른 컬럼이 있을 경우 submit 안됨 */  
            var approval_number = mstModel.oData.approval_number;
            oModel.addRecord({
                "tenant_id": "L2600",
                "mold_id": String(data.mold_id),
                "approval_number": approval_number,
                "model": data.model,
                "mold_number": data.mold_number,
                "mold_sequence": data.mold_sequence,
                "spec_name": data.spec_name,
                "mold_item_type_code": data.mold_item_type_code,
                "mold_item_type_code_nm": data.mold_item_type_code_nm,
                "currency_code": data.currency_code,
                "currency_code_nm": data.currency_code_nm,
                "receiving_amount": data.receiving_amount,
                "book_currency_code": data.book_currency_code,
                "provisional_budget_amount": data.provisional_budget_amount,
                "supplier_code": data.supplier_code,
                "supplier_local_name": data.supplier_local_name,
                "supplier_code_nm": data.supplier_code_nm,
                "production_supplier_code": data.production_supplier_code,
                "production_supplier_code_nm": data.production_supplier_code_nm,
                "project_code": data.project_code,
                "acq_department_code": data.acq_department_code,
                "acq_department_code_nm": data.acq_department_code_nm,
                "drawing_consent_plan": data.drawing_consent_plan,
                "drawing_consent_result": data.drawing_consent_result,
                "production_plan": data.production_plan,
                "production_result": data.production_result,
                "completion_plan": data.completion_plan,
                "completion_result": data.completion_result,
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/MoldRecepit"); 

            if(oModel.getProperty("/entityName") == undefined){ // 신규시 entityName 없어서 행삭제를 못하고 있음 
                oModel.setProperty("/entityName","MoldRecepit");
            }

        },
        /**
        * @description Participating Supplier 의 delete 버튼 누를시 
        */
        onMoldRecepitDelRow: function () {
            var budgetExecutionTable = this.byId("moldRecepitTable")
                , detailModel = this.getModel("mdRecepit")
                , oSelected = budgetExecutionTable.getSelectedIndices();
            ;
            if (oSelected.length > 0) {
                oSelected.forEach(function (idx) {
                    detailModel.removeRecord(idx)
                    //  detailModel.markRemoved(idx)
                });
                budgetExecutionTable.clearSelection();
            } else {
                MessageBox.error("삭제할 목록을 선택해주세요.");
            }
        } ,
        /**
         * @description 미리보기 버튼눌렀을 경우 
         */
        onPagePreviewButtonPress : function(){
            this.getView().setModel(new ManagedListModel(), "approverPreview"); 

            if(this.getModel("approver").getData().Approvers != undefined){ 
                var ap = this.getModel("approver").getData().Approvers;
                for(var i = 0 ; i < ap.length ; i++){
                    this.getModel("approverPreview").addRecord( ap[i], "/Approvers");
                }
            }

        //    var ref = this.getModel("referer");
        //    this.getView().setModel(new ManagedModel(), "refererPreview");

        //    var rArr = [];
        //    if(ref.getData().Referers != undefined && ref.getData().Referers.length >0){
        //         ref.getData().Referers.forEach(function(item){
        //             rArr.push(item.referer_empno); 
        //         });
        //     }
        //     this.getModel("refererPreview").setProperty("/refArr", rArr);

            var oView = this.getView();

            if (!this._oDialogPrev) {
                this._oDialogPrev = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.moldApprovalList.view.MoldRecepitApprovalPreView",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            this._oDialogPrev.then(function (oDialog) {
                oDialog.open();
                oView.byId('referMultiPrev').setTokens(oView.byId("referMulti").getTokens()); // 미리보기 레퍼러 
            });

        },
        onPrvClosePress : function(){ 
             var oView = this.getView();
             if (this._oDialogPrev) {
                this._oDialogPrev.then(function (oDialog) {
                    oView.byId('referMulti').setTokens(oView.byId("referMultiPrev").getTokens()); // 이거 안하면 본화면에 표시가 안됨 
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogPrev = undefined;
            }

          //    this.byId("moldRecepitPreview").close();
        },
        onValueHelpRequestedDept : function(mold_id){ 
            // console.log('oEvent>>>> ' , mold_id);
            var that = this;
            this.deptSelection.openDeptSelectionPop(this, function(data){
                // console.log("data " , data[0]);
                that.setDept(mold_id, data[0].oData);
            });
        } ,
        setDept : function (mold_id, data){
            var oModel = this.getModel("mdRecepit").getData();
          
            for(var i = 0 ; i < oModel.MoldRecepit.length ; i++){ 
                // console.log("============= setDept  =============  ");
                // console.log("oModel " , oModel.MoldRecepit[i]);

                if(String(oModel.MoldRecepit[i].mold_id) == String(mold_id)){ 
                    // console.log(" =============  " , data);
                    oModel.MoldRecepit[i].acq_department_code = data['department_id'];
                    oModel.MoldRecepit[i].acq_department_code_nm =  data['department_local_name'];
                }
            }
             this.getModel("mdRecepit").refresh(true); 
          
        },

        onPageRequestButtonPress : function (){
            this.getModel("appMaster").setProperty("/approve_status_code", "AR"); // 결제요청 
            this._moldRecepitApprovalDataSetting();
        } ,
        onPageDraftButtonPress : function () { 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 임시저장 
            this._moldRecepitApprovalDataSetting();
        } , 
        onPageRequestCancelButtonPress : function () { 
            this.getModel("appMaster").setProperty("/approve_status_code", "DR"); // 요청취소 
            this.approvalRequestCancel(); 
           // this._moldRecepitApprovalDataSetting();
        } , 

        _moldRecepitApprovalDataSetting : function () { 
            this.approval_type_code = "I";

            var bModel = this.getModel("mdRecepit");
            this.approvalDetails_data = [] ;
            this.moldMaster_data = [] ;
            this.asset_data = [];

            if(this.validator.validate(this.byId("generalInfoLayout") ) !== true){
                MessageToast.show( this.getModel('I18N').getText('/ECM01002') );
                this.getModel("appMaster").setProperty("/approve_status_code", this.firstStatusCode); 
                return;
            }
          
            var that = this;
            
            // 삭제 row 먼저 추가되어야 데이터가 정상 저장됨 
            if(bModel._aRemovedRows.length > 0){
                bModel._aRemovedRows.forEach(function(item){
                    that.approvalDetails_data.push({
                        tenant_id : that.tenant_id 
                        , approval_number : that.approval_number 
                        , mold_id : item.mold_id 
                        , _row_state_ : "D"
                    });

                    that.asset_data.push({
                        tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , acq_department_code : item.acq_department_code
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });
                });
            }




            if(bModel.getData().MoldRecepit != undefined && bModel.getData().MoldRecepit.length > 0){

                bModel.getData().MoldRecepit.forEach(function(item){
                    that.approvalDetails_data.push({
                        tenant_id : that.tenant_id 
                        , approval_number : that.approval_number 
                        , mold_id : item.mold_id 
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });

                    that.asset_data.push({
                        tenant_id : that.tenant_id 
                        , mold_id : item.mold_id 
                        , acq_department_code : item.acq_department_code
                        , _row_state_ : item._row_state_ == undefined ? "U" : item._row_state_
                    });

                });

            }


            this._commonDataSettingAndSubmit();

        }




        /** PO Item End */

    });
});