sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/Formatter",    
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/Fragment",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    Formatter, TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox, ExcelUtil) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.partBaseActivityMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        formatter: Formatter,

        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        tenant_id: new String,
        companyCode: new String,

        processIcon: String,
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");

            
            //로그인 세션 작업완료시 수정
            this.loginUserId = "TestUser";
            this.tenant_id = "L2100";
            this.companyCode = "LGCKR";

            this.setModel(new JSONModel(), "visibleTF");

            oTransactionManager = new TransactionManager();
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


            this.enableMessagePopover();

            this._doInitTablePerso();
           
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

        onSearch: function () {
            var aSearchFilters = this._getSearchStates();
            var aSorter = this._getSorter();
            this._applySearch(aSearchFilters, aSorter);
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            // if (oEvent.getParameters().refreshButtonPressed) {
            //     // Search field's 'refresh' button has been pressed.
            //     // This is visible if you select any master list item.
            //     // In this case no new search is triggered, we only
            //     // refresh the list binding.
            //     this.onRefresh();
            // } else {
            //     var aSearchFilters = this._getSearchStates();
            //     var aSorter = this._getSorter();
            //     this._applySearch(aSearchFilters, aSorter);
            // }

            if(this.getModel("list").isChanged() === true){
				MessageBox.confirm(this.getModel("I18N").getText("/NCM00005"), {
					title : this.getModel("I18N").getText("/SEARCH"),
					initialFocus : sap.m.MessageBox.Action.CANCEL,
					onClose : function(sButton) {
						if (sButton === MessageBox.Action.OK) {
							this.onSearch();
						}
					}.bind(this)
				});
			} else {
				this.onSearch();
			}
        },

        onMainTableDeleteButtonPress: function(){
			var table = this.byId("mainTable"),
				model = this.getModel("list");
			
            table.getSelectedIndices().reverse().forEach(function (idx) {
                model.markRemoved(idx);
            });
			this.byId("mainTable").clearSelection();
        },

        onCreate: function (oEvent) {
            // this.getRouter().navTo("midPage", {
            //     tenantId: this.tenant_id,
            //     companyCode: this.companyCode,
            //     ideaNumber: 'new'
            // }, true);
            MessageBox.alert("준비중입니다.");
        },

        onCopy: function (oEvent) {
           MessageBox.alert("준비중입니다.");
        },

        onExportPress: function (_oEvent) {
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            //var sFileName = oTable.title || this.byId("page").getTitle(); //file name to exporting
            var sFileName = "Part Base Activity_"+ this._getDTtype();
            var oData = this.getModel("list").getProperty("/PdPartBaseActivityView"); //binded Data
            // var oData = oTable.getModel().getProperty("/Uom");
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        onStatusColor: function (sStautsCodeParam) {

            var sReturnValue = 5;
            //색상 정의 필요
            if( sStautsCodeParam === "DRAFT" ) {
                sReturnValue = 5;
            }else if( sStautsCodeParam === "30" ) {
                sReturnValue = 7;
            }else if( sStautsCodeParam === "40" ) {
                sReturnValue = 3;
            }

            return sReturnValue;
        },


        /**
         * Cell 클릭 후 상세화면으로 이동
         */
        onCellClickPress: function(oEvent) {
            this._goDetailView(oEvent);
        },

        

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/PdPartBaseActivityView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
                    oView.setBusy(false);
        },

        _getSearchStates: function () {

            // var searchKeyword = this.getView().byId("searchKeyword").getValue();
            // var searchCompany = this.getView().byId("searchCompany").getSelectedKey();
            // var searchOrg = this.getView().byId("searchOrg").getSelectedKey();
            // var searchPrjType = this.getView().byId("searchPrjType").getSelectedKey();

            var aSearchFilters = [];

            // if (searchKeyword != "") {                
            //     aSearchFilters.push(new Filter("tolower(activity_name)", FilterOperator.Contains, "'"+searchKeyword.toLowerCase().replace("'","''")+"'"));
            // }

            // if (searchCompany && searchCompany.length > 0) {
			// 	aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, searchCompany));
            // }

            // if (searchOrg && searchOrg.length > 0) {
			// 	aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, searchOrg));
            // }

            // if (searchPrjType && searchPrjType.length > 0) {
			// 	aSearchFilters.push(new Filter("part_project_type_code", FilterOperator.EQ, searchPrjType));
            // }

            return aSearchFilters;
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

        /**
         * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
         */
        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        },


        _getSorter: function () {
            var aSorter = [];
            // aSorter.push(new Sorter("idea_number", true));
            return aSorter;
        },

        _doInitTablePerso: function(){
			// init and activate controller
			// this._oTPC = new TablePersoController({
			// 	table: this.byId("mainTable"),
			// 	componentName: "partBaseActivityMgt",
			// 	persoService: MainListPersoService,
			// 	hasGrouping: true
            // }).activate();
            
            // 개인화 - UI 테이블의 경우만 해당
            this._oTPC = new TablePersoController({
                customDataKey: "partBaseActivityMgt",
                persoService: MainListPersoService            
            }).setTable(this.byId("mainTable"));
        },        

        _goDetailView: function(oEvent){

            var oView = this.getView();
            var oTable = oView.byId("mainTable"),
                oModel = this.getView().getModel("list");
            var rowData = oEvent.getParameter('rowBindingContext').getObject();

            var idea_number = rowData.idea_number;
            console.log("####idea_number====", idea_number);

            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: rowData.tenant_id,
                companyCode: rowData.company_code,
                ideaNumber: rowData.idea_number
            }, true);
        }

    });
});