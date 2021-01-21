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
    "sap/m/SearchField"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, SearchField) {
    "use strict";

    var vendorPoolDialog = Parent.extend("pg.util.control.ui.VendorPoolDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "60em" },
                keyField: { type: "string", group: "Misc", defaultValue: "idea_manager_empno" },
                textField: { type: "string", group: "Misc", defaultValue: "idea_manager_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            this.oVendorPoolCode = new SearchField({ placeholder: this.getModel("I18N").getText("/VENDOR_POOL_CODE") });
            //this.oBizunitCode = new SearchField({ placeholder: this.getModel("I18N").getText("/BIZUNIT_CODE") });
            //this.oLocalUserName = new SearchField({ placeholder: this.getModel("I18N").getText("/LOCAL_USER_NAME") });

            this.oVendorPoolCode.attachEvent("change", this.loadData.bind(this));
            //this.oBizunitCode.attachEvent("change", this.loadData.bind(this));
            //this.oLocalUserName.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                        this.oVendorPoolCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                })
                //,
                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/BIZUNIT_CODE") }),
                //         this.oBizunitCode
                //     ],
                //     layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                // }),
                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/LOCAL_USER_NAME") }),
                //         this.oLocalUserName
                //     ],
                //     layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                // })
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
            if (this.oSearchObj.vendor_pool_code) {
                this.oVendorPoolCode.setValue(this.oSearchObj.vendor_pool_code);
            }
            var sVendorPoolCode = this.oVendorPoolCode.getValue();
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanent_id)
            ];

            if (sVendorPoolCode) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("vendor_pool_path_code", FilterOperator.Contains, "'" + sVendorPoolCode.toUpperCase() + "'")
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
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        },

        open: function(sSearchObj){
            this.oSearchObj = sSearchObj;
            console.log("sSearchObj:" + sSearchObj);
            if(!this.oDialog) {
                this.openWasRequested = true;
                return;
            }
            this.loadData();
            this.oDialog.open();
        }

    });

    return vendorPoolDialog;
}, /* bExport= */ true);
