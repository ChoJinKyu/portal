sap.ui.define([
    "ext/lib/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sp.sf.fundingNotifySup.controller.App", {

        onInit: function () {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }

    });

});