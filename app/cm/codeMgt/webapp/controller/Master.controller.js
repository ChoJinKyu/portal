sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/f/LayoutType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ext/lib/model/ManagedListModel",
    // "ext/lib/util/ValidatorUtil",
    "ext/lib/util/ControlUtil"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageToast, MessageBox, LayoutType, Filter, FilterOperator, ManagedListModel, /*ValidatorUtil,*/ ControlUtil) {
		"use strict";

		return BaseController.extend("cm.codeMgt.controller.Master", {

            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
			    this.oRouter.getRoute("master").attachPatternMatched(this._onCodeMasterMatched, this);
            },

            onBeforeRendering : function(){
                var oContModel = this.getModel("contModel");
                var sTenantId = "L2100";
                oContModel.setProperty("/tenant_id", sTenantId);

                this.onTenantChange();
            },

            onAfterRendering: function () {

            },

            _onCodeMasterMatched: function (oEvent) {
                var sThisViewId = this.getView().getId();
                var oFcl = this.getOwnerComponent().getRootControl().byId("fcl");
                oFcl.to(sThisViewId);
            },

			onSearch: function () {
                var sSearchTenant = this.getView().byId("search_tenant").getSelectedKey();
                var sSearchChain = this.getView().byId("search_chain").getSelectedKey();
                var sUseFlag = this.getView().byId("search_useflag").getSelectedKey();
                var sSearchKeyword = this.getView().byId("search_keyword").getValue();

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
                    var aKeywordFilters = {
                        filters: [
                            new Filter("group_code", FilterOperator.Contains, sSearchKeyword),
                            new Filter("group_name", FilterOperator.Contains, sSearchKeyword)
                        ],
                        and: false
                    };
                    aFilters.push(new Filter(aKeywordFilters));
                }

                var oCodeMasterTable = this.byId("codeMasterTable");
                oCodeMasterTable.setBusy(true);

                var oViewModel = this.getModel('viewModel');
                var oUtilModel = this.getModel('util');
                var oServiceModel = this.getModel();
                oServiceModel.read("/CodeMasters",{
                    filters : aFilters,
                    success : function(data){
                        oViewModel.setProperty("/CodeMasters", data.results);

                        data.results.forEach(function(item,i){
                            var oChainKey = {
                                tenant_id:item.tenant_id,
                                group_code:"CM_CHAIN_CD",
                                code:item.chain_code
                            };
                            var sChainPath =  oUtilModel.createKey("/Code", oChainKey);
                            var oChain = oUtilModel.getProperty(sChainPath);
                            var sChainText = (oChain)?oChain.code_description:"";

                            var sTargetPath = "/CodeMasters/"+i+"/chain_name";
                            oViewModel.setProperty(sTargetPath, sChainText);
                        })

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

                // ControlUtil.scrollToIndexOneColumnMTable(oEvent.getSource());

                var oNavParam = {
                    // layout: oNextUIState.layout,
                    layout: LayoutType.OneColumn,
                    tenantId : oTargetData.tenant_id,
                    groupCode : oTargetData.group_code
                };
                this.getRouter().navTo("detail", oNavParam);
            },

            onCreatePress : function(oEvent){
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                // var sLayout = oNextUIState.layout;
                var sLayout = LayoutType.OneColumn;
                
			    this.getRouter().navTo("detail", {layout: sLayout});
            },

            onTenantChange : function(oEvent){
                // var sTenant = oEvent.getSource().getSelectedKey();
                var oContModel = this.getModel("contModel");
                var sTenant = oContModel.getProperty("/tenant_id");
                var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, sTenant),
                    new Filter("group_code", FilterOperator.EQ, 'CM_CHAIN_CD')
                ];
                var oItemTemplate = new sap.ui.core.ListItem({
                    key : "{util>code}",
                    text : "{util>code_name}",
                    additionalText : "{util>code}"
                });

                var oChain = this.byId("search_chain");
                oChain.setSelectedKey(null);
                oChain.bindItems("util>/Code", oItemTemplate, null, aFilters);
            }
		});
	});
