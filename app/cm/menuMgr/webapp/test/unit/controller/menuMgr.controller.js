/*global QUnit*/

sap.ui.define([
	"cm/menuMgr/controller/menuMgr.controller"
], function (Controller) {
	"use strict";

	QUnit.module("menuMgr Controller");

	QUnit.test("I should test the menuMgr controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
