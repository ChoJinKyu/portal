sap.ui.define([
	"./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        

		return Controller.extend("sp.sf.fundingStatusSup.controller.App", {
			onInit: function () {
                this.getOwnerComponent().getModel("viewModel").setProperty("/App",{
                    layout : "OneColumn",
                    EditMode : false
                });
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            }
		});
	});