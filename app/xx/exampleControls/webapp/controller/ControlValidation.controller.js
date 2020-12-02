sap.ui.define([
	"./Empty.controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var oMessageManager;

	return Controller.extend("xx.exampleControls.controller.ControlValidation", {

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
				currency: 102485361.56,
				list: [{
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}, {
					value1: null,
					value2: null,
					value3: null,
					value4: null,
				}]
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