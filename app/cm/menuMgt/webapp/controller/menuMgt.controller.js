sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
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
    function (Controller, JSONModel, TreeListModel, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("cm.menuMgt.controller.menuMgt", {
            onInit: function () {
            },
            onAfterRendering: function() {
                this.onSearch();
            },
            onSelectionChange: function(event) {
                this.onSearch();
            },
            onAdd: function () {
                var [flag] = arguments;
                var oTable = this.getView().byId("menuTreeTable");
                var row =
                    (this.getView().getModel("tree").getProperty("/Menu_haa").nodes || []).length > 0
                        ? oTable.getSelectedIndex() >= 0 
                          &&
                          this.getView().getModel("tree").getObject(
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
                        ) || "",
                        chainCode: row.chain_code || ""
                    }
                });
            },
            onRowSelectionChange: function (event) {
                // Tree 부분 클릭시에는 return 처리한다.
                if (!event.getParameters().rowContext) return ;
                // event 객체를 통해 레코드(ROW)를 가져온다. ()
                var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);
                // 라우팅 한다.
                this.getRouter().navTo("midPage", {
                    layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        menuCode: row.menu_code,
                        menuName: row.menu_name.replaceAll("#", "^"),
                        parentMenuCode: row.parent_menu_code,
                        chainCode: row.chain_code || ""
                    }
                });
            },
            onSearch: function (event) {
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
                //predicates.push(new Filter("language_code", FilterOperator.EQ, "KO"));
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/Menu_haa", {
                        filters: predicates,
                        sorters: [new Sorter("hierarchy_rank")]
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