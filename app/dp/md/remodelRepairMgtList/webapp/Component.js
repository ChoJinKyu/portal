sap.ui.define([
    "ext/lib/UIComponent",
    'sap/ui/model/json/JSONModel',
    "ext/lib/model/models",
], function (UIComponent, JSONModel, models) {
    "use strict";

    return UIComponent.extend("dp.md.remodelRepairMgtList.Component", {

        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // create the views based on the url/hash
            this.getRouter().initialize();

            var oMode = new JSONModel({
                editFlag: false,
                viewFlag: true,
                btnEdit: true,
                btnCancel: true,
                btnDraft: true,
                btnRequset : true
            });

            this.setModel(oMode, "mode");

        }
    });

});