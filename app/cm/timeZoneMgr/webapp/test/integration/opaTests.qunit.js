/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cm/timeZoneMgr/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
