sap.ui.define([
    "sap/base/util/UriParameters",
	"ext/lib/UIComponent",
	"sap/ui/Device",
    "cm/orgCodeMgt/model/models",
    "sap/f/library",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/model/json/JSONModel"
], function (UriParameters, UIComponent, Device, models, library, FlexibleColumnLayoutSemanticHelper, JSONModel) {
    "use strict";
    
    var LayoutType = library.LayoutType;

	return UIComponent.extend("cm.orgCodeMgt.Component", {
    
		metadata: {
			manifest: "json"
		}
	});
});
