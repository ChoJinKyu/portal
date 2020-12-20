sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/TransactionManager",
	"ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
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
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Formatter, Validator, TablePersoController, MainListPersoService, 
		Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
	"use strict";

	// var oTransactionManager;

	return BaseController.extend("cm.msgMgt.controller.MainList", {

        formatter: Formatter,
        
        validator: new Validator(),

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");

			oMultilingual.attachEvent("ready", function(oEvent){
				var oi18nModel = oEvent.getParameter("model");
				this.addHistoryEntry({
					title: oi18nModel.getText("/MESSAGE_MANAGEMENT"),
					icon: "sap-icon://table-view",
					intent: "#Template-display"
				}, true);
			}.bind(this));

           //this._doInitTablePerso();
            this.enableMessagePopover();
        },
        
        onRenderedFirst : function () {
			this.byId("pageSearchButton").firePress();
        },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler when a page state changed
		 * @param {sap.ui.base.Event} oEvent the page stateChange event
		 * @public
		 */
		onPageStateChange: function(oEvent){
			debugger;
		},


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table updateFinished event
		 * @public
		 */
		onMainTableUpdateFinished : function (oEvent) {
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			//this._oTPC.openDialog();
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
			var forceSearch = function(){
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}.bind(this);
			
			if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM0003"), {
					title : this.getModel("I18N").getText("/SEARCH"),
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
            this.validator.clearValueState(this.byId("mainTable"));
		},

		onMainTableDeleteButtonPress: function(){
			var table = this.byId("mainTable"),
				model = this.getModel("list");
				// aItems = oTable.getSelectedItems(),
				// aIndices = [];
			// aItems.forEach(function(oItem){
			// 	aIndices.push(oModel.getProperty("/Message").indexOf(oItem.getBindingContext("list").getObject()));
			// });
			// aIndices = aIndices.sort(function(a, b){return b-a;});
			// aIndices.forEach(function(nIndex){
			// 	//oModel.removeRecord(nIndex);
			// 	oModel.markRemoved(nIndex);
			// });
            // oTable.removeSelections(true);
            // this.validator.clearValueState(this.byId("mainTable"));

            // var [tId, mName] = arguments;
            // var table = this.byId(oTable);
            // var model = this.getView().getModel(oModel);
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
        },
       
        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView(),
                table = this.byId("mainTable");
			
			// if(!oModel.isChanged()) {
			// 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
			// 	return;
            // }
            
            if(this.validator.validate(this.byId("mainTable")) !== true) return;

			MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oModel.submitChanges({
							success: function(oEvent){
								oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                                this.byId("pageSearchButton").firePress();
                                //table.clearSelection().removeSelections(true);
							}.bind(this)
						});
					};
				}.bind(this)
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
                    new Sorter("language_code", true)
				],
				success: function(oData){
                    this.validator.clearValueState(this.byId("mainTable"));
					oView.setBusy(false);
				}.bind(this)
			});
            // ,
			// 	sorters: [
			// 		new Sorter("chain_code"),
			// 		new Sorter("message_code"),
			// 		new Sorter("language_code", true)
			// 	]
			//oTransactionManager.setServiceModel(this.getModel());
		},
		
		_getSearchStates: function(){
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S",
				chain = this.getView().byId("searchChain"+sSurffix).getSelectedKey(),
				language = this.getView().byId("searchLanguage"+sSurffix).getSelectedKey(),
                keyword = this.getView().byId("searchKeyword"+sSurffix).getValue();
				
			var aTableSearchState = [];
			if (chain && chain.length > 0) {
				aTableSearchState.push(new Filter("chain_code", FilterOperator.EQ, chain));
			}
			if (language && language.length > 0) {
				aTableSearchState.push(new Filter("language_code", FilterOperator.EQ, language));
			}
			if (keyword && keyword.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						new Filter("tolower(message_code)", FilterOperator.Contains, "'" + keyword.toLowerCase().replace("'","''") + "'"),
						new Filter("tolower(message_contents)", FilterOperator.Contains, "'" + keyword.toLowerCase().replace("'","''") + "'")
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
				componentName: "cm.msgMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});