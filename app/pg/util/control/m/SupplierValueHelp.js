sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/ui/table/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/SearchField",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/ui/layout/GridData"
], function (Parent, Renderer, ODataV2ServiceProvider, Dialog, Button, Text, Table, Column, ColumnListItem, Filter, FilterOperator, Sorter, SearchField, VBox, Label, GridData) {
    "use strict";

    var SupplierValueHelp = Parent.extend("ext.lib.control.m.CodePickerValueHelp", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "60em" },
                keyField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                textField: { type: "string", group: "Misc", defaultValue: "supplier_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            this.oSupplierCode = new SearchField({ placeholder: this.getModel("I18N").getText("/SUPPLIER_CODE") });

            this.oSupplierCode.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                        this.oSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                })
            ];
        },

        createTableColumns: function () {
            return [
                new Column({
                    width: "20%",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "25%",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                    template: new Text({ text: "{supplier_code}" })
                }),
                new Column({
                    width: "55%",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME") }),
                    template: new Text({ text: "{supplier_local_name}" })
                })
            ];
        },

        loadData: function () {
            var sSupplierCode = this.oSupplierCode.getValue();
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanent_id),
                new Filter("vendor_pool_code", FilterOperator.EQ, this.oSearchObj.vendor_pool_code)
            ];

            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanent_id));
            aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.language_cd));
            if (this.oSearchObj.vendor_pool_code) {
                aFilters.push(new Filter("vendor_pool_code", FilterOperator.Contains, this.oSearchObj.vendor_pool_code));
            }

            if (sSupplierCode) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("supplier_code", FilterOperator.Contains, "'" + sSupplierCode.toUpperCase() + "'")
                        ],
                        and: false
                    })
                );
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/VpSupplierDtlView", {
                filters: aFilters,
                sorters: [
                    new Sorter("supplier_code", true)
                ],
                success: function (oData) {
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        },

        open: function () {
            this.oSearchObj = {};
            this.oSearchObj.tanent_id = "L2100";//추후 세션처리
            this.oSearchObj.language_cd = "KO";//추후 세션처리
            //console.log("this.oParent.getValue()::" + this.oParent.getValue());
            if (!!this.oParent.getValue()) {
                this.oSupplierCode.setValue(this.oParent.getValue().toUpperCase());
            }
            //console.log("sSearchObj:" + sSearchObj);
            if (!this.oDialog) {
                this.openWasRequested = true;
                return;
            }
            this.loadData(this.oSearchObj);
            this.oDialog.open();
        },

        onApply: function(oEvent) {
            console.log(oEvent);
        }

    });

    return SupplierValueHelp;
}, /* bExport= */ true);
