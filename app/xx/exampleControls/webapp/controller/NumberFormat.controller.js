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
					transactionAmount: {
						size: 560.67,
						currency: "EUR"
					},
					exchangeRate: 1.00000,
					amount: 12345670.67
				},
				{
					expense: "Meals",
					transactionAmount: {
						size: 180.50,
						currency: "USD"
					},
					exchangeRate: 0.85654,
					amount: 1234154.72
				},
				{
					expense: "Hotel",
					transactionAmount: {
						size: 675.00,
						currency: "USD"
					},
					exchangeRate: 0.85654,
					amount: 1234578.57
				},
				{
					expense: "Taxi",
					transactionAmount: {
						size: 15,
						currency: "USD"
					},
					exchangeRate: 0.85654,
					amount: 123412.86
				},
				{
					expense: "Daily allowance",
					transactionAmount: {
						size: 80.00,
						currency: "BGN"
					},
					exchangeRate: 0.51129,
					amount: 1234540.90
				}
			];

			this.getView().setModel(new JSONModel(aData));
		}
	});
});