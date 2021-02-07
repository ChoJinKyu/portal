sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("sp.sc.scQBMgt.controller.App", {
			onInit: function () {
                // apply content density mode to root view
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
                
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );

			}
		});
	});
