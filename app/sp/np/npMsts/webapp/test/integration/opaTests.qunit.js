/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"np/npMsts/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
