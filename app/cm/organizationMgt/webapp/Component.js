sap.ui.define([
    "ext/lib/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("cm.organizationMgt.Component", {

		metadata : {
			manifest: "json"
        }
        // ,
        //  onInit: function () {
        //     this.setModel(new JSONModel({
        //         selectedTabKey: "",
        //         tenant_id: "",
        //         company_code: "",
        //         add: "",
        //     }), "view");
        // },

	});

});