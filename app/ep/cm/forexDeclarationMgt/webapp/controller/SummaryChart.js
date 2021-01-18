sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (BaseController, Controller, MessageToast) {
    "use strict";

    return BaseController.extend("ep.cm.forexDeclarationMgt.controller.SummaryChart", {
    
    


		press: function (oEvent) {
			MessageToast.show("The interactive bar chart is pressed.");
		},

		selectionChanged: function (oEvent) {
			var oBar = oEvent.getParameter("bar");
			MessageToast.show("The selection changed: " + oBar.getLabel() + " " + ((oBar.getSelected()) ? "selected" : "deselected"));
		}

	});
});