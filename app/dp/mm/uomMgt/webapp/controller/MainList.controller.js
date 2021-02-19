sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
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
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil) {
	"use strict";

	return BaseController.extend("dp.mm.uomMgt.controller.MainList", {

		dateFormatter: DateFormatter,

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
			var oViewModel,
				oResourceBundle = this.getResourceBundle();

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

			this._doInitTablePerso();
        },

        onRenderedFirst : function () {
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
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: "new",
				uomCode: "code"
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

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				uomCode: oRecord.uom_code
			});

            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            }

			var oItem = oEvent.getSource();
			oItem.setNavigated(true);
			var oParent = oItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oItem);
        },
        
        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "Unit Of Measure";
            var oData = this.getModel("list").getProperty("/Uom"); //binded Data
            // var oData = oTable.getModel().getProperty("/Uom");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
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
			oModel.read("/Uom", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){
            var sTenantId = "L2100",
                sUomClass = this.getView().byId("searchUomClass").getSelectedKey(),			
                // sUom = this.getView().byId("searchUom").getSelectedKey(),
			 	sBU = this.getView().byId("searchBUSegmentButton").getSelectedKey();
			
            var aSearchFilters = [];
            
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));

			if (sUomClass && sUomClass.length > 0) {
				aSearchFilters.push(new Filter("uom_class_code", FilterOperator.EQ, sUomClass));
            }
            // if (sUom && sUom.length > 0) {
			// 	aSearchFilters.push(new Filter("uom_code", FilterOperator.EQ, sUom));
            // }
            // if (sBU && sBU.length > 0) {
			// 	aSearchFilters.push(new Filter("base_unit_flag", FilterOperator.EQ, sBU));
			// }
			// if (sKeyword && sKeyword.length > 0) {
			// 	aSearchFilters.push(new Filter({
			// 		filters: [
			// 			new Filter("control_option_code", FilterOperator.Contains, sKeyword),
			// 			new Filter("control_option_name", FilterOperator.Contains, sKeyword)
			// 		],
			// 		and: false
			// 	}));
			// }
			if(sBU != "all"){
				switch (sBU) {					
					case "true":
					aSearchFilters.push(new Filter("base_unit_flag", FilterOperator.EQ, sBU));
					break;
					case "false":
					aSearchFilters.push(new Filter("base_unit_flag", FilterOperator.EQ, sBU));
					break;					
				}
            }
            
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "uomMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        
        onMainTableFilterPress: function() {
            this._MainTableApplyFilter();
        },

        _MainTableApplyFilter: function() {

            var oView = this.getView(),
				sValue = oView.byId("mainTableSearchField").getValue(),
				oFilter = new Filter("uom_code", FilterOperator.Contains, sValue);

			oView.byId("mainTable").getBinding("items").filter(oFilter, sap.ui.model.FilterType.Application);

        }


	});
});