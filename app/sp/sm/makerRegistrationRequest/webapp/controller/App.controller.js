sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sp.sm.makerRegistrationRequest.controller.App", {

			onInit : function () {
			// apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            this.getRouter().navTo("mainPage");
		}
	});

});