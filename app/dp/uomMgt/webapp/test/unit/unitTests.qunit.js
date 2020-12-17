/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"dp/uomMgr/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
