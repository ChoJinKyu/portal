/*global QUnit*/

sap.ui.define([
	"pg/mm/controller/MainList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MainList Controller");

	QUnit.test("I should test the MainList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
