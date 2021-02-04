sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/SearchField"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, ComboBox, Item, SearchField) {
    "use strict";
    var that;
    var supplierDialogPop = Parent.extend("pg.util.control.ui.SupplierDialogPop", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em" },
                keyField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                textField: { type: "string", group: "Misc", defaultValue: "supplier_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            that = this;
            this.oSupplierCodePop = new Input({ placeholder: this.getModel("I18N").getText("/SUPPLIER_CODE") });
            this.oSupplierNamePop = new Input({ placeholder: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME") });

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                        this.oSupplierCodePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME") }),
                        this.oSupplierNamePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                })
            ];
        },

        createTableColumns: function () {
            return [
                new Column({
                    width: "20%",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                    template: new Text({ text: "{supplier_code}" })
                }),
                new Column({
                    width: "35%",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME") }),
                    template: new Text({ text: "{supplier_local_name}" })
                }),
                new Column({
                    width: "35%",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_ENGLISH_NAME") }),
                    template: new Text({ text: "{supplier_english_name}" })
                }),
                new Column({
                    width: "10%",
                    label: new Label({ text: this.getModel("I18N").getText("/STATUS") }),
                    template: new Text({ text: "{inactive_status_name}" })
                })
            ];
        },

        loadData: function () {
            var aFilters = [];
            var sSupplierCodePop = this.oSupplierCodePop.getValue();
            var sSupplierNamePop = this.oSupplierNamePop.getValue();

            if (!!this.oSearchObj.tanentId) {
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            }

            if (!!this.oSearchObj.languageCd) {
                aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.languageCd));
            }

            if (!!this.oSearchObj.companyCode) {
                aFilters.push(new Filter("company_code", FilterOperator.EQ, this.oSearchObj.companyCode)); 
            }

            if (!!this.oSearchObj.orgCode) {
                aFilters.push(new Filter("org_code", FilterOperator.EQ, this.oSearchObj.orgCode));
            }

            if (!!this.oSearchObj.orgUnitCode) {
                aFilters.push(new Filter("supplier_type_code", FilterOperator.EQ, this.oSearchObj.orgUnitCode));
            }

            if (!!sSupplierCodePop) {
                aFilters.push(new Filter("supplier_code", FilterOperator.Contains, "'" + sSupplierCodePop.toUpperCase() + "'"));
            }

            if (!!sSupplierNamePop) {
                aFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, "'" + sSupplierNamePop.toUpperCase() + "'"));
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/VpSupplierMstView", {
                filters: aFilters,
                sorters: [
                    new Sorter("supplier_code", true)
                ],
                success: function (oData) {
                    var aRecords = oData.results;
                    that.oDialog.setData(aRecords, false);
                    this.oDialog.oTable.setBusy(false);
                }.bind(this)
            });
        },

        open: function (sSearchObj) {
            this.oSearchObj = sSearchObj;
            console.log("sSearchObj:" + sSearchObj);
            if (!this.oDialog) {
                this.openWasRequested = true;
                return;
            }

            // if (!!this.oSearchObj.supplierCode) {
            //     this.oSupplierCodePop.setValue(null);
            //     this.oSupplierCodePop.setValue(this.oSearchObj.supplierCode);
            // }
            //this.loadData();
            this.oDialog.open();
        }
    });

    return supplierDialogPop;
}, /* bExport= */ true);
