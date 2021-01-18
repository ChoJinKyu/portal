/*global QUnit*/

sap.ui.define([
	"xx/sampleMgr/controller/SampleMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SampleMgr Controller");

	QUnit.test("I should test the SampleMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
