/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cm/purOrgMgt/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});