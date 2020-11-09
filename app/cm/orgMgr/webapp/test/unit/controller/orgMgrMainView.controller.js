/*global QUnit*/

sap.ui.define([
	"cm/orgMgr/controller/orgMgrMainView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("orgMgrMainView Controller");

	QUnit.test("I should test the orgMgrMainView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
