sap.ui.define([
	"ext/lib/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("dp.budgetReport.controller.App", {

	
		onInit : function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			//this.oRouter = this.getOwnerComponent().getRouter();
			//this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            //this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}


	});

});