/*global QUnit*/

sap.ui.define([
	"cm/countryMgr/controller/countryMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("countryMgr Controller");

	QUnit.test("I should test the countryMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
