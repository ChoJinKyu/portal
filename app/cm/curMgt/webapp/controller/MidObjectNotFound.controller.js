sap.ui.define([
	"ext/lib/controller/BaseController",
], function (BaseController) {
	"use strict";

	return BaseController.extend("cm.curMgt.controller.MidObjectNotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed : function () {
			this.getRouter().navTo("worklist");
		}

	});

});