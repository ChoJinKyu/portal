/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"xx/ui5Examples/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
