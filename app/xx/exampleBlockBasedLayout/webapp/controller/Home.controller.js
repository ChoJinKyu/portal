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
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Add the home page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("homeViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);

			var oModel = new JSONModel(sap.ui.require.toUrl("xx/exampleBlockBasedLayout/mockdata") + "/exam-list.json");
			this.setModel(oModel, "examples");
		},


		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onTestPress: function () {
			var oModel = this.getView().getModel("examples");
		},
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onListItemPress: function (oEvent) {
			var oModel = this.getModel("examples"),
				oItem = this.getModel("examples").getProperty(oEvent.getSource().getBindingContextPath());
			this.getRouter().navTo(oItem.viewName, {}, true);
		},

		onSAPUI5APIButtonPress: function(){
			window.open("https://sapui5.hana.ondemand.com/#/api","_blank");
		},

		onThanksButtonPress: function(){
			MessageBox.alert("Thanks.", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.OK,
				onClose : function(sButton) {
					MessageToast.show("thanks");
				}
			});
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */



	});
});