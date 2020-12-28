/*global QUnit*/

sap.ui.define([
	"pg/vp/vpCallProcTest/controller/vpCallProcTest.controller"
], function (Controller) {
	"use strict";

	QUnit.module("vpCallProcTest Controller");

	QUnit.test("I should test the vpCallProcTest controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
