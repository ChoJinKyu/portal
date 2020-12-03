/*global QUnit*/

sap.ui.define([
	"cm/codeMgr/controller/CodeMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CodeMgr Controller");

	QUnit.test("I should test the CodeMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
