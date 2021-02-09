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
    "dp/md/util/controller/ProcessUI", 
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ProcessUI
) {
    "use strict";

    var oTransactionManager;
    var oRichTextEditor;
    var supplierData = [];
    /**
     * @description Remodel/Repair Management List(협력사) 상세 
     * @date 2021.02.08 
     * @author jinseon.lee 
     */
    return BaseController.extend("dp.md.remodelRepairMgtList.controller.RrMgtDetail", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        process : new ProcessUI(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("rrMgtDetail").attachPatternMatched(this._onObjectMatched, this);

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
          //  this.setModel(new ManagedListModel(), "schedule");
            this.setModel(new ManagedModel(), "rrMgt");
            oTransactionManager = new TransactionManager();
            oTransactionManager.aDataModels.length = 0;

            console.log("session >>>> " , this.getSessionUserInfo() );

            this.process.setDrawProcessUI(this, "rrMgtProcess" , "C", 0);

        },
        _onObjectMatched : function(oEvent){ 
            var oArgs = oEvent.getParameter("arguments");
            console.log("param>>>>> " , oArgs); 
            this._srchDetail(oArgs);
        } ,

        _srchDetail : function(oArgs){
            var oModel = this.getModel("rrMgt")
                , session = this.getSessionUserInfo() 
                , today = this._getToday()
            ;
              oModel.setTransactionModel(this.getModel())
              
              
              ;

            if( oArgs.request_number != "New"){
                oModel.read("/remodelRepairDetail(tenant_id='" + "L2101"
                    + "',mold_id='" + oArgs.mold_id 
                    + "',repair_request_number='"+oArgs.request_number 
                    + "')", {
                    filters: [],
                    success: function (oData) {
                        console.log("oData>>>>> ", oData);
                    }
                });
            }else{

                oModel.read("/remodelRepairNew(tenant_id='" + "L2101"
                    + "',mold_id='" + oArgs.mold_id + "')", {
                    filters: [],
                    success: function (oData) {
        
                         
                    oModel.setProperty("/mold_id",  oArgs.mold_id ); 
                    oModel.setProperty("/create_user_id", session.USER_ID); 
                    oModel.setProperty("/user_local_name", session.EMPLOYEE_NAME); 
                    oModel.setProperty("/user_english_name", session.ENGLISH_EMPLOYEE_NAME); 
                    oModel.setProperty("/repair_request_date", today);
            


                        console.log("oData>>>>> ", oData);
                    }
                });

            };  
        },
        /**
         * today
         * @private
         * @return yyyy-mm-dd
         */
        _getToday: function () {
            var date_ob = new Date();
            var date = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();

            // console.log(year + "-" + month + "-" + date);
            return year + "" + month + "" + date;
        },
        onPageNavBackButtonPress: function () {
            this.getRouter().navTo("rrMgtList", {}, true); 
        },

        onPageDraftButtonPress: function () {
            var mst = this.getModel("rrMgt").getData()
                , session = this.getSessionUserInfo();
            var data = {
                inputData: {
                    repairItem: {
                        tenant_id: session.tenant_id
                        , repair_request_number: mst.repair_request_number
                        , mold_id: mst.mold_id
                        , repair_desc: mst.repair_desc
                        , repair_reason: mst.repair_reason
                        , mold_moving_plan_date: mst.mold_moving_plan_date
                        , mold_complete_plan_date: mst.mold_complete_plan_date
                        , mold_moving_result_date: mst.mold_moving_result_date
                        , mold_complete_result_date: mst.mold_complete_result_date
                        , repair_progress_status_code: 'RS'
                        , repair_type_code: 'F'
                    }
                }
            }

            var msg = "";
            var isOk = true;
            //  if(this.firstStatusCode == "AR" && this.getModel('appMaster').getProperty("/approve_status_code") == "DR"){ 
            isOk = true;
            msg = "저장 하시겠습니까?";
            //   }

            if (isOk) {
                this._callSave(msg, data);
            }
        }, 

        onPageRequestButtonPress : function(){
// pageSectionRepairInfo 
            if (this.validator.validate(this.byId("pageSectionReqEntry")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }
            if (this.validator.validate(this.byId("pageSectionRepairInfo")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }




            var mst = this.getModel("rrMgt").getData()
                , session = this.getSessionUserInfo();
            var data = {
                inputData: {
                    repairItem: {
                        tenant_id: session.tenant_id
                        , repair_request_number: mst.repair_request_number
                        , mold_id: mst.mold_id
                        , repair_desc: mst.repair_desc
                        , repair_reason: mst.repair_reason
                        , mold_moving_plan_date: mst.mold_moving_plan_date
                        , mold_complete_plan_date: mst.mold_complete_plan_date
                        , mold_moving_result_date: mst.mold_moving_result_date
                        , mold_complete_result_date: mst.mold_complete_result_date
                        , repair_progress_status_code: 'RA'
                        , repair_type_code: 'F'
                    }
                }
            }

            var msg = "";
            var isOk = true;
            //  if(this.firstStatusCode == "AR" && this.getModel('appMaster').getProperty("/approve_status_code") == "DR"){ 
            isOk = true;
            msg = "요청 하시겠습니까?";
            //   }

            if (isOk) {
                this._callSave(msg, data);
            }
        },

        _callSave : function(msg, data){
            var oView = this.getView();
            var that = this;
              MessageBox.confirm(msg, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {  
                            oView.setBusy(true);
                            that.callAjax(data, "saveRemodelRepair"
                                , function(result){
                                    oView.setBusy(false);
                                    MessageToast.show(that.getModel("I18N").getText("/" + result.messageCode));
                                if (result.resultCode > -1) {
                                    that._srchDetail(result);
                                }
                            });
                        }
                    }
                });

        }, 

        callAjax : function(data, fn , callback){
              var url = "/dp/md/remodelRepairMgtList/webapp/srv-api/odata/v4/dp.RrMgtListV4Service/" + fn;

            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (result) { 
                    callback(result);
                },
                error: function (e) {
                    callback(e);
                }
            });
        }





    });
});