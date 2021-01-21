/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sp/sc/scQBPages/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
