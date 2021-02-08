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
                plant = this.getView().byId("searchPlant" + sSurffix).getSelectedKeys(),
                requestFromDate = this.getView().byId("searchRequestDate" + sSurffix).getDateValue(),
                requestToDate = this.getView().byId("searchRequestDate" + sSurffix).getSecondDateValue(),
                status = this.getView().byId("searchRequestStatus" + sSurffix).getSelectedKey(),
                ecoNumber = this.getView().byId("searchEcoNumber").getValue(),
                description = this.getView().byId("searchDescription").getValue(),
                repairType = this.getView().byId("searchRepairType").getSelectedKey(),
                model = this.getView().byId("searchModel").getValue(),
                moldNo = this.getView().byId("searchPart").getValue(),
                assetNo = this.getView().byId("searchAssetNo").getValue(),
                requester = this.getView().byId("searchRequester").getValue()
                ;

            var aTableSearchState = [];
            var companyFilters = [];
            var plantFilters = [];

            //aTableSearchState.push(new Filter("mold_purchasing_type_code", FilterOperator.EQ, "L"));

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

            if (plant.length > 0) {

                plant.forEach(function (item) {
                    plantFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: plantFilters,
                        and: false
                    })
                );
            }

            if (requestFromDate || requestToDate) {
                aTableSearchState.push(new Filter("repair_request_date", FilterOperator.BT, requestFromDate, requestToDate));
            }
            if (status) {
                aTableSearchState.push(new Filter("repair_progress_status_code", FilterOperator.EQ, status));
            }
            
            if (ecoNumber && ecoNumber.length > 0) {
                aTableSearchState.push(new Filter("tolower(eco_number)", FilterOperator.Contains, "'" + ecoNumber.toLowerCase() + "'"));
            }
            if (description && description.length > 0) {
                aTableSearchState.push(new Filter("tolower(class_desc)", FilterOperator.Contains, "'" + description.toLowerCase() + "'"));
            }
            if(repairType.length > 0){
                aTableSearchState.push(new Filter("repair_type_code", FilterOperator.EQ, repairType));
            }
            if (model && model.length > 0) {
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.Contains, "'" + model.toLowerCase() + "'"));
            }
            if (moldNo && moldNo.length > 0) {
                aTableSearchState.push(new Filter("mold_number", FilterOperator.Contains, moldNo.toUpperCase()));
            }
            if(assetNo.length > 0){
                var _assetNoFilters = [];
                assetNo.forEach(function(item){
                    _assetNoFilters.push(new Filter("asset_number", FilterOperator.EQ, item ));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: _assetNoFilters,
                        and: false
                    })
                );
            }
            if (requester && requester.length > 0) {
                aTableSearchState.push(new Filter("tolower(create_user_id)", FilterOperator.Contains, "'" + requester.toLowerCase() + "'"));
            }
            return aTableSearchState;
		},

        onValueHelpRequested: function (oEvent) {

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.md.remodelRepairMgt.view.ValueHelpDialogModel", this);

            this._oBasicSearchField = new SearchField({
                showSearchButton: false
            });

            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this.setValuHelpDialog(oEvent);

            var aCols = this.oColModel.getData().cols;

            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                var _filter = new Filter("tenant_id", FilterOperator.EQ, "L2101");

                oTable.setModel(this.getOwnerComponent().getModel(this.modelName));
                oTable.setModel(this.oColModel, "columns");

                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", this.vhdPath);
                    oTable.getBinding("rows").filter(_filter);
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", this.vhdPath, function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                     oTable.getBinding("items").filter(_filter);
                }
                this._oValueHelpDialog.update();

            }.bind(this));



            // debugger

            var oToken = new Token();
            oToken.setKey(this._oInputModel.getSelectedKey());
            oToken.setText(this._oInputModel.getValue());
            this._oValueHelpDialog.setTokens([oToken]);
            this._oValueHelpDialog.open();


        },

        setValuHelpDialog: function(oEvent){

            if(oEvent.getSource().sId.indexOf("searchModel") > -1){
                //model
                this._oInputModel = this.getView().byId("searchModel");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Model",
                            "template": "model"
                        }
                    ]
                });

                this.modelName = '';
                this.vhdPath = '/Models';
                
                this._oValueHelpDialog.setTitle('Model');
                this._oValueHelpDialog.setKey('model');
                this._oValueHelpDialog.setDescriptionKey('model');

            }else if(oEvent.getSource().sId.indexOf("searchPart") > -1){
                //part
                this._oInputModel = this.getView().byId("searchPart");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Part No",
                            "template": "mold_number"
                        },
                        {
                            "label": "Item Type",
                            "template": "mold_item_type_name"
                        },
                        {
                            "label": "Description",
                            "template": "spec_name"
                        }
                    ]
                });

                this.modelName = '';
                this.vhdPath = "/PartNumbers";
                this._oValueHelpDialog.setTitle('Part No');
                this._oValueHelpDialog.setKey('mold_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');

            }else if(oEvent.getSource().sId.indexOf("searchRequester") > -1){

                this._oInputModel = this.getView().byId("searchRequester");

                this.oColModel = new JSONModel({
                    "cols": [
                        {
                            "label": "Name",
                            "template": "create_user_name"
                        },
                        {
                            "label": "ID",
                            "template": "create_user_id"
                        }
                    ]
                });

                this.modelName = 'dsc';
                this.vhdPath = '/CreateUsers';
                this._oValueHelpDialog.setTitle('Requester');
                this._oValueHelpDialog.setKey('create_user_id');
                this._oValueHelpDialog.setDescriptionKey('create_user_id');
            }
        },

        onValueHelpOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oInputModel.setSelectedKey(aTokens[0].getKey());
            this._oValueHelpDialog.close();
        },

        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
        },

        onValueHelpAfterClose: function () {
            this._oValueHelpDialog.destroy();
        },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
		onListMainTableEditButtonPress: function(){
			this._toEditMode();
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
            oModel.read("/RepairMstAssetView", {
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