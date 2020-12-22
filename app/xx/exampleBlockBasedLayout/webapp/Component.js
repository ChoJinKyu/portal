sap.ui.define([
	"ext/lib/UIComponent",
    "sap/ui/core/routing/HashChanger"
], function (UIComponent, HashChanger) {
	"use strict";

	return UIComponent.extend("xx.exampleBlockBasedLayout.Component", {

		metadata : {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {
            //HashChanger.getInstance().replaceHash("");
            
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
		},


	});

});