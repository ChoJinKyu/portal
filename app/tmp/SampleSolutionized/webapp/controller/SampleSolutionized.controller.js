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
                        

                        var v_returnModel = oView.getModel("TAG").getData();
                        v_returnModel.result = data.result;
                        oView.getModel("TAG").updateBindings(true);
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
			}
		});
	});
