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

                //로그인 세션 작업완료시 수정
                this.loginUserId = "TestUser";
                this.tenantId = "L2101";
                this.categoryGroupCode = "CO";
                this.language_cd = "KO";

                this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            },

            onAfterRendering: function() {
                this.onSearch();
            },

            onSelectionChange: function(event) {
                this.onSearch();
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
            },

            onMainTableCreate2ButtonPress: function(e){
                this.getRouter().navTo("selectionPage", {
                    tenantId: this.tenantId,
                    categoryGroupCode: this.categoryGroupCode,
                    requestNumber: "new"
                }, true);
            }

        });
    }
);