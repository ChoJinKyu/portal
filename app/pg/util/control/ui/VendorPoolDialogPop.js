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
    var vendorPoolDialogPop = Parent.extend("pg.util.control.ui.VendorPoolDialogPop", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em" },
                keyField: { type: "string", group: "Misc", defaultValue: "vendor_pool_code" },
                textField: { type: "string", group: "Misc", defaultValue: "vendor_pool_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            that = this;
            this.oVendorPoolCodePop = new Input({ placeholder: this.getModel("I18N").getText("/VENDOR_POOL_CODE") });
            this.oVendorPoolLocalNamePop = new Input({ placeholder: this.getModel("I18N").getText("/VENDOR_POOL_LOCAL_NAME") });

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                        this.oVendorPoolCodePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_LOCAL_NAME") }),
                        this.oVendorPoolLocalNamePop
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                })
            ];
        },

        createTableColumns: function () {
            return [
                new Column({
                    width: "20%",
                    label: new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT_CODE") }),
                    template: new Text({ text: "{operation_unit_code}" })
                }),
                new Column({
                    width: "25%",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "55%",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_LOCAL_NAME") }),
                    template: new Text({ text: "{level_path}" })
                })
            ];
        },

        loadData: function () {
            
            var sVendorPoolCodePop = this.oVendorPoolCodePop.getValue();
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanent_id)
            ];

            if (sVendorPoolCodePop) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("vendor_pool_path_code", FilterOperator.Contains, "'" + sVendorPoolCodePop.toUpperCase() + "'")
                        ],
                        and: false
                    })
                );
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpInfoLeafView", {
                filters: aFilters,
                sorters: [
                    new Sorter("vendor_pool_code", true)
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
            this.loadData();
            this.oDialog.open();
        }
    });

    return vendorPoolDialogPop;
}, /* bExport= */ true);
