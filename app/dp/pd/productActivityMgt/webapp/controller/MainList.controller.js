sap.ui.define([
	"ext/lib/controller/BaseController",
	"ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
	"sap/ui/model/json/JSONModel",
	"ext/lib/formatter/DateFormatter",
	"sap/ui/table/TablePersoController",
	"./MainListPersoService",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "ext/lib/util/ExcelUtil",
    "ext/lib/util/SppUserSession"
], function (BaseController, Multilingual, ManagedListModel, TransactionManager, JSONModel, DateFormatter, 
        TablePersoController, MainListPersoService, 
        Filter, FilterOperator, MessageBox, MessageToast, Sorter, ExcelUtil, SppUserSession) {
	        "use strict";
            var oTransactionManager;

	return BaseController.extend("dp.pd.productActivityMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        
        _oViewData : {
            tenant_id : "",
            user_id : "",
            language_code : ""
        },
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
		onInit : function () {
            var oMultilingual = new Multilingual(),
                oSppUserSession = new SppUserSession();
            
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");
            
            var oTransactionManager = new TransactionManager();
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


            //세션 정보 받기
            this._oViewData.tenant_id = this.getSessionTenantId()

            this.enableMessagePopover();
            //this._doInitTablePerso();

            this.setModel(oSppUserSession.getModel(), "USER_SESSION");

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
			this.getModel("mainListViewModel").setProperty("/mainListTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onMainTablePersoButtonPressed: function(oEvent){

        //     var mainTable = this.byId("mainTable");
        //   //  mainTable.clearSelection();
        //     mainTable.setSelectedIndex(0);


			//this._oTPC.openDialog();
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

			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				activityCode = oEvent.getParameter('rowBindingContext').getObject().product_activity_code;

			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: this._oViewData.tenant_id,
				controlOptionCode: activityCode
			}, true);
            
        },
        
        onCreateActivity : function(){
            var that = this;
            var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(1);
			this.getRouter().navTo("midPage", {
				layout: oNextUIState.layout, 
				tenantId: this._oViewData.tenant_id,
				controlOptionCode: "new"				
            });	   
        },

        onExportPress : function(_oEvent){
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }
            var oTable = this.byId(sTableId);

            var sFileName = "Product Activity_"+ this._getDTtype();
            var oData = this.getModel("list").getProperty("/PdProdActivityTemplateView"); //binded Data

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
            this.byId("localUpdateDtmColumn").setVisible(true);
            this.byId("updateUserIdColumn").setVisible(true);

            this.getModel("mainListViewModel").setProperty("/headerExpanded", false);
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

			var sSearchProductActivity = this.byId("searchProductActivity").getValue(),
				sStatus = this.getView().byId("searchStatusSegmentButton").getSelectedKey();
			
            var aSearchFilters = [new Filter("tenant_id", FilterOperator.EQ, this._oViewData.tenant_id)];

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