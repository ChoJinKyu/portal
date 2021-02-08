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
    "sap/m/MultiInput",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/SearchField",
    //"ext/pg/util/control/ui/VendorPoolDialogPop",
    "ext/pg/util/control/ui/SupplierDialogPop",
    "ext/pg/util/control/ui/MaterialDialogPop",
    "ext/cm/util/control/ui/EmployeeDialog",
    "ext/cm/util/control/ui/DepartmentDialog"
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
    MultiInput,
    ComboBox, 
    Item, 
    SearchField,
    //VendorPoolDialogPop,
    SupplierDialogPop,
    MaterialDialogPop,
    EmployeeDialog,
    DepartmentDialog
    ) {
    "use strict";
    var that;
    var vendorPoolDialog = Parent.extend("pg.util.control.ui.VendorPoolDialog", {

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

            this.oOperationOrgComb = new ComboBox({
                id: "operationOrgVp",
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
                id: "operationUnitVp",
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

            // this.oVendorPoolCode = new Input({
            //     placeholder : this.getModel("I18N").getText("/VENDOR_POOL_CODE"),
            //     showValueHelp : true,
            //     valueHelpOnly : true,
            //     valueHelpRequest: function (oEvent) {
            //         this.oVendorPoolDialogPop = new VendorPoolDialogPop({
            //             multiSelection: false,
            //             keyField: "VENDOR_POOL_CODE",
            //             textField: "VENDOR_POOL_NAME",
            //             filters: [
            //                 new VBox({
            //                     items: [
            //                         new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
            //                         new Input({placeholder : this.getModel("I18N").getText("/VENDOR_POOL_CODE")})
            //                     ],
            //                     layoutData: new GridData({ span: "XL2 L3 M5 S10" })
            //                 })
            //             ],
            //             columns: [
            //                 new Column({
            //                     width: "75%",
            //                     label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
            //                     template: new Text({ text: "vendorpool code" })
            //                 }),
            //                 new Column({
            //                     width: "25%",
            //                     hAlign: "Center",
            //                     label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
            //                     template: new Text({ text: "vendorpool name" })
            //                 })
            //             ]
            //         });

            //         this.oVendorPoolDialogPop.setContentWidth("300px");
            //         var sSearchObj = {};
            //         sSearchObj.tanent_id = "L2100";
            //         //sSearchObj.vendor_pool_code = oSearchValue;
            //         this.oVendorPoolDialogPop.open(sSearchObj);
            //         this.oVendorPoolDialogPop.attachEvent("apply", function (oEvent) {
            //             console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
            //             that.oVendorPoolCode.setValue(null);
            //             that.oVendorPoolCode.setValue(oEvent.mParameters.item.vendor_pool_code);
            //         }.bind(this));
            //     }
            // });

            this.oVendorPoolLvl1 = new ComboBox({
                id: "vendorPoolLvl1Vp",
                width : "90%",
                enabled : false,
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
                id: "vendorPoolLvl2Vp",
                width : "90%",
                enabled : false,
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
                id: "vendorPoolLvl3Vp",
                width : "90%",
                enabled : false,
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
                id: "vendorPoolLvl4Vp",
                width : "90%",
                enabled : false,
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
                id: "vendorPoolLvl5Vp",
                width : "90%",
                enabled : false,
                items: {
                    path: "/items",
                    template: new sap.ui.core.Item({
                        key: "{code}",
                        text: "{code_name}"
                    })
                }
            });

             //Supplier 내부 팝업
            this.oSupplierCode = new MultiInput({
                id : "supplierVp",
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oSupplierDialogPop = new SupplierDialogPop({
                        multiSelection: true,
                        keyField: "supplier_code",
                        textField: "supplier_local_name"
                    });

                    // Pop 내부에 값을 올려주기 위해 구성
                    var sSearchObj = {};
                    sSearchObj.tanentId = "L2100"; // 세션임시값
                    sSearchObj.languageCd = "KO";  // 세션임시값
                    if(!!that.oOperationOrgComb.getSelectedKey()){
                        sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey();
                    }
                    if(!!that.oOperationUnitComb.getSelectedKey()){
                        sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey();
                    }

                    // Pop의 open에 sSearchObj를 인자로 호출 (override in SupplierDialogPop)
                    this.oSupplierDialogPop.open(sSearchObj);

                    // this.oSupplierDialogPop.attachEvent("apply", function (oEvent) {
                    //     that.oSupplierCode.setValue(null);
                    //     that.oSupplierCode.setValue(oEvent.mParameters.item.supplier_code);
                    // }.bind(this));

                    this.oSupplierDialogPop.attachEvent("apply", function(oEvent){
                        that.oSupplierCode.setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                    this.oSupplierDialogPop.setTokens(that.oSupplierCode.getTokens());
                }
            });

            // Material 내부팝업
            this.oMaterialCode = new MultiInput({
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oMaterialDialogPop = new MaterialDialogPop({
                        multiSelection: true,
                        keyField: "material_code",
                        textField: "material_desc",
                    });

                    this.oMaterialDialogPop.setContentWidth("300px");
                    var sSearchObj = {};
                    sSearchObj.tanentId = "L2100"; //세션 임시값
                    sSearchObj.languageCd = "KO";  //세션 임시값
                    if(!!that.oOperationOrgComb.getSelectedKey()){
                        sSearchObj.orgUnitCode = that.oOperationOrgComb.getSelectedKey();
                    }
                    if(!!that.oOperationUnitComb.getSelectedKey()){
                        sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey();
                    }

                    this.oMaterialDialogPop.open(sSearchObj);

                    // this.oMaterialDialogPop.attachEvent("apply", function (oEvent) {
                    //     that.oMaterialCode.setValue(null);
                    //     that.oMaterialCode.setValue(oEvent.mParameters.item.material_code);
                    // }.bind(this));

                    this.oMaterialDialogPop.attachEvent("apply", function(oEvent){
                        that.oMaterialCode.setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                    this.oMaterialDialogPop.setTokens(that.oMaterialCode.getTokens());
                }
            });

            // 관리자 내부 팝업
            this.oEmployeeCode = new MultiInput({
                placeholder : this.getModel("I18N").getText("/EMPLOYEE_NUMBER"),
                showValueHelp : true,
                valueHelpOnly : false,
                valueHelpRequest : function (oEvent) {
        
                    this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                        title: "Choose Employees",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    
                    this.oEmployeeMultiSelectionValueHelp.open();

                    // // case : multiSelection: true
                    // this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    //     that.oEmployeeCode.setValue(oEvent.mParameters.item.user_local_name);
                    // }.bind(this));
                    // this.oEmployeeMultiSelectionValueHelp.setTokens(that.oEmployeeCode.getTokens());

                    this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        that.oEmployeeCode.setValue("");
                        that.oEmployeeCode.setValue(oEvent.mParameters.item.user_local_name);
                    }.bind(this));
                }
            });

            // 부서 내부팝업
            this.oDepartmentCode = new MultiInput({
                placeholder : this.getModel("I18N").getText("/DEPARTMENT_CODE"),
                showValueHelp : true,
                valueHelpOnly : false,
                valueHelpRequest : function (oEvent) {

                    this.oDepartmentMultiSelectionValueHelp = new DepartmentDialog({
                        title: "Choose Departments",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            ]
                        }
                    });
                    this.oDepartmentMultiSelectionValueHelp.open();

                    // //multiSelection: true
                    // this.oDepartmentMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    //     that.oDepartmentCode.setTokens(oEvent.getSource().getTokens());
                    // }.bind(this));
                    // this.oDepartmentMultiSelectionValueHelp.setTokens(that.oDepartmentCode.getTokens());

                    this.oDepartmentMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        that.oDepartmentCode.setValue("");
                        that.oDepartmentCode.setValue(oEvent.mParameters.item.department_id);
                    }.bind(this));
                }
            });
            //this.oVendorPoolCode.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_ORG") }),
                        this.oOperationOrgComb
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M6 S12" })
                }),

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT") }),
                        this.oOperationUnitComb
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M6 S12" })
                }),

                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") }),
                //         this.oVendorPoolCode
                //     ],
                //     layoutData: new GridData({ span: "XL3 L3 M3 S12" })
                // }),

                 new HBox({
                    items: [
                        new VBox({
                            items: [
                                new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL") + " " + this.getModel("I18N").getText("/LEVEL1") }),
                                this.oVendorPoolLvl1
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL") + " " + this.getModel("I18N").getText("/LEVEL2") }),
                                this.oVendorPoolLvl2
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL") + " " + this.getModel("I18N").getText("/LEVEL3") }),
                                this.oVendorPoolLvl3
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL") + " " + this.getModel("I18N").getText("/LEVEL4") }),
                                this.oVendorPoolLvl4
                            ],
                            layoutData: new GridData({ span: "XL2 L2 M2 S12" })
                        }),
                        new VBox({
                            items: [
                                new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL") + " " + this.getModel("I18N").getText("/LEVEL5") }),
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
                    layoutData: new GridData({ span: "XL3 L3 M3 S12" }),
                }),

                 new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE") }),
                        this.oMaterialCode
                    ],
                    layoutData: new GridData({ span: "XL3 L3 M3 S12" })
                }),

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MANAGER") }),
                        this.oEmployeeCode
                    ],
                    layoutData: new GridData({ span: "XL3 L3 M3 S12" })
                }),

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/DEPARTMENT") }),
                        this.oDepartmentCode
                    ],
                    layoutData: new GridData({ span: "XL3 L3 M3 S12" })
                })
            ];
        },

        createTableColumns: function () {
            return [
                new Column({
                    width: "8rem",
                    label: new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT_CODE") }),
                    template: new Text({ text: "{operation_unit_code}" })
                }),
                new Column({
                    width: "12rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "1"}),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "13rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "2" }),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "12rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "3"}),
                    template: new Text({ text: "{vendor_pool_code}" })
                }),
                new Column({
                    width: "6rem",
                    label: new Label({ text: this.getModel("I18N").getText("/EVAL_CONTROL_FLAG") }),
                    template: new Text({ text: "{regular_evaluation_flag}" })
                }),
                new Column({
                    width: "6rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VP_EXCEPTION_FLAG") }),
                    template: new Text({ text: "{sd_exception_flag}" })
                })
            ];
        },

        loadData: function () {

            //this.oVendorPoolCode.setValue(null);
            this.oDialog.oMultiInput.setTokens(null);
            this.oDialog.oTable.clearSelection();

            // if (this.oSearchObj.vendorPoolCode) {
            //     this.oVendorPoolCode.setValue(this.oSearchObj.vendorPoolCode);
            // }
           // var sVendorPoolCode = this.oVendorPoolCode.getValue();
           this.oDialog.oTable.setBusy(true);

            var aFilters = [];
            var aTempFilters = [];
            var vpTempFilters = [];
            var sSupplierCode,
                sMaterialCode,
                sEmployeeCode,
                sDepartmentCode,
                aSupplierToken;
            
            // 세션에서 받아오는 필터 value
             if (!!this.oSearchObj.tanentId) {
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            }
            
            if (!!this.oSearchObj.languageCd) {
                aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.languageCd));
            }

            if (!!this.oOperationOrgComb.getSelectedKey()) {
                aFilters.push(new Filter("org_code", FilterOperator.EQ, this.oOperationOrgComb.getSelectedKey()));
            }

            if (!!this.oOperationUnitComb.getSelectedKey()) {
                aFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, this.oOperationUnitComb.getSelectedKey()));
            }

            // 조회조건에서 가져오는 value
            if (!!this.oSupplierCode.getValue()) {
                 aFilters.push(new Filter("supplier_code", FilterOperator.Contains, "'" + sSupplierCode.toUpperCase() + "'"));
            }

            if(this.oSupplierCode.getTokens().length > 0 ){
                aTempFilters = [];
                aSupplierToken = this.oSupplierCode.getTokens();
                 for (var i = 0; i < aSupplierToken.length; i++) {
                    aTempFilters.push(new Filter("supplier_code", FilterOperator.EQ, aSupplierToken[i].mProperties.key));
                }
                    //aFilters.push(new Filter(aTempFilters, false));
            }

            if(!!this.oVendorPoolLvl1.getSelectedKey()){
                vpTempFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, this.oVendorPoolLvl1.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl2.getSelectedKey()){
                vpTempFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, this.oVendorPoolLvl2.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl3.getSelectedKey()){
                vpTempFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, this.oVendorPoolLvl3.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl4.getSelectedKey()){
                vpTempFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, this.oVendorPoolLvl4.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl5.getSelectedKey()){
                vpTempFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, this.oVendorPoolLvl5.getSelectedKey()));
            }

            if(vpTempFilters.length > 0) {
                aFilters.push(new Filter(vpTempFilters, false));
            }
            
       
            if (!!this.oMaterialCode.getValue()) {
                sMaterialCode = this.oMaterialCode.getValue();
                //aFilters.push(new Filter("material_code", FilterOperator.EQ, sSupplierCode));
            }

            // if(this.oMaterialCode.getTokens().length > 0 ){
            //     aTempFilters = [];
            //     aMaterialToken = this.oMaterialCode.getTokens();
            //      for (var i = 0; i < aSuppliaMaterialTokenerToken.length; i++) {
            //         aTempFilters.push(new Filter("material_code", FilterOperator.EQ, aMaterialToken[i].mProperties.key));
            //     }
            //         aFilters.push(new Filter(aTempFilters, false));
            // }

            if(!!this.oEmployeeCode.getValue()) {
                sEmployeeCode = that.oEmployeeCode.getValue();
                //aFilters.push(new Filter("employee_code", FilterOperator.EQ, sEmployeeCode));
            }

            if(!!this.oDepartmentCode.getValue()) {
                sDepartmentCode = that.oDepartmentCode.getValue();
                aFilters.push(new Filter("repr_department_code", FilterOperator.EQ, sDepartmentCode));
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpInfoDrillAllView", {
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

        
       // 운영조직 필드에 따른 vp level 설정
        loadOperationChange: function() {
            if (that.oOperationOrgComb.getSelectedKey() && that.oOperationUnitComb.getSelectedKey()) {
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, that.oSearchObj.tanentId));
                aFilters.push(new Filter("org_code", FilterOperator.EQ, that.oOperationOrgComb.getSelectedKey()));
                aFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, that.oOperationUnitComb.getSelectedKey()));

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolSearchService/").read("/vpMaxLevelView", {
                        filters: aFilters,
                        success: function (oData) {
                            var aRecords = oData.results;
                            if (aRecords.length !== 0){
                                switch (aRecords[0].max_level) {
                                    case "1" : 
                                        that.oVendorPoolLvl2.oParent.setVisible(false);
                                        that.oVendorPoolLvl3.oParent.setVisible(false);
                                        that.oVendorPoolLvl4.oParent.setVisible(false);
                                        that.oVendorPoolLvl5.oParent.setVisible(false);
                                        break;
                                    case "2" : 
                                        that.oVendorPoolLvl2.oParent.setVisible(true);
                                        that.oVendorPoolLvl3.oParent.setVisible(false);
                                        that.oVendorPoolLvl4.oParent.setVisible(false);
                                        that.oVendorPoolLvl5.oParent.setVisible(false);
                                        break;
                                    case "3" :
                                        that.oVendorPoolLvl2.oParent.setVisible(true);
                                        that.oVendorPoolLvl3.oParent.setVisible(true);
                                        that.oVendorPoolLvl4.oParent.setVisible(false);
                                        that.oVendorPoolLvl5.oParent.setVisible(false);
                                        break;
                                    case "4" : 
                                        that.oVendorPoolLvl2.oParent.setVisible(true);
                                        that.oVendorPoolLvl3.oParent.setVisible(true);
                                        that.oVendorPoolLvl4.oParent.setVisible(true);
                                        that.oVendorPoolLvl5.oParent.setVisible(false); 
                                        break;
                                    case "5" : 
                                        that.oVendorPoolLvl2.oParent.setVisible(true);
                                        that.oVendorPoolLvl3.oParent.setVisible(true);
                                        that.oVendorPoolLvl4.oParent.setVisible(true);
                                        that.oVendorPoolLvl5.oParent.setVisible(true);
                                        break;
                                }
                            } else {
                                that.oVendorPoolLvl2.oParent.setVisible(false);
                                that.oVendorPoolLvl3.oParent.setVisible(false);
                            }
                        }.bind(this)
                    }); 
                }
                this.loadoVendorPoolLvlData();
            },
        

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

                            that.oVendorPoolLvl1.setEnabled(true);
                            that.oVendorPoolLvl2.setEnabled(false);
                            that.oVendorPoolLvl3.setEnabled(false);
                            that.oVendorPoolLvl4.setEnabled(false);
                            that.oVendorPoolLvl5.setEnabled(false);
                            break;

                        case "2" : 
                            that.oVendorPoolLvl2.setModel(oModel); 
                            that.oVendorPoolLvl3.setModel(null); 
                            that.oVendorPoolLvl4.setModel(null);
                            that.oVendorPoolLvl5.setModel(null);

                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl2.setEnabled(true);
                            } else {
                                that.oVendorPoolLvl2.setEnabled(false);
                            }
                            that.oVendorPoolLvl3.setEnabled(false);
                            that.oVendorPoolLvl4.setEnabled(false);
                            that.oVendorPoolLvl5.setEnabled(false);
                            break;

                        case "3" : 
                            that.oVendorPoolLvl3.setModel(oModel); 
                            that.oVendorPoolLvl4.setModel(null); 
                            that.oVendorPoolLvl5.setModel(null);
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl3.setEnabled(true);
                            } else {
                                that.oVendorPoolLvl3.setEnabled(false);
                            }
                            that.oVendorPoolLvl4.setEnabled(false);
                            that.oVendorPoolLvl5.setEnabled(false);
                            break;

                        case "4" : 
                            that.oVendorPoolLvl4.setModel(oModel); 
                            that.oVendorPoolLvl5.setModel(null); 
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl4.setEnabled(true);
                            } else {
                                that.oVendorPoolLvl4.setEnabled(false);
                            }
                            that.oVendorPoolLvl5.setEnabled(false);
                            break;

                        case "5" : 
                            that.oVendorPoolLvl5.setModel(oModel);
                            
                            if(oModel.oData.items.length > 0) {
                                that.oVendorPoolLvl5.setEnabled(true);
                            } else {
                                that.oVendorPoolLvl5.setEnabled(false);
                            }
                            break;
                    }    
                }.bind(this)
            });
        },

        open: function (sSearchObj) {

            this.oSearchObj = sSearchObj;
            if(!sSearchObj.tanentId) {
                sSearchObj.tanentId = "L2100";
            }
            //console.log("sSearchObj:" + sSearchObj);

            if (!this.oDialog) {
                this.openWasRequested = true;
                return;
            }

            // 초기화면 설정 (기본레벨3)
            that.oVendorPoolLvl4.oParent.setVisible(false);
            that.oVendorPoolLvl5.oParent.setVisible(false);

            
            //this.loadData();
            this.loadOperationOrgData();
            this.loadOperationUnitData();
            this.oDialog.open();
        }
    });

    return vendorPoolDialog;
}, /* bExport= */ true);