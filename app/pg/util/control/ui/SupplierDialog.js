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
    "sap/m/SearchField",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/pg/util/control/ui/VendorPoolDialogPop",
    "ext/pg/util/control/ui/SupplierDialogPop"
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
        SearchField, 
        ComboBox, 
        Item, 
        VendorPoolDialogPop,
        SupplierDialogPop
    ) {
    "use strict";
    var that;
    var supplierDialog = Parent.extend("pg.util.control.ui.SupplierDialog", {

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

            this.oCompany = new Input({ placeholder: this.getModel("I18N").getText("/COMPANY_CODE") });
            this.oOperationOrgComb = new ComboBox({
                id: "operationOrg",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{operation_org_code}",
                        text: "{operation_org_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {
                    console.log("oOperationOrgComb change!!");
                    that.loadOperationChange();
                }
            });

            this.oOperationUnitComb = new ComboBox({
                id: "operationUint",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {
                    console.log("oOperationUnitComb change!!");
                    that.loadOperationChange();
                }
            });

            this.oVendorPoolCode = new Input({
                placeholder : this.getModel("I18N").getText("/VENDOR_POOL_CODE"),
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oVendorPoolDialogPop = new VendorPoolDialogPop({
                        multiSelection: false,
                        keyField: "vendor_pool_code",
                        textField: "vendor_pool_local_name",
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
                    sSearchObj.tanentId = "L2100";
                    sSearchObj.vendorPoolCode = that.oVendorPoolCode.getValue();
                    sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey()
                    sSearchObj.vendorPoolCode = that.oOperationUnitComb.getSelectedKey()

                    this.oVendorPoolDialogPop.open(sSearchObj);
                    this.oVendorPoolDialogPop.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        that.oVendorPoolCode.setValue(null);
                        that.oVendorPoolCode.setValue(oEvent.mParameters.item.vendor_pool_code);
                    }.bind(this));
                }
            });

            this.oSupplierCode = new Input({
                placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE"),
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oSupplierDialogPop = new SupplierDialogPop({
                        multiSelection: false,
                        keyField: "supplier_code",
                        textField: "supplier_local_name",
                        filters: [
                            new VBox({
                                items: [
                                    new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
                                    new Input({placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE")})
                                ],
                                layoutData: new GridData({ span: "XL2 L3 M5 S10" })
                            })
                        ],
                        columns: [
                            new Column({
                                width: "75%",
                                label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
                                template: new Text({ text: "supplier_local_name" })
                            }),
                            new Column({
                                width: "25%",
                                hAlign: "Center",
                                label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
                                template: new Text({ text: "supplier_code" })
                            })
                        ]
                    });

                    this.oSupplierDialogPop.setContentWidth("300px");
                    var sSearchObj = {};
                    sSearchObj.tanentId = "L2100";
                    sSearchObj.languageCd = "KO";
                    sSearchObj.supplierCode = that.oSupplierCode.getValue();
                    sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey()
                    sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey()

                    this.oSupplierDialogPop.open(sSearchObj);
                    this.oSupplierDialogPop.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        that.oSupplierCode.setValue(null);
                        that.oSupplierCode.setValue(oEvent.mParameters.item.supplier_code);
                    }.bind(this));
                }
            });

        return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE") }),
                        this.oCompany
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_ORG") }),
                        this.oOperationOrgComb
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT") }),
                        this.oOperationUnitComb
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                        this.oVendorPoolCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                        this.oSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                })
            ]
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

        loadOperationChange: function() {
            if (that.oOperationOrgComb.getSelectedKey() && that.oOperationUnitComb.getSelectedKey()) {
                //console.log("stisfy!!!!", that.oOperationOrgComb.getSelectedKey(), that.oOperationUnitComb.getSelectedKey());
                //that.loadoVendorPoolLvlData();
            }
        },

        loadOperationOrgData: function () {
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolSearchService/").read("/VpOperationOrg", {
                filters: aFilters,
                sorters: [
                    new Sorter("operation_org_code", false)
                ],
                success: function (oData) {
                    var mData = {
                        items : oData.results
                    };
                    var oModel = new sap.ui.model.json.JSONModel(mData);
                    that.oOperationOrgComb.setModel(oModel);
                    //that.oSearchObj.operationOrg 넘겨 받은 값에 있을 경우 셋팅 해주고 
                    //임시로 셋팅 해둔다
                    that.oOperationOrgComb.setSelectedKey("BIZ00300").fireChange();
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
                    //that.oSearchObj.operationUnit 넘겨 받은 값에 있을 경우 셋팅 해주고 
                    //임시로 셋팅 해둔다
                    that.oOperationUnitComb.setSelectedKey("RAW_MATERIAL").fireChange();
                }.bind(this)
            });
        },

        loadData: function () {
            // if (this.oSearchObj.supplier_code) {
            //     this.oSupplierCode.setValue(this.oSearchObj.supplier_code);
            // }
            // var sSupplierCode = this.oSupplierCode.getValue();

            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            if (this.oSearchObj.vendorPoolCode) {
                aFilters.push(new Filter("vendor_pool_code", FilterOperator.Contains, this.oSearchObj.vendorPoolCode));
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

        open: function(sSearchObj){
            this.oSearchObj = sSearchObj;
            console.log("sSearchObj:" + sSearchObj);
            if(!this.oDialog) {
                this.openWasRequested = true;
                return;
            }
            //this.loadData();
            this.loadOperationOrgData();
            this.loadOperationUnitData();
            this.oDialog.open();
        }

    });

    return supplierDialog;
}, /* bExport= */ true);
