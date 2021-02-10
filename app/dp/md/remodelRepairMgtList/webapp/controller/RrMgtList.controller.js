sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    "ext/lib/util/ExcelUtil",
    "cm/util/control/ui/EmployeeDialog",
    "dp/md/util/controller/ModelDeveloperSelection",
    "./RrMgtListPersoService",
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
], function (BaseController, DateFormatter, ManagedListModel, ManagedModel, Multilingual, Validator, ExcelUtil, EmployeeDialog, ModelDeveloperSelection, RrMgtListPersoService,
    ManagedObject, History, Element, Fragment, JSONModel, Filter, FilterOperator, Sorter, Column, Row, TablePersoController, Item,
    ComboBox, ColumnListItem, Input, MessageBox, MessageToast, ObjectIdentifier, SearchField, Text, Token) {
    "use strict";

    /**
     * @description Remodel/Repair Management List(협력사)
     * @date 2021.02.08 
     * @author jinseon.lee 
     */
    return BaseController.extend("dp.md.remodelRepairMgtList.controller.RrMgtList", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        modelDeveloperSelection: new ModelDeveloperSelection(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the remodelRepairMgtList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oViewModel,
                oResourceBundle = this.getResourceBundle();
            
            console.log(" session >>> " , this.getSessionUserInfo().TENANT_ID);
            // Model used to manipulate control states
            oViewModel = new JSONModel({
                remodelRepairMgtListTableTitle: oResourceBundle.getText("remodelRepairMgtListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "remodelRepairMgtListView");

            // Add the remodelRepairMgtList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("remodelRepairMgtListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new ManagedListModel(), "plant");
            this.setModel(new ManagedModel(), "searchCon");

            this._oTPC = new TablePersoController({
                customDataKey: "remodelRepairMgtList",
                persoService: RrMgtListPersoService
            }).setTable(this.byId("remodelRepairMgtListTable"));
            
            this._doInitSearch();

            this.getRouter().getRoute("rrMgtList").attachPatternMatched(this._onRoutedThisPage, this);
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();

        },

        onAfterRendering: function () {
            //this.getModel().setDeferredGroups(["bindReceipt", "cancelBind", "delete", "receipt"]);
            this.byId("pageSearchButton").firePress();
            return;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
           var search =  this.getView().getModel('searchCon');
            //접속자 법인 사업부로 바꿔줘야함
            search.setProperty("/companyList",['LGESL']);
            search.setProperty("/plantList",['A040']);  
                    
        },
        _onRoutedThisPage : function(){
            this.getModel("remodelRepairMgtListView").setProperty("/headerExpanded", true); 
            this._searchPlant(); 
        },

        _searchPlant: function(){ 
            var search = this.getView().getModel("searchCon");
            // session에서 받아오는 tenant_id를 변수로 저장함
            var sTenant_id=this.getSessionUserInfo().TENANT_ID;
            var aFilter = [];
            var companyFilters = [];
                aFilter.push( new Filter("tenant_id", FilterOperator.EQ, sTenant_id)); 
              if(search.getProperty("/companyList").length > 0){
                search.getProperty("/companyList").forEach(function (item) {
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item));
                });
                aFilter.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            }; 
            
            
            console.log("aFilter>>" , aFilter);

           
            var oView = this.getView(),
                oModel = oView.getModel("plant");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel("dpMdUtil"));
            oModel.read("/Divisions", {
                filters: aFilter,
                success: function (oData) { 
                    // console.log(" Pur_Operation_Org " , oData);
                    oView.setBusy(false); 
                }
            });
        },
       
        /**
        * @private 
        * @see (멀티박스)Company와 Plant 부분 연관성 포함함
        */
        handleSelectionFinishComp: function (oEvent) {
           this._searchPlant();
        },


		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMoldMstTablePersoRefresh: function () {
            RrMgtListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		
		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function () {
            this.validator.validate( this.byId('pageSearchFormE'));
            if(this.validator.validate( this.byId('pageSearchFormS') ) !== true) return;

            var aTableSearchState = this._getSearchStates();
            this._applySearch(aTableSearchState);
        },

        /**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
        onCellClick : function (oEvent) { 
            var params = oEvent.getParameters()
              , sPath = params.rowBindingContext.sPath
              , oRecord = this.getModel("list").getProperty(sPath);
  
            this.getRouter().navTo("rrMgtDetail", {
                mold_id : oRecord.mold_id  
                , request_number : oRecord.repair_request_number
            });
         
        },

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
            oModel.read("/remodelRepairList", {
                filters: aTableSearchState,
                success: function (oData) { 
                    console.log("oData>>> ", oData);
                    this.validator.clearValueState(this.byId("moldMstTable"));
                    oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {

            var search = this.getModel("searchCon");

            console.log("search>>>> " , search);

            var aTableSearchState = [];
            var companyFilters = [];
            var plantFilters = [];

            if(search.getProperty("/companyList").length > 0){
                search.getProperty("/companyList").forEach(function (item) {
                    companyFilters.push(new Filter("company_code", FilterOperator.EQ, item));
                });
                aTableSearchState.push(
                    new Filter({
                        filters: companyFilters,
                        and: false
                    })
                );
            };
 
            if (search.getProperty("/plantList").length > 0) {
                search.getProperty("/plantList").forEach(function (item) {
                    plantFilters.push(new Filter("org_code", FilterOperator.EQ, item));
                });

                aTableSearchState.push(
                    new Filter({
                        filters: plantFilters,
                        and: false
                    })
                );
            };

            if(search.getProperty("/repair_progress_status_code") != undefined 
                && search.getProperty("/repair_progress_status_code") != null && search.getProperty("/repair_progress_status_code") != ""){
                var srch = search.getProperty("/repair_progress_status_code");
                aTableSearchState.push(new Filter("repair_progress_status_code", FilterOperator.EQ, srch));
            };

            if(search.getProperty("/model") != undefined 
                && search.getProperty("/model") != null && search.getProperty("/model") != "" ){ 
                var srch = search.getProperty("/model");
                aTableSearchState.push(new Filter("tolower(model)", FilterOperator.StartsWith, String(srch.toLowerCase()) ));
            };
            
            if(search.getProperty("/mold_number") != undefined 
                && search.getProperty("/mold_number") != null && search.getProperty("/mold_number") != "" ){ 
                var srch = search.getProperty("/mold_number");
                aTableSearchState.push(new Filter("tolower(mold_number)", FilterOperator.StartsWith, String(srch.toLowerCase())));
            };

            if(search.getProperty("/class_desc") != undefined 
                && search.getProperty("/class_desc") != null && search.getProperty("/class_desc") != "" ){ 
                var srch = search.getProperty("/class_desc");
                aTableSearchState.push(new Filter("tolower(class_desc)", FilterOperator.StartsWith, String(srch.toLowerCase())));
            };
            
            if(search.getProperty("/asset_number") != undefined 
                && search.getProperty("/asset_number") != null && search.getProperty("/asset_number") != "" ){ 
                var srch = search.getProperty("/asset_number");
                aTableSearchState.push(new Filter("tolower(asset_number)", FilterOperator.StartsWith, String(srch.toLowerCase())));
            };
            
            console.log("aTableSearchState>>>> " , aTableSearchState);
            
            return aTableSearchState;
        },

        
        
        _doInitTablePerso: function () {
            // init and activate controller
            this._oTPC = new TablePersoController({
                table: this.byId("moldMstTable"),
                componentName: "remodelRepairMgtList",
                persoService: RrMgtListPersoService,
                hasGrouping: true
            }).activate();
        }

    });
});