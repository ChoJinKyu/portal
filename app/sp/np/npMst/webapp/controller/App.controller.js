sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Multilingual, UIComponent, mobileLibrary, JSONModel) {
	"use strict";

	return BaseController.extend("sp.np.npMst.controller.App", {

        onInit: function () {
            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
	});

});