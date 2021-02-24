sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/util/ExcelUtil",
    "sap/ui/core/Fragment",
    "ext/lib/model/TreeListModel"
], function (BaseController, Multilingual, History, JSONModel, ManagedListModel, Formatter, DateFormatter, Validator, TablePersoController,
    MainListPersoService, Filter, FilterOperator, MessageBox, MessageToast, ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, ExcelUtil, Fragment, TreeListModel) {
    "use strict";

    return BaseController.extend("dp.pd.activityStandardDayMgt.controller.MainList", {

        formatter: Formatter,
        dateFormatter: DateFormatter,
        validator: new Validator(),

        onInit: function () {
            var oViewModel = this.getResourceBundle();
            oViewModel = new JSONModel({
                headerExpanded: true,
                readMode: false,
                editMode: false
            });
            this.setModel(oViewModel, "mainListView");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.getView().setModel(new ManagedListModel(), "list");
            this.getView().setModel(this.getOwnerComponent().getModel());

            oMultilingual.attachEvent("ready", function (oEvent) {
                var oi18nModel = oEvent.getParameter("model");
                this.addHistoryEntry({
                    title: oi18nModel.getText("/Activity Standard Day Management"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);
            }.bind(this));

            //this.byId("btn_search").firePress();
            this._doInitTablePerso();
        },

        onMainTablePersoButtonPressed: function (event) {
            this._oTPC.openDialog();
        },

        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();

                if(this.byId("searchCompanyCombo").getSelectedKey() === "" && this.validator.validate(this.byId("searchCompanyCombo")) !== true) {
                    MessageToast.show(this.getModel("I18N").getText("/ECM01001"));
                    return;
                } else {
                    this.validator.clearValueState(this.byId("searchCompanyCombo"));
                }
                
                this._applySearch(aSearchFilters);
            }
        },

        _applySearch: function (aSearchFilters) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());

            var oTable = this.byId("mainTable");
            oModel.read("/pdActivityStdDayView", {
                filters: aSearchFilters,
                success: function (oData) {
                    oView.setBusy(false);
                }.bind(this)
            });
        },

        _getSearchStates: function () {
            var sTenantId = "L2101",
                oSearchCompanyCombo = this.getView().byId("searchCompanyCombo").getSelectedKey(),
                oSearchAUCombo = this.getView().byId("searchAUCombo").getSelectedKey(),
                oSearchPCField = this.getView().byId("searchPCField").getValue(),
                oSearchPCFieldTx = this.getView().byId("searchPCInputTx").getValue(),
                oSearchPTCombo = this.getView().byId("searchPTCombo").getSelectedKey(),
                oSearchActivity = this.getView().byId("searchActivity").getValue();

            var aSearchFilters = [
                new Filter("tenant_id", FilterOperator.EQ, sTenantId)
            ];

            if(oSearchCompanyCombo && oSearchCompanyCombo.length > 0) {
                aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, oSearchCompanyCombo));
            }

            if (oSearchAUCombo && oSearchAUCombo.length > 0) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, oSearchAUCombo));
            }

            if (oSearchPCField && oSearchPCField.length > 0) {
                aSearchFilters.push(new Filter("path_name", FilterOperator.EQ, oSearchPCField));
            }

            if (oSearchPCFieldTx && oSearchPCFieldTx.length > 0) {
                aSearchFilters.push(new Filter("category_name", FilterOperator.EQ, oSearchPCFieldTx));
            }
           
            if (oSearchPTCombo && oSearchPTCombo.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("part_project_type_code", FilterOperator.EQ, oSearchPTCombo)
                    ],
                    and: false
                }));
            }
           
            if (oSearchActivity && oSearchActivity.length > 0) {
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("activity_code", FilterOperator.Contains, oSearchActivity),
                        new Filter("activity_name", FilterOperator.Contains, oSearchActivity)
                    ],
                    and: false
                }));
            }

            return aSearchFilters;
        },

        onExportPress: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if (!sTableId) { return; }

            var oTable = this.byId(sTableId);

            var sFileName = "Activity Standard Day Management_"+ this._getDTtype();
            var oData = this.getModel("list").getProperty("/pdActivityStdDayView");

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
        },

        _doInitTablePerso: function(){
			this._oTPC = new TablePersoController({
				table: this.byId("mainTable"),
				componentName: "activityStandardDayMgt",
				persoService: MainListPersoService,
				hasGrouping: true
			}).activate();
        },

        onSearchPartCategory: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();

            if (!this.treeDialog) {
                this.treeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.pd.activityStandardDayMgt.view.PartCategory",
                    controller: this
                }).then(function (tDialog) {
                    oView.addDependent(tDialog);
                    return tDialog;
                }.bind(this));
            }

            this.treeDialog.then(function (tDialog) {
                tDialog.open();
                this.onDialogTreeSearch();
            }.bind(this));
        },

        onDialogTreeSearch: function (oEvent) {

            var treeFilter = [];

            treeFilter.push(new Filter({
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101"),
                    new Filter("category_group_code", FilterOperator.EQ, "CO")
                ],
                and: false
            }));
            
            this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
            this.treeListModel
                .read("/pdPartCategoryView", {
                     filters: treeFilter
                })
                // 성공시
                .then((function (jNodes) {
                    this.getView().setModel(new JSONModel({
                        "pdPartCategoryView": {
                            "nodes": jNodes
                        }
                    }), "tree");

                    //this.onCollapseAll();
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                    this.byId("diatreeTable").collapseAll();
                }).bind(this));
        },

        partCategoryPopupClose: function (oEvent) {
            this.byId("PartCategory").close();
        },

        selectPartCategoryValue: function (oEvent) {
            var row = this.getView().getModel("tree").getObject(oEvent.getParameters().rowContext.sPath);

            this.getView().byId("searchPCField").setValue(row.path_name);
            this.getView().byId("searchPCInput").setValue(row.category_code);
            this.getView().byId("searchPCInputTx").setValue(row.category_name);

            this.partCategoryPopupClose();
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
});
