sap.ui.define([
  "ext/lib/UIComponent",
  "sap/ui/model/json/JSONModel",
  "ext/lib/util/Multilingual",
  "sap/ui/model/Filter", 
  "sap/ui/model/FilterOperator",
], function (UIComponent, JSONModel, Multilingual, Filter, FilterOperator) {
  "use strict";

    return UIComponent.extend("sp.vi.exceMaterialMgt.Component", {

        metadata: {
        manifest: "json"
        },

        init : function () { 
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            //세션 처리 
            var oUserInfo = {"tenantId" : "L2100", 
                             "company_code" : "LGCKR",
                             "user_empno" : "5453",
                             "user_empnm" : "**영",
                             "bizunit_code" : "BIZ00100",
                             "bizunit_name" : "석유화학"
                            };
                             

            this.setModel(new JSONModel(oUserInfo), "userModel");
            var oUserModel = this.getModel("userModel");

            this.setModel(new JSONModel(), "rootModel");
            this.setModel(new Multilingual().getModel(), "I18N");

            this.setModel(new JSONModel(), "currModel");
            var oCurrModel = this.getModel("currModel");

            var oRootModel = this.getModel("rootModel");
            oRootModel.setSizeLimit(10000);

            // 플랜트 조회(Plant)
            var oOrgModel = this.getModel("orgCode");
            var aOrgPlantFilter = [new Filter("tenant_id", FilterOperator.EQ, oUserModel.getProperty("/tenantId"))];
            oOrgModel.read("/Org_Plant", {
                filters : aOrgPlantFilter,
                success : function(data){
                    if( data && data.results ) {
                        oRootModel.setProperty("/org_Plant", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

            // 사업부 조회(Business Division)
            oOrgModel = this.getModel("orgCode");
            var aOrgDivFilter = [new Filter("tenant_id", FilterOperator.EQ, oUserModel.getProperty("/tenantId"))];
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
        }

    });
});
