sap.ui.define([
    "ext/lib/UIComponent",
    "ext/lib/util/Multilingual"
], function (UIComponent, Multilingual) {
    "use strict";

    return UIComponent.extend("sp.sm.makerRegistrationRequest.Component", {

        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            // 다국어 Model 세팅
            this.setModel(new Multilingual().getModel(), "I18N");

        }

    });

});