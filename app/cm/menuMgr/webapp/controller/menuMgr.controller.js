sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/ui/core/Fragment',
  'sap/ui/model/Sorter',
  "sap/m/MessageBox",
  "sap/m/MessageToast"
],
	/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, ManagedListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("cm.menuMgr.controller.menuMgr", {
      onInit: function () {
        this.getView().setModel(new ManagedListModel(), "tree");
      },
      onSearch: function (event) {
        this.getView()
          .setBusy(true)
          .getModel("tree")
          .setTransactionModel(this.getView().getModel())
          .tree("/Menu_haa", {
            // urlParameters: {
            //   language_code: 'KO'
            // },
            filters: [
              // 조회조건
              new Filter("language_code", FilterOperator.EQ, "KO")
              //new Filter("name", FilterOperator.Contains, "e")
            ]
          })
          // 성공시
          .then((function (oData) {
            console.log(">>>> success", oData);
          }).bind(this))
          // 실패시
          .catch(function (oError) {
            console.log(">>>> fail", oError);
          })
          // 모래시계해제
          .finally((function () {
            console.log(">>>> finally");
            this.getView().setBusy(false);
          }).bind(this));
      },

      /**
       * Event handler when a table add button pressed
       * @param {sap.ui.base.Event} oEvent
       * @public
       */
      onAdd: function () {
        var [flag] = arguments;
        //var [menuCode, menuName, parentMenuCode] = "";
        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          "?query": {
            menuCode: "",
            menuName: "",
          }
        });
      },

      /**
		   * Event handler when pressed the item of table
		   * @param {sap.ui.base.Event} oEvent
		   * @public
		   */
      onMainTableItemPress: function (oEvent) {
        var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
          sPath = oEvent.getSource().getBindingContext("tree").getPath(),
          oRecord = this.getModel("tree").getProperty(sPath);

        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          menuCode: oRecord.menu_code,
          menuName: oRecord.menu_name,
          parentMenuCode: oRecord.parent_menu_code
        });

        // this.getRouter().navTo("midPage", {
        //   layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
        //   tenantId: oRecord.tenant_id,
        //   controlOptionCode: oRecord.control_option_code
        // });

        // if (oNextUIState.layout === 'TwoColumnsMidExpanded') {
        //   this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
        // }

        // var oItem = oEvent.getSource();
        // oItem.setNavigated(true);
        // var oParent = oItem.getParent();
        // // store index of the item clicked, which can be used later in the columnResize event
        // this.iIndex = oParent.indexOfItem(oItem);
      },
    });
  });
