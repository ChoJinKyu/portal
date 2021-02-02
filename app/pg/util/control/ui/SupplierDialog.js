sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/SearchField",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/pg/util/control/ui/SupplierDialogPop",
    "ext/pg/util/control/ui/MatrialDialogPop"
], function (
        Parent, 
        Renderer, 
        ODataV2ServiceProvider, 
        Filter, 
        FilterOperator, 
        Sorter, 
        GridData, 
        VBox,
        HBox, 
        Column, 
        Label, 
        Text, 
        Input, 
        SearchField, 
        ComboBox, 
        Item, 
        SupplierDialogPop,
        MatrialDialogPop
    ) {
    "use strict";
    var that;
    var supplierDialog = Parent.extend("pg.util.control.ui.SupplierDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "60em" },
                keyField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                textField: { type: "string", group: "Misc", defaultValue: "supplier_local_name" }
            }
        },

        renderer: Renderer,
        
        // 검색조건 필터 화면
        createSearchFilters: function () {
            that = this;

            this.oCompany = new Input({ placeholder: this.getModel("I18N").getText("/COMPANY_CODE") });

            this.oOperationOrgComb = new ComboBox({
                id: "operationOrgSp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{operation_org_code}",
                        text: "{operation_org_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {
                    that.loadOperationChange();
                }
            });

            this.oOperationUnitComb = new ComboBox({
                id: "operationUnitSp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {
                    that.loadOperationChange();
                }
            });

            this.oVendorPoolLvl1 = new ComboBox({
                id: "vendorPoolLvl1Sp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                selectionChange: function (oEvent) {
                    that.loadoVendorPoolLvlData("2");
                }.bind(this)
            });
            
            this.oVendorPoolLvl2 = new ComboBox({
                id: "vendorPoolLvl2Sp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                selectionChange: function (oEvent) {
                    that.loadoVendorPoolLvlData("3");
                }.bind(this)
            });

            this.oVendorPoolLvl3 = new ComboBox({
                id: "vendorPoolLvl3Sp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                selectionChange: function (oEvent) {
                    that.loadoVendorPoolLvlData("4");
                }.bind(this)
            });

            this.oVendorPoolLvl4 = new ComboBox({
                id: "vendorPoolLvl4Sp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                },
                selectionChange: function (oEvent) {
                    that.loadoVendorPoolLvlData("5");
                }.bind(this)
            });

            this.oVendorPoolLvl5 = new ComboBox({
                id: "vendorPoolLvl5Sp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                }
            });

            this.oSupplierCode = new Input({
                placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE"),
                showValueHelp : true,
                valueHelpOnly : false,
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

            this.oMatrialCode = new Input({
                //placeholder : this.getModel("I18N").getText("/MATRIAL_CODE"),
                placeholder : "Part No",
                showValueHelp : true,
                valueHelpOnly : false,
                valueHelpRequest: function (oEvent) {
                    this.oMatrialDialogPop = new MatrialDialogPop({
                        multiSelection: false,
                        keyField: "material_code",
                        textField: "material_desc",
                        filters: [
                            new VBox({
                                items: [
                                    new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
                                    new Input({placeholder : this.getModel("I18N").getText("/PART")})
                                ],
                                layoutData: new GridData({ span: "XL2 L3 M5 S10" })
                            })
                        ],
                        columns: [
                            new Column({
                                width: "75%",
                                label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
                                template: new Text({ text: "material_desc" })
                            }),
                            new Column({
                                width: "25%",
                                hAlign: "Center",
                                label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
                                template: new Text({ text: "material_code" })
                            })
                        ]
                    });

                    this.oMatrialDialogPop.setContentWidth("300px");
                    var sSearchObj = {};
                    sSearchObj.tanentId = "L2100";
                    sSearchObj.languageCd = "KO";
                    sSearchObj.companyCode = "LGCKR";
                    sSearchObj.matrialCode = that.oMatrialCode.getValue();
                    sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey()
                    sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey()

                    this.oMatrialDialogPop.open(sSearchObj);
                    this.oMatrialDialogPop.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        that.oMatrialCode.setValue(null);
                        that.oMatrialCode.setValue(oEvent.mParameters.item.material_code);
                    }.bind(this));
                }
            });

            this.oManagerComb = new ComboBox({
                id: "managerSp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{employee_number}",
                        text: "{user_local_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {

                }.bind(this)
            });

            this.oDepartmentComb = new ComboBox({
                id: "departmentSp",
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{department_id}",
                        text: "{department_local_name}"
                    })
                },
                width : "100%",
                change: function(oEvent) {

                }.bind(this)
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
                new HBox({
                    items: [
                        new VBox({
                            items: [
                                new Label({ text: "level1" }),
                                this.oVendorPoolLvl1
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: "level2" }),
                                this.oVendorPoolLvl2
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: "level3" }),
                                this.oVendorPoolLvl3
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: "level4" }),
                                this.oVendorPoolLvl4
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: "level5" }),
                                this.oVendorPoolLvl5
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        })
                    ],
                    layoutData: new GridData({ span: "XL12 L12 M12 S12" })

                }),
               
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                        this.oSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),

                new VBox({
                    items: [
                        //new Label({ text: this.getModel("I18N").getText("/MATRIAL_CODE") }),
                        new Label({ text: "Part No" }),
                        this.oMatrialCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MANAGER") }),
                        this.oManagerComb
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/DEPARTMENT") }),
                        this.oDepartmentComb
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

        loadTenantCode: function() {
            if (this.oSearchObj.tanentId) {
                that.oCompany.setValue(this.oSearchObj.tanentId);
            }
        },


        loadOperationChange: function() {
            if (that.oOperationOrgComb.getSelectedKey() && that.oOperationUnitComb.getSelectedKey()) {
                that.loadoVendorPoolLvlData();
            }
        },

        loadOperationOrgData: function () {
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));

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
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
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

        loadDepartmentData: function () {
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/cm.util.HrService/").read("/Department", {
                filters: aFilters,
                success: function (oData) {
                    var mData = {
                        items : oData.results
                    };
                    var oModel = new sap.ui.model.json.JSONModel(mData);
                    that.oDepartmentComb.setModel(oModel);
                    //that.oSearchObj.operationUnit 넘겨 받은 값에 있을 경우 셋팅 해주고 
                    //임시로 셋팅 해둔다
                    //that.oDepartmentComb.setSelectedKey("11510001").fireChange();
                }.bind(this)
            });
        },

        loadManagerData: function () {
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/cm.util.HrService/").read("/Employee", {
                filters: aFilters,
                success: function (oData) {
                    var mData = {
                        items : oData.results
                    };
                    var oModel = new sap.ui.model.json.JSONModel(mData);
                    that.oManagerComb.setModel(oModel);
                    //that.oSearchObj.operationUnit 넘겨 받은 값에 있을 경우 셋팅 해주고 
                    //임시로 셋팅 해둔다
                    //that.oManagerComb.setSelectedKey("10010").fireChange();
                }.bind(this)
            });
        },

        loadData: function () {
            var sSupplierCode;
            if (!!this.oSupplierCode.getValue()) {
                sSupplierCode = this.oSupplierCode.getValue();
            }

            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.language));
            
            if (this.oSearchObj.vendorPoolCode) {
                aFilters.push(new Filter("vendor_pool_code", FilterOperator.Contains, this.oSearchObj.vendorPoolCode));
            }
            
            if (sSupplierCode) {
                aFilters.push(new Filter("supplier_code", FilterOperator.Contains, "'" + sSupplierCode.toUpperCase() + "'"));
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

        // loadVpData: function (level) {

        //     this.oVendorPoolCode.setValue(null);
        //     this.oDialog.oMultiInput.setTokens(null)

        //     this.oDialog.oTable.clearSelection();
        //     if (this.oSearchObj.vendorPoolCode) {
        //         this.oVendorPoolCode.setValue(this.oSearchObj.vendorPoolCode);
        //     }
        //     var sVendorPoolCode = this.oVendorPoolCode.getValue();
        //     var aFilters = [];
          
        //     aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));

        //     if (level === undefined) {
        //         level = "1";
        //         aFilters.push(new Filter("vendor_pool_level", FilterOperator.EQ, level));
        //     }

        //     switch (level) {
        //         case "2" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl1.getSelectedKey())); break;
        //         case "3" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl2.getSelectedKey())); break;
        //         case "4" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl3.getSelectedKey())); break;
        //         case "5" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl4.getSelectedKey())); break;
        //     }

        //     if (sVendorPoolCode) {
        //         aFilters.push(
        //             new Filter({
        //                 filters: [
        //                     new Filter("vendor_pool_path_code", FilterOperator.Contains, "'" + sVendorPoolCode.toUpperCase() + "'")
        //                 ],
        //                 and: false
        //             })
        //         );
        //     }

        //     ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpInfoDrillAllView", {
        //         filters: aFilters,
        //         sorters: [
        //             new Sorter("vendor_pool_code", true)
        //         ],
        //         success: function (oData) {
        //             var aRecords = oData.results;
        //             that.oDialog.setData(aRecords, false);
        //             this.oDialog.oTable.setBusy(false);
        //         }.bind(this)
        //     });
        // },

        loadoVendorPoolLvlData: function (level) {
            
            var aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            if (level === undefined) {
                level = "1";
            }

            aFilters.push(new Filter("vendor_pool_level", FilterOperator.EQ, level));
            aFilters.push(new Filter("org_code", FilterOperator.EQ, that.oOperationOrgComb.getSelectedKey()));
            aFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, that.oOperationUnitComb.getSelectedKey()));

            switch (level) {
                case "2" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl1.getSelectedKey())); break;
                case "3" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl2.getSelectedKey())); break;
                case "4" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl3.getSelectedKey())); break;
                case "5" : aFilters.push(new Filter("parent_code", FilterOperator.EQ, this.oVendorPoolLvl4.getSelectedKey())); break;
            }
            
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolSearchService/").read("/vpCodeView", {
                filters: aFilters,
                sorters: [
                    new Sorter("code", true)
                ],
                success: function (oData) {
                    var mData = {
                        items : oData.results
                    };
                    var oModel = new sap.ui.model.json.JSONModel(mData);
                    switch (level) {
                        case "1" : 
                            that.oVendorPoolLvl1.setModel(oModel); 
                            that.oVendorPoolLvl2.setModel(null);
                            that.oVendorPoolLvl3.setModel(null);
                            that.oVendorPoolLvl4.setModel(null);
                            that.oVendorPoolLvl5.setModel(null);
                            
                            that.oVendorPoolLvl2.oParent.setVisible(false);
                            that.oVendorPoolLvl3.oParent.setVisible(false);
                            that.oVendorPoolLvl4.oParent.setVisible(false);
                            that.oVendorPoolLvl5.oParent.setVisible(false);
                            break;

                        case "2" : 
                            that.oVendorPoolLvl2.setModel(oModel); 
                            that.oVendorPoolLvl3.setModel(null); 
                            that.oVendorPoolLvl4.setModel(null);
                            that.oVendorPoolLvl5.setModel(null);

                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl2.oParent.setVisible(true);
                            } else {
                                that.oVendorPoolLvl2.oParent.setVisible(false);
                            }
                            that.oVendorPoolLvl3.oParent.setVisible(false);
                            that.oVendorPoolLvl4.oParent.setVisible(false);
                            that.oVendorPoolLvl5.oParent.setVisible(false);
                            break;

                        case "3" : 
                            that.oVendorPoolLvl3.setModel(oModel); 
                            that.oVendorPoolLvl4.setModel(null); 
                            that.oVendorPoolLvl5.setModel(null);
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl3.oParent.setVisible(true);
                            } else {
                                that.oVendorPoolLvl3.oParent.setVisible(false);
                            }
                            that.oVendorPoolLvl4.oParent.setVisible(false);
                            that.oVendorPoolLvl5.oParent.setVisible(false);
                            break;

                        case "4" : 
                            that.oVendorPoolLvl4.setModel(oModel); 
                            that.oVendorPoolLvl5.setModel(null); 
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl4.oParent.setVisible(true);
                            } else {
                                that.oVendorPoolLvl4.oParent.setVisible(false);
                            }
                            that.oVendorPoolLvl5.oParent.setVisible(false);
                            break;

                        case "5" : 
                            that.oVendorPoolLvl4.setModel(oModel); 
                            that.oVendorPoolLvl5.setModel(null); 
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl5.oParent.setVisible(true);
                            } else {
                                that.oVendorPoolLvl5.oParent.setVisible(false);
                            }
                            break;
                    }    
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
                
            if (!!this.oSearchObj.supplierCode) {
                this.oSupplierCode.setValue(null);
                this.oSupplierCode.setValue(this.oSearchObj.supplierCode);
            }

            //this.loadData();
            this.loadTenantCode();
            this.loadOperationOrgData();
            this.loadOperationUnitData();
            this.loadDepartmentData();
            this.loadManagerData();
            this.oDialog.open();
        }

    });

    return supplierDialog;
}, /* bExport= */ true);
