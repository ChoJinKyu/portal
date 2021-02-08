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

            // basePriceProgressStatusMgt App 전체에서 사용할 Model 세팅
            
            // 다국어 Model 세팅
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            if (oRootModel === undefined) {
                this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
                oRootModel = this.getModel("rootModel");
                // 상태값 조회(품의서 진행 상태) 시작
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, SppUserSessionUtil.getUserInfo().TENANT_ID));
                aFilters.push(new Filter("group_code", FilterOperator.EQ, "CM_APPROVE_STATUS"));
    
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
            }
        },

         /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
         */
        _changeDateString: function (oDateParam, sGubun) {
            var oDate = oDateParam || new Date(),
                sGubun = sGubun || "",
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            var sReturnValue = "" + iYear + sGubun + "-" + this._getPreZero(iMonth) + "-" + sGubun + this._getPreZero(iDate);

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        }
    });
});
