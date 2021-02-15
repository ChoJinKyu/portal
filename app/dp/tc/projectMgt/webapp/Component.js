sap.ui.define([
  "ext/lib/UIComponent",
  "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
  "use strict";

  return UIComponent.extend("dp.tc.projectMgt.Component", {

    metadata: {
      manifest: "json"
    },

    init : function () {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);
        var oRootModel = new JSONModel({
            userId : "A60262", tenantId : "L2100"
        });
        this.setModel(oRootModel, "rootModel");
        this.getModel().setSizeLimit(1000);
    },
  });
});
