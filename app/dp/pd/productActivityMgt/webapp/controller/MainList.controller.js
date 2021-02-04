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
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "ext/lib/util/ExcelUtil",
], function (BaseController, Multilingual, ManagedListModel, JSONModel, DateFormatter, 
        TablePersoController, MainListPersoService, 
        Filter, FilterOperator, MessageBox, MessageToast, Sorter, ExcelUtil) {
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
			
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();
			this._doInitTablePerso();
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
			MainListPersoService.resetPersData();
			this._oTPC.refresh();
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
                var aSorter = this._getSorter();
				this._applySearch(aSearchFilters, aSorter);
			}
		},

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		onMainTableItemPress: function(oEvent) {
            console.log("onMainTableItemPress");

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				sPath = oEvent.getParameters("rowIndices").rowContext.sPath,
                oRecord = this.getModel("list").getProperty(sPath);

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: oRecord.tenant_id,
				controlOptionCode: oRecord.product_activity_code
			}, true);

            
        },
        
        onCreateActivity : function(){

            var that = this;
            var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: "L2100",
				controlOptionCode: "new"				
            });

			// //수정대상 : 수정 검색한 값을 기준으로 데이타를 수정해야한다. 
			// if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
			// 	this.getView().getModel('oUi').setProperty("/headerExpandFlag", false);
            // }	
            
        },

        onTableSettings : function(){
            this._oTPC.openDialog();
        },

        onExportPress : function(_oEvent){
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "Product Activity_"+ this._getDTtype();
            var oData = this.getModel("list").getProperty("/PdProdActivityTemplateView"); //binded Data
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
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */

		_applySearch: function(aSearchFilters, aSorter) {
			var oView = this.getView(),
				oModel = this.getModel("list");
            oView.setBusy(true);
         //  console.log(oModel);
			oModel.setTransactionModel(this.getModel());
			oModel.read("/PdProdActivityTemplateView", {
                filters: aSearchFilters,
                sorters: aSorter,
				success: function(oData){
					oView.setBusy(false);
                }
            });
            oView.setBusy(false);
		},
		
		_getSearchStates: function(){

            console.log()

			var sSearchProductActivity = this.byId("searchProductActivity").getValue(),
				sStatus = this.getView().byId("searchStatusSegmentButton").getSelectedKey();
			
            var aSearchFilters = [];

            if (sSearchProductActivity) {
                aSearchFilters.push(new Filter({
                    path: 'keyword', 
                    filters: [
                        new Filter("tolower(product_activity_code)", FilterOperator.Contains, "'" + sSearchProductActivity.toLowerCase().replace("'","''") + "'"),
                        new Filter("tolower(activity_name)", FilterOperator.Contains, "'" + sSearchProductActivity.toLowerCase().replace("'","''") + "'"),
                        new Filter("tolower(description)", FilterOperator.Contains, "'" + sSearchProductActivity.toLowerCase().replace("'","''") + "'")
                    ],
                    and: false
                }));
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
			// 개인화 - UI 테이블의 경우만 해당
            this._oTPC = new TablePersoController({
                customDataKey: "productActivityMgt",
                persoService: MainListPersoService            
            }).setTable(this.byId("mainTable"));
        },
        
        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("sequence", false));
            return aSorter;
        },

        _getDTtype: function (StartFlag, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
 
            let sReturnValue = iYear + this._getPreZero(iMonth) + this._getPreZero(iDate);                      

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        }

	});
});