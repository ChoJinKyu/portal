sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
		// "ext/lib/controller/BaseController",
		// "ext/lib/formatter/DateFormatter",
		 "ext/lib/model/ManagedModel"
		// "ext/lib/model/ManagedListModel",
		// "ext/lib/model/TransactionManager",
		// "ext/lib/util/Multilingual",
		// "ext/lib/util/Validator",
		// "sap/m/ColumnListItem",
		// "sap/m/Label",
		// "sap/m/MessageBox",
		// "sap/m/MessageToast",
		// "sap/m/UploadCollectionParameter",
		// "sap/ui/core/Fragment",
		// "sap/ui/core/syncStyleClass",
		// "sap/ui/core/routing/History",
		// "sap/ui/Device", // fileupload 
		// "sap/ui/model/json/JSONModel",
		// "sap/ui/model/Filter",
		// "sap/ui/model/FilterOperator",
		//"sap/ui/richtexteditor/RichTextEditor"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,JSONModel,ManagedModel) {
		"use strict";

		return Controller.extend("tmp.SampleSolutionized.controller.SampleSolutionized", {
			onInit: function () {
                alert("hi");
                var oView = this.getView();
                var url = "tmp/SampleSolutionizedwebapp/srv-api/odata/v4/tmp.TmpMgrService/SampleLogicTransition"

				var input = {};
				input.TENANT_ID = "AAAA";
                //this.returnModel = new JSONModel({});
                //this.getView().setModel(new JSONModel({}), "TEST");
                this.getView().setModel(new ManagedModel(), "TAG");

				$.ajax({
					url: url,
					type: "POST",
					//datatype: "json",
					//data: input,
					data : JSON.stringify(input),
					contentType: "application/json",
					success: function(data){
						debugger;
                        //var v_returnModel = oView.getModel("TEST").getData();
                        //v_returnModel.result = data.result;
                        //oView.getModel("returnModel").updateBindings(true);
						// var v_returnModel = oView.getModel("returnModel").getData();
						// v_returnModel.headerList = data.value;
						// oView.getModel("returnModel").updateBindings(true);
						// v_this.onSearch();
						
					},
					error: function(e){
						
					}
				});
			},
			/**
			 * Binds the view to the data path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			 _onObjectMatched: function (oEvent) {

				/**
				 * init 에서 해당 모델을 선언하면 create 계속 연속 했을때 기존 데이터가 남아있어서
				 * 비정상적으로 나옴 
				 */
				//this.getView().setModel(new ManagedModel(), "company");
				var url = "tmp/SampleSolutionizedwebapp/srv-api/odata/v4/tmp.TmpMgrService/SampleLogicTransition"

				var input = {};
				input.TENANT_ID = "AAAA";

				$.ajax({
					url: url,
					type: "POST",
					//datatype: "json",
					//data: input,
					data : JSON.stringify(input),
					contentType: "application/json",
					success: function(data){
						debugger;
						// //oView.getModel("returnModel").getData().headerList = [];
						// var v_returnModel = oView.getModel("returnModel").getData();
						// v_returnModel.headerList = data.value;
						// oView.getModel("returnModel").updateBindings(true);
						// v_this.onSearch();
						
					},
					error: function(e){
						
					}
				});
			}
		});
	});
