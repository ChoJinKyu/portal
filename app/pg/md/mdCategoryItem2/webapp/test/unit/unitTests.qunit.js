/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"pg/md/mdCategory/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
