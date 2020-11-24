sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/I18nModel",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/Formatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
], function (BaseController, JSONModel, I18nModel, TransactionManager, ManagedListModel, Formatter, TablePersoController, MainListPersoService, 
		Filter, FilterOperator, Sorter,
		MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
	"use strict";

	// var oTransactionManager;

	return BaseController.extend("xx.templateListInlineEdit.controller.MainList", {

		formatter: Formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel, 
				oI18ndModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : "No data."
			});
			this.setModel(oViewModel, "mainListView");
			
			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
				
			this.setModel(new I18nModel(), "i18nd");
			this.setModel(new ManagedListModel(), "list");

			// oTransactionManager = new TransactionManager();
			// oTransactionManager.addDataModel(this.getModel("list"));

			this._doInitTablePerso();
        },
        
        onRenderedFirst : function () {
			this.getModel("i18nd")
				.setTransactionModel(this.getModel("util"))
				.attachEvent("loaded", function(oEvent){

				})
				//.load(this.getOwnerComponent().getManifestEntry("sap.app").id)
				.load("cm.templateListInlineEdit");
				
			this.byId("pageSearchButton").firePress();
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
			// update the mainList's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("mainListTableTitle");
			}
			this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var forceSearch = function(){
					var aTableSearchState = this._getSearchStates();
					this._applySearch(aTableSearchState);
				}.bind(this);
				
				if(this.getModel("list").isChanged() === true){
					MessageBox.confirm(this.getModel("i18nd").getText("/msgConfirmForceSearch"), {
						title : this.getModel("i18nd").getText("/lblConfirmation"),
						initialFocus : sap.m.MessageBox.Action.CANCEL,
						onClose : function(sButton) {
							if (sButton === MessageBox.Action.OK) {
								forceSearch();
							}
						}.bind(this)
					});
				}else{
					forceSearch();
				}
			}
		},

		onMainTableAddButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("list");
			oModel.addRecord({
				"tenant_id": "L2100",
				"chain_code": "CM",
				"language_code": "",
				"message_code": "",
				"message_type_code": "LBL",
				"message_contents": "",
				"local_create_dtm": new Date(),
				"local_update_dtm": new Date()
			}, "/Message", 0);
		},

		onMainTableDeleteButtonPress: function(){
			var oTable = this.byId("mainTable"),
				oModel = this.getModel("list"),
				aItems = oTable.getSelectedItems(),
				aIndices = [];
			aItems.forEach(function(oItem){
				aIndices.push(oModel.getProperty("/Message").indexOf(oItem.getBindingContext("list").getObject()));
			});
			aIndices = aIndices.sort(function(a, b){return b-a;});
			aIndices.forEach(function(nIndex){
				//oModel.removeRecord(nIndex);
				oModel.markRemoved(nIndex);
			});
			oTable.removeSelections(true);
		},
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
				oView = this.getView();
			
			if(!oModel.isChanged()) {
				MessageToast.show(this.getModel("i18nd").getText("/msgNoChanges"));
				return;
			}
			MessageBox.confirm(this.getModel("i18nd").getText("/msgConfirmSave?"), {
				title : this.getModel("i18nd").getText("/lblConfirmation"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oModel.submitChanges({
							success: function(oEvent){
								oView.setBusy(false);
								MessageToast.show("Success to save.");
							}
						});
						//oTransactionManager.submit({
						// 	success: function(oEvent){
						// 		oView.setBusy(false);
						// 		MessageToast.show("Success to save.");
						// 	}
						// });
					};
				}
			});
			
        }, 

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/Message", {
				filters: aTableSearchState,
				sorters: [
					new Sorter("chain_code"),
					new Sorter("message_code"),
					new Sorter("language_code", true),
					new Sorter("group_code")
				],
				success: function(oData){
					oView.setBusy(false);
				}
			});

			// oTransactionManager.setServiceModel(this.getModel());
		},
		
		_getSearchStates: function(){
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
				chain = this.getView().byId("searchChain"+sSurffix).getSelectedKey(),
				language = this.getView().byId("searchLanguage"+sSurffix).getSelectedKey(),
				group = this.getView().byId("searchGroup"+sSurffix).getValue(),
				keyword = this.getView().byId("searchKeyword"+sSurffix).getValue();
				
			var aTableSearchState = [];
			if (chain && chain.length > 0) {
				aTableSearchState.push(new Filter("chain_code", FilterOperator.EQ, chain));
			}
			if (group && group.length > 0) {
				aTableSearchState.push(new Filter("group_code", FilterOperator.Contains, group));
			}
			if (language && language.length > 0) {
				aTableSearchState.push(new Filter("language_code", FilterOperator.EQ, language));
			}
			if (keyword && keyword.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						new Filter("message_code", FilterOperator.Contains, keyword),
						new Filter("message_contents", FilterOperator.Contains, keyword)
					],
					and: false
				}));
			}
			return aTableSearchState;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "templateListInlineEdit",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});