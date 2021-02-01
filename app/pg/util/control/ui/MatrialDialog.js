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
    SearchField
    )
    {
    "use strict";

    var martrialDialog = Parent.extend("pg.util.control.ui.MartrialDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "60em" },
                keyField: { type: "string", group: "Misc", defaultValue: "idea_manager_empno" },
                textField: { type: "string", group: "Misc", defaultValue: "idea_manager_name" }
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
                        console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        that.oVendorPoolCode.setValue(null);
                        that.oVendorPoolCode.setValue(oEvent.mParameters.item.vendor_pool_code);
                    }.bind(this));
                }
            });


            this.oMaterialCode = new SearchField({ placeholder: this.getModel("I18N").getText("/SUPPLIER_CODE") });

            this.oMaterialCode.attachEvent("change", this.loadData.bind(this));

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
                    width: "20%",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "20%",
                    label: new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE") }),
                    template: new Text({ text: "{material_code}" })
                }),
                new Column({
                    width: "40%",
                    label: new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC") }),
                    template: new Text({ text: "{material_desc}" })
                })
            ];
        },

        loadData: function () {
            if (this.oSearchObj.material_code) {
                this.oMaterialCode.setValue(this.oSearchObj.material_code);
            }
            var sMaterialCode = this.oMaterialCode.getValue();
            var aFilters = [
                new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanent_id),
                new Filter("vendor_pool_code", FilterOperator.EQ, this.oSearchObj.vendor_pool_code)
            ];

            if (sSupplierCode) {
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("material_code", FilterOperator.Contains, "'" + sMaterialCode.toUpperCase() + "'")
                        ],
                        and: false
                    })
                );
            }
            
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpMaterialDtlView", {
                filters: aFilters,
                sorters: [
                    new Sorter("material_code", true)
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

    return martrialDialog;
}, /* bExport= */ true);
