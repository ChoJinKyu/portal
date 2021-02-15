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
    "sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text"
], function (BaseController, JSONModel, TreeListModel, DateFormatter, Validator, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast,
     LayoutType, Multilingual, ValueState, Dialog, DialogType, Button, ButtonType, Text) {
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
                    predicates.push(new Filter("category_group_code", FilterOperator.EQ, this.byId("searchCategoryCombo").getSelectedKey()));
                }

                if (!!this.byId("searchActiveFlag").getSelectedKey()) {
                    if(this.byId("searchActiveFlag").getSelectedKey()=="Active"){
                        predicates.push(new Filter("active_flag", FilterOperator.EQ, true));
                    } else {
                        predicates.push(new Filter("active_flag", FilterOperator.EQ, false));
                    }
                    
                }
               
                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel(), { returnType: "Array" });
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/pdPartCategoryView", {
                        filters: predicates
                    })
                    // 성공시
                    .then((function (jNodes) {
                        
                        for(var i=0; i<jNodes[1].results.length; i++) {
                            var local_update_dtm = jNodes[1].results[i].local_update_dtm;
                            jNodes[1].results[i].local_update_dtm = this.dateFormatter.toDateTimeString(local_update_dtm);
                        }

                        this.getView().setModel(new JSONModel({
                            "pdPartCategoryView": {
                                "nodes": jNodes[0],
                                "list": jNodes[1]
                            }
                        }), "tree");

                        this.getModel("tree").getData()
                        

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

            onMainTableCreate2ButtonPress: function () {
                if (!this.oInfoMessageDialog) {
                    this.oInfoMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Information",
                        state: ValueState.Information,
                        content: new Text({ text: "메뉴별 이동은 Sprint4에서...곧 만나요." }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oInfoMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }
                this.oInfoMessageDialog.open();
            },

            onMainTableCreate0ButtonPress: function () {
                if (!this.oInfoMessageDialog) {
                    this.oInfoMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Information",
                        state: ValueState.Information,
                        content: new Text({ text: "동일레벨생성은 Sprint3에서...곧 만나요." }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oInfoMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }
                this.oInfoMessageDialog.open();
            },

            onMainTableCreate1ButtonPress: function () {
                if (!this.oInfoMessageDialog) {
                    this.oInfoMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Information",
                        state: ValueState.Information,
                        content: new Text({ text: "하위레벨생성은 Sprint3에서...곧 만나요." }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oInfoMessageDialog.close();
                            }.bind(this)
                        })
                    });
                }
                this.oInfoMessageDialog.open();
            },

            onRowSelectionChange: function(oEvent) {
                console.log(oEvent);
                this.getRouter().navTo("addCreatePage", {
                    requestNumber: "CCR2102050022"
                }, true);
                
            }
        });
    }
);