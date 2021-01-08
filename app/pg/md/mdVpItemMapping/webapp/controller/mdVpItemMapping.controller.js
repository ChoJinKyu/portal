sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"./Utils"
],
  function (BaseController, JSONModel, ManagedListModel, Utils) {
    "use strict";

    return BaseController.extend("pg.md.mdVpItemMapping.controller.mdVpItemMapping", {

		onInit: function () {
			// set explored app's demo model on this sample
			// this.oProductsModel = this.initSampleProductsModel(); //dataModelBinding
            // this.getView().setModel(this.oProductsModel);
            
            // 
            // this.getView("availableItems").setModel(new ManagedListModel(), "list");
		},

		onExit: function() {
			this.oProductsModel.destroy();
		},

		initSampleProductsModel: function() {
			// var oData = jQuery.sap.sjax({
			// 	url: sap.ui.require.toUrl("sap/ui/demo/mock/products.json"),
			// 	dataType: "json"
			// }).data;

            // oData.MdCategory.forEach(function(oProduct) {
			// 	oProduct.Rank = Utils.ranking.Initial;
			// }, this);

			// var oModel = new JSONModel();
			// oModel.setData(oData);
			// return oModel;
		},

		moveToAvailableItemsTable: function() {
			this.byId("selectedItems").getController().moveToAvailableItemsTable();
		},

		moveToSelectedItemsTable: function() {
			this.byId("availableItems").getController().moveToSelectedItemsTable();
		}

    });
  }
);