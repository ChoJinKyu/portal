sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("cm.organizationMgt.controller.App", {

		onInit : function () {
			// apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            this.setModel(new JSONModel({
                selectedTabKey: "Tenant",
                tenant_id: "",
                company_code: "",
                add: "",
            }), "view");
		}
	});

});