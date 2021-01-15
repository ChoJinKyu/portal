sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("xx.templateGuide.controller.CodeViewer", {
			onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },
            onRouteMatched : function(oEvent){
                this.getView().byId("viewCodeEditor").setValue(this.getOwnerComponent().getModel("targetViewSrc").getData());
                this.getView().byId("ControllerCodeEditor").setValue(this.getOwnerComponent().getModel("targetCtrollerSrc").getData());
            },
            onNavToCodeViewer : function(oEvent){
                this.getOwnerComponent().getRouter().navTo("mainTemplateGuide");
            }
		});
	});
