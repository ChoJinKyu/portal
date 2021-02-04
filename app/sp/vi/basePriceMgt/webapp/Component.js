sap.ui.define([
  "ext/lib/UIComponent",
  "sap/ui/model/json/JSONModel",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter", 
  "sap/ui/model/FilterOperator",
], function (UIComponent, JSONModel, Multilingual, Filter, FilterOperator) {
  "use strict";

    return UIComponent.extend("sp.vi.basePriceMgt.Component", {

        metadata: {
        manifest: "json"
        },

        init : function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oBasePriceArlMgtRootData = {tenantId: "L2100", company_code : "LGCKR", number: {symbol: "", currency: "KRW"}};

            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            this.setModel(new Multilingual().getModel(), "I18N");

            this.setModel(new JSONModel(), "currModel");
            var oCurrModel = this.getModel("currModel");

            var oRootModel = this.getModel("rootModel");
            oRootModel.setSizeLimit(10000);
            
            // 사업부 조회
            var oOrgModel = this.getModel("orgCode");
            var aOrgDivFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oOrgModel.read("/Org_Division", {
                filters : aOrgDivFilter,
                success : function(data){
                    if( data && data.results ) {
                        oRootModel.setProperty("/org_Division", data.results);                        
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            // 법인 조회
            var aOrgCompFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oOrgModel.read("/Org_Company", {
                filters : aOrgCompFilter,
                success : function(data){
                    if( data && data.results ) {
                        oRootModel.setProperty("/org_Company", data.results);    
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            // 통화 조회
            var oCurryModel = this.getModel("currencyODataModel");
            var aOrgCompFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oCurryModel.read("/Currency", {
                filters : aOrgCompFilter,
                success : function(data){
                    if( data && data.results ) {
                        oCurrModel.setProperty("/org_Currency", data.results);    
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            // 플랜트 조회
            var aOrgPlantFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oOrgModel.read("/Org_Plant", {
                filters : aOrgPlantFilter,
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

                            oPurOrg[oResult.company_code].push({plant_code: oResult.plant_code, plant_name: oResult.plant_name});
                        }

                        oRootModel.setProperty("/org_Plant", oPurOrg);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            //자재 조회
            var oBasePriceArlModel = this.getModel("basePriceArl");
            oBasePriceArlModel.setSizeLimit(3000);
            var aOrgMetalFilter = [];
                aOrgMetalFilter.push(new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")));
            oBasePriceArlModel.read("/Base_Price_Aprl_Material", {
                filters : aOrgMetalFilter,
                success : function(data){
                    if( data && data.results ) {
                        var aResults = data.results;
                        var aCompoany = [];
                        var oPurOrg = {};

                        for( var i=0; i<aResults.length; i++ ) {
                            var oResult = aResults[i];
                            if( -1===aCompoany.indexOf(oResult.material_code) ) {
                                aCompoany.push(oResult.material_code);
                                oPurOrg[oResult.material_code] = [];
                            }

                            oPurOrg[oResult.material_code].push({material_code: oResult.material_code
                                                                ,material_desc: oResult.material_desc
                                                                ,material_price_unit : oResult.material_price_unit
                                                                ,vendor_pool_code : oResult.vendor_pool_code
                                                                ,vendor_pool_local_name : oResult.vendor_pool_local_name
                                                                });
                        }

                        oRootModel.setProperty("/material_code", oPurOrg);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            //상태값 조회
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, "CM_APPROVE_STATUS"));

            this.getModel("commonODataModel").read("/Code", {
                filters : aFilters,
                urlParameters: {
                    "$orderby": "sort_no"
                },
                success : function(data){
                    if( data ) {
                        oRootModel.setProperty("/processList", data.results);
                    }
                }.bind(this),
                error : function(data){
                    console.log("error", data);
                }
            });
        },
    });
});
