sap.ui.define([
	"./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        

		return Controller.extend("sp.se.evalProgressList.controller.App", {
			onInit: function () {
                this.getOwnerComponent().getModel("viewModel").setProperty("/App",{
                    layout : "OneColumn",
                    btnScreen : "sap-icon://full-screen",
                    EditMode : false
                });
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            }
		});
	});