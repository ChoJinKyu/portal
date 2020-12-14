sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  'sap/ui/core/Fragment',
  'sap/ui/model/Sorter',
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/odata/v2/ODataTreeBinding"
],
	/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, ManagedListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, ODataTreeBinding) {
    "use strict";

    return Controller.extend("cm.menuMgr.controller.menuMgr", {
      onInit: function () {
        this.getView().setModel(new ManagedListModel(), "tree");
      },
      onAdd: function () {
        var [flag] = arguments;
        var oTable = this.getView().byId("menuTreeTable");
        var row =
          (this.getView().getModel("tree").getProperty("/Menu_haa") || {}).length > 0
            ? this.getView().getModel("tree").getObject(
              oTable.getContextByIndex(oTable.getSelectedIndex()).sPath
            )
            : {};
        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          "?query": {
            menuCode: "",
            menuName: "",
            parentMenuCode: (
              flag == 'S'
                ? row.parent_menu_code
                : row.menu_code
            ) || ""
          }
        });
      },
      onRowSelectionChange: function (event) {
        // event 객체를 통해 레코드(ROW)를 가져온다.        
        var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);
        // 라우팅 한다.
        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          "?query": {
            menuCode: row.menu_code,
            menuName: row.menu_name,
            parentMenuCode: row.parent_menu_code
          }
        });
      },
      onSearch: function (event) {
        // Menu
        // this
        //   .getView()
        //   .setBusy(true)
        //   .getModel("tree")
        //   .setTransactionModel(this.getView().getModel())
        //   .readP("/Menu", {
        //     filters: [
        //       // 조회조건 - 일단 신규인 경우도 "99999" 를 던짐
        //       //new Filter("language_code", FilterOperator.EQ, "KO")
        //     ]
        //   })
        //   // 성공시
        //   .then((function (oData) {
        //   }).bind(this))
        //   // 실패시
        //   .catch(function (oError) {
        //   })
        //   // 모래시계해제
        //   .finally((function () {
        //     this.getView().setBusy(false);
        //   }).bind(this));

        // console.log(">>>> result", this.getView().getModel("tree").getMetadata());
        // var self = this;
        // this.getView().getModel("tree").read("/Menu_haa", {
        //   filters: [
        //     new Filter("menu_code", FilterOperator.EQ, "CM1110")
        //   ],
        //   success: function (oData) {
        //     console.log(">>>>>>> oData", oData);
        //     self.getView().getModel("tree").update("/Menu_haa", oData);
        //   }
        // });
        // TBD
        console.log(">>>> Success - 1");
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
              new Filter("language_code", FilterOperator.EQ, "KO"),
              new Filter("menu_code", FilterOperator.EQ, "CM1200")
            ]
          })
          // 성공시
          .then((function (oData) {
            console.log(">>>> Success", oData);
          }).bind(this))
          // 실패시
          .catch(function (oError) {
          })
          // 모래시계해제
          .finally((function () {
            this.getView().setBusy(false);
          }).bind(this));
      }
    });
  }
);