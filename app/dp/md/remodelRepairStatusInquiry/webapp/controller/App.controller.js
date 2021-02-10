sap.ui.define([
    "./BaseController",
    "ext/lib/util/Multilingual",
], function (BaseController, Multilingual) {
	"use strict";

	return BaseController.extend("dp.md.remodelRepairStatusInquiry.controller.App", {

		onInit : function () {

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});