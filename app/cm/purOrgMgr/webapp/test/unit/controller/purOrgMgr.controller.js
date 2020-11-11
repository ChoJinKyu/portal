/*global QUnit*/

sap.ui.define([
	"cm/purOrgMgr/controller/purOrgMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("purOrgMgr Controller");

	QUnit.test("I should test the purOrgMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
