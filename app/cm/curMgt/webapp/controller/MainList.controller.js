sap.ui.define([
    "ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "./MainListPersoService",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/util/Multilingual",
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, Filter, FilterOperator, MainListPersoService,
     MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Multilingual) {
	"use strict";

	return BaseController.extend("cm.currencyMgt.controller.MainList", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
            // var oMultilingual = new Multilingual();
            // this.setModel(oMultilingual.getModel(), "I18N");
			var oViewModel,
                oResourceBundle = this.getResourceBundle();
            // var oMultilingual = new ext.lib.util.Multilingual();
            // this.setModel(oMultilingual.getModel(), "I18N");

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				headerExpanded: true,
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
			
			this.setModel(new ManagedListModel(), "list");
			
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            
            
			//this._doInitTablePerso();
        },
        
        onAfterRendering : function () {
			//this.byId("pageSearchButton").firePress();
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
		// onMainTablePersoButtonPressed: function(oEvent){
		// 	this._oTPC.openDialog();
		// },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		// onMainTablePersoRefresh : function() {
		// 	MainListPersoService.resetPersData();
		// 	this._oTPC.refresh();
		// },

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: "new",
				currencyCode: "code"
			});
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
				var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
                var oViewModel = this.getModel("editMode");
            if(oViewModel.getProperty("/editMode") === "edit"){
                sap.m.MessageToast.show("수정을 완료해 주세요.");
            }
            else
            {
                this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				currencyCode: oRecord.currency_code
                });

                if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                    this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
                }

                var oItem = oEvent.getSource();
                oItem.setNavigated(true);
                var oParent = oItem.getParent();
                // store index of the item clicked, which can be used later in the columnResize event
                this.iIndex = oParent.indexOfItem(oItem);
            }
                
			
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onRoutedThisPage: function(){
            this.getModel("mainListView").setProperty("/headerExpanded", true);
            //this.byId("pageSearchButton").firePress();
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
		_applySearch: function(aSearchFilters) {
			var oView = this.getView(),
				oModel = this.getModel("list");
			oView.setBusy(true);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/CurrencyView", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
            });
            this.getView().byId("mainTable").getBinding("items").filter(aSearchFilters, "Application");
            // this.getView().byId("mainTable").getBinding("items").getModel("list");
		},
        
        /**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter} aSearchFilters An array of filters for the search
		 * @private
		 */
		_getSearchStates: function(){
			var sChain = this.getView().byId("searchChain").getSelectedKey(),
				sKeyword = this.getView().byId("searchKeyword").getValue();
			// 	sUsage = this.getView().byId("searchUsageSegmentButton").getSelectedKey();
			
            var aSearchFilters = [];
			if (sChain && sChain.length > 0) {
                var vChain = (sChain === "true")?true:false;
				aSearchFilters.push(new Filter("use_flag", FilterOperator.EQ, vChain));
			}
			if (sKeyword && sKeyword.length > 0) {
				aSearchFilters.push(new Filter({
					filters: [
						new Filter("currency_code", FilterOperator.Contains, sKeyword)
					],
					and: false
				}));
			}
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "currencyMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});