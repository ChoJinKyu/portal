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
    "sap/m/SearchField",
    "ext/pg/util/control/ui/VendorPoolDialogPop"
], function (
    Parent, 
    Renderer, 
    ODataV2ServiceProvider, 
    Filter, 
    FilterOperator, 
    Sorter, 
    GridData, 
    VBox, 
    Column, 
    Label, 
    Text, 
    Input, 
    ComboBox, 
    Item, 
    SearchField,
    VendorPoolDialogPop
    ) {
    "use strict";
    var that;
    var vendorPoolDialogPop = Parent.extend("pg.util.control.ui.VendorPoolDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "60em" },
                keyField: { type: "string", group: "Misc", defaultValue: "vendor_pool_code" },
                textField: { type: "string", group: "Misc", defaultValue: "vendor_pool_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function () {
            that = this;
            this.oPlant = new Input({ placeholder: this.getModel("I18N").getText("/PLANT") });
            this.oOperationOrg = new Input({ placeholder: this.getModel("I18N").getText("/OPERATION_ORG") });

            var oItemTemplate = new sap.ui.core.Item({
                key: "{code}",
                text: "{code_name}"
            });

            this.oOperationUnitComb = new ComboBox({
                id: "operationUint",
                items: {
                    path: "/items",
                    template: oItemTemplate
                }
            });

            this.oVendorPoolCode = new Input({
                placeholder : this.getModel("I18N").getText("/VENDOR_POOL_CODE"),
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oVendorPoolDialogPop = new VendorPoolDialogPop({
                        multiSelection: false,
                        keyField: "VENDOR_POOL_CODE",
                        textField: "VENDOR_POOL_NAME",
                        filters: [
                            new VBox({
                                items: [
                                    new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
                                    new Input({placeholder : this.getModel("I18N").getText("/VENDOR_POOL_CODE")})
                                ],
                                layoutData: new GridData({ span: "XL2 L3 M5 S10" })
                            })
                        ],
                        columns: [
                            new Column({
                                width: "75%",
                                label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
                                template: new Text({ text: "vendorpool code" })
                            }),
                            new Column({
                                width: "25%",
                                hAlign: "Center",
                                label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
                                template: new Text({ text: "vendorpool name" })
                            })
                        ]
                    });

                    this.oVendorPoolDialogPop.setContentWidth("300px");
                    var sSearchObj = {};
                    sSearchObj.tanent_id = "L2100";
                    //sSearchObj.vendor_pool_code = oSearchValue;
                    this.oVendorPoolDialogPop.open(sSearchObj);
                    this.oVendorPoolDialogPop.attachEvent("apply", function (oEvent) {
                        console.log("oEvent : ", oEvent.mParameters.item);
                    }.bind(this));
                }
            });

            //this.oVendorPoolCode.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/PLANT") }),
                        this.oPlant
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_ORG") }),
                        this.oOperationOrg
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT") }),
                        this.oOperationUnitComb
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                        this.oVendorPoolCode
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

            this.oTable.setBusy(true);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpInfoLeafView", {
                filters: aFilters,
                sorters: [
                    new Sorter("vendor_pool_code", true)
                ],
                success: function (oData) {
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                    this.oTable.setBusy(false);
                }, error: function(e){
                    console.log(e);
                }.bind(this)
            });
        },

        loadOperationUnitData: function () {
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
            aFilters.push(new Filter("group_code", FilterOperator.EQ, "SP_SM_SUPPLIER_TYPE"));

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/xx.util.CommonService/").read("/Code", {
                filters: aFilters,
                success: function (oData) {
                    var mData = {
                        items : oData.results
                    };
                    var oModel = new sap.ui.model.json.JSONModel(mData);
                    that.oOperationUnitComb.setModel(oModel);
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
            this.loadOperationUnitData();
            this.oDialog.open();
        }
    });

    return vendorPoolDialogPop;
}, /* bExport= */ true);
