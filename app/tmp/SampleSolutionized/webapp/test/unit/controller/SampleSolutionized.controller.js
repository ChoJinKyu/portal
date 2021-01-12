/*global QUnit*/

sap.ui.define([
	"tmp/SampleSolutionized/controller/SampleSolutionized.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SampleSolutionized Controller");

	QUnit.test("I should test the SampleSolutionized controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
