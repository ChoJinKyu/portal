sap.ui.define([
	"ext/lib/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"ext/lib/model/ManagedListModel",
	"ext/lib/formatter/DateFormatter",
	"sap/m/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
	"sap/m/Text",
	"sap/m/Input",
	"sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/m/Label',
    'sap/m/Token',
    'sap/m/SearchField',
    "ext/lib/util/Validator"
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Label, Token, SearchField, Validator) {
	"use strict";

	return BaseController.extend("dp.md.detailSpecConfirm.controller.MainList", {

        dateFormatter: DateFormatter,
        
        validator: new Validator(),

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
            
            this._doInitSearch();
			
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedListModel(), "orgMap");
            this.setModel(new ManagedListModel(), "division");

			this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._doInitTablePerso();
            
            
        },
        
        onAfterRendering : function () {
			this.byId("pageSearchButton").firePress();
			return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            var companyRole = 'LGESL';
            var orgRole = 'A040';

            this.getView().setModel(this.getOwnerComponent().getModel());

            this.setDivision(companyRole);

            //접속자 법인 사업부로 바꿔줘야함
            this.getView().byId("searchCompanyS").setSelectedKeys(companyRole);
            this.getView().byId("searchCompanyE").setSelectedKeys(companyRole);
            this.getView().byId("searchDivisionS").setSelectedKeys(orgRole);
            this.getView().byId("searchDivisionE").setSelectedKeys(orgRole);

            /** Date */
            var today = new Date();
            
            this.getView().byId("searchDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            this.getView().byId("searchDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            this.getView().byId("searchDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        setDivision: function(companyCode){
            
            var filter = new Filter({
                            filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, 'L2600' ),
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

            this.getView().byId("searchDivisionS").bindItems(bindItemInfo);
            this.getView().byId("searchDivisionE").bindItems(bindItemInfo);
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
				moldId: "code"
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

                this.validator.validate( this.byId('pageSearchFormE'));
                if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

                var aSearchFilters = this._getSearchStates();
				this._applySearch(aSearchFilters);
			}
        },
        
        /**
		 * Event handler when item press of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onItemPress: function(oEvent){

            var oSelectedItem = oEvent.getParameter("listItem");

            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oSelectedItem.getBindingContext("list").getPath(),
				oRecord = this.getModel("list").getProperty(sPath);

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				moldId: oRecord.mold_id
			});

            if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
                this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            }

			oSelectedItem.setNavigated(true);
			var oParent = oSelectedItem.getParent();
			// store index of the item clicked, which can be used later in the columnResize event
			this.iIndex = oParent.indexOfItem(oSelectedItem);
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
            
            var self = this;
            var oModel = this.getModel('orgMap');
            oModel.setTransactionModel(this.getModel('purOrg'));
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
			oModel.read("/MoldMasterSpec", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S"
            
            var aCompany = this.getView().byId("searchCompany"+sSurffix).getSelectedKeys();
            var aDivision = this.getView().byId("searchDivision"+sSurffix).getSelectedKeys();

            var sDateFrom = this.getView().byId("searchDate"+sSurffix).getDateValue();
            var sDateTo = this.getView().byId("searchDate"+sSurffix).getSecondDateValue();

			var sModel = this.getView().byId("searchModel").getValue().trim();
            var	sPart = this.getView().byId("searchPart").getValue().trim();
            var	sFamilyPart = this.getView().byId("searchFamilyPart").getValue().trim();
            var	sRequester = this.getView().byId("searchRequester").getValue().trim();
            var	sStatus = this.getView().byId("searchStatus").getSelectedKey();
            
            var aSearchFilters = [];
            
            if(aCompany.length > 0){
                var _tempFilters = [];

                aCompany.forEach(function(item, idx, arr){
                    _tempFilters.push(new Filter("company_code", FilterOperator.EQ, item ));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if(aDivision.length > 0){
                var _tempFilters = [];

                aDivision.forEach(function(item, idx, arr){
                    _tempFilters.push(new Filter("org_code", FilterOperator.EQ, item ));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }


            if(sDateFrom || sDateFrom){
                var _tempFilters = [];

                _tempFilters.push(
                    new Filter({
                        path: "mold_spec_register_date",
                        operator: FilterOperator.BT,
                        value1: this.getFormatDate(sDateFrom),
                        value2: this.getFormatDate(sDateTo)
                    })
                );

                _tempFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, ''));
                _tempFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, null));

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            

			if (sModel) {
                aSearchFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sModel.toLowerCase().replace("'","''")+"'"));
            }
            
            if (sPart) {
				aSearchFilters.push(new Filter("tolower(mold_number)", FilterOperator.Contains, "'"+sPart.toLowerCase()+"'"));
            }
            
            if (sFamilyPart) {
				aSearchFilters.push(new Filter("tolower(family_part_numbers)", FilterOperator.Contains, "'"+sFamilyPart.toLowerCase()+"'"));
            }

            if(sRequester){
                aSearchFilters.push(new Filter("tolower(create_user_id)", FilterOperator.Contains, "'"+sRequester.toLowerCase()+"'"));
            }
            
            if (sStatus) {
				aSearchFilters.push(new Filter("mold_spec_status_code", FilterOperator.EQ, sStatus));
            }
            
			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "detailSpecConfirm",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        
        handleSelectionFinishComp: function(oEvent){

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var divisionFilters = [];

            if(params.selectedItems.length > 0){

                params.selectedItems.forEach(function(item, idx, arr){

                    divisionFilters.push(new Filter({
                                filters: [
                                    new Filter("tenant_id", FilterOperator.EQ, 'L2600' ),
                                    new Filter("company_code", FilterOperator.EQ, item.getKey() )
                                ],
                                and: true
                            }));
                });
            }else{
                divisionFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600' ));
            }

            var filter = new Filter({
                            filters: divisionFilters,
                            and: false
                        });
            
            var bindInfo = {
                    path: '/Divisions',
                    filters: filter,
                    template: new Item({
                    key: "{org_code}", text: "[{org_code}] {org_name}"
                    })
                };

            this.getView().byId("searchDivisionS").bindItems(bindInfo);
            this.getView().byId("searchDivisionE").bindItems(bindInfo);
        },

        handleSelectionFinishDiv: function(oEvent){
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var sIds = source.sId.split('--');
            var id = sIds[sIds.length-1];
            var idPreFix = id.substr(0, id.length-1);
            var selectedKeys = [];

            params.selectedItems.forEach(function(item, idx, arr){
                selectedKeys.push(item.getKey());
            });

            this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },

        onValueHelpRequested : function (oEvent) {

            var path = '';
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.md.detailSpecConfirm.view.ValueHelpDialogModel", this);

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

                var _filter = new Filter("tenant_id", FilterOperator.EQ, 'L2600' );
                
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

        onFilterBarSearch: function (oEvent) {
			
			var	aSelectionSet = oEvent.getParameter("selectionSet");
			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
            }, []);
            
            var _tempFilters = this.getFiltersFilterBar();

			aFilters.push(new Filter({
				filters: _tempFilters,
				and: false
            }));
            
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600' ));

			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
        },

        getFiltersFilterBar: function(){

            var sSearchQuery = this._oBasicSearchField.getValue();
            var _tempFilters = [];

            if(this._oValueHelpDialog.oRows.sPath.indexOf('/Models') > -1){
                // /Models
                _tempFilters.push(new Filter("tolower(model)", FilterOperator.Contains, "'"+sSearchQuery.toLowerCase().replace("'","''")+"'"));

            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/PartNumbers') > -1){
                //PartNumbers
                _tempFilters.push(new Filter({ path: "tolower(mold_number)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(mold_item_type_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(spec_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }else if(this._oValueHelpDialog.oRows.sPath.indexOf('/CreateUsers') > -1){
                _tempFilters.push(new Filter({ path: "tolower(create_user_name)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
                _tempFilters.push(new Filter({ path: "tolower(create_user_id)", operator: FilterOperator.Contains, value1: "'"+sSearchQuery.toLowerCase()+"'" }));
            }

            return _tempFilters;
        },
        
        _filterTable: function (oFilter) {
			var oValueHelpDialog = this._oValueHelpDialog;

			oValueHelpDialog.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}

				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				oValueHelpDialog.update();
			});
		},
        
        getFormatDate: function (date){
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        }

	});
});