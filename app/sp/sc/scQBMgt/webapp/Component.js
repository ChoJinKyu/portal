// sap.ui.define([
// 	"sap/ui/core/UIComponent",
// 	"sap/ui/Device",
// 	"sp/sc/scQBMgt/model/models"
// ], function (UIComponent, Device, models) {
// 	"use strict";

// 	return UIComponent.extend("sp.sc.scQBMgt.Component", {

// 		metadata: {
// 			manifest: "json"
// 		},

// 		/**
// 		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
// 		 * @public
// 		 * @override
// 		 */
// 		init: function () {
// 			// call the base component's init function
// 			UIComponent.prototype.init.apply(this, arguments);

// 			// enable routing
// 			this.getRouter().initialize();

// 			// set the device model
// 			this.setModel(models.createDeviceModel(), "device");
// 		}
// 	});
// });




sap.ui.define([
	"ext/lib/UIComponent",
	"sap/ui/Device",
	"ext/lib/model/models",
	"ext/lib/controller/ErrorHandler"
], function (UIComponent, Device, models,ErrorHandler) {
	"use strict";

	return UIComponent.extend("sp.sc.scQBMgt.Component", {

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
			this.setModel(models.createDeviceModel(), "device");
        },
        /**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				// eslint-disable-next-line sap-no-proprietary-browser-api
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}          
	});
});
