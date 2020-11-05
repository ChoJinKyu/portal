/*global QUnit*/

sap.ui.define([
	"xx/ui5Examples/controller/Controls.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Controls Controller");

	QUnit.test("I should test the Controls controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
