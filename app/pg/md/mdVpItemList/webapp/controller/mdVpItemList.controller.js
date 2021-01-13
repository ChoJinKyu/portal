sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"jquery.sap.global",
    "sap/ui/core/util/MockServer"
],
  function (BaseController, Multilingual, JSONModel, ManagedListModel, jQuery, MockServer) {
    "use strict";

    return BaseController.extend("pg.md.mdVpItemList.controller.mdVpItemList", {

		onInit: function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new JSONModel()); 
            
            
        }

    });
  }
);