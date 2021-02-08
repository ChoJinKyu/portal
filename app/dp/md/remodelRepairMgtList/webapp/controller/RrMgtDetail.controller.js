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
        } ,
        onPageNavBackButtonPress: function () {
            this.getRouter().navTo("rrMgtList", {}, true); 
        },

        
    });
});