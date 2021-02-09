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
    "dp/md/util/controller/ProcessUI", 
], function (BaseController, DateFormatter, ManagedModel, ManagedListModel, TransactionManager, Multilingual, Validator,
    ColumnListItem, Label, MessageBox, MessageToast, UploadCollectionParameter,
    Fragment, syncStyleClass, History, Device, JSONModel, Filter, FilterOperator, RichTextEditor, MoldItemSelection, SupplierSelection, ProcessUI
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

        moldItemPop: new MoldItemSelection(),

        supplierSelection: new SupplierSelection(),

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

          //  oTransactionManager.addDataModel(this.getModel("schedule"));

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
                oModel.read("/remodelRepairDetail(tenant_id='" + this.getSessionUserInfo().TENANT_ID
                    + "',mold_id='" + oArgs.mold_id 
                    + "',repair_request_number='"+oArgs.request_number 
                    + "')", {
                    filters: [],
                    success: function (oData) {
                        console.log("oData>>>>> ", oData);
                    }
                });
            }else{

                oModel.read("/remodelRepairNew(tenant_id='" + this.getSessionUserInfo().TENANT_ID
                    + "',mold_id='" + oArgs.mold_id + "')", {
                    filters: [],
                    success: function (oData) {
        
                         
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

        
    });
});