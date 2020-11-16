sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("xx.exampleControls.controller.Example", {

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

		},


		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onNavigationBackPress: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("home", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */



	});
});