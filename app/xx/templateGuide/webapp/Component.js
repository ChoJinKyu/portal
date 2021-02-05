sap.ui.define([
	"ext/lib/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("xx.templateGuide.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
            // this.setModel(models.createDeviceModel(), "device");
            
            this.setModel(new JSONModel({}), "targetViewSrc");
            this.setModel(new JSONModel({}), "targetCtrollerSrc");
		}
	});
});