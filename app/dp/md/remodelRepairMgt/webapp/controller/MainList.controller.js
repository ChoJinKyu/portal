sap.ui.define([
	"ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
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
], function (BaseController, DateFormatter, NumberFormatter, ManagedListModel, Multilingual, Validator, ExcelUtil, EmployeeDialog, CmDialogHelp, ProcessUI, MainListPersoService,
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item,
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token) {
    "use strict";

	return BaseController.extend("dp.md.remodelRepairMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

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

            this._doInitSearch();
			//this._doInitTable();
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
            this.process.setDrawProcessUI(this, "remodelRepairMgtProcessE", "B", 1);
            this.process.setDrawProcessUI(this, "remodelRepairMgtProcessS", "B", 1);
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

		onMainTableNewButtonPress : function () {
            this.getRouter().navTo("mainObject", {
                //layout: oNextUIState.layout,
                //tenantId: rowData.tenant_id,
                moldId: "new",
                orgCode: "new"
            });
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTableItemPress : function (oEvent) {
            var rowData = oEvent.getParameter('rowBindingContext').getObject();

            this.getRouter().navTo("mainObject", {
                //layout: oNextUIState.layout,
                //tenantId: rowData.tenant_id,
                moldId: rowData.mold_id,
                orgCode: rowData.org_code
            });
		},

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
            this.getView().setModel(this.getOwnerComponent().getModel());

            this.setDivision(this.getSessionUserInfo().COMPANY_CODE);//LGEKR

            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys([this.getSessionUserInfo().COMPANY_CODE]);
            this.getView().byId("searchCompanyE").setSelectedKeys([this.getSessionUserInfo().COMPANY_CODE]);
            this.getView().byId("searchPlantS").setSelectedKeys(['A040']);//CCZ', 'DHZ', 'PGZ
            this.getView().byId("searchPlantE").setSelectedKeys(['A040']);

            /** Create Date */
            var today = new Date();

            this.getView().byId("searchRequestDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchRequestDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90));
            this.getView().byId("searchRequestDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        setDivision: function (companyCode) {
            var filter = new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID),
                    new Filter("company_code", FilterOperator.EQ, companyCode)
                ],
                and: true
            });

            var bindItemInfo = {
                path: '/Divisions',
                filters: filter,
                template: new Item({
                    key: "{org_code}", text: "[{org_code}] {org_name}"
                })
            };
            this.getView().byId("searchPlantS").bindItems(bindItemInfo);
            this.getView().byId("searchPlantE").bindItems(bindItemInfo);
        },

        handleSelectionFinishComp: function (oEvent) {

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var plantFilters = [];

            if (params.selectedItems.length > 0) {

                params.selectedItems.forEach(function (item, idx, arr) {

                    plantFilters.push(new Filter({
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID),
                            new Filter("company_code", FilterOperator.EQ, item.getKey())
                        ],
                        and: true
                    }));
                }.bind(this));
            } else {
                plantFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, this.getSessionUserInfo().TENANT_ID)
                );
            }

            var filter = new Filter({
                filters: plantFilters,
                and: false
            });

            var bindInfo = {
                    path: '/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{org_code}", text: "[{org_code}] {org_name}"
                    })
                };

            this.getView().byId("searchPlantS").bindItems(bindInfo);
            this.getView().byId("searchPlantE").bindItems(bindInfo);
        },

        handleSelectionFinishDiv: function (oEvent) {
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function (oEvent) {
            var source = oEvent.getSource(),
                params = oEvent.getParameters();

            var sIds = source.sId.split('--'),
                id = sIds[sIds.length-1],
                idPreFix = id.substr(0, id.length - 1),
                selectedKeys = [];

            params.selectedItems.forEach(function (item, idx, arr) {
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix + 'S').setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix + 'E').setSelectedKeys(selectedKeys);
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
		},

		_getSearchStates: function(){
			var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S",
                company = this.getView().byId("searchCompany" + sSurffix).getSelectedKeys(),
                division = this.getView().byId("searchPlant" + sSurffix).getSelectedKeys(),
                status = this.getView().byId("searchRequestStatus" + sSurffix).getSelectedKey(),
                //status = Element.registry.get(statusSelectedItemId).getText(),
                receiptFromDate = this.getView().byId("searchRequestDate" + sSurffix).getDateValue(),
                receiptToDate = this.getView().byId("searchRequestDate" + sSurffix).getSecondDateValue(),
                itemType = this.getView().byId("searchItemType").getSelectedKeys(),
                //productionType = this.getView().byId("searchProductionType").getSelectedKeys(),
                //eDType = this.getView().byId("searchEDType").getSelectedKey(),
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
/*
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
            }*/
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
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/MoldMstView", {
                filters: aTableSearchState,
                success: function (oData) {
                    this.validator.clearValueState(this.byId("mainTable"));
                    oView.setBusy(false);
                }.bind(this)
            });
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