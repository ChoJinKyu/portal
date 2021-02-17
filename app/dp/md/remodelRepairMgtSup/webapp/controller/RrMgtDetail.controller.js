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
    "dp/md/util/controller/SupplierDialog",
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, ProcessUI, SupplierDialog
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
    return BaseController.extend("dp.md.remodelRepairMgtSup.controller.RrMgtDetail", {

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
            this.setModel(new ManagedModel(), "company");
            this.setModel(new ManagedModel(), "plant");
            oTransactionManager = new TransactionManager();
            oTransactionManager.aDataModels.length = 0;

            console.log("session >>>> " , this.getSessionUserInfo() );

            this.process.setDrawProcessUI(this, "rrMgtProcess" , "C", 0);

        },
        _onObjectMatched : function(oEvent){ 
            var oArgs = oEvent.getParameter("arguments");
          //  console.log("param>>>>> " , oArgs); 
            this._srchDetail(oArgs);
        } , 
        _searchDivision : function (oArgs){
          //  console.log("oArgs>> " , oArgs);
            var oModel = this.getModel("plant");
            oModel.setTransactionModel(this.getModel("dpMdUtil"));

            oModel.read("/Divisions(tenant_id='" + oArgs.tenant_id
                + "',company_code='" + oArgs.company_code
                + "',org_code='" + oArgs.org_code + "')", {
                filters: [],
                success: function (oData) {
                      console.log("orgName ", oData);
                }
            });

        },
        _searchCompany : function (oArgs){
            var oModel = this.getModel("company");
            oModel.setTransactionModel(this.getModel("org"));

           oModel.read("/Company(tenant_id='" 
           + oArgs.tenant_id + "',company_code='" + oArgs.company_code + "')", {
                filters: [],
                success: function (oData) {

                }
            });

        },
        // 상세 조회 
        _srchDetail : function(oArgs){
            var oModel = this.getModel("rrMgt")
                , session = this.getSessionUserInfo() 
                , today = this._getToday()
            ;
            var that = this;
            var oUiModel = this.getView().getModel("mode");
            oModel.setTransactionModel(this.getModel())
            if( oArgs.request_number != "New"){
                oModel.read("/remodelRepairDetail(tenant_id='" + session.TENANT_ID 
                            + "',mold_id='" + oArgs.mold_id 
                            + "',repair_request_number='"+oArgs.request_number 
                            + "')", {
                            filters: [],
                    success: function (oData) { 
                        var d = oModel.getProperty("/repair_request_date");
                        oModel.setProperty("/repair_request_date", d.substring(0, 4) + "-" +d.substring(4, 6)+"-"+d.substring(6, 8));
                        oUiModel.setProperty("/editFlag", false);    
                        oUiModel.setProperty("/viewFlag", true);    
                        that._setBtnStatus(); 
                        that._searchCompany(oData);
                        that._searchDivision(oData);
                    }
                });
            }else{ // NEW 일 경우 MOLD 정보만 조회한다. 
                oModel.read("/remodelRepairNew(tenant_id='" + session.TENANT_ID
                            + "',mold_id='" + oArgs.mold_id + "')", {
                            filters: [],
                            success: function (oData) { 

                            oUiModel.setProperty("/editFlag", true);    
                            oUiModel.setProperty("/viewFlag", false);    
                            oUiModel.setProperty("/btnDraft", true);    
                            oUiModel.setProperty("/btnRequset", true);    
                            oUiModel.setProperty("/btnEdit", false);    
                            oUiModel.setProperty("/btnCancel", false);    

                            oModel.setProperty("/tenant_id", session.TENANT_ID); 
                            oModel.setProperty("/mold_id",  oArgs.mold_id ); 
                            oModel.setProperty("/create_user_id", session.USER_ID); 
                            oModel.setProperty("/user_local_name", session.EMPLOYEE_NAME); 
                            oModel.setProperty("/user_english_name", session.ENGLISH_EMPLOYEE_NAME); 
                            oModel.setProperty("/repair_request_date", today.substring(0, 4) + "-" +today.substring(4, 6)+"-"+today.substring(6, 8));
                            that._searchCompany(oData);
                            that._searchDivision(oData);
                           
                    }
                });

            };  
        },

        dateParse : function(str){
            var y = str.substring(0, 4);
            var m = str.substring(4, 2);
            var d = str.substring(6, 2);
            return new Date(y,m-1,d)
        },
        onPageEditButtonPress : function(){
            var oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", true);    
                oUiModel.setProperty("/viewFlag", false);    
                this._setBtnStatus();
        },
        onPageCancelEditButtonPress : function(){
            var oUiModel = this.getView().getModel("mode");
                oUiModel.setProperty("/editFlag", false);    
                oUiModel.setProperty("/viewFlag", true);    
                this._setBtnStatus();
        },
        _setBtnStatus : function(){
            var oUiModel = this.getView().getModel("mode");
           //  console.log("_setBtnStatus>>>>> ", oUiModel);
            var oModel = this.getModel("rrMgt") ;

           // console.log("oModel>>>>> ", oModel);
            if(oUiModel.getProperty("/editFlag")){
                if(oModel.getProperty("/repair_progress_status_code") === "RA"){ // Requst 
                    oUiModel.setProperty("/btnDraft", false);    
                    oUiModel.setProperty("/btnRequset", false);
                    oUiModel.setProperty("/btnEdit", false);
                    oUiModel.setProperty("/btnCancel", false);

                }else if(oModel.getProperty("/repair_progress_status_code") === "RS"){ // Draft
                    oUiModel.setProperty("/btnDraft", true);    
                    oUiModel.setProperty("/btnRequset", true);  
                    oUiModel.setProperty("/btnEdit", false);
                    oUiModel.setProperty("/btnCancel", true);
                }else{
                    oUiModel.setProperty("/btnDraft", false);    
                    oUiModel.setProperty("/btnRequset", false);
                    oUiModel.setProperty("/btnEdit", false);
                    oUiModel.setProperty("/btnCancel", false);
                }
            }else{  
                if(oModel.getProperty("/repair_progress_status_code") === "RA"){ // Requst 
                    oUiModel.setProperty("/btnDraft", false);    
                    oUiModel.setProperty("/btnRequset", false);
                    oUiModel.setProperty("/btnEdit", false);
                    oUiModel.setProperty("/btnCancel", false);

                }else if(oModel.getProperty("/repair_progress_status_code") === "RS"){ // Draft
                    oUiModel.setProperty("/btnDraft", false);    
                    oUiModel.setProperty("/btnRequset", true);  
                    oUiModel.setProperty("/btnEdit", true);
                    oUiModel.setProperty("/btnCancel", false);
                }else{
                    oUiModel.setProperty("/btnDraft", false);    
                    oUiModel.setProperty("/btnRequset", false);
                    oUiModel.setProperty("/btnEdit", false);
                    oUiModel.setProperty("/btnCancel", false);
                }
            }

            //   console.log("_setBtnStatus 222 >>>>> ", oUiModel);
          
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
            /*
            var oModel = this.getModel("rrMgt"),
                reqNum = oModel.getProperty("/repair_request_number");
            var pull_url = window.location.href;
            var complete_url;
            var targetPath;
            console.log("reqNum >>>>", reqNum);
            var isDevServer = false;
            // 개발서버, 로컬 분기
            if(pull_url.indexOf("biztech-partners") > -1){
                isDevServer = true;
            }else if(pull_url.indexOf("workspaces") > -1){
                isDevServer = false;
            }
            
            if(isDevServer){
                this.getRouter().navTo("rrMgtList", {}, true); 
            }else{
                // request_number가 채번된 상태에선 개조수리 리스트로
                if(reqNum !=""){
                    targetPath = "/dp/md/remodelRepairMgtSup/webapp/";
                }
                // New일때는 금형자산관리 리스트로
                else{
                    targetPath = "/dp/md/assetListSup/webapp/";
                }
                console.log("targetPath >>>", targetPath);
                complete_url=pull_url.split(pull_url.substring(pull_url.indexOf("/dp"),pull_url.length));
                complete_url[0] = complete_url[0]+targetPath;
                window.location.href=complete_url[0]; 
                
            }*/
        },

        getStrDate : function(date){
            if(date != null){
               var str = this.dateFormatter.toDateString(date).split("-");
              return str[0] + str[1] + str[2]   
            }else{
              return null;
            }
        },
        // MOLD_SUPPLIER 팝업창 띄우기 
        onMoldSupplierValuePress : function(){ 

            var mst = this.getModel("rrMgt").getData(),
               plant = this.getModel("plant").getData(),
                company = this.getModel("company").getData();
                var setMst = this.getModel("rrMgt");
             if (!this.oCodeSelectionValueHelp) {
                    this.oCodeSelectionValueHelp = new SupplierDialog({
                        multiSelection: false 
                      , items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2101") 
                                ,  new Filter("company_code", FilterOperator.EQ, mst.company_code) 
                                ,  new Filter("org_code", FilterOperator.EQ, mst.org_code) 
                                ,  new Filter("company_name", FilterOperator.EQ, company.company_name ) 
                                ,  new Filter("org_name", FilterOperator.EQ, plant.org_name) 
                            ]
                        }
                    });

                    this.oCodeSelectionValueHelp.attachEvent("apply", function (oEvent) { 
                        setMst.setProperty("/mold_mfger_code_nm", oEvent.getParameter("item").supplier_local_name);
                        setMst.setProperty("/mold_mfger_code", oEvent.getParameter("item").supplier_code);
                       // this.byId("input_supplier_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oCodeSelectionValueHelp.open();
        } ,

        onPageDraftButtonPress: function () {
            var mst = this.getModel("rrMgt").getData(); 
           console.log("onPageDraftButtonPress >>>>>> " , mst);

            var data = {
                inputData: {
                    repairItem: {
                        tenant_id: mst.tenant_id
                        , repair_request_number: mst.repair_request_number
                        , mold_id: mst.mold_id
                        , repair_desc: mst.repair_desc
                        , repair_reason: mst.repair_reason 
                        , mold_mfger_code: mst.mold_mfger_code 
                        , repair_request_date : this._getToday()
                        , mold_moving_plan_date: this.getStrDate(mst.mold_moving_plan_date)
                        , mold_complete_plan_date: this.getStrDate(mst.mold_complete_plan_date)
                        , mold_moving_result_date: this.getStrDate(mst.mold_moving_result_date)
                        , mold_complete_result_date: this.getStrDate(mst.mold_complete_result_date)
                        , repair_progress_status_code: 'RS'
                        , repair_type_code: 'F'
                    }
                }
            }

            var isOk = true;
            var msg = "저장 하시겠습니까?";

            if (isOk) {
                this._callSave(msg, data);
            }
        }, 

        onPageRequestButtonPress : function(){
            
            if (this.validator.validate(this.byId("pageSectionReqEntry")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }
            if (this.validator.validate(this.byId("pageSectionRepairInfo")) !== true) {
                MessageToast.show(this.getModel('I18N').getText('/ECM01002'));
                return;
            }

            var mst = this.getModel("rrMgt").getData();
            console.log("onPageRequestButtonPress >>>>>> " , mst);

            var data = {
                inputData: {
                    repairItem: {
                        tenant_id: mst.tenant_id
                        , repair_request_number: mst.repair_request_number
                        , mold_id: mst.mold_id
                        , repair_desc: mst.repair_desc
                        , repair_reason: mst.repair_reason 
                        , mold_mfger_code: mst.mold_mfger_code 
                        , repair_request_date : this._getToday()
                        , mold_moving_plan_date: this.getStrDate(mst.mold_moving_plan_date)
                        , mold_complete_plan_date: this.getStrDate(mst.mold_complete_plan_date)
                        , mold_moving_result_date: this.getStrDate(mst.mold_moving_result_date)
                        , mold_complete_result_date: this.getStrDate(mst.mold_complete_result_date)
                        , repair_progress_status_code: 'RA'
                        , repair_type_code: 'F'
                    }
                }
            }

            var msg = "요청 하시겠습니까?";
            var isOk = true;

            if (isOk) {
                this._callSave(msg, data);
            }
        },
        // confirm 창 띄우고 결과값 받음 
        _callSave : function(msg, data){

            console.log("senddata>>>" , data);


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
                                    result.request_number = result.repair_request_number 
                                  //  console.log("result>>>> ", result);
                                    that._srchDetail(result);
                                }
                            });
                        }
                    }
                });
        }, 

        callAjax : function(data, fn , callback){
            var url = "/dp/md/remodelRepairMgtSup/webapp/srv-api/odata/v4/dp.RemodelRepairMgtV4Service/" + fn;

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