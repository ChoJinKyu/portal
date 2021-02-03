sap.ui.define([
    "ext/lib/UIComponent",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Multilingual",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (UIComponent, JSONModel, Multilingual, Filter, FilterOperator) {
    "use strict";

    return UIComponent.extend("sp.np.netPriceMgt.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oBasePriceArlMgtRootData = {
                tenantId: "L2100",
                number: { symbol: "", currency: "KRW" }
            };

            // basePriceProgressStatusMgt App 전체에서 사용할 Model 세팅
            this.setModel(new JSONModel(oBasePriceArlMgtRootData), "rootModel");
            // 다국어 Model 세팅
            this.setModel(new Multilingual().getModel(), "I18N");

            var oRootModel = this.getModel("rootModel");

            // 상태값 조회(품의서 진행 상태) 시작
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")));
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
    });
});
