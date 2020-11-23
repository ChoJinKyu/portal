/*global QUnit*/

sap.ui.define([
	"dp/detailSpecEntry/controller/detailSpecEntry.controller"
], function (Controller) {
	"use strict";

	QUnit.module("detailSpecEntry Controller");

	QUnit.test("I should test the detailSpecEntry controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
