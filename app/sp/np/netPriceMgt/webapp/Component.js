sap.ui.define([
    "ext/lib/UIComponent",
    //"ext/lib/util/SppUserSessionUtil",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Multilingual",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (
    UIComponent, 
    //SppUserSessionUtil, 
    JSONModel, 
    Multilingual, 
    Filter, 
    FilterOperator
) {
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
                tenantId: "L2100",
                number: { symbol: "", currency: "KRW" }
            };

            // basePriceArlMgt App 전체에서 사용할 Model 세팅
            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            // 다국어 Model 세팅
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            var aFilters = [];
            aFilters.push(new Filter("group_code", FilterOperator.EQ, "CM_APPROVE_STATUS"));
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));

            this.getModel("util").read("/Code", {
                filters: aFilters,
                urlParameters: {
                    "$orderby": "sort_no"
                },
                success: function (data) {
                    if (data) {
                        oRootModel.setProperty("/processList", data.results);
                    }
                },
                error: function (data) {
                    console.log("error", data);
                }
            });
            
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
