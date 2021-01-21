/*global QUnit*/

sap.ui.define([
	"pg/tm/supplierEvaluationSetupMgt/controller/Monitor.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Monitor Controller");

	QUnit.test("I should test the Monitor controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
