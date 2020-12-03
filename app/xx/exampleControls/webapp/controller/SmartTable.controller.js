sap.ui.define([
	"./Empty.controller",
	"ext/lib/model/v2/ODataDelegateModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, DelegateModel, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.SmartTable", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// this.setModel(new DelegateModel(), "list");

			this.setModel(new JSONModel({
				"Message": [{
					"tenant_id": "L2100",
					"language_code": "EN",
					"chain_code": "CM",
					"message_code": "MSG1",
					"message_contents": "MSG1 ddd",
				}, {
					"tenant_id": "L2100",
					"language_code": "EN",
					"chain_code": "CM",
					"message_code": "MSG2",
					"message_contents": "MSG2 ddd",
				}, {
					"tenant_id": "L2100",
					"language_code": "EN",
					"chain_code": "CM",
					"message_code": "MSG3",
					"message_contents": "MSG3 ddd",
				}, {
					"tenant_id": "L2100",
					"language_code": "EN",
					"chain_code": "CM",
					"message_code": "MSG4",
					"message_contents": "MSG4 ddd",
				}]
			}), "json");

		},

		onAfterRendering: function(){
			// this.getModel().read("/Message");
			// this.getModel("list").setTransactionModel(this.getModel("odata"));
			// this.getModel("list").read("/Message");
			this.byId("smartTable").setModel(this.getModel("json"));
		}

	});
});