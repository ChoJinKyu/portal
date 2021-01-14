sap.ui.define([
  "ext/lib/UIComponent",
  "sap/ui/model/json/JSONModel",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], function (UIComponent, JSONModel, Multilingual, Filter, FilterOperator) {
  "use strict";

    return UIComponent.extend("dp.vi.basePriceProgressStatusMgt.Component", {

        metadata: {
        manifest: "json"
        },

        init : function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oBasePriceArlMgtRootData = {tenantId: "L2100",
            tenantList: [
                {
                    "tenant_id": "L1100",
                    "tenant_name": "전자"
                },
                {
                    "tenant_id": "L1110",
                    "tenant_name": "실리콘웍스"
                },
                {
                    "tenant_id": "L1200",
                    "tenant_name": "디스플레이"
                },
                {
                    "tenant_id": "L1300",
                    "tenant_name": "이노텍"
                },
                {

                    "tenant_id": "L2100",
                    "tenant_name": "화학"
                },
                {

                    "tenant_id": "L2200",
                    "tenant_name": "하우시스"
                },
                {

                    "tenant_id": "L2300",
                    "tenant_name": "생활건강"
                },
                {

                    "tenant_id": "L2501",
                    "tenant_name": "팜한농"
                },
                {

                    "tenant_id": "L2600",
                    "tenant_name": "전지"
                },
                {

                    "tenant_id": "L3100",
                    "tenant_name": "U+"
                },
                {

                    "tenant_id": "L4100",
                    "tenant_name": "상사"
                },
                {

                    "tenant_id": "L4200",
                    "tenant_name": "CNS"
                },
                {
                    "tenant_id": "L4300",
                    "tenant_name": "S&I"
                },
                {
                    "tenant_id": "L4400",
                    "tenant_name": "지투알"

                },
                {
                    "tenant_id": "L4500",
                    "tenant_name": "판토스"
                }
                ]};

            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            var aConfigFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            this.getModel().read("/Base_Price_Arl_Config", {
                filters : aConfigFilter,
                success : function(data){
                    if( data && data.results ) {
                        var oConfig = {};

                        data.results.forEach(function (oResult) {
                            oConfig[oResult.control_option_level_val] = oResult.control_option_val;
                        });
                        
                        oRootModel.setProperty("/config", oConfig);
                    }
                }.bind(this),
                error : function(data){
                    console.log("error", data);
                }
            });
            
            var oPurOrgModel = this.getModel("purOrg");
            var aPurOrgFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oPurOrgModel.read("/Pur_Operation_Org", {
                filters : aPurOrgFilter,
                success : function(data){
                    if( data && data.results ) {
                        var aResults = data.results;
                        var aCompoany = [];
                        var oPurOrg = {};

                        for( var i=0; i<aResults.length; i++ ) {
                            var oResult = aResults[i];
                            if( -1===aCompoany.indexOf(oResult.company_code) ) {
                                aCompoany.push(oResult.company_code);
                                oPurOrg[oResult.company_code] = [];
                            }

                            oPurOrg[oResult.company_code].push({org_code: oResult.org_code, org_name: oResult.org_name});
                        }

                        oRootModel.setProperty("/purOrg", oPurOrg);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });


            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, "DP_VI_APPROVAL_STATUS_CODE"));

            this.getModel("commonODataModel").read("/Code", {
                filters : aFilters,
                success : function(data){
                    if( data ) {
                        this.getModel("rootModel").setProperty("/processList", data.results);
                    }
                }.bind(this),
                error : function(data){
                    console.log("error", data);
                }
            });
        },

        onSetPurOrgText: function (sTextParam) {
            var oI18NModel = this.getModel("I18N");
            var sPurOrgDisplayNm = this.getModel("rootModel").getProperty("/config/PURORG_DISPLAY_NM");

            return oI18NModel.getText("/"+sPurOrgDisplayNm) || oI18NModel.getText("/PLANT");
        }
    });
});
