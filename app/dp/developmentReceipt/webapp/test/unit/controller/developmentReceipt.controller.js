/*global QUnit*/

sap.ui.define([
	"dp/developmentReceipt/controller/developmentReceipt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("developmentReceipt Controller");

	QUnit.test("I should test the developmentReceipt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
