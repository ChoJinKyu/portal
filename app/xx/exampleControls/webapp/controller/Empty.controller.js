sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("xx.exampleControls.controller.Empty", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

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