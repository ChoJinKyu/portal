sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/NumberFormatter"
], function (Controller, JSONModel, NumberFormatter) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.NumberFormat", {

        numberFormatter: NumberFormatter,

		onInit: function () {
			var aData = [
				{
					expense: "Flight",
					amount: 12345670.67
				},
				{
					expense: "Meals",
					amount: 1234154.72
				},
				{
					expense: "Hotel",
					amount: 1234578.57
				},
				{
					expense: "Taxi",
					amount: 123412.86
				},
				{
					expense: "Daily allowance",
					amount: 1234540.90
				}
			];

			this.getView().setModel(new JSONModel(aData));
		}
	});
});