sap.ui.define([
    
	"ext/lib/UIComponent",
	"ext/lib/model/models",
    "ext/lib/controller/ErrorHandler",
    
	// "sap/ui/core/UIComponent",
	// "sap/ui/Device",
	// "cm/currencyMgr/model/models",
	'sap/f/library',
    'sap/ui/model/json/JSONModel',
    'sap/f/FlexibleColumnLayoutSemanticHelper'
], function (UIComponent, Device, models, fioriLibrary, JSONModel, FlexibleColumnLayoutSemanticHelper, ErrorHandler) {
	"use strict";

	return UIComponent.extend("cm.currencyMgr.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
            var oModel,
				oProductsModel,
                oRouter,
                oVisible;
			// call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
            
            oModel = new JSONModel({
                            true1 : true,
                            true2 : false,
                            true3 : true,
                            true4 : false,
                        });
            this.setModel(oModel, "Currency");
            this.setModel(new JSONModel(), "flexibleColumnLayout");
             
		},

        getHelper: function () {
			return this._getFcl().then(function(oFCL) {
				var oSettings = {
					defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
					//defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded
				};
				return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
			});
        },
        _getFcl: function () {
			return new Promise(function(resolve, reject) {
				var oFCL = this.getRootControl().byId('flexibleColumnLayout');
				if (!oFCL) {
					this.getRootControl().attachAfterInit(function(oEvent) {
						resolve(oEvent.getSource().byId('flexibleColumnLayout'));
					}, this);
					return;
				}
				resolve(oFCL);

			}.bind(this));
		}
	});
});
