sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/ValidatorUtil"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, ManagedListModel, ValidatorUtil) {
		"use strict";

		return BaseController.extend("cm.userMgr.controller.Master", {

            onInit: function () {
                // sap.ui.getCore().attachValidationError(function (oEvent) {
                //     // debugger;
                //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
                // });
        
                // sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                //     // debugger;
                //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
                // });

            // var sServiceUrl = 'srv-api/odata/v2/cm.userMgr/';

            //   var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
            // console.log(oModel)
            //   this.setModel(oModel, 'oRefModel');

            //   sap.ui.getCore().setModel(oModel, 'oRefModel');
            },

            isValNull: function (p_val) {
                if(!p_val || p_val == "" || p_val == null){
                    return true
                }else{
                    return false;
                }
            },

            onAfterRendering: function () {
                // var model = this.getModel("contModel");
                // model.setProperty("/input",null);
            },

			onSearch: function () {


                var oUserMasterTable = this.byId("userMasterTable");
                oUserMasterTable.setBusy(true);

                var oViewModel = this.getModel('viewModel');
                var oServiceModel = this.getModel();
                oServiceModel.read("/UserMasters",{
                    success : function(data){
                        oViewModel.setProperty("/UserMasters", data.results);
                        oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        oCodeMasterTable.setBusy(false);
                    }
                });
               
            },

            onListItemPress : function(oEvent){
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                
                var oViewModel = this.getModel('viewModel');
                var sPath = oEvent.getSource().getBindingContextPath();
                var oTargetData = oViewModel.getProperty(sPath);

                oViewModel.setProperty("/detail", $.extend(true, {}, oTargetData));
                oViewModel.setProperty("/detailClone", $.extend(true, {}, oTargetData));

                var oNavParam = {
                    layout: oNextUIState.layout,
                    tenantId : oTargetData.tenant_id,
                    groupCode : oTargetData.group_code
                };
                this.getRouter().navTo("detail", oNavParam);
            },

            onCreatePress : function(oEvent){
                console.log("onCreatePress")
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                var sLayout = oNextUIState.layout;
                
			    this.getRouter().navTo("detail", {layout: sLayout});
            }
		});
	});
