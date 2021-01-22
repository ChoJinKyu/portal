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
            number: {symbol: "", currency: "KRW"}};

            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            // DB에서 Config값을 읽어와서 세팅(view에 사용할 visible, text 값등)
            var aConfigFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            this.getModel().read("/Base_Price_Arl_Config", {
                filters : aConfigFilter,
                success : function(data){
                    if( data && data.results ) {
                        var oConfig = {};

                        data.results.forEach(function (oResult) {
                            oConfig[oResult.control_option_code] = oResult.control_option_val;
                        });
                        
                        oRootModel.setProperty("/config", oConfig);

                        var aFilters2 = [];
                        aFilters2.push(new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")));
                        aFilters2.push(new Filter("message_code", FilterOperator.EQ, oConfig.DP_VI_PURORG_DISPLAY_NM));
                        this.getModel("commonODataModel").read("/Message", {
                            filters : aFilters2,
                            success : function(data){
                                if( data ) {
                                    oRootModel.setProperty("/plantLabel", data.results[0].message_contents);
                                }
                            }.bind(this),
                            error : function(data){
                                console.log("error", data);
                            }
                        });
                    }
                }.bind(this),
                error : function(data){
                    console.log("error", data);
                }
            });
            
            // 플랜트 조회
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

            // 상태값 조회
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

        /**
         * 세팅값에 따라 Text 변경
         */
        onSetPurOrgText: function (sTextParam) {
            var oI18NModel = this.getModel("I18N");
            var sPurOrgDisplayNm = this.getModel("rootModel").getProperty("/config/PURORG_DISPLAY_NM");

            return oI18NModel.getText("/"+sPurOrgDisplayNm) || oI18NModel.getText("/PLANT");
        }
    });
});
