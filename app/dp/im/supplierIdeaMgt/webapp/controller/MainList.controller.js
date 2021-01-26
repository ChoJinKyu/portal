sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    // "sap/m/TablePersoController",
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
    "dp/util/control/ui/IdeaManagerDialog",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox,IdeaManagerDialog,ExcelUtil) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.im.supplierIdeaMgt.controller.MainList", {

        dateFormatter: DateFormatter,

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

            var today = new Date();
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
            // this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            //MainListPersoService.resetPersData();
            //this._oTPC.refresh();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
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

        onTestPress: function (oEvent) {
          //  var sPath = oEvent.getSource().getBindingContext("list").getPath(),
          //      oRecord = this.getModel("list").getProperty(sPath);

            this._sTenantId = 'L2100';
            this._sCompanyCode = 'LGCKR';
            this._sIdeaNumber = '2012000001';
            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: 'L2100',
                companyCode: 'LGCKR',
                ideaNumber: '2012000001'
            }, true);
        },

        onCreate: function (oEvent) {

            this.getRouter().navTo("selectionPage", {
                tenantId: this.tenant_id,
                companyCode: this.companyCode,
                ideaNumber: 'new'
            }, true);
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
            oModel.read("/IdeaListView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    //console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
                    oView.setBusy(false);
        },

        _getSearchStates: function () {

            var searchKeyword = this.getView().byId("searchKeyword").getValue();
            var searchIdeaProcess = this.getView().byId("searchIdeaProcess").getSelectedKeys();
            var searchIdeaType = this.getView().byId("searchIdeaType").getSelectedKeys();
            var searchProductGroup = this.getView().byId("searchProductGroup").getSelectedKeys();
            var requestFromDate = this.getView().byId("searchRequestDate").getDateValue(),
                requestToDate = this.getView().byId("searchRequestDate").getSecondDateValue();
            var searchIdeaManagerId = this.getView().byId("searchIdeaManagerId").getValue();
            var searchIdeaManager = this.getView().byId("searchIdeaManager").getValue();


            var aSearchFilters = [];

            

            if (searchKeyword != "") {
                aSearchFilters.push(new Filter("idea_title", FilterOperator.Contains, searchKeyword) );
            }


            
            if (searchIdeaProcess.length > 0) {
                var _tempFilters = [];
                searchIdeaProcess.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("idea_progress_status_code", FilterOperator.EQ, item));
                });
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            
            if (searchIdeaType.length > 0) {
                var _tempFilters = [];
                searchIdeaType.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("idea_type_code", FilterOperator.EQ, item));
                });
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            
            if (searchProductGroup.length > 0) {
                var _tempFilters = [];
                searchProductGroup.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("idea_product_group_code", FilterOperator.EQ, item));
                });
                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }


            if (requestFromDate && requestToDate) {
               aSearchFilters.push(new Filter("idea_date", FilterOperator.BT, this._getDTtype(true,requestFromDate), this._getDTtype(false,requestToDate)));
            }

            if (searchIdeaManagerId != "") {
                aSearchFilters.push(new Filter("idea_manager_empno", FilterOperator.EQ, searchIdeaManagerId) );
            }else if(searchIdeaManager!=""){
                aSearchFilters.push(new Filter("idea_manager_local_name", FilterOperator.Contains, searchIdeaManager) );
            }

            return aSearchFilters;
        },


        /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10T00:00:00
         */
        _getDTtype: function (StartFlag, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
 
            let sReturnValue = "" + iYear + "-" + this._getPreZero(iMonth) + "-" + this._getPreZero(iDate)+"T" ;
            let sTimes = "" + this._getPreZero(iHours) + ":" + this._getPreZero(iMinutes) + ":" + this._getPreZero(iSeconds);

            if( StartFlag ) {
                sReturnValue += "00:00:00";
            }else {
                sReturnValue += "23:59:59";
            }

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
            aSorter.push(new Sorter("idea_number", true));
            return aSorter;
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

        _goDetailView: function(oEvent){

            var oView = this.getView();
            var oTable = oView.byId("mainTable"),
                oModel = this.getView().getModel("list");
            var rowData = oEvent.getParameter('rowBindingContext').getObject();

            var idea_number = rowData.idea_number;
            //console.log("####idea_number====", idea_number);

            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: rowData.tenant_id,
                companyCode: rowData.company_code,
                ideaNumber: rowData.idea_number
            }, true);
        },


        /**
         * function : 아이디어 관리자 팝업 Call 함수
         * date : 2021/01/14
         */
        onIdeaManagerDialogPress : function(){
            
            if(!this.oSearchIdeaManagerDialog){
                this.oSearchIdeaManagerDialog = new IdeaManagerDialog({
                    title: this.getModel("I18N").getText("/SEARCH_IDEA_MANAGER"),
                    multiSelection: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.tenant_id)
                        ]
                    }
                });
                this.oSearchIdeaManagerDialog.attachEvent("apply", function(oEvent){ 
                    this.byId("searchIdeaManager").setValue(oEvent.getParameter("item").idea_manager_name);
                    // this.byId("ideaManager").setValue(oEvent.getParameter("item").idea_manager_name+"("+oEvent.getParameter("item").idea_manager_empno+")");
                    this.byId("searchIdeaManagerId").setValue(oEvent.getParameter("item").idea_manager_empno);
                    
                }.bind(this));
                }
            this.oSearchIdeaManagerDialog.open();

        },

        
        /**
         * 코드 체크
         */
        onNameChk : function(e) {
            //console.log(e);
            var oView = this.getView();
            //var searchIdeaManager = this.getView().byId("searchIdeaManager");
            var searchIdeaManagerId = this.getView().byId("searchIdeaManagerId");
            //console.log(searchIdeaManager.getValue());
            //if(searchIdeaManager.getValue() == ""){
                searchIdeaManagerId.setValue("");
            //}
        },


        onExportPress: function (_oEvent) {
            console.log("export");
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);
            var sFileName = "Supplier Idea List";
            var oData = this.getModel("list").getProperty("/IdeaListView"); //binded Data
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },




    });
});