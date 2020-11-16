sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("xx.templateListInlineEdit.controller.App", {

		onInit : function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});