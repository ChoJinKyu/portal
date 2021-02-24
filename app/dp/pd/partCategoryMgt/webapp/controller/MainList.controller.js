sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "./MainListPersoService",
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
    "sap/m/Text",
    "ext/lib/util/ExcelUtil",
    "ext/lib/util/SppUserSession"
], function (BaseController, JSONModel, TreeListModel, DateFormatter, TablePersoController, MainListPersoService, Validator, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast,
     LayoutType, Multilingual, ValueState, Dialog, DialogType, Button, ButtonType, Text, ExcelUtil, SppUserSession) {
        "use strict";

        return BaseController.extend("dp.pd.partCategoryMgt.controller.MainList", {

            dateFormatter: DateFormatter,
            validator: new Validator(),
            loginUserId: new String,
            tenant_id: new String,
            companyCode: new String,
            language_cd: new String,

            /**
             * Called when the mainList controller is instantiated.
             * @public
             */

            onInit: function () {       
                var oView,oMultilingual, oComponent, oViewModel;   
                oView = this.getView();
                oComponent = this.getOwnerComponent();
                oMultilingual = new Multilingual();
                oViewModel = oComponent.getModel("viewModel");

                oView.setModel(oMultilingual.getModel(), "I18N");
                
                var oSppUserSession = new SppUserSession();
                this.setModel(oSppUserSession.getModel(), "USER_SESSION");

                //로그인 세션 작업완료시 수정
                this.tenant_id = this.getModel("USER_SESSION").getSessionAttr("TENANT_ID");
                this.loginUserId = this.getModel("USER_SESSION").getSessionAttr("USER_ID");
                this.companyCode = this.getModel("USER_SESSION").getSessionAttr("COMPANY_CODE");
                this.language_cd = this.getModel("USER_SESSION").getSessionAttr("LANGUAGE_CODE");
                
                this.tenant_id = "L2101";
                this.loginUserId = "user@lgensol.com";
                this.companyCode = "LGESL";
                this.language_cd = "KO";

                //this._doInitTablePerso();
                this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            },

            onAfterRendering: function() {
                //this.onSearch();
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
                        this.getView().byId("treeTable").collapseAll();
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

            // onRowSelectionChange: function(oEvent) {
            //     console.log(oEvent);
            //     this.getRouter().navTo("addCreatePage", {
            //         requestNumber: "CCR2102050022"
            //     }, true);
                
            // }

            onExportPress: function (_oEvent) {
                var oTable = this.byId("treeTable");
                var aTreeData;
                var sFileName = "Part Category List_"+ this._getDTtype();
                
                var oData = this.getModel("tree").getProperty("/pdPartCategoryView"); //binded Data
                aTreeData = oData.list.results;

                ExcelUtil.fnExportExcel({
                    fileName: sFileName || "SpreadSheet",
                    table   : oTable,
                    data    : aTreeData
                });
            },

            onMainTablePersoButtonPressed: function (event) {
                this._oTPC.openDialog();
            },

            onMainTablePersoRefresh: function () {
                MainListPersoService.resetPersData();
                this._oTPC.refresh();
            },

            _doInitTablePerso: function(){
                this._oTPC = new TablePersoController({
                    table: this.byId("treeTable"),
                    componentName: "partCategoryMgt",
                    persoService: MainListPersoService,
                    hasGrouping: true
                }).activate();
            },
            
            _getDTtype: function (StartFlag, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();
 
            let sReturnValue = iYear + this._getPreZero(iMonth) + this._getPreZero(iDate);                      

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        }


        });
    }
);