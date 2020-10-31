/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"pg/purchaseMgr/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
