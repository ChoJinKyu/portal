/*global QUnit*/

sap.ui.define([
	"cm/purOrgMgt/controller/purOrgMgt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("purOrgMgt Controller");

	QUnit.test("I should test the purOrgMgt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
