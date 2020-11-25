sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ext.lib.controller.NotFound", {

		/**
		 * Navigates to the home when the link is pressed
		 * @public
		 */
		onNotFoundLinkPressed : function () {
			this.getRouter().navTo("home");
		}

	});

});