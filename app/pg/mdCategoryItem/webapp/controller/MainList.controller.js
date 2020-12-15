sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
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
], function (BaseController, Multilingual, History, JSONModel, formatter, ManagedListModel, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
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
			
			var oMultilingual = new Multilingual();
			this.setModel(oMultilingual.getModel(), "I18N");
			this.setModel(new ManagedListModel(), "list");

			this._doInitTablePerso();
        },
        
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
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
		},

		onMainTableAddButtonPress: function(oEvent){
            var oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
            var oSelected = oTable.getSelectedContexts();
            /*
                1. 새로 추가된 row사이에 addRow시 rowIdx 밀리는 경우생김
                2. rowIdx 억지로 뜯어내는 법 말고 함수 없나
            */

            //var idx = parseInt(oTable.getSelectedContextPaths().split("/")[2])+1;
            var idx = 0 ;

            if(oSelected.length>0){
                idx = parseInt(oSelected[0].getPath().split("/")[2])+1;
            }

			oModel.addRecord({
				"tenant_id": "L2100",
				"company_code": "C100",
				"org_type_code": "BU",
				"org_code": "L210000000",
				"spmd_category_code": "C101",
				// "spmd_character_code": "T999",
				"spmd_character_code_name": "TEST",
				"spmd_character_desc": "TEST_DESC",
				// "spmd_character_type_code": "T",
				// "spmd_character_value_unit": "",
                "spmd_character_sort_seq": "10",
                "system_update_dtm": new Date(),
                // "local_create_dtm": new Date(),
                // "local_update_dtm": new Date()
            }, "/MdCategoryItem" , idx);     //, "/MdCategoryItem"
            
            oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(true);
            oTable.getAggregation('items')[idx].getCells()[4].getItems()[0].setVisible(false);
            oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setVisible(true);
        },
        

        onMainTableSaveButtonPress: function(){
			var oModel = this.getModel("list"),
                oView = this.getView();
			
			if(!oModel.isChanged()) {
				MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
				return;
			}
                
			MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
				title : this.getModel("I18N").getText("/SAVE"),
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : (function(sButton) {
					if (sButton === MessageBox.Action.OK) {
						oView.setBusy(true);
						oModel.submitChanges({
							success: function(oEvent){
								oView.setBusy(false);
                                MessageToast.show(this.getModel("I18N").getText("/NCM0005"));
                                this._refreshSearch();
							}.bind(this)
						});
					}
                }).bind(this)
			})
			
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
			oModel.read("/MdCategoryItem", {
				filters: aTableSearchState,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
        
		_refreshSearch: function() {
			var oView = this.getView(),
                oTable = this.byId("mainTable"),
                oModel = this.getModel("list");
            oView.setBusy(true);
            
			oModel.setTransactionModel(this.getModel());
			oModel.read("/MdCategoryItem", {
				success: function(oData){
					oView.setBusy(false);
				}
            });
            var idx = 0 ;
            oTable.getAggregation('items')[idx].getCells()[1].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[idx].getCells()[1].getItems()[1].setVisible(false);
            oTable.getAggregation('items')[idx].getCells()[2].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[idx].getCells()[2].getItems()[1].setVisible(false);
            oTable.getAggregation('items')[idx].getCells()[4].getItems()[0].setVisible(true);
            oTable.getAggregation('items')[idx].getCells()[4].getItems()[1].setVisible(false);
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
				componentName: "mdCategoryItem",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        }
	});
});