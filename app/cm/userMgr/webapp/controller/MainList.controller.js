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
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/m/ColumnListItem",
  "sap/m/ObjectIdentifier",
  "sap/m/Text",
  "sap/m/Input",
  "sap/m/ComboBox",
  "sap/ui/core/Item",
  "3rd/lib/lodash/lodash"
], function (BaseController, History, JSONModel, ManagedListModel, DateFormatter, TablePersoController, MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {
  "use strict";

  return BaseController.extend("cm.userMgr.controller.MainList", {

    dateFormatter: DateFormatter,

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
    onInit: function () {
      // console.log(">>>>>> lodash", _);
      var oViewModel,
        oResourceBundle = this.getResourceBundle();

      // Model used to manipulate control states
      oViewModel = new JSONModel({
        headerExpanded: true,
        mainListTableTitle: oResourceBundle.getText("mainListTableTitle"),
        tableNoDataText: oResourceBundle.getText("tableNoDataText")
      });
      this.setModel(oViewModel, "mainListView");

      // Add the mainList page to the flp routing history
      this.addHistoryEntry({
        title: oResourceBundle.getText("mainListViewTitle"),
        icon: "sap-icon://table-view",
        intent: "#Template-display"
      }, true);

      this.setModel(new ManagedListModel(), "list");

      this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

    },

    onRenderedFirst: function () {
      //this.byId("pageSearchButton").firePress();
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
    onMainTableUpdateFinished: function (oEvent) {
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

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
    onMainTableAddButtonPress: function () {
      var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
      this.getRouter().navTo("midPage", {
        layout: oNextUIState.layout,
        tenantId: "new",
        userId: "new",
        "?query": {
          //param1: "1111111111"
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
        this._applySearch(aSearchFilters);
      }
    },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
    onMainTableItemPress: function (oEvent) {
      var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
        sPath = oEvent.getSource().getBindingContext("list").getPath(),
        oRecord = this.getModel("list").getProperty(sPath);

      this.getRouter().navTo("midPage", {
        layout: oNextUIState.layout,
        userId: oRecord.user_id
      });

      if (oNextUIState.layout === 'TwoColumnsMidExpanded') {
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
    _onRoutedThisPage: function () {
      this.getModel("mainListView").setProperty("/headerExpanded", true);
    },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
    _applySearch: function (aSearchFilters) {
      var oView = this.getView(),
        oModel = this.getModel("list");
      oView.setBusy(true);
      //oModel.setTransactionModel(this.getModel());

        var oUserMasterTable = this.byId("mainTable");
        oUserMasterTable.setBusy(true);

        var oServiceModel = this.getModel();

        oServiceModel.read("/UserMgr",{
            filters : aSearchFilters,
            success : function(data){
                oModel.setProperty("/UserMgr", data.results);
                oUserMasterTable.setBusy(false);
            },
            error : function(data){
                oUserMasterTable.setBusy(false);
            }
        });

    //   oModel.read("/UserMgrMasters", {
    //     filters: aSearchFilters,
    //     success: function (oData) {
    //         console.log("111111 success", oData);

    //       oView.setBusy(false);
    //     }
    //   });
      /////////////////////////////////////////////////////////////////////////////////
      // TAG : Hierachy/Tree
      // 검색 : name like '%e%'
      // 결과 : NODE_ID 2, 3을 제외한 결과가 Hirachecy 를 유지한 Object Array 형태로 반환
      //        되며, 이는 sap.ui.table.TreeTable 태그의 model 에 바로 적용되는 형식
      //
      // * 검색버튼 클릭후 F12 를 통해 개발자도구에서 로그 확인하세요.
      //
      /////////////////////////////////////////////////////////////////////////////////
      oView.setBusy(true);
      (new ManagedListModel())
        .setTransactionModel(this.getModel("tree"))
        .tree("/Categories_haa", [
          // 조회조건
          new Filter("name", FilterOperator.Contains, "e")
        ])
        // 성공시
        .then(function (oData) {
          console.log(">>>> success", oData);
        })
        // 실패시
        .catch(function (oError) {
          console.log(">>>> fail", oError);
        })
        // 모래시계해제
        .finally(function () {
          console.log(">>>> finally");
          oView.setBusy(false);
        });
    },

    _getSearchStates: function () {
      var aSearchFilters = [];
      if (!!this.byId("searchTenantCombo").getSelectedKey()) aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.byId("searchTenantCombo").getSelectedKey()));
      if (!!this.byId("searchOrgCombo").getSelectedKey()) aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, this.byId("searchOrgCombo").getSelectedKey()));
      
      if (!!this.byId("searchUserId").getValue()) aSearchFilters.push(new Filter("user_id", FilterOperator.EQ, this.byId("searchUserId").getValue()));
      if (!!this.byId("searchUserName").getValue()) aSearchFilters.push(new Filter("user_name", FilterOperator.EQ, this.byId("searchUserName").getValue()));
      if (!!this.byId("searchEngName").getValue()) aSearchFilters.push(new Filter("user_eng_name", FilterOperator.EQ, this.byId("searchEngName").getValue()));
      if (!!this.byId("searchEmail").getValue()) aSearchFilters.push(new Filter("email", FilterOperator.EQ, this.byId("searchEmail").getValue()));
      if (!!this.byId("searchUseflag").getSelectedKey()) aSearchFilters.push(new Filter("use_flag", FilterOperator.EQ, this.byId("searchUseflag").getSelectedKey()));
      
      return aSearchFilters;
    },

  });
});