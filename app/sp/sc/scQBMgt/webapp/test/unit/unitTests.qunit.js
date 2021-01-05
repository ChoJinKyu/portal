/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sp/sc/scQBMgt/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
