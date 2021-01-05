sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/DateFormatter"
], function (Controller, JSONModel, DateFormatter) {
	"use strict";

	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h*60*60*1000));
		return this;
	};
	
	Date.prototype.addMinutes = function(m) {
		this.setTime(this.getTime() + (m*60*1000));
		return this;
	};


	return Controller.extend("xx.exampleControls.controller.DateFormat", {

        DateFormatter: DateFormatter,

		onInit: function () {
			var aData = [
				{
					title: "하와이 알류샨 표준",
					zone: "UTC-10",
					dt: new Date().addHours(-9).addHours(-10)
				},
				{
					title: "미 중부 표준시",
					zone: "UTC-6",
					dt: new Date().addHours(-9).addHours(-6)
				},
				{
					title: "그리니치 표준시 GMT",
					zone: "UTC+0",
					dt: new Date().addHours(-9)
				},
				{
					title: "서울",
					zone: "UTC+9",
					dt: new Date()
				},
				{
					title: "호주 중부 하계 표준시",
					zone: "UTC+10:30",
					dt: new Date().addHours(-9).addHours(10).addMinutes(30)
				}
			];

			this.getView().setModel(new JSONModel(aData));
		}
	});
});