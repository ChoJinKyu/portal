sap.ui.define([
	"jquery.sap.global",
	"ext/lib/UIComponent",
	"sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/HashChanger",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "ext/lib/util/SppUserSession"
], function (jQuery, UIComponent, JSONModel, HashChanger, FlexibleColumnLayoutSemanticHelper, SppUserSession) {
	"use strict";

	return UIComponent.extend("dp.pd.categoryCreationRequestMgt.Component", {

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
            var oSppUserSession = new SppUserSession();
            this.setModel(oSppUserSession.getModel(), "USER_SESSION");
            HashChanger.getInstance().replaceHash("");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			this.setModel(new JSONModel(), "fcl");

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		/**
		 * Returns an instance of the semantic helper
		 * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
		 */
		getHelper: function () {
			var oFCL = this.getRootControl().byId("fcl"),
				oParams = jQuery.sap.getUriParameters(),
				oSettings = {
					defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
					//defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
					mode: oParams.get("mode"),
					maxColumnsCount: oParams.get("max")
				};

			return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
		}

	});

});