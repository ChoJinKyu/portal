/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"dp/remodelRepairMgtSup/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});