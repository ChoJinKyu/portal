sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"ext/lib/model/ManagedListModel",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
	"sap/ui/core/Item",
], function (BaseController, History, JSONModel, formatter, ManagedListModel, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";

	return BaseController.extend("pg.mdCategory.controller.MainList", {

        formatter: formatter,
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
        
		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {

            var oViewModel,
				oResourceBundle = this.getResourceBundle();

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				mainListTableTitle : oResourceBundle.getText("mainListTableTitle"),
				tableNoDataText : oResourceBundle.getText("tableNoDataText")
            });
            1
			this.setModel(oViewModel, "mainListView");

			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
			}, true);
			
			this.setModel(new ManagedListModel(), "list");

			this._doInitTablePerso();
        },
        
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
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
			// // update the mainList's object counter after the table update
			// var sTitle,
			// 	oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");
			// // only update the counter if the length is final and
			// // the table is not empty
			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			// } else {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitle");
			// }
			// this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
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
			// if (oEvent.getParameters().refreshButtonPressed) {
			// 	// Search field's 'refresh' button has been pressed.
			// 	// This is visible if you select any master list item.
			// 	// In this case no new search is triggered, we only
			// 	// refresh the list binding.
			// 	this.onRefresh();
			// } else {
			// 	var aTableSearchState = this._getSearchStates();
			// 	this._applySearch(aTableSearchState);
            // }
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
		},

		onMainTableAddButtonPress: function(oEvent){
            // var oTable = this.byId("mainTable"),
			// 	oModel = this.getModel("list");
			// oModel.addRecord({
			// 	"tenant_id": "L2100",
			// 	"chain_code": "CM",
			// 	"language_code": "",
			// 	"message_code": "",
			// 	"message_type_code": "LBL",
			// 	"message_contents": "",
			// 	"local_create_dtm": new Date(),
            //     "local_update_dtm": new Date()
            // }, 0);
            
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[1].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[2].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[2].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[3].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[3].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[4].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[4].getItems()[1].setVisible(true);
            // oTable.getAggregation('items')[0].getCells()[5].getItems()[0].setVisible(false);
            // oTable.getAggregation('items')[0].getCells()[5].getItems()[1].setVisible(true);
            
		},
        onMainTableSaveButtonPress: function(){
			// var oModel = this.getModel("list"),
			// 	oView = this.getView();
			
			// MessageBox.confirm("Are you sure ?", {
			// 	title : "Comfirmation",
			// 	initialFocus : sap.m.MessageBox.Action.CANCEL,
			// 	onClose : function(sButton) {
			// 		if (sButton === MessageBox.Action.OK) {
			// 			oView.setBusy(true);
			// 			oModel.submitChanges({
			// 				success: function(oEvent){
			// 					oView.setBusy(false);
			// 					MessageToast.show("Success to save.");
			// 				}
			// 			});
			// 		};
			// 	}
			// });
			
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
            debugger;
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MdCategoryItem", {
				filters: aTableSearchState,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){
			var keyword = this.getView().byId("searchKeyword").getValue();
                
            
			var aTableSearchState = [];
			if (keyword && keyword.length > 0) {
				aTableSearchState.push(new Filter({
					filters: [
						// new Filter("md_category_item_code", FilterOperator.Contains, keyword),
						new Filter("spmd_character_code_name", FilterOperator.Contains, keyword)
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
				componentName: "mdCategory",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        }
	});
});