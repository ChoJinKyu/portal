/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"pg/tm/tmMonitoring/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
