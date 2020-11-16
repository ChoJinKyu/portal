/*global QUnit*/

sap.ui.define([
	"cm/currencyMgr/controller/currencyMainView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("currencyMainView Controller");

	QUnit.test("I should test the currencyMainView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
