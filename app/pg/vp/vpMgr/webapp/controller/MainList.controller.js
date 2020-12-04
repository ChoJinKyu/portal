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
    'sap/ui/core/Fragment',    
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/m/ColumnListItem",
	"sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",    
	"sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",    
    "sap/ui/core/Item",
    'sap/m/Label',    
    'sap/m/SearchField',    
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
    "use strict";
    
    var dialogId = "";
    
	return BaseController.extend("vp.vpMgr.controller.MainList", {

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

			// this._doInitTablePerso();
        },
        
        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
		_doInitSearch: function(){
            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

            // this.getView().setModel(this.getOwnerComponent().getModel());

            // /** Date */
            // var today = new Date();
            
            // this.getView().byId("searchDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            // this.getView().byId("searchDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

         /**
         * @public
         * @see 사용처 DialogCreate Fragment Open 이벤트
         */

         onDialogCreate: function (){
            var oView = this.getView();

			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "vp.vpMgr.view.DialogCreate",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					return oDialog;
				});
			} 
			this.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		
        },

        createPopupClose: function (oEvent){
            console.log(oEvent);
            this.byId("ceateVpCategory").close();
        },        

        onAfterRendering : function () {
			// this.byId("pageSearchButton").firePress();
			// return;
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
			// var sTitle,
			// 	oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");
			// // only update the counter if the length is final and
			// // the table is not empty
			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
			// } else {
			// 	sTitle = this.getResourceBundle().getText("mainListTableTitle");
			// }
			// this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){
			// this._oTPC.openDialog();
		},

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoRefresh : function() {
			// MainListPersoService.resetPersData();
			// this._oTPC.refresh();
		},

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableAddButtonPress: function(){
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: "new",
			// 	moldId: "code"
			// });
		},

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onPageSearchButtonPress : function (oEvent) {
			// if (oEvent.getParameters().refreshButtonPressed) {
			// 	// Search field's 'refresh' button has been pressed.
			// 	// This is visible if you select any master list item.
			// 	// In this case no new search is triggered, we only
			// 	// refresh the list binding.
			// 	this.onRefresh();
			// } else {
                 var aSearchFilters = this._getSearchStates();
				 this._applySearch(aSearchFilters);
			// }
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
			// var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			// 	sPath = oEvent.getSource().getBindingContext("list").getPath(),
			// 	oRecord = this.getModel("list").getProperty(sPath);

			// this.getRouter().navTo("midPage", {
			// 	layout: oNextUIState.layout, 
			// 	tenantId: oRecord.tenant_id,
			// 	moldId: oRecord.mold_id
			// });

            // if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
            //     this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            // }

			// var oItem = oEvent.getSource();
			// oItem.setNavigated(true);
			// var oParent = oItem.getParent();
			// // store index of the item clicked, which can be used later in the columnResize event
			// this.iIndex = oParent.indexOfItem(oItem);
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
            // this.getModel("mainListView").setProperty("/headerExpanded", true);
            
            // var self = this;
            // var oModel = this.getModel('orgMap');
            // oModel.setTransactionModel(this.getModel('purOrg'));
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
			oModel.read("/vPSearchView", {
				filters: aSearchFilters,
				success: function(oData){
					oView.setBusy(false);
				}
			});
		},
		
		_getSearchStates: function(){

            // var sVpLv = this.getView().byId("search_Vp_lv").getSelectedKey(),
            // sVpCode = this.getView().byId("search_Vp_Code").getValue();

            var aSearchFilters = [];
			// if (sVpLv && sVpLv.length > 0) {
			// 	aSearchFilters.push(new Filter("hierarchy_level", FilterOperator.EQ, sVpLv));
			// }
			// if (sVpCode && sVpCode.length > 0) {
			// 	aSearchFilters.push(new Filter({
			// 		filters: [
			// 			new Filter("vendor_pool_code", FilterOperator.Contains, sVpCode)
			// 		],
			// 		and: false
			// 	}));
			// }
			return aSearchFilters;

            // alert("aSearchFilters : " + aSearchFilters);

            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S"
            
            // var aCompany = this.getView().byId("searchCompany"+sSurffix).getSelectedItems();

            // var sDateFrom = this.getView().byId("searchDate"+sSurffix).getDateValue();
            // var sDateTo = this.getView().byId("searchDate"+sSurffix).getSecondDateValue();

			// var sModel = this.getView().byId("searchModel").getValue().trim();
            // var	sPart = this.getView().byId("searchPart").getValue().trim();
            // var	sFamilyPart = this.getView().byId("searchFamilyPart").getValue().trim();
            // var	sStatus = this.getView().byId("searchStatus").getSelectedKey();
            
            // var aSearchFilters = [];
            // var companyFilters = [];
            
            // if(aCompany.length > 0){

            //     aCompany.forEach(function(item, idx, arr){
            //         companyFilters.push(new Filter("company_code", FilterOperator.EQ, item.mProperties.key ));
            //     });

            //     aSearchFilters.push(
            //         new Filter({
            //             filters: companyFilters,
            //             and: false
            //         })
            //     );
            // }

            // var dateFilters = [];

            // if (sDateFrom) {
			// 	dateFilters.push(new Filter("local_update_dtm", FilterOperator.GE, sDateFrom));
            // }

            // if (sDateTo) {
			// 	dateFilters.push(new Filter("local_update_dtm", FilterOperator.LE, sDateTo));
            // }

            // if(dateFilters.length > 0){
            //     aSearchFilters.push(
            //         new Filter({
            //             filters: dateFilters,
            //             and: true
            //         })
            //     );
            // }

			// if (sModel) {
			// 	aSearchFilters.push(new Filter("model", FilterOperator.StartsWith, sModel));
            // }
            
            // if (sPart) {
			// 	aSearchFilters.push(new Filter("part_number", FilterOperator.StartsWith, sPart));
            // }
            
            // if (sFamilyPart) {
			// 	aSearchFilters.push(new Filter("family_part_numbers", FilterOperator.Contains, sFamilyPart));
            // }
            
            // if (sStatus) {
			// 	aSearchFilters.push(new Filter("mold_spec_status_code", FilterOperator.EQ, sStatus));
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
			// if(sUsage != "all"){
			// 	switch (sUsage) {
			// 		case "site":
			// 		aSearchFilters.push(new Filter("site_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "company":
			// 		aSearchFilters.push(new Filter("company_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "org":
			// 		aSearchFilters.push(new Filter("organization_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 		case "user":
			// 		aSearchFilters.push(new Filter("user_flag", FilterOperator.EQ, "true"));
			// 		break;
			// 	}
            // }
            
            // console.log('aSearchFilters',aSearchFilters);

			// return aSearchFilters;
		},
		
		_doInitTablePerso: function(){
			// // init and activate controller
			// this._oTPC = new TablePersoController({
			// 	table: this.byId("mainTable"),
			// 	componentName: "vpMgr",
			// 	persoService: MainListPersoService,
			// 	hasGrouping: true
			// }).activate();
        },
        
        handleSelectionFinishComp: function(oEvent){

            // this.copyMultiSelected(oEvent);

            // var params = oEvent.getParameters();
            // var selectedKeys = [];
            // var divisionFilters = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            //     divisionFilters.push(new Filter("operation_org_code", FilterOperator.EQ, item.getKey() ));
            // });

            // var filter = new Filter({
            //                 filters: divisionFilters,
            //                 and: false
            //             });

            // this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
            // this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function(oEvent){
            // this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function(oEvent){
            // var source = oEvent.getSource();
            // var params = oEvent.getParameters();

            // var id = source.sId.split('--')[1];
            // var idPreFix = id.substr(0, id.length-1);
            // var selectedKeys = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            // });

            // this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            // this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },

        onValueHelpRequested : function () {
            // console.group("onValueHelpRequested");

            // // var aCols = this.oColModel.getData().cols;

            // this._oValueHelpDialog = sap.ui.xmlfragment("vp.vpMgr.view.ValueHelpDialogAffiliate", this);
            // this.getView().addDependent(this._oValueHelpDialog);

            // this._oValueHelpDialog.getTableAsync().then(function (oTable) {
            //     oTable.setModel(this.oAffiliateModel);
            //     oTable.setModel(this.oColModel, "columns");

            //     if (oTable.bindRows) {
            //         oTable.bindAggregation("rows", "/AffiliateCollection");
            //     }

            //     if (oTable.bindItems) {
            //         oTable.bindAggregation("items", "/AffiliateCollection", function () {
            //             return new ColumnListItem({
            //                 // cells: aCols.map(function (column) {
            //                 //     return new Label({ text: "{" + column.template + "}" });
            //                 // })
            //             });
            //         });
            //     }
            //     this._oValueHelpDialog.update();
            // }.bind(this));

            // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            // this._oValueHelpDialog.open();

            //     console.groupEnd();
        }

	});
});