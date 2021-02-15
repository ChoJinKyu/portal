sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
    "sap/m/library",
	"ext/lib/util/Multilingual",
    "ext/lib/util/SppUserSessionUtil"
], function (Controller, UIComponent, Fragment, mobileLibrary, Multilingual, SppUserSessionUtil) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("ext.lib.controller.BaseController", {

		enableMessagePopover: function(oEventName){
			// sap.ui.getCore().attachValidationError(function (oEvent) {
			// 	debugger;
			// 	oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			// });
			// sap.ui.getCore().attachValidationSuccess(function (oEvent) {
			// 	debugger;
			// 	oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
            // });
            
            var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
            
			this.oMessageManager = sap.ui.getCore().getMessageManager();
            this.getView().setModel(this.oMessageManager.getMessageModel(),  "message");
            this.oMessageManager.registerObject(this.getView(), false);

            // oEventName = oEventName || "onMessagePopoverPress";
            // this[oEventName] = function(oEvent){
            //     var oSource = oEvent.getSource();
            //     this._getMessagePopover(function(oPopover){
            //         oPopover.openBy(oSource);
            //     });
            // }.bind(this);
		},
		
        onMessagePopoverPress : function (oEvent) {
			var oSource = oEvent.getSource();
            this._getMessagePopover(function(oPopover){
				oPopover.toggle(oSource);
			});
        },
		
        _getMessagePopover : function (oHandler) {
            if (!this._oMessagePopover) {
				Fragment.load({
					id: this.getView().getId(),
					name: "ext.lib.view.MessagePopover",
					controller: this.getView()
				}).then(function(oFragment){
                    this.getView().addDependent(oFragment);
                    this._oMessagePopover = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
            }else{
				if(oHandler) oHandler(this._oMessagePopover);
			}
		},
		


		/**
		 * @public
		 */
		onAfterRendering: function(){
            if(this._nRenderedFirstRun == undefined) this._nRenderedFirstRun = 0;
			if(!!this.onRenderedFirst && this._nRenderedFirstRun++ === 0){
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
        })(),

        getMultilingual: function(){
            if(!this.oMultilingual)
                this.oMultilingual = new Multilingual();
            return this.oMultilingual;
        },
        
        isValNull: function (p_val) {
            if(!p_val || p_val == "" || p_val == null){
                return true
            }else{
                return false;
            }
        },

        getSessionUserInfo: function(){
            return SppUserSessionUtil.getUserInfo();
        },

        getSessionUserId: function(){
            return SppUserSessionUtil.getUserId();
        },

        getSessionTenantId: function(){
            return SppUserSessionUtil.getTenantId();
        },

        getSessionLanguageCode: function(){
            return SppUserSessionUtil.getLanguageCode();
        },

        getSessionTimezoneCode: function(){
            return SppUserSessionUtil.getTimezoneCode();
        },

        getSessionDateFormatType: function(){
            return SppUserSessionUtil.getDateFormatType();
        },

        getSessionDigitsFormatType: function(){
            return SppUserSessionUtil.getDigitsFormatType();
        },

        getSessionCurrencyCode: function(){
            return SppUserSessionUtil.getCurrencyCode();
        }
        
	});
});