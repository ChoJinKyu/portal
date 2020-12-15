sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/util/Validator",
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
  function (BaseController, Multilingual, Validator, History, JSONModel, ManagedListModel, TablePersoController, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, Item) {
    "use strict";

    return BaseController.extend("pg.mdCategory.controller.mdCategory", {

      //formatter: formatter,

      onInit: function () {
        var oMultilingual = new Multilingual();
        this.setModel(oMultilingual.getModel(), "I18N");
        this.getView().setModel(new ManagedListModel(), "list");
        
        // 개인화 - UI 테이블의 경우만 해당
        this._oTPC = new TablePersoController({
          customDataKey: "mdCategory"
          //persoService: timeZonePersoService
        }).setTable(this.byId("mainTable"));
      },


      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },
      // Display row number without changing data
      onAfterRendering: function () {
        this.onSearch();
      },


      onSearch: function () {
        this.getView()
          .setBusy(true)
          .getModel("list")
          .setTransactionModel(this.getView().getModel())
          .read("/MdCategory", {
            success: (function (oData) {
              this.getView().setBusy(false);
            }).bind(this)
          });
      },
      
      onAdd: function () {
        //
        var [tId, mName, sEntity, aCol] = arguments;
        //tableId modelName EntityName tenant_id
        var oTable = this.byId(tId), //mainTable
            oModel = this.getView().getModel(mName); //list
        oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "C100",
				"org_type_code": "BU",
				"org_code": "L210000000",
				"spmd_category_code": "",
				"spmd_category_code_name": "",
				"rgb_font_color_code": "#000000",
				"rgb_cell_clolor_code": "#FFFFFF",
                "spmd_category_sort_sequence": "8",
                "system_update_dtm": new Date(),
                "local_create_dtm": new Date(),
                "local_update_dtm": new Date()
            }, "/MdCategory" , 0);  

            oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);
            
        },
      
      onSave: function () {
        var [tId, mName] = arguments;
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
			MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
          //MessageBox.alert("변경사항이 없습니다.");
          return;
        }

        if(this.Validator.validate(this.byId(tId)) !== true){
            MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
            return;
        }

        MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
          title: this.getModel("I18N").getText("/SAVE"),
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                success: (function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                  this._refreshSearch();//this.onSearch();
                }).bind(this)
              });
            }
          }).bind(this)
        })
      },

      _refreshSearch: function() {
			var oView = this.getView(),
                oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
            oView.setBusy(true);
            
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MdCategory", {
				success: function(oData){
					oView.setBusy(false);
				}
            });
            
            oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(false);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(false);
        },
    });
  }
);