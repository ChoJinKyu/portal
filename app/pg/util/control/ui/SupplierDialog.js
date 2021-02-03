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
    "sap/m/SearchField",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
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
        SearchField, 
        ComboBox, 
        Item, 
        SupplierDialogPop,
        MaterialDialogPop,
        EmployeeDialog,
        DepartmentDialog
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

            // 회사코드 
            this.oCompany = new Input({ editable: false, placeholder: this.getModel("I18N").getText("/COMPANY_CODE")});

            // 운영조직
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

            //운영단위
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

            //벤더 레벨1
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
            
            //벤더 레벨2
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

            //벤더 레벨3
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

            //벤더 레벨4
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

            //벤더 레벨5
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

            //Supplier 내부 팝업
            this.oSupplierCode = new MultiInput({
                placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE"),
                showValueHelp : true,
                valueHelpOnly : true,
                valueHelpRequest: function (oEvent) {
                    this.oSupplierDialogPop = new SupplierDialogPop({
                        multiSelection: true,
                        keyField: "supplier_code",
                        textField: "supplier_local_name"
                    });

                    // Pop 내부에 값을 올려주기 위해 구성
                    this.oSupplierDialogPop.setContentWidth("300px");
                    var sSearchObj = {};
                    sSearchObj.tanentId = "L2100"; // 세션임시값
                    sSearchObj.languageCd = "KO";  // 세션임시값
                    sSearchObj.companyCode = that.oCompany.getValue();
                    sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey();
                    sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey();

                    if(!!that.oSupplierCode.getValue()) {
                         sSearchObj.supplierCode = that.oSupplierCode.getValue();
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
                placeholder : this.getModel("I18N").getText("/MATERIAL_CODE"),
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
                    sSearchObj.languageCd = "CN";  //세션 임시값
                    sSearchObj.companyCode = that.oCompany.getValue();
                    sSearchObj.materialCode = that.oMaterialCode.getValue();
                    sSearchObj.orgCode = that.oOperationOrgComb.getSelectedKey()
                    sSearchObj.orgUnitCode = that.oOperationUnitComb.getSelectedKey()

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
                valueHelpOnly : true,
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

                    // case : multiSelection: false
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
                valueHelpOnly : true,
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

                    // // case : multiSelection: true
                    // this.oDepartmentMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    //     that.oDepartmentCode.setTokens(oEvent.getSource().getTokens());
                    // }.bind(this));
                    // this.oDepartmentMultiSelectionValueHelp.setTokens(that.oDepartmentCode.getTokens());

                    //case : multiSelection: false
                    this.oDepartmentMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        that.oDepartmentCode.setValue("");
                        that.oDepartmentCode.setValue(oEvent.mParameters.item.department_id);
                    }.bind(this));
                }
            });

        return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE") , required: true}),
                        this.oCompany
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_ORG"), required: true}),
                        this.oOperationOrgComb
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M4 S12" })
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT"), required: true }),
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
            ]
        },

        // 조회결과 테이블 화면
        createTableColumns: function () {
            return [
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/OPERATION_UNIT") }),
                    template: new Text({ text: ""})
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "1" }),
                    template: new Text({ text: "{vendor_pool_level1_code}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "2" }),
                    template: new Text({ text: "{vendor_pool_level2_code}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/VENDOR_POOL_CODE") + "3" }),
                    template: new Text({ text: "{vendor_pool_level3_code}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE") }),
                    template: new Text({ text: "{supplier_code}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME") }),
                    template: new Text({ text: "{supplier_local_name}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/REGISTER_STATUS") }),
                    template: new Text({ text: "{supplier_register_status_name}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/FLAG") }),
                    template: new Text({ text: "{supplier_flag}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/MAKER_FLAG") }),
                    template: new Text({ text: "{maker_flag}" })
                }),
                new Column({
                    width: "10rem",
                    label: new Label({ text: this.getModel("I18N").getText("/SUPPLIER_SELECTION_STATUS") }),
                    template: new Text({ text: "{inactive_status_name}" })
                })
            ];
        },

        // 회사코드 load
        loadTenantCode: function() {
            if (this.oSearchObj.tanentId) {
                that.oCompany.setValue(this.oSearchObj.companyCode);
            }
        },

        // 운영조직 load
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

        // 운영단위 load
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
                that.loadoVendorPoolLvlData();
            }
        },

        // Data 조회
        loadData: function () {

            var aFilters = [];
            var sSupplierCode,
                sMaterialCode,
                sEmployeeCode,
                sDepartmentCode;
            
            // 세션에서 받아오는 필터 value
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, this.oSearchObj.tanentId));
            aFilters.push(new Filter("language_cd", FilterOperator.EQ, this.oSearchObj.language));
            aFilters.push(new Filter("supplier_company_code", FilterOperator.EQ, this.oSearchObj.companyCode));

            // 조회조건에서 가져오는 value
          
            if (!!this.oSupplierCode.getValue()) {
                sSupplierCode = this.oSupplierCode.getValue();
            }

            if (sSupplierCode) {
                aFilters.push(new Filter("supplier_code", FilterOperator.Contains, "'" + sSupplierCode.toUpperCase() + "'"));
            }

            if(!!this.oVendorPoolLvl1.getSelectedKey()){
                aFilters.push(new Filter("vendor_pool_level1_code", FilterOperator.EQ, this.oVendorPoolLvl1.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl2.getSelectedKey()){
                aFilters.push(new Filter("vendor_pool_level2_code", FilterOperator.EQ, this.oVendorPoolLvl2.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl3.getSelectedKey()){
                aFilters.push(new Filter("vendor_pool_level3_code", FilterOperator.EQ, this.oVendorPoolLvl3.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl4.getSelectedKey()){
                aFilters.push(new Filter("vendor_pool_level4_code", FilterOperator.EQ, this.oVendorPoolLvl4.getSelectedKey()));
            }

            if(!!this.oVendorPoolLvl5.getSelectedKey()){
                aFilters.push(new Filter("vendor_pool_level5_code", FilterOperator.EQ, this.oVendorPoolLvl5.getSelectedKey()));
            }
       
            if (!!this.oMaterialCode.getValue()) {
                sMaterialCode = this.oMaterialCode.getValue();
                //aFilters.push(new Filter("material_code", FilterOperator.EQ, sSupplierCode));
            }

            if(!!this.oEmployeeCode.getValue()) {
                sEmployeeCode = that.oEmployeeCode.getValue();
                //aFilters.push(new Filter("employee_code", FilterOperator.EQ, sEmployeeCode));
            }

            if(!!this.oDepartmentCode.getValue()) {
                sDepartmentCode = that.oDepartmentCode.getValue();
                //aFilters.push(new Filter("department_code", FilterOperator.EQ, sDepartmentCode));
            }
            
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/pg.vendorPoolMappingService/").read("/vpSupplierPopupDtlView", {
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
                            that.oVendorPoolLvl5.setModel(oModel);
                            
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
            
            // dialog가 호출될 때 넘어오는 인자
            this.oSearchObj = sSearchObj;
            console.log("sSearchObj:" + sSearchObj);
            if(!this.oDialog) {
                this.openWasRequested = true;
                return;
            }
            
            // 초기화면 안정화를 위한 초기설정
            that.oVendorPoolLvl2.oParent.setVisible(false);
            that.oVendorPoolLvl3.oParent.setVisible(false);
            that.oVendorPoolLvl4.oParent.setVisible(false);
            that.oVendorPoolLvl5.oParent.setVisible(false)

            // 앞 화면에서 넘어온 supplierCode가 있는 경우 화면에 넘김
            if (!!this.oSearchObj.supplierCode) {
                this.oSupplierCode.setValue(null);
                this.oSupplierCode.setValue(this.oSearchObj.supplierCode);
            }

            // 데이터 load
            //this.loadData();
            this.loadTenantCode();
            this.loadOperationOrgData();
            this.loadOperationUnitData();
            this.oDialog.open();
        }

    }); 

    return supplierDialog;
}, /* bExport= */ true);
