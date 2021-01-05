sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("sp.sc.scQBMgt.controller.CreatePage", {
			onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.attachBeforeRouteMatched(this._onProductMatched, this);

            },
            _onProductMatched: function (e) {


            },
            onCancelPrss: function(e){
                this.getOwnerComponent().getRouter().navTo("mainPage", {} );
            }
		});
	});
