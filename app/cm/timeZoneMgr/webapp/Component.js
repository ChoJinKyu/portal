sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "ext/lib/model/models",
  "ext/lib/controller/ErrorHandler"
], function (UIComponent, Device, models, ErrorHandler) {
  "use strict";

  return UIComponent.extend("cm.timeZoneMgr.Component", {

    metadata: {
      manifest: "json"
    }

  });
});
