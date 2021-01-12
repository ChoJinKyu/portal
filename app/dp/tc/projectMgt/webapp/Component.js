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
        
        this.setModel(new JSONModel(), "projectMgtRootModel");
    },
  });
});
