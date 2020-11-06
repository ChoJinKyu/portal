sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Fragment, MessageBox) {
	"use strict";

	return BaseController.extend("cm.messageMgr.controller.MainObject", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
			this.getRouter().getRoute("mainObject").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "mainObjectView");
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("mainList", {}, true);
			}
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onPageEditButtonPress: function(){
			this._toEditMode();
		},
		
		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function(){
			var oView = this.getView(),
				me = this,
				oMessageContents = this.byId("inputMessageContents");

			if(!oMessageContents.getValue()) {
				oMessageContents.setValueState(sap.ui.core.ValueState.Error);
				return;
			}
			MessageBox.confirm("Are you sure ?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oView.getModel().submitBatch("forUpdate").then(function(ok){
							me._toShowMode();
							oView.setBusy(false);
						});
					};
				}
			});

		},
		
		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function(){
			var oView = this.getView(),
				me = this;

			MessageBox.confirm("Are you sure to delete?", {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						me.getView().getBindingContext().delete('$direct').then(function () {
								me.onNavBack();
							}, function (oError) {
								MessageBox.error(oError.message);
							});
					};
				}
			});

		},
		
		
		/**
		 * Event handler for page edit cancel
		 * @public
		 */
        onPageCancelButtonPress: function(){
			this.byId("page").setProperty("showFooter", false);
            this._showFormFragment('MainObject_Show');
			this.byId("pageEditButton").setEnabled(true);
        },

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments"),
				sTenantId = oArgs.tenantId,
				sLanguageCode = oArgs.languageCode,
				sMessageCode = oArgs.messageCode;
			this._bindView("/Message(tenant_id='" + sTenantId + "',language_code='" + sLanguageCode + "',message_code='" + sMessageCode + "')");
			this._toShowMode();
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("mainObjectView");

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					"$$updateGroupId" : 'forUpdate'
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("mainObjectView"),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("mainObjectNotFound");
				return;
			}
			oView.getBindingContext().requestObject().then((function (oObject) {
				var sTenantId = oObject.tenant_id,
					sLanguageCode = oObject.language_code,
					sMessageCode = oObject.message_code;
				oViewModel.setProperty("/busy", false);
			}).bind(this));
		},

		_toEditMode: function(){
            this._showFormFragment('MainObject_Edit');
			this.byId("page").setProperty("showFooter", true);
			this.byId("pageEditButton").setEnabled(false);
		},

		_toShowMode: function(){
			this.byId("page").setProperty("showFooter", false);
            this._showFormFragment('MainObject_Show');
			this.byId("pageEditButton").setEnabled(true);
		},

		_oFragments: {},
		_showFormFragment : function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function(oFragment){
				oPageSubSection.removeAllBlocks();
				oPageSubSection.addBlock(oFragment);
			})
        },
        _loadFragment: function (sFragmentName, oHandler) {
			if(!this._oFragments[sFragmentName]){
				Fragment.load({
					id: this.getView().getId(),
					name: "cm.messageMgr.view." + sFragmentName,
					controller: this
				}).then(function(oFragment){
					this._oFragments[sFragmentName] = oFragment;
					if(oHandler) oHandler(oFragment);
				}.bind(this));
			}else{
				if(oHandler) oHandler(this._oFragments[sFragmentName]);
			}
		}


	});
});