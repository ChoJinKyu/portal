/*global QUnit*/

sap.ui.define([
	"cm/countryMgt/controller/countryMgt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("countryMgt Controller");

	QUnit.test("I should test the countryMgt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
