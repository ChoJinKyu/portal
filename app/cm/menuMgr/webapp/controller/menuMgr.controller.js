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
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/Menu_haa", {
                        filters: [
                            // 조회조건
                            new Filter("language_code", FilterOperator.EQ, "KO"),
                            new Filter("menu_code", FilterOperator.EQ, "CM1100")
                        ]
                    })
                    // 성공시
                    .then((function (jNodes) {
                        console.log(">>>>>> results", jNodes);
                        // Model
                        this.getView().setModel(new JSONModel({
                            "Menu_haa": {
                                "nodes": jNodes
                            }
                        }), "tree");
                    }).bind(this))
                    // 실패시
                    .catch(function (oError) {
                        console.log(">>>> failure", oError);
                    })
                    // 모래시계해제
                    .finally((function () {
                        this.getView().setBusy(false);
                    }).bind(this));












                // this.getView().getModel().read("/Menu_haa", {
                //     filters: [
                //         new Filter("language_code", FilterOperator.EQ, "KO"),
                //         new Filter("menu_code", FilterOperator.EQ, "CM1100")
                //     ],
                //     success: (function (oData) {
                //         var predicates = oData.results
                //             // PATH를 분리한다.
                //             .reduce(function (acc, e) {
                //                 return [...acc, ...((e["path"]).split("/"))];
                //             }, [])
                //             // 중복을 제거한다.
                //             .reduce(function (acc, e) {
                //                 return acc.includes(e) ? acc : [...acc, e];
                //             }, [])
                //             .reduce(function (acc, e) {
                //                 return [...acc, new Filter({
                //                   path: 'node_id', operator: FilterOperator.EQ, value1: e
                //                 })];
                //             }, []);

                //         this.getView().getModel().read("/Menu_haa", {
                //             filters: [...predicates],
                //             success: (function (oData) {
                //                 var tree = {}, data = oData.results;
                //                 data.map(function (d) {
                //                     d["level"] = d.path.split("/").length - 1;
                //                     d["nodes"] = [];
                //                     return d;
                //                 });
                //                 // 0
                //                 tree = data.reduce(function (t, d) {
                //                     if (d.level == 0) t.push(d);
                //                     return t;
                //                 }, []);
                //                 // 1
                //                 tree = data.reduce(function (t, d) {
                //                     if (d.level == 1) {
                //                         t.map(function (t0) {
                //                             if (t0.node_id == d.parent_id) {
                //                                 t0.nodes.push(d);
                //                             }
                //                             return t0;
                //                         });
                //                     }
                //                     return t;
                //                 }, JSON.parse(JSON.stringify(tree)));
                //                 // 2
                //                 tree = data.reduce(function (t, d) {
                //                     if (d.level == 2) {
                //                         t.map(function (t0) {
                //                             t0.nodes.map(function (t1) {
                //                                 if (t1.node_id == d.parent_id) {
                //                                     t1.nodes.push(d);
                //                                 }
                //                                 return t1;
                //                             });
                //                             return t0;
                //                         });
                //                     }
                //                     return t;
                //                 }, JSON.parse(JSON.stringify(tree)));
                //                 // 3
                //                 tree = data.reduce(function (t, d) {
                //                     if (d.level == 3) {
                //                         t.map(function (t0) {
                //                             t0.nodes.map(function (t1) {
                //                                 t1.nodes.map(function (t2) {
                //                                     if (t2.node_id == d.parent_id) {
                //                                         t2.nodes.push(d);
                //                                     }
                //                                     return t2;
                //                                 });
                //                                 return t1;
                //                             });
                //                             return t0;
                //                         });
                //                     }
                //                     return t;
                //                 }, JSON.parse(JSON.stringify(tree)));
                //                 // Model
                //                 this.getView().setModel(new JSONModel({
                //                     "Menu_haa": {
                //                         "nodes": tree
                //                     }
                //                 }), "tree");
                //             }).bind(this)
                //         })
                //     }).bind(this)
                // });
            }
        });
    }
);