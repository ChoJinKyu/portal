sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
	"ext/lib/model/ManagedListModel",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, Multilingual, ManagedListModel, JSONModel, DateFormatter, 
        TablePersoController, MainListPersoService, 
        Filter, FilterOperator, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("dp.pd.productActivityMgt.controller.MainList", {

		dateFormatter: DateFormatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
            console.log("onInit");
			var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");

			// oMultilingual.attachEvent("ready", function(oEvent){
			// 	var oi18nModel = oEvent.getParameter("model");
			// 	this.addHistoryEntry({
			// 		title: oi18nModel.getText("/CONTROL_OPTION_MANAGEMENT"),   //제어옵션관리
			// 		icon: "sap-icon://table-view",
			// 		intent: "#-display"
			// 	}, true);
			// }.bind(this));
			
			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

			//this._doInitTablePerso();
            //this.enableMessagePopover();
        },
		
        onRenderedFirst : function () {
            console.log("onRenderedFirst");
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
            console.log("onMainTableUpdateFinished");
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
			this.getModel("mainListViewModel").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
            console.log("onMainTablePersoButtonPressed");
		//	this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
            console.log("onMainTablePersoRefresh");
			// MainListPersoService.resetPersData();
			// this._oTPC.refresh();
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
            console.log("onMainTableAddButtonPress");
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: "new",
			// 	controlOptionCode: "code"
			// });
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
            console.log("onPageSearchButtonPress");
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
            console.log("onMainTableItemPress");
            MessageToast.show("상세 페이지 미구현");

			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			// 	sPath = oEvent.getParameters("rowIndices").rowContext.sPath,
            //     oRecord = this.getModel("list").getProperty(sPath);
                
            // console.log(oNextUIState.layout);
            // console.log(sPath);
            // console.log(oRecord.product_activity_code);

			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: oRecord.tenant_id,
			// 	controlOptionCode: oRecord.product_activity_code
			// }, true);

            
        },
        
        onCreateActivity : function(){
            MessageToast.show("Create 미구현");
        },

        onTableSort : function(){
            MessageToast.show("Sort 미구현");
        },

        onTableFilter : function(){
            MessageToast.show("Filter 미구현");
        },

        onTableSettings : function(){
            MessageToast.show("Settings 미구현");
        },

        onExportPress : function(){
            MessageToast.show("Export 미구현");
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
			this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
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
         //  console.log(oModel);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/PdProdActivityTemplateView", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
                }
            });
            oView.setBusy(false);
		},
		
		_getSearchStates: function(){
			var sProductActivityName = this.getView().byId("searchProductActivityName").getValue(),
				sDescription = this.getView().byId("searchDescription").getValue(),
				sStatus = this.getView().byId("searchStatusSegmentButton").getSelectedKey();
			
            var aSearchFilters = [];
            
			if (sProductActivityName) {
				aSearchFilters.push(new Filter("activity_name", FilterOperator.Contains, sProductActivityName));
            }
            
			if (sDescription) {
				aSearchFilters.push(new Filter("description", FilterOperator.Contains, sDescription));
            }
            
			if(sStatus !== "All"){
				switch (sStatus) {
					case "Active":
					    aSearchFilters.push(new Filter("active_flag", FilterOperator.EQ, "true"));
					    break;
					case "Inactive":
					    aSearchFilters.push(new Filter("active_flag", FilterOperator.EQ, "false"));
                        break;
				}
			}
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "productActivityMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});