sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("sp.sc.scQBCreate.controller.App", {
			onInit: function () {
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );

			}
		});
	});
