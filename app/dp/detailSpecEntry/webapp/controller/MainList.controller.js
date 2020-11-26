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
    'sap/m/Token'
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, Label, Token) {
	"use strict";

	return BaseController.extend("dp.detailSpecEntry.controller.MainList", {

		dateFormatter: DateFormatter,

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
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

            this.getView().setModel(this.getOwnerComponent().getModel());

            /** Date */
            var today = new Date();
            
            this.getView().byId("searchDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            this.getView().byId("searchDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            this.getView().byId("searchDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
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
				moldId: oRecord.mold_id
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
            // oModel.read("/Pur_Org_Type_Mapping", {
            //     filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //         new Filter("process_type_code", FilterOperator.EQ, 'DP05') //금형 DP05
            //     ],
            //     success: function(oData){

            //         var oModelDiv = self.getModel('division');
            //         oModelDiv.setTransactionModel(self.getModel('purOrg'));
            //         oModelDiv.read("/Pur_Operation_Org", {
            //             filters: [
            //                 new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //                 new Filter("org_type_code", FilterOperator.EQ, oData.results[0].org_type_code)
            //             ],
            //             sorters: [
            //                 new Sorter("org_code", false)
            //             ],
            //             success: function(oData){
                            
            //             }
            //         });
            //     }
            // });
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
            
            var aCompany = this.getView().byId("searchCompany"+sSurffix).getSelectedItems();

            var sDateFrom = this.getView().byId("searchDate"+sSurffix).getDateValue();
            var sDateTo = this.getView().byId("searchDate"+sSurffix).getSecondDateValue();

			var sModel = this.getView().byId("searchModel").getValue().trim();
            var	sPart = this.getView().byId("searchPart").getValue().trim();
            var	sFamilyPart = this.getView().byId("searchFamilyPart").getValue().trim();
            var	sStatus = this.getView().byId("searchStatus").getSelectedKey();
            
            var aSearchFilters = [];
            var companyFilters = [];
            
            if(aCompany.length > 0){

                aCompany.forEach(function(item, idx, arr){
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key ));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }

            var dateFilters = [];

            dateFilters.push(
                new Filter({
                    path: "mold_spec_register_date",
                    operator: FilterOperator.BT,
                    value1: this.getFormatDate(sDateFrom),
                    value2: this.getFormatDate(sDateTo)
                })
            );

            dateFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, ''));
            dateFilters.push(new Filter("mold_spec_register_date", FilterOperator.EQ, null));

            aSearchFilters.push(
                new Filter({
                    filters: dateFilters,
                    and: false
                })
            );

			if (sModel) {
				aSearchFilters.push(new Filter("model", FilterOperator.StartsWith, sModel));
            }
            
            if (sPart) {
				aSearchFilters.push(new Filter("part_number", FilterOperator.StartsWith, sPart));
            }
            
            if (sFamilyPart) {
				aSearchFilters.push(new Filter("family_part_numbers", FilterOperator.Contains, sFamilyPart));
            }
            
            if (sStatus) {
				aSearchFilters.push(new Filter("mold_spec_status_code", FilterOperator.EQ, sStatus));
            }
            
            console.log(aSearchFilters);

			return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// init and activate controller
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "detailSpecEntry",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },
        
        handleSelectionFinishComp: function(oEvent){

            this.copyMultiSelected(oEvent);

            var params = oEvent.getParameters();
            var selectedKeys = [];
            var divisionFilters = [];

            divisionFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100' ));

            params.selectedItems.forEach(function(item, idx, arr){
                selectedKeys.push(item.getKey());
                divisionFilters.push(new Filter("company_code", FilterOperator.EQ, item.getKey() ));
            });

            var filter = new Filter({
                            filters: divisionFilters,
                            and: true
                        });

            this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
            this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function(oEvent){
            this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            var source = oEvent.getSource();
            var params = oEvent.getParameters();

            var id = source.sId.split('--')[1];
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
            this._oValueHelpDialog = sap.ui.xmlfragment("dp.detailSpecEntry.view.ValueHelpDialogModel", this);

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

                path = '/Models';
                
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
                            "template": "part_number"
                        },
                        {
                            "label": "Description",
                            "template": "spec_name"
                        }
                    ]
                });

                path = '/PartNumbers';

                this._oValueHelpDialog.setTitle('Part No');
                this._oValueHelpDialog.setKey('part_number');
                this._oValueHelpDialog.setDescriptionKey('spec_name');
            }

            var aCols = this.oColModel.getData().cols;

            console.log('this._oValueHelpDialog.getKey()',this._oValueHelpDialog.getKey());
            
            this.getView().addDependent(this._oValueHelpDialog);

            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                
                oTable.setModel(this.getOwnerComponent().getModel());
                oTable.setModel(this.oColModel, "columns");
                
                if (oTable.bindRows) {
                    oTable.bindAggregation("rows", path);
                }

                if (oTable.bindItems) {
                    oTable.bindAggregation("items", path, function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
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