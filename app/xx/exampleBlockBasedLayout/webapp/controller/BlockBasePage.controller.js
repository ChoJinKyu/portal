sap.ui.define([
	"./Empty.controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleBlockBasedLayout.controller.BlockBasePage", {

        onInit: function(){

			var oColumns = [{
					width: "30%",
					header: "Product Name",
					demandPopin: false,
					minScreenWidth: "",
					styleClass: "cellBorderLeft cellBorderRight"
				}, {
					width: "20%",
					header: "Supplier Name",
					demandPopin: false,
					minScreenWidth: "",
					styleClass: "cellBorderRight"
				}, {
					width: "50%",
					header: "Description",
					demandPopin: true,
					minScreenWidth: "Tablet",
					styleClass: "cellBorderRight"
				}
			];

			this.setModel(new JSONModel(oColumns), "column");

			var oModel = new JSONModel(sap.ui.require.toUrl("xx/exampleBlockBasedLayout/mockdata/products.json"));
			this.setModel(oModel, "products");

			this.setModel(new JSONModel(), "product");
		},

		onPageSaveButtonPress: function(){
			var oBlock1View = sap.ui.getCore().byId(this.byId("block1").getSelectedView());
			// var oBlock1View = ext.lib.control.uxap.BlockBase.getViewFrom(this.byId("block1"));
			var oBlock1Table = oBlock1View.byId("table1");
			if(oBlock1Table.getSelectedContextPaths().length > 0){
				MessageToast.show("saved");
			}else{
				MessageToast.show("please select one of record");
			}
		},

		onBlock1TableRequestButtonPress: function(){
			MessageToast.show("Block 2 Table Toolbar Request Button Pressed");
		},

		onBlock1TableSelected: function(oEvent){
			var oContext = oEvent.getParameter("context");
			var oData = this.getModel("products").getProperty(oContext.getPath());
			this.getModel("product").setData(oData);
		}
        
	});
});