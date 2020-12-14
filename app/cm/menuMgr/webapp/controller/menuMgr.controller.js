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
  "sap/ui/model/odata/v2/ODataTreeBinding",
  "sap/ui/model/odata/v2/ODataModel"
],
	/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, ManagedListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, ODataTreeBinding, ODataModel) {
    "use strict";

    return Controller.extend("cm.menuMgr.controller.menuMgr", {
      onInit: function () {


        //console.log("111111111111");
        //this.getView().setModel(new ManagedListModel(), "tree");
        // this.getView().setModel(
        //     new ODataModel("cm/menuMgr/webapp/srv-api/odata/v2/cm.menuMgrService", {
        //         json : true,
        //         useBatch : true,
        //         serviceUrlParams: {
        //             menu_code: 'CM'
        //         }
        //     })
        // , "tree");

        // this.getView().byId("menuTreeTable").attachFilter(function(oData){
        //     console.log(">>>>>>>>>>> oData", oData);
        // }, this);
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
        // this.getView().byId("menuTreeTable").fireFilter();
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

        //console.log(">>>> result", this.getView().getModel("tree").getMetadata());
        //cm/menuMgr/webapp/srv-api/odata/v2/cm.menuMgrService/$metadata
        //var self = this;
        //console.log(">>>> result", self.getView().getModel().getMetadata());
        console.log("33333");
        // self.getView().setModel(self.getView().getModel(), "tree");
        this.getView().getModel().read("/Menu_haa", {
          filters: [
            new Filter("menu_code", FilterOperator.EQ, "CM")
          ],
          success: (function (oData) {
              console.log(this.getView().getModel())
            console.log(">>>>>>> ", oData);
            this.getView().getModel('viewModel').setData({"Menu_haa" : oData.results})
            console.log(this.getView().getModel())
            console.log(">>>>>>> ", oData);
            //this.getView().setModel(this.getView().getModel(), "tree");
          }).bind(this)
        });

        // TBD
        //console.log(">>>> Success - 2222");
        // this.getView()
        //   .setBusy(true)
        //   .getModel("tree")
        //   .setTransactionModel(this.getView().getModel())
        //   .tree("/Menu_haa", {
        //     // urlParameters: {
        //     //   language_code: 'KO'
        //     // },
        //     filters: [
        //       // 조회조건
        //       new Filter("language_code", FilterOperator.EQ, "KO"),
        //       new Filter("menu_code", FilterOperator.EQ, "CM1100")
        //     ]
        //   })
        //   // 성공시
        //   .then((function (oData) {
        //       //this.getView().getModel("tree2").setJSON(oData.results);
        //       console.log(">>>>>> results", oData);
        //      this.getView().getModel('viewModel').setData({"Menu_haa" : oData.results})
        //   }).bind(this))
        //   // 실패시
        //   .catch(function (oError) {
        //       console.log(">>>> failure", oError);
        //   })
        //   // 모래시계해제
        //   .finally((function () {
        //     this.getView().setBusy(false);
        //   }).bind(this));
      }
    });
  }
);