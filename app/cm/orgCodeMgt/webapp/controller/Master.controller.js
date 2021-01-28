sap.ui.define([
    "ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/f/LayoutType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/ControlUtil"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, Multilingual, JSONModel, MessageToast, MessageBox, LayoutType, Filter, FilterOperator, ManagedListModel, ControlUtil) {
		"use strict";

		return BaseController.extend("cm.orgCodeMgt.controller.Master", {

            onInit: function () {
                var oMultilingual = new Multilingual();
                this.setModel(oMultilingual.getModel(), "I18N");

                this.oRouter = this.getOwnerComponent().getRouter();
			    this.oRouter.getRoute("master").attachPatternMatched(this._onCodeMasterMatched, this);
            },

            onBeforeRendering : function(){
                var oInitSearch = {
                    tenant_id : "L2100"
                }
                var oContModel = this.getModel("contModel");
                oContModel.setData(oInitSearch);

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
                var sOrgtype = this.getView().byId("search_orgtype").getSelectedKey();
                var sUseFlag = this.getView().byId("search_useflag").getSelectedKey();
                var sSearchKeyword = this.getView().byId("search_keyword").getValue();

                var aFilters = [];
                if(!this.isValNull(sSearchTenant)){
                    aFilters.push(new Filter("tenant_id", FilterOperator.EQ, sSearchTenant));
                }
                if(!this.isValNull(sSearchChain)){
                    aFilters.push(new Filter("chain_code", FilterOperator.EQ, sSearchChain));
                }
                if(!this.isValNull(sOrgtype)){
                    aFilters.push(new Filter("code_control_org_type_code", FilterOperator.EQ, sOrgtype));
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
                var oServiceModel = this.getModel();
                oServiceModel.read("/OrgCodeMasters",{
                    filters : aFilters,
                    success : function(data){
                        oViewModel.setProperty("/OrgCodeMasters", data.results);
                        oCodeMasterTable.setBusy(false);
                    },
                    error : function(data){
                        oCodeMasterTable.setBusy(false);
                    }
                });
            },

            onListItemPress : function(oEvent){
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                
                //var oContModel = this.getModel("contModel");
                //oContModel.setProperty("/detail", {"readMode" : true, "createMode" : false, "editMode" : false, "footer" : true});

                var oViewModel = this.getModel('viewModel');
                var sPath = oEvent.getSource().getBindingContextPath();
                var oTargetData = oViewModel.getProperty(sPath);

                oViewModel.setProperty("/detail", $.extend(true, {}, oTargetData));
                oViewModel.setProperty("/detailClone", $.extend(true, {}, oTargetData));

                var oNavParam = {
                    //layout: oNextUIState.layout,
                    layout: LayoutType.OneColumn,
                    tenantId : oTargetData.tenant_id,
                    groupCode : oTargetData.group_code
                };
                this.getRouter().navTo("detail", oNavParam);
            },

            onCreatePress : function(oEvent){
                //var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                //var sLayout = oNextUIState.layout;                
                // var sLayout = "MidColumnFullScreen";
                var sLayout = LayoutType.OneColumn;                
			    this.getRouter().navTo("detail", {layout: sLayout});
            },

            onOrgTypeChange : function(oEvent){
                var sOrgType = oEvent.getSource().getSelectedKey();
                console.log("sOrgType : " + sOrgType);

                var oModel = this.getModel();
                

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
                    text : "{util>code_description}",
                    additionalText : "{util>code}"
                });

                var oChain = this.byId("search_chain");
                oChain.setSelectedKey(null);
                oChain.bindItems("util>/CodeDetails", oItemTemplate, null, aFilters);

                // Organization type Combobox
                var aOrgtypeFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, sTenant),
                    new Filter("group_code", FilterOperator.EQ, 'CM_CODE_CTRL_ORG_TYPE_CODE')
                ];
                var oOrgtypeItemTemplate = new sap.ui.core.ListItem({
                    key : "{util>code}",
                    text : "{util>code_description}",
                    additionalText : "{util>code}"
                });
                var oOrgtype = this.byId("search_orgtype");
                oOrgtype.setSelectedKey(null);
                oOrgtype.bindItems("util>/CodeDetails", oOrgtypeItemTemplate, null, aOrgtypeFilters);
            }
		});
	});
