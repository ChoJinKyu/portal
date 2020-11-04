/*global QUnit*/

sap.ui.define([
	"pg/vendorPoolSearch/controller/VendorPoolSearch.controller"
], function (Controller) {
	"use strict";

	QUnit.module("VendorPoolSearch Controller");

	QUnit.test("I should test the VendorPoolSearch controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
