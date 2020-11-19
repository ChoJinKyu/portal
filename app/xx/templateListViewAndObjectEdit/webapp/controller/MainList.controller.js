sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/model/json/JSONModel",
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
], function (BaseController, JSONModel, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
	"use strict";

	return BaseController.extend("xx.templateListViewAndObjectEdit.controller.MainList", {

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
			this.setModel(oViewModel, "mainListView");

			// Add the mainList page to the flp routing history
			this.addHistoryEntry({
				title: oResourceBundle.getText("mainListViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#Template-display"
            }, true);

			this._doInitTable();
			this._doInitTablePerso();
        },
        
        onAfterRendering : function () {
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
		onListMainTableUpdateFinished : function (oEvent) {
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

		onListMainTablePersoButtonPressed: function(oEvent){
			this._oTPC.openDialog();
		},

		onListMainTablePersoRefresh : function() {
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
		},

		onListMainTableFilterPress: function(oEvent){
			var oTableFilterState = [],
				sQuery = oEvent.getParameter("query");

			if (sQuery && sQuery.length > 0) {
				oTableFilterState = [
					new Filter({
						filters: [
							new Filter("message_code", FilterOperator.Contains, sQuery),
							new Filter("message_contents", FilterOperator.Contains, sQuery)
						],
						and: false
					})
				];
			}

			this.getView().byId("mainTable").getBinding("items").filter(oTableFilterState, "Application");
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onListMainTableItemPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showMainObject(oEvent.getSource());
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
				var aTableSearchState = this._getSearchStates();
				this._applySearch(aTableSearchState);
			}
		},

		_getSearchStates: function(){
			var chain = this.getView().byId("searchChainS").getSelectedKey(),
				language = this.getView().byId("searchLanguageS").getSelectedKey(),
				keyword = this.getView().byId("searchKeywordS").getValue();
				
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
						new Filter("message_code", FilterOperator.Contains, keyword),
						new Filter("message_contents", FilterOperator.Contains, keyword)
					],
					and: false
				}));
			}
			return aTableSearchState;
		},

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onListMainTableEditButtonPress: function(){
			this._toEditMode();
		},

       
        onListMainTableAddtButtonPress: function(){
			var oTable = this.byId("mainTable"),
                oBinding = oTable.getBinding("items");

            var oContext = oBinding.create({
                "tenant_id": "L2100",
                "chain_code": "CM",
                "language_code": "",
                "message_code": "",
                "message_type_code": "",
                "message_contents": "",
                "local_create_dtm": "2020-10-13T00:00:00Z",
                "local_update_dtm": "2020-10-13T00:00:00Z"
            });

            oContext.created().then(function (oEvent) {
                oTable.refresh();
                MessageToast.show("Success to create.");
            }).catch(function(oEvent){
                MessageBox.error("Error while creating.");
            });
		},
        
		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefreshPress : function () {
			var oTable = this.byId("mainTable");
			oTable.getBinding("items").refresh();
		},


		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showMainObject : function (oItem) {
			var that = this;
			that.getRouter().navTo("mainObject", {
				tenantId: oItem.getBindingContext().getProperty("tenant_id"),
				messageCode: oItem.getBindingContext().getProperty("message_code"),
				languageCode: oItem.getBindingContext().getProperty("language_code")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("mainTable"),
				oViewModel = this.getModel("mainListView");

			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("mainListNoDataWithSearchText"));
			}
		},

		_doInitTable: function(){

			this.oReadOnlyTemplate = new ColumnListItem({
				cells: [
					new ObjectIdentifier({
						text: "{chain_code}"
					}), new ObjectIdentifier({
						text: "{language_code}"
					}), new ObjectIdentifier({
						text: "{message_code}"
					}), new Text({
						text: "{message_contents}", hAlign: "Right"
					}), new Text({
						text: "{message_type_code}", hAlign: "Right"
					})
				],
				type: sap.m.ListType.Navigation
			});
			this.oReadOnlyTemplate.attachPress(this.onListMainTableItemPress.bind(this));

			var aFilters = this._getSearchStates();
			this.byId("mainTable").bindItems({
				path: "/Message",
				filters: aFilters,
				template: this.oReadOnlyTemplate,
				templateShareable: true,
				key: "message_code"
			}).setKeyboardMode("Navigation");
		},

		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "templateListViewAndObjectEdit",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});