sap.ui.define([
	"./Empty.controller",
	"ext/lib/model/v2/ODataDelegateModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, DelegateModel, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.SmartTable_Ex", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
            this.getView().setModel(this.getOwnerComponent().getModel("main"))
			//this.byId("smartTable").setModel(this.getOwnerComponent().getModel("main"));
		},

		onAfterRendering: function(){
		}

	});
});