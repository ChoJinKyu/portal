sap.ui.define([
  "ext/lib/UIComponent",
  "sap/ui/model/json/JSONModel",
  "ext/lib/util/Multilingual"
], function (UIComponent, JSONModel, Multilingual) {
  "use strict";

  return UIComponent.extend("dp.basePriceList.Component", {

    metadata: {
      manifest: "json"
    },

    init : function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        this.setModel(new JSONModel({tenantId: "L1100",
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
    ]}), "basePriceListRootModel");
        this.setModel(new Multilingual().getModel(), "I18N");
    },
  });
});
