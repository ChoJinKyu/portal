sap.ui.define([
	"ext/lib/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("dp.md.remodelRepairMgt.Component", {

		metadata : {
			manifest: "json"
        },
        
		init : function () {
            UIComponent.prototype.init.apply(this, arguments);
            
            var oMode = new JSONModel({
                editFlag : false,
                newFlag : false
            });

            this.setModel(oMode, "mode");
        }

	});

});