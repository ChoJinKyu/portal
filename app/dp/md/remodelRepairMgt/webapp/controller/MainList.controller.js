sap.ui.define([
	"ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/util/ExcelUtil",
    "cm/util/control/ui/EmployeeDialog",
    "cm/util/control/ui/CmDialogHelp",
    "dp/md/util/controller/ProcessUI", 
    "./MainListPersoService",
    "sap/ui/base/ManagedObject",
    "sap/ui/core/routing/History",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/ui/table/Column",
    "sap/ui/table/Row",
    "sap/ui/table/TablePersoController",
    "sap/ui/core/Item",
    "sap/m/ComboBox",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ObjectIdentifier",
    'sap/m/SearchField',
    "sap/m/Text",
    "sap/m/Token"
], function (BaseController, DateFormatter, ManagedListModel, Multilingual, Validator, ExcelUtil, EmployeeDialog, CmDialogHelp, ProcessUI, MainListPersoService,
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item,
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token) {
    "use strict";

	return BaseController.extend("dp.md.remodelRepairMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        process : new ProcessUI(),

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
            //this._doInitTablePerso();
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
/*
            this._oTPC = new TablePersoController({
                customDataKey: "remodelRepairMgt",
                persoService: MainListPersoService
            }).setTable(this.byId("moldMstTable"));
*/
            this.process.setDrawProcessUI(this, "remodelRepairMgtProcessE", "B", 0);
            this.process.setDrawProcessUI(this, "remodelRepairMgtProcessS", "B", 0);
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
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                company = this.getView().byId("searchCompany" + sSurffix).getSelectedKeys(),
                division = this.getView().byId("searchDivision" + sSurffix).getSelectedKeys(),
                status = this.getView().byId("searchRequestStatus" + sSurffix).getSelectedKey(),
                //status = Element.registry.get(statusSelectedItemId).getText(),
                receiptFromDate = this.getView().byId("searchRequestDate" + sSurffix).getDateValue(),
                receiptToDate = this.getView().byId("searchRequestDate" + sSurffix).getSecondDateValue(),
                itemType = this.getView().byId("searchItemType").getSelectedKeys(),
                productionType = this.getView().byId("searchProductionType").getSelectedKeys(),
                eDType = this.getView().byId("searchEDType").getSelectedKey(),
                description = this.getView().byId("searchDescription").getValue(),
                model = this.getView().byId("searchModel").getValue(),
                moldNo = this.getView().byId("searchPart").getValue(),
                familyPartNo = this.getView().byId("searchFamilyPartNo").getValue();

            var aTableSearchState = [];
            var companyFilters = [];
            var divisionFilters = [];

            aTableSearchState.push(new Filter("mold_purchasing_type_code", FilterOperator.EQ, "L"));

            if (company.length > 0) {

                company.forEach(function (item) {
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }

            if (division.length > 0) {

                division.forEach(function (item) {
                    divisionFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: divisionFilters,
                        and: false
                    })
                );
            }

            if (receiptFromDate || receiptToDate) {
                aTableSearchState.push(new Filter("local_create_dtm", FilterOperator.BT, receiptFromDate, receiptToDate));
            }
            if (status) {
                aTableSearchState.push(new Filter("mold_progress_status_code", FilterOperator.EQ, status));
            }
            
            if(itemType.length > 0){

                var _itemTypeFilters = [];
                itemType.forEach(function(item){
                    _itemTypeFilters.push(new Filter("mold_item_type_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _itemTypeFilters,
                        and: false
                    })
                );
            }

            if(productionType.length > 0){

                var _productionTypeFilters = [];
                productionType.forEach(function(item){
                    _productionTypeFilters.push(new Filter("mold_production_type_code", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _productionTypeFilters,
                        and: false
                    })
                );
            }

            if (eDType && eDType.length > 0) {
                aTableSearchState.push(new Filter("mold_location_type_code", FilterOperator.EQ, eDType));
            }
            if (model && model.length > 0) {
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + model.toLowerCase() + "'"));
            }
            if (moldNo && moldNo.length > 0) {
                aTableSearchState.push(new Filter("mold_number", FilterOperator.Contains, moldNo.toUpperCase()));
            }
            if (description && description.length > 0) {
                aTableSearchState.push(new Filter("tolower(spec_name)", FilterOperator.Contains, "'" + description.toLowerCase() + "'"));
            }
            if (familyPartNo && familyPartNo.length > 0) {
                aTableSearchState.push(new Filter({
                    filters: [
                        new Filter("family_part_number_1", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_2", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_3", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_4", FilterOperator.Contains, familyPartNo.toUpperCase()),
                        new Filter("family_part_number_5", FilterOperator.Contains, familyPartNo.toUpperCase())
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
				componentName: "remodelRepairMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
		}


	});
});