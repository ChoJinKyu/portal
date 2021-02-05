sap.ui.define([
	"ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual"
], function (BaseController, Multilingual) {
	"use strict";

	return BaseController.extend("dp.md.remodelRepairMgt.controller.App", {

		onInit : function () {
			// apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
		}
	});

});