sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Multilingual, UIComponent, mobileLibrary, JSONModel) {
	"use strict";

    // shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("sp.sm.makerMasterList.controller.App", {

        onInit : function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
                
			// apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
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
		addHistoryEntry: function() {
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
					this.getOwnerComponent().getService("ShellUIService").then(function(oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
        },

        onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getOwnerComponent().getModel("fcl");

            var sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
			if (!sLayout) {
				var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
				sLayout = oNextUIState.layout;
			}

			// Update the layout of the FlexibleColumnLayout
			if (sLayout) {
				oModel.setProperty("/layout", sLayout);
            }
 
            if (this.sCurrentRouteName === "mainPage") { // last viewed route was master
                var oMainListView = this.oRouter.getView("sp.sm.makerMasterList.view.MainList");
                //var oMidViewObjectView = this.oRouter.getView("sp.sm.makerMasterList.view.MidViewObject");
                //var oMidCreateObjectView = this.oRouter.getView("sp.sm.makerMasterList.view.MidCreateObject");
                //this.getView().byId("fcl").removeBeginColumnPage(oMainListView);
                //this.getView().byId("fcl").removeMidColumnPage(oMidViewObjectView);
                
            }
        
            if (this.sCurrentRouteName === "midView") { // last viewed route was master
                var oMidObjectView = this.oRouter.getView("sp.sm.makerMasterList.view.MidObject");
                this.getView().byId("fcl").removeMidColumnPage(oMidObjectView);
                //
            }
            /* if (this.sCurrentRouteName === "midCreate")
            {
                var oMidCreateObjectView = this.oRouter.getView("sp.sm.makerMasterList.view.MidCreateObject");
                this.getView().byId("fcl").removeMidColumnPage(oMidCreateObjectView);
                // if (this.oRouter.getView("sp.sm.makerMasterList.view.MidModifyObject"))
                //     this.getView().byId("fcl").removeMidColumnPage(this.oRouter.getView("sp.sm.makerMasterList.view.MidModifyObject")) ;
                // if (this.oRouter.getView("sp.sm.makerMasterList.view.MidCreateObject"))
                //     this.getView().byId("fcl").removeMidColumnPage(this.oRouter.getView("sp.sm.makerMasterList.view.MidCreateObject")) ; 
            } */
        },
        
        onColumnResize: function(oEvent) {
            // This event is ideal to call scrollToIndex function of the Table
            var oMasterView = oEvent.getSource().getBeginColumnPages()[0];
			// if (oMasterView.getController().iIndex) {
			// 	var oTable = oMasterView.byId("productsTable");
			// 	oTable.scrollToIndex(oMasterView.getController().iIndex);
            // }
            
            var sLayout = this.getView().getModel("fcl").getProperty("/layout");
			if (sLayout !== 'TwoColumnsMidExpanded') {
				// var oTable = oMasterView.byId("productsTable");
				// oTable.scrollToIndex(0);
			}

		},

		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");

			this._updateUIElements();

			// Save the current route name
			this.sCurrentRouteName = sRouteName;
			this.sCurrentTenantId = oArguments.tenantId;
			this.sCurrentControlOptionCode = oArguments.supplier;
        },
        
        onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();
			// Replace the URL with the new layout if a navigation arrow was used
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.sCurrentRouteName, {
					layout: sLayout, 
					tenantId: this.sCurrentTenantId, 
					controlOptionCode: this.sCurrentControlOptionCode
				}, true);
			}
		},

		// Update the close/fullscreen buttons visibility
		_updateUIElements: function () {
			var oModel = this.getModel('fcl');
			var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
			oModel.setData(oUIState);
		},

		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});

});