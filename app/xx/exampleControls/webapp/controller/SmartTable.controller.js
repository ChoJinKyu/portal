sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.SmartTable", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
            this.getView().setModel(this.getOwnerComponent().getModel("main"));
			//this.byId("smartTable").setModel(this.getOwnerComponent().getModel("main"));
		},

		onAfterRendering: function(){
		}

	});
});