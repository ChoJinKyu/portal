sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("tmp.SampleSolutionized.controller.SampleSolutionized", {
			onInit: function () {
                alert("hi");
			}
		});
	});
