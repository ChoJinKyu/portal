sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("xx.exampleBlockBasedLayout.controller.Home", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the home controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oModel = new JSONModel(sap.ui.require.toUrl("xx/exampleBlockBasedLayout/mockdata") + "/exam-list.json");
			this.setModel(oModel, "examples");
		},


		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onListItemPress: function (oEvent) {
			var oItem = this.getModel("examples").getProperty(oEvent.getSource().getBindingContextPath());
			this.getRouter().navTo(oItem.viewName, {}, true);
		},

		onSAPUI5APIButtonPress: function(){
			window.open("https://sapui5.hana.ondemand.com/#/api","_blank");
		}

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */



	});
});