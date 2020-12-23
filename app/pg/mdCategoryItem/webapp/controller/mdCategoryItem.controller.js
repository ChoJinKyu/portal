sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/ui/core/Item"
],
  function (BaseController, Multilingual, Validator, DateFormatter, History, JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item) {
    "use strict";

    return BaseController.extend("pg.mdCategoryItem.controller.mdCategoryItem", {

      //formatter: formatter,
       Validator : new Validator(),
	   dateFormatter: DateFormatter,

      onInit: function () {
          
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");
        
        // 개인화 - UI 테이블의 경우만 해당
        this._oTPC = new TablePersoController({
          customDataKey: "mdCategoryItem"
        }).setTable(this.byId("mainTable"));
        
        this.aSearchCategoryCd = "C001";
        this.byId("textCategoryCode").setText(this.aSearchCategoryCd);
        // this.byId("textCategoryName").setText();
      },


      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },
      // Display row number without changing data
      onAfterRendering: function () {
        this.onSearch();
      },


      onSearch: function () {
            var aFilters = [];
            aFilters.push(new Filter("spmd_category_code", FilterOperator.EQ, this.aSearchCategoryCd));

            this.getView()
                .setBusy(true)
                .getModel("list")
                .setTransactionModel(this.getView().getModel())
                .read("/MdCategoryItem", {
				    filters: aFilters,
                    success: (function (oData) {
                    this.getView().setBusy(false);
                    }).bind(this)
                });
            var oTable = this.byId("mainTable");
            this.byId("buttonMainAddRow").setEnabled(true);     
            this.byId("buttonMainCancelRow").setEnabled(false);   
        },
      
      onAdd: function () {
            var [tId, mName, sEntity, aCol] = arguments;
            //tableId modelName EntityName tenant_id
            var oTable = this.byId(tId), //mainTable
                oModel = this.getView().getModel(mName); //list
            var oDataArr, oDataLength, lastCtgrSeq, ctgrSeq;

            if(oModel.oData){
                oDataArr = oModel.getProperty("/MdCategoryItem"); //oModel.oData.mdCategoryItem;
                oDataLength = oDataArr.length;
                lastCtgrSeq = oDataArr[oDataLength-1].spmd_character_sort_seq;
                ctgrSeq = String(parseInt(lastCtgrSeq)+1);
            }

            oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "*",
				"org_type_code": "BU",
                "org_code": "BIZ00200",
                "spmd_category_code":"C001", //*************파라미터값으로 변경 필요************ */
				"spmd_character_code": "",
				"spmd_character_sort_seq": ctgrSeq,
                "spmd_character_code_name": "",
                "spmd_character_desc": ""
                // "system_update_dtm": new Date(),
                // "local_create_dtm": new Date(),
                // "local_update_dtm": new Date()
            }, "/MdCategoryItem" , 0);  

		    this.byId("buttonMainAddRow").setEnabled(false);
            this.byId("buttonMainCancelRow").setEnabled(true);    
        },
        
        onDelete: function(oEvent){
            var table = oEvent.getSource().getParent().getParent();
            console.log(table);
            var model = this.getView().getModel(table.getBindingInfo('items').model);
            model.setProperty("/entityName", "MdCategoryItem");

            table.getSelectedItems().reverse().forEach(function(item){
                var iSelectIndex = table.indexOfItem(item);
                if(iSelectIndex > -1){
                    model.markRemoved(iSelectIndex);
                }
             });

        table.removeSelections(true);
        },

      onSave: function () {
        var [tId, mName] = arguments;
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
			MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
          return;
        }
        if(this.Validator.validate(this.byId(tId)) !== true){
            // MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            return;
        }

        MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                groupId: "MdCategoryItem",
                success: (function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                  this.refresh();//this.onSearch();
                }).bind(this)
              });
            }
          }).bind(this)
        })
      },

    });
  }
);