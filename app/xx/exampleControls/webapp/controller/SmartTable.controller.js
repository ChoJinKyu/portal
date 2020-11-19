sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("xx.exampleControls.controller.SmartTable", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			this.setModel(new JSONModel({
				Books: [{
					value1: "Value of",
					value2: "Value of",
					value3: "Value of",
					value4: "Value of",
				}, {
					value1: "Value of",
					value2: "Value of",
					value3: "Value of",
					value4: "Value of",
				}]
			}));
		}

	});
});