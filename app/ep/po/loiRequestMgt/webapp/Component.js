sap.ui.define([
    "sap/base/util/UriParameters",
    "ext/lib/UIComponent",
    "sap/ui/Device",
    "ep/po/loiRequestMgt/model/models",
    "sap/f/library",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/model/json/JSONModel"
], function (UriParameters, UIComponent, Device, models, library, FlexibleColumnLayoutSemanticHelper, JSONModel) {
    "use strict";

    var LayoutType = library.LayoutType;

    return UIComponent.extend("ep.po.loiRequestMgt.Component", {

        metadata: {
            manifest: "json"
        },

        /**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            this.setModel(new JSONModel({ layout: LayoutType.OneColumn }), "fcl");

            // create the views based on the url/hash
            this.getRouter().initialize();
        },

        /**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
        getHelper: function () {
            var oFCL = this.getRootControl().byId("fcl"),
                oParams = UriParameters.fromQuery(location.search),
                oSettings = {
                    defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
                    defaultThreeColumnLayoutType: LayoutType.ThreeColumnsEndExpanded,
                    mode: oParams.get("mode"),
                    initialColumnsCount: 2,
                    maxColumnsCount: oParams.get("max")
                };

            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        }
    });
});
