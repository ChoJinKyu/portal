sap.ui.define([
    "ext/lib/UIComponent",
    "ext/lib/util/SppUserSessionUtil",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Multilingual",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (UIComponent, SppUserSessionUtil, JSONModel, Multilingual, Filter, FilterOperator) {
    "use strict";

    return UIComponent.extend("sp.np.netPriceMgt.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            //console.log("SppUserSessionUtil", SppUserSessionUtil);
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oBasePriceArlMgtRootData = {
                tenantId: SppUserSessionUtil.getUserInfo().TENANT_ID,
                number: { symbol: "", currency: "KRW" }
            };

            // basePriceArlMgt App 전체에서 사용할 Model 세팅
            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            // 다국어 Model 세팅
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            var aFilters = [];
            aFilters.push(new Filter("group_code", FilterOperator.EQ, "CM_APPROVE_STATUS"));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, SppUserSessionUtil.getUserInfo().TENANT_ID));

            this.getModel("util").read("/Code", {
                filters: aFilters,
                urlParameters: {
                    "$orderby": "sort_no"
                },
                success: function (data) {
                    if (data) {
                        oRootModel.setProperty("/processList", data.results);
                    }
                }.bind(this),
                error: function (data) {
                    console.log("error", data);
                }
            });

            // 플랜트 조회 시작
            var oPurOrgModel = this.getModel("purOrg");
            var aPurOrgFilter = [new Filter("tenant_id", FilterOperator.EQ, SppUserSessionUtil.getUserInfo().TENANT_ID)];
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
            // 플랜트 조회 끝
        },

        /**
        * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
        */
        _changeDateString: function (oDateParam, sGubun) {
            var oDate = oDateParam || new Date(),
                sGubun = sGubun || "",
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth() + 1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            var sReturnValue = "" + iYear + sGubun + "-" + this._getPreZero(iMonth) + "-" + sGubun + this._getPreZero(iDate);

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam < 10 ? "0" + iDataParam : iDataParam);
        }
    });
});
