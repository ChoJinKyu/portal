/*global QUnit*/

sap.ui.define([
	"cm/hrEmployeeMgr/controller/hrEmployeeMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("hrEmployeeMgr Controller");

	QUnit.test("I should test the hrEmployeeMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
