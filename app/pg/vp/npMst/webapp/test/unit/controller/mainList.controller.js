/*global QUnit*/

sap.ui.define([
	"np/npMst/controller/mainList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("mainList Controller");

	QUnit.test("I should test the mainList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});