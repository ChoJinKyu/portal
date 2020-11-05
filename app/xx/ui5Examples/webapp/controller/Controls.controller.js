sap.ui.define([
	"xx/ui5Examples/controller/BaseController",
	"ext/lib/m/CodeDialog"
],
	function (BaseController, CodeDialog) {
		"use strict";

		return BaseController.extend("xx.ui5Examples.controller.Controls", {
			onInit: function () {
			},

			onValueHelpRequest: function () {
				var codeDialog = new CodeDialog();
				codeDialog.open();
			}
		});
	});
