sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"ext/lib/controller/BaseController",
		"ext/lib/formatter/DateFormatter",
		"ext/lib/model/ManagedModel",
		"ext/lib/model/ManagedListModel",
		"ext/lib/model/TransactionManager",
		"ext/lib/util/Multilingual",
		"ext/lib/util/Validator",
		"sap/m/ColumnListItem",
		"sap/m/Label",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/m/UploadCollectionParameter",
		"sap/ui/core/Fragment",
		"sap/ui/core/syncStyleClass",
		"sap/ui/core/routing/History",
		"sap/ui/Device", // fileupload 
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/richtexteditor/RichTextEditor"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, ManagedModel) {
		"use strict";

		return Controller.extend("tmp.SampleSolutionized.controller.SampleSolutionized", {
			onInit: function () {
                alert("hi");
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
				this.getView().setModel(new ManagedModel(), "company");

				this._bindView("/AppMaster(tenant_id='" + this.tenant_id + "',approval_number='" + approvalNumber + "')", "appMaster", [], function (oData) {

                    console.log(" oData >>> ", oData); 
                    this.firstStatusCode = oData.approve_status_code; // 저장하시겠습니까? 하고 취소 눌렀을 경우 다시 되돌리기 위해서 처리 
                    this._toButtonStatus();
				}.bind(this));
				
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
				

				$.ajax({
					url: url,
					type: "POST",
					//datatype: "json",
					data: JSON.stringify(data),
					contentType: "application/json",
					success: function (result) { 
						callback(result);
					},
					error: function (e) {
						callback(e);
					}
				});




			}
		});
	});
