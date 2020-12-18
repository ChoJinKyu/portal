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
        
        this.setModel(new JSONModel(), "basePriceListRootModel");
        this.setModel(new Multilingual().getModel(), "I18N");
    },
  });
});
