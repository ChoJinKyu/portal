sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("pg.md.mdCategory.controller.MainObjectNotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed : function () {
			this.getRouter().navTo("worklist");
		}

	});

});