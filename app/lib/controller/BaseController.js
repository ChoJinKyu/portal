sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/m/library"
], function (Controller, UIComponent, Fragment, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;
	var _nRenderedFirstRun = 0;
	var oMessageManager;

	return Controller.extend("ext.lib.controller.BaseController", {

		enableValidator: function(){
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
		
        onValidatorMessagePopoverPress : function (oEvent) {
			var oSource = oEvent.getSource();
            this._getValidatorMessagePopover(function(oPopover){
				oPopover.openBy(oSource);
			});
		},
		
        _getValidatorMessagePopover : function (oHandler) {
            if (!this._oValidatorMessagePopover) {
				Fragment.load({
					id: this.getView().getId(),
					name: "ext.lib.view.ValidatorMessagePopover",
					controller: this
				}).then(function(oFragment){
					this._oValidatorMessagePopover = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
            }else{
				if(oHandler) oHandler(this._oValidatorMessagePopover);
			}
		},
		


		/**
		 * @public
		 */
		onAfterRendering: function(){
			if(!!this.onRenderedFirst && _nRenderedFirstRun++ === 0){
				this.onRenderedFirst.call(this);
			}
		},
		
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress : function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		* Adds a history entry in the FLP page history
		* @public
		* @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		* @param {boolean} bReset If true resets the history before the new entry is added
		*/
		addHistoryEntry: (function() {
			var aHistoryEntries = [];

			return function(oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function(oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					// this.getOwnerComponent().getService("ShellUIService").then(function(oService) {
					// 	oService.setHierarchy(aHistoryEntries);
					// });
				}
			};
		})()

	
	});

});