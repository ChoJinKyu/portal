sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
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
    function (Controller, JSONModel, TreeListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, ODataTreeBinding, ODataModel) {
        "use strict";

        return Controller.extend("cm.menuMgr.controller.menuMgr", {
            onInit: function () {
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
                // filter
                var predicates = [];
                if (!!this.byId("searchChainCombo").getSelectedKey()) {
                    predicates.push(new Filter("chain_code", FilterOperator.Contains, this.byId("searchChainCombo").getSelectedKey()));
                }
                if (!!this.byId("searchKeyword").getValue()) {
                    predicates.push(new Filter({
                        filters: [
                        new Filter("menu_code", FilterOperator.Contains, this.byId("searchKeyword").getValue()),
                        new Filter("menu_name", FilterOperator.Contains, this.byId("searchKeyword").getValue())
                        ],
                        and: false
                    }));
                }
                predicates.push(new Filter("language_code", FilterOperator.EQ, "KO"));
                // treeListModel
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/Menu_haa", {
                        filters: predicates
                    })
                    // 성공시
                    .then((function (jNodes) {
                        this.getView().setModel(new JSONModel({
                            "Menu_haa": {
                                "nodes": jNodes
                            }
                        }), "tree");
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