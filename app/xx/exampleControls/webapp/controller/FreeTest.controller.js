sap.ui.define([
	"./Empty.controller",
	"ext/lib/util/Multilingual",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/odata/ODataUtils",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Controller, Multilingual, ODataModel, ODataUtils, MessageBox, MessageToast, 
        Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.FreeTest", {

		onInit: function(){
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
		},

        onSearchPress: function(){

			var filters = [
				new Filter({
					filters: [
						new Filter("tenant_id", FilterOperator.EQ, "l2100"),
						new Filter("language_code", FilterOperator.EQ, "KO")
					],
					and: false
				})
			];

			var sorters = [
				new Sorter("hierarchy_rank")
			]

			var customParams = {
				"aaa": "babb"
			}

			var aParams = [];
			aParams.push(ODataUtils._createUrlParamsArray({
					"$top": 2000,
					"$skip": 1000
				}));
			aParams.push(ODataUtils.createFilterParams(filters));
			aParams.push(ODataUtils.createSortParams(sorters));

			var oDataModel = new ODataModel({
				useBatch: true,
				serviceUrl: "srv-api/odata/v2/cm.util.CommonService/",
				batchRequestFailed: function(oEvent){
					debugger;
				}.bind(this),
				batchRequestCompleted: function(oEvent){
					debugger;
				}.bind(this),
				requestFailed: function(oEvent){
					debugger;
				}.bind(this),
				requestCompleted: function(oEvent){
					debugger;
				}.bind(this)
			});

			oDataModel.read("/Message", {
				groupId: "batchRead",
				filters: filters,
				success: function(oEvent){
					debugger;
				}.bind(this)
			});

			oDataModel.read("/Message", {
				groupId: "batchRead",
				filters: filters,
				urlParameters: {
					"$top": 2000,
					"$skip": 1000
				},
				success: function(oEvent){
					debugger;
				}.bind(this)
			});

			oDataModel.submitChanges({
				groupId: "batchRead",
				success: function(oEvent){
					debugger;
				}.bind(this)
			})
			
		}

	});
});