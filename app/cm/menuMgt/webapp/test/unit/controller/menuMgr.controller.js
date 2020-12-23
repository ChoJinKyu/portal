/*global QUnit*/

sap.ui.define([
	"cm/menuMgt/controller/menuMgt.controller"
], function (Controller) {
	"use strict";

	QUnit.module("menuMgt Controller");

	QUnit.test("I should test the menuMgt controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
