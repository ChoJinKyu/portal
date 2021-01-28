sap.ui.define([
	"sap/ui/core/mvc/Controller",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        

		return Controller.extend("sp.se.supplierEvaluationSetupMgt.controller.Detail", {
			onInit: function () {
                this.getOwnerComponent().getModel("viewModel").setProperty("/App",{
                    layout : "OneColumn",
                    EditMode : false
                });
            }
		});
	});
