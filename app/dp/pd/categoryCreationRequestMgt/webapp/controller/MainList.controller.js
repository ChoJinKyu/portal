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
    "ext/lib/util/ExcelUtil",
    "sap/m/SegmentedButtonItem"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox,ExcelUtil,SegmentedButtonItem) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.pd.categoryCreationRequestMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

        validator: new Validator(),

        loginUserId: new String,
        tenant_id: new String,
        companyCode: new String,
        language_cd: new String,

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
            this.tenant_id = "L2101";
            this.companyCode = "LGCKR";
            this.language_cd = "KO";
            this.setModel(new JSONModel(), "visibleTF");

            oTransactionManager = new TransactionManager();
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);


            this.enableMessagePopover();

            var today = new Date();
            this._setSegmentedItem();
        },



        _setSegmentedItem : function(){
            var oBtnSegmentedMode, aFilters, oUserInfo;

            oBtnSegmentedMode = this.byId("searchStatusButton");
            aFilters = [
                new Filter("tenant_id", "EQ", this.tenant_id),
                new Filter("group_code", "EQ", "DP_PD_PROGRESS_STATUS"),
                new Filter("language_cd", "EQ", this.language_cd)
            ];

            oBtnSegmentedMode.destroyItems();
            this.getOwnerComponent().getModel("common").read("/Code",{
                filters : aFilters,
                success : function(oData){
                    console.log(oData);
                    var aResults, sOrgCode;

                    aResults = oData.results;
                    oBtnSegmentedMode.addItem(
                        new SegmentedButtonItem({ 
                            text : "All", 
                            key : ""
                        })
                    );
                    if(!aResults.length){
                        return;
                    }
                    aResults.forEach(function(item){
                        oBtnSegmentedMode.addItem(
                            new SegmentedButtonItem({ 
                                text : item.code_name, 
                                key : item.code
                            })
                        );
                    });
                    oBtnSegmentedMode.setSelectedKey("");
                }.bind(this),
                error : function(){
                    
                }
            });
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
            oModel.read("/pdPartCategoryCreationRequestView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    //console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
            oView.setBusy(false);
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("request_number", true));
            return aSorter;
        },


        _getSearchStates: function () {
            var aSearchFilters = [];

            var status = this.getView().byId("searchStatusButton").getSelectedKey();
            console.log("status::"+status);
			if (status != "") {
			    aSearchFilters.push(new Filter("progress_status_code", FilterOperator.EQ, status));
            }

            var searchCategoryCombo = this.getView().byId("searchCategoryCombo").getValue();
            if (searchCategoryCombo != "") {
                aSearchFilters.push(new Filter("category_group_code", FilterOperator.EQ, searchCategoryCombo) );
            }
            return aSearchFilters;
        },


        onExportPress: function (_oEvent) {
            // console.log("export");
            var sTableId = _oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }
            
            var oTable = this.byId(sTableId);
            var sFileName = "PART CATEGORY CREATION REQUEST List";
            var oData = this.getModel("list").getProperty("/pdPartCategoryCreationRequestView"); //binded Data
            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
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

        onStatusColor: function (sStautsCodeParam) {

/* 할당안된 상태값
[REQUEST TD] 기술자료요청
[ASSIGN COACH] Idea 담당자 지정
[TRANSFER PD] 부품개발 이관
[TRANSFER ECN] ECN 이관
[FINAL COMPLETE] 최종완료
*/
            var sReturnValue = 5;
            //색상 정의 필요
            if( sStautsCodeParam === "DRAFT" || sStautsCodeParam === "SUBMIT" ) {
                sReturnValue = 1;
            }else if( sStautsCodeParam === "ADOPT" || sStautsCodeParam === "REQUEST CONTRACT" || sStautsCodeParam === "CONCLUDE CONTRACT" ) {
                sReturnValue = 5;
            }else if( sStautsCodeParam === "REJECT"  ) {
                sReturnValue = 9;
            }else if( sStautsCodeParam === "COMPLETE PLAN"  ) {
                sReturnValue = 6;
            }else if( sStautsCodeParam === "COMPLETE 4M" || sStautsCodeParam === "APPLY PRICE" || sStautsCodeParam === "COMPLETE PRODUCTION" ) {
                sReturnValue = 7;
            }else if( sStautsCodeParam === "DROP"  ) {
                sReturnValue = 8;
            }else if( sStautsCodeParam === "REQUEST REWRITING"  ) {
                sReturnValue = 8;
            }

            //return sReturnValue;
            if(sStautsCodeParam==null ||sStautsCodeParam=="")sStautsCodeParam=5;
            return parseInt(sStautsCodeParam);
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
        }




    });
});