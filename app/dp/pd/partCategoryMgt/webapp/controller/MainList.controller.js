sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/Validator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/f/LayoutType",
    "ext/lib/util/Multilingual",
], function (BaseController, JSONModel, TreeListModel, DateFormatter, Validator, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast, LayoutType, Multilingual) {
        "use strict";

        return BaseController.extend("dp.pd.partCategoryMgt.controller.MainList", {

            dateFormatter: DateFormatter,
            validator: new Validator(),

            /**
             * Called when the mainList controller is instantiated.
             * @public
             */

            onInit: function () {
                this.setModel((new Multilingual()).getModel(), "I18N");
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
                    layout: LayoutType.TwoColumnsBeginExpanded,//this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        menuCode: row.menu_code,
                        menuName: "",//row.menu_name.replaceAll("#", "^"),
                        parentMenuCode: row.parent_menu_code,
                        chainCode: row.chain_code || ""
                    }
                });
            },
            onSearch: function (event) {
                var predicates = [];
                if (!!this.byId("searchCategoryCombo").getSelectedKey()) {
                    predicates.push(new Filter("category_group_code", FilterOperator.Contains, this.byId("searchCategoryCombo").getSelectedKey()));
                }

                if (!!this.byId("searchActiveFlag").getSelectedKey()) {
                    predicates.push(new Filter("activity_flag", FilterOperator.Contains, this.byId("searchActiveFlag").getSelectedKey()));
                }
               
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel(), { returnType: "Array" });
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/pdPartCategoryView", {
                        filters: predicates
                    })
                    // 성공시
                    .then((function (jNodes) {
                        this.getView().setModel(new JSONModel({
                            "pdPartCategoryView": {
                                "nodes": jNodes[0],
                                "list": jNodes[1]
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
            },

            onMainTableexpandAll: function(e) {
                var table = this.getView().byId("treeTable");
                table.expandToLevel(3);
            },

            onMainTablecollapseAll: function(e){
                this.getView().byId("treeTable").collapseAll();
            }

        });
    }
);