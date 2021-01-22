sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    //"./NpSearchService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",
    'sap/m/Label',
    'sap/m/SearchField',
    "ext/lib/util/ValidatorUtil",
    "sap/f/library",
    "ext/lib/util/ControlUtil",
    "ext/dp/util/control/ui/MaterialMasterDialog"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        History,
        JSONModel,
        TreeListModel,
        TransactionManager,
        ManagedModel,
        ManagedListModel,
        DateFormatter,
        TablePersoController,
        //NpSearchService,
        Filter,
        FilterOperator,
        Fragment,
        Sorter,
        MessageBox,
        MessageToast,
        ColumnListItem,
        ObjectIdentifier,
        Text,
        Token,
        Input,
        ComboBox,
        Item,
        Element,
        syncStyleClass,
        Label,
        SearchField,
        ValidatorUtil,
        library,
        ControlUtil,
        MaterialMasterDialog
    ) {
        "use strict";
        var that;
        return BaseController.extend("pg.vp.npMst.controller.MainList", {
            //dateFormatter: DateFormatter,
            onInit: function () {
                console.log("MainList Init!!!");
                var oViewModel,
                    oResourceBundle = this.getResourceBundle();

                this.oRouter = this.getOwnerComponent().getRouter();

                // Model used to manipulate control states
                oViewModel = new JSONModel({
                    headerExpanded: true,
                    mainListTableTitle: oResourceBundle.getText("mainListTableTitle"),
                    tableNoDataText: oResourceBundle.getText("tableNoDataText")
                });
                this.setModel(oViewModel, "mainListView");

                // Add the mainList page to the flp routing history
                this.addHistoryEntry({
                    title: oResourceBundle.getText("mainListViewTitle"),
                    icon: "sap-icon://table-view",
                    intent: "#Template-display"
                }, true);

                this.setModel(new ManagedListModel(), "list");
                this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
                that = this;
            },

            _onRoutedThisPage: function () {
                this.sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";
                that.mainTable = this.byId("mainTable");
                that.byId("search_effective_end_date").setEditable(false);
                //this.statusKey = oEvent.getSource().getProperty("selectedKey");
            },

            onStatusChange: function (oEvent) {
                this.statusKey = oEvent.getSource().getProperty("selectedKey");
                //console.log("statusKey" + statusKey);
                that.byId("search_effective_end_date").setValue(null);

                if (this.statusKey === "all" || this.statusKey === "effPrc") {
                    that.byId("search_effective_end_date").setValue("9999.12.31");
                    that.byId("search_effective_end_date").setEditable(false);
                } else {
                    that.byId("search_effective_end_date").setValue(that.getToday());
                    that.byId("search_effective_end_date").setEditable(true);
                }
            },

            getToday: function (dateObj) {
                var date = new Date();
                if (dateObj === undefined) {
                    date = new Date();
                } else {
                    date = dateObj;
                }
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);

                return year + "." + month + "." + day;
            },

            formatDate: function (date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('');
            },

            fnSearch: function () {

                // that.mainTable.clearSelection();
                var status = "";
                var oFilter = [];
                var aFilter = [];
                var searchOperationOrg = [];

                if (this.sSurffix === "E") {
                    status = that.byId("status_e").getSelectedKey();
                    searchOperationOrg = that.byId("search_operation_org_e").getSelectedKeys();
                }

                if (this.sSurffix === "S") {
                    status = that.byId("status_s").getSelectedKey();
                    searchOperationOrg = that.byId("search_operation_org_s").getSelectedKeys();
                }

                //console.log("searchOperationOrg:" + searchOperationOrg);
                if (searchOperationOrg.length > 0) {
                    for (var i = 0; i < searchOperationOrg.length; i++) {
                        aFilter.push(new Filter("org_code", FilterOperator.EQ, searchOperationOrg[i]));
                    }
                    oFilter.push(new Filter(aFilter, false));
                }

                var supplierCode = that.byId("search_supplier_code").getValue();

                if (!!supplierCode) {
                    oFilter.push(new Filter("supplier_code", FilterOperator.EQ, supplierCode));
                }

                var materialCode = that.byId("search_material_code").getValue();

                if (!!materialCode) {
                    oFilter.push(new Filter("material_code", FilterOperator.EQ, materialCode));
                }

                var netPriceDocumentTypeCode = that.byId("search_document").getSelectedKey();

                if (!!netPriceDocumentTypeCode) {
                    oFilter.push(new Filter("net_price_document_type_code", FilterOperator.EQ, netPriceDocumentTypeCode));
                }

                var netPriceType = that.byId("search_net_price_type").getSelectedKey();

                if (!!netPriceType) {
                    oFilter.push(new Filter("net_price_type_code", FilterOperator.EQ, netPriceType));
                }

                var searchEffectiveEndDate = that.byId("search_effective_end_date").getValue().replace(/\./gi, "");
                var searchEffectiveStartDate = that.byId("search_effective_start_date");

                if (!!searchEffectiveEndDate) {
                    if (status === "all" || status === "expPrc") {
                        oFilter.push(new Filter("effective_end_date", FilterOperator.LE, searchEffectiveEndDate));
                    } else if (status === "effPrc") {
                        oFilter.push(new Filter("effective_end_date", FilterOperator.GE, that.getToday().replace(/\./gi, "")));
                    }
                }

                if (!!searchEffectiveStartDate.getValue()) {
                    oFilter.push(new Filter("effective_start_date", FilterOperator.BT,
                        this.formatDate(searchEffectiveStartDate.getDateValue()),
                        this.formatDate(searchEffectiveStartDate.getSecondDateValue())
                    ));
                }

                oFilter.push(new Filter("language_cd", FilterOperator.EQ, "KO"));

                var oDataLen = 0;
                var oView = this.getView(),
                    oModel = this.getModel("list");

                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/SpNetpriceView", {
                    filters: oFilter,
                    success: function (oData) {
                        oDataLen = oData.results.length;

                        // that.mainTable.setVisibleRowCount(0);
                        // var oColumn = that.mainTable.getColumns()[0];
                        // that.mainTable.sort(oColumn);
                        console.log(oDataLen);

                        // that.mainTable.onAfterRendering = function () {
                        //     sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
                        //     var aRows = that.mainTable.getRows();
                        //     if (aRows && aRows.length > 0) {
                        //         var pRow = {};
                        //         for (var i = 0; i < aRows.length; i++) {
                        //             if (i > 0) {
                        //                 var pCell = pRow.getCells()[0],
                        //                     cCell = aRows[i].getCells()[0];
                        //                 console.log(cCell.getText(), pCell.getText());
                        //                 if (cCell.getText() === pCell.getText()) {
                        //                     $("#" + cCell.getId()).css("visibility", "hidden");
                        //                     $("#" + pRow.getId() + "-col0").css("border-bottom-style", "hidden");
                        //                 }

                        //                 var pCell1 = pRow.getCells()[1],
                        //                     cCell1 = aRows[i].getCells()[1];
                        //                 console.log(cCell.getText(), pCell.getText());
                        //                 if (cCell1.getText() === pCell1.getText()) {
                        //                     $("#" + cCell1.getId()).css("visibility", "hidden");
                        //                     $("#" + pRow.getId() + "-col1").css("border-bottom-style", "hidden");
                        //                 }


                        //             }
                        //             pRow = aRows[i];
                        //         }
                        //     }
                        //     console.log(oDataLen);
                        //     that.mainTable.setVisibleRowCount(oDataLen);
                            oView.setBusy(false);
                        // };
                    }
                });
            },

            cvtStringToDate: function (str) {
                if (!!str) {
                    var yyyy = str.substring(0, 4);
                    var mm = str.substring(4, 6);
                    var dd = str.substring(6, 8);
                    return yyyy + "." + mm + "." + dd;
                }
            },

            vhMatrialCode: function (oEvent) {
                var materialItem;

                if (!this.oSearchMultiMaterialMasterDialog) {
                    this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                        title: "Choose MaterialMaster",
                        MultiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });
                    this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function (oEvent) {
                        materialItem = oEvent.mParameters.item;
                        //console.log("materialItem : ", materialItem);
                        that.byId("search_material_code").setValue(materialItem.material_code);

                    }.bind(this));
                }
                this.oSearchMultiMaterialMasterDialog.open();
            },

            cvtSupplier: function (oEvent) {
                console.log(oEvent);
            },

            /**
                 * Rounds the number unit value to 2 digits
                 * @public
                 * @param {string} sValue the number string to be rounded
                 * @returns {string} sValue with 2 digits rounded
                 */
            numberUnit: function (sValue) {
                if (!sValue) {
                    return "";
                }

                sValue = sValue.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
                return parseFloat(sValue).toFixed(2);
            },

            comma: function (str) {
                str = String(str);
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            }
        });
    });