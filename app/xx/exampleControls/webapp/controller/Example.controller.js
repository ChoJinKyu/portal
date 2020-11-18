sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var oMessageManager;

	return BaseController.extend("xx.exampleControls.controller.Example", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the home controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

			this.setModel(new JSONModel({
				currency: 102485361.56
			}), "form");

			sap.ui.getCore().attachValidationError(function (oEvent) {
				debugger;
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			});
	
			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				debugger;
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
			});

			oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(this.getView(), true);

		},


		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onNavigationBackPress: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("home", {}, true);
			}
		},

        onMessagePopoverPress : function (oEvent) {
            this._getMessagePopover().openBy(oEvent.getSource());
		},
		
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

        _getMessagePopover : function () {
            // create popover lazily (singleton)
            if (!this._oMessagePopover) {
                this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "xx.exampleControls.view.MessagePopover", this);
                this.getView().addDependent(this._oMessagePopover);
            }
            return this._oMessagePopover;
        }



	});
});