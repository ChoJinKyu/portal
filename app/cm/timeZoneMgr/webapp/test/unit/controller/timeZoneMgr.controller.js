/*global QUnit*/

sap.ui.define([
	"cm/timeZoneMgr/controller/timeZoneMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("timeZoneMgr Controller");

	QUnit.test("I should test the timeZoneMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
