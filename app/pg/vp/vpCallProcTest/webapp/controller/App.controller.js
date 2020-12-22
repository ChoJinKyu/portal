sap.ui.define([
		"ext/lib/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("pg.vp.vpCallProcTest.controller.App", {
			onInit: function () {
                alert("11111");
			}
		});
	});
