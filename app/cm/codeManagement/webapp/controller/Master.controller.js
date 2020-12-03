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

		return BaseController.extend("cm.codeManagement.controller.Master", {

            onInit: function () {
                // sap.ui.getCore().attachValidationError(function (oEvent) {
                //     // debugger;
                //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
                // });
        
                // sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                //     // debugger;
                //     oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
                // });

            // var sServiceUrl = 'srv-api/odata/v2/cm.CodeMgrService/';

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
                var model = this.getModel("contModel");
                model.setProperty("/input",null);
            },

			onSearch: function () {

                var sSearchTenant = this.getView().byId("search_tenant").getValue();
                var sSearchChain = this.getView().byId("search_chain").getSelectedKey();
                var sUseFlag = this.getView().byId("search_useflag").getSelectedKey();
                var sSearchKeyword = this.getView().byId("search_keyword").getValue();

                console.log(this.getView().byId("search_keyword"))

                // alert(ValidatorUtil.validate(this))

                var aFilters = [];
                if(!this.isValNull(sSearchTenant)){
                    aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sSearchTenant));
                }
                if(!this.isValNull(sSearchChain)){
                    aFilters.push(new Filter("chain_code", FilterOperator.EQ, sSearchChain));
                }
                if(!this.isValNull(sUseFlag)){
                    var bUseFlag = (sUseFlag === "true")?true:false;
                    aFilters.push(new Filter("use_flag", FilterOperator.EQ, bUseFlag));
                }
                if(!this.isValNull(sSearchKeyword)){
                    aFilters.push(new Filter("group_code", FilterOperator.Contains, sSearchKeyword));
                    aFilters.push(new Filter("group_name", FilterOperator.Contains, sSearchKeyword));
                }

                var oCodeMasterTable = this.byId("codeMasterTable");
                oCodeMasterTable.setBusy(true);

                var oViewModel = this.getModel('viewModel');
                var oServiceModel = this.getModel();
                oServiceModel.read("/CodeMasters",{
                    filters : aFilters,
                    success : function(data){
                        oViewModel.setProperty("/CodeMasters", data.results);
                        oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        oCodeMasterTable.setBusy(false);
                    }
                });
                /*
                var filters = [];

                var search_tenant_id = "";
                var search_company_code = "";
                var search_chain_code = "";
                var search_use_yn = "";
                var search_group_code = this.getView().byId("search_group_code").getValue();
                var search_group_name = this.getView().byId("search_group_name").getValue();
                var search_group_description = this.getView().byId("search_group_description").getValue();
                

                if(this.byId("search_tenant_id").getSelectedItem()){
                    search_tenant_id = this.byId("search_tenant_id").getSelectedItem().getKey();
                }

                if(this.byId("search_company_code").getSelectedItem()){
                    search_company_code = this.byId("search_company_code").getSelectedItem().getKey();
                }

                if(this.byId("search_chain_code").getSelectedItem()){
                    search_chain_code = this.byId("search_chain_code").getSelectedItem().getKey();
                }

                if(this.byId("search_use_yn").getSelectedItem()){
                    search_use_yn = this.byId("search_use_yn").getSelectedItem().getKey();
                }

                // 필터 추가 
                if(!this.isValNull(search_tenant_id)){
                    filters.push(new Filter("tenant_id", FilterOperator.Contains, search_tenant_id));
                }

                if(!this.isValNull(search_company_code)){
                    filters.push(new Filter("company_code", FilterOperator.Contains, search_company_code));
                }

                if(!this.isValNull(search_chain_code)){
                    filters.push(new Filter("chain_code", FilterOperator.Contains, search_chain_code));
                }

                if(!this.isValNull(search_use_yn)){
                    //filters.push(new Filter("use_yn", FilterOperator.Contains, search_use_yn));
                }

                if(!this.isValNull(search_group_code)){
                    filters.push(new Filter("group_code", FilterOperator.Contains, search_group_code));
                }

                if(!this.isValNull(search_group_name)){
                    filters.push(new Filter("group_name", FilterOperator.Contains, search_group_name));
                }

                if(!this.isValNull(search_group_description)){
                    filters.push(new Filter("group_description", FilterOperator.Contains, search_group_description));
                }

                var mstBinding = this.byId("codeMstTable").getBinding("items");
                //var mstBinding = this.byId("codeMstTable").getBinding("rows");
                mstBinding.resetChanges();
                this._retrieveParam.mstParam = "";
                this._retrieveParam.dtlParam = "";
                this._retrieveParam.lngParam = "";

                this.getView().setBusy(true);
                mstBinding.filter(filters);
                this.getView().setBusy(false);
                */
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
                // var sLayout = "MidColumnFullScreen";
                
			    this.getRouter().navTo("detail", {layout: sLayout});
            }
		});
	});
