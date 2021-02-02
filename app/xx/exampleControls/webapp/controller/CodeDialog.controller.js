sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"cm/util/control/ui/CodeDialog",
    "cm/util/control/ui/EmployeeDialog",
    "cm/util/control/ui/CompanyDetailDialog",
    "cm/util/control/ui/CmDialogHelp",
    "op/util/control/ui/OrderDialog", 
    "op/util/control/ui/AssetDialog", 
    "op/util/control/ui/AccountDialog", 
    "op/util/control/ui/CctrDialog", 
    "op/util/control/ui/WbsDialog", 
    "sp/util/control/ui/SupplierDialog",
    "sp/util/control/ui/SupplierWithOrgDialog",
    "sp/util/control/ui/MakerDialog",
    "sp/util/control/ui/BPDialog",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "dp/util/control/ui/MaterialOrgDialog"
], function (Controller, JSONModel, MessageBox, MessageToast, CodeDialog, EmployeeDialog, CompanyDetailDialog, CmDialogHelp,
             OrderDialog, AssetDialog, AccountDialog, CctrDialog, WbsDialog,
             SupplierDialog, SupplierWithOrgDialog, MakerDialog, BPDialog,
             Filter, FilterOperator, Sorter, MaterialOrgDialog) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.CodeCombo", {

        onInit: function(){
            this.setModel(new JSONModel({
                    chain: "CM",
                    processTypes: [
                        {key: "PG01", text: "시장분석(MI)관리"}
                    ],
                    employee: "",
                    list: [{
                        timezone: ""
                    }]
                }));
        },

        onInputWithCodeValuePress: function(){
            if(!this.oCodeDialog){
                this.oCodeDialog = new CodeDialog({
                    title: "Choose Chains",
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("group_code", FilterOperator.EQ, "CM_CHAIN_CD")
                        ],
                        sorters: [
                            new Sorter("sort_no", true)
                        ],
                        serviceName: "cm.util.CommonService",
                        entityName: "Code"
                    }
                });
                this.oCodeDialog.attachEvent("apply", function(oEvent){
                    this.byId("inputWithCodeDialog").setValue(oEvent.getParameter("item").code);
                }.bind(this));
            }
            this.oCodeDialog.open();
        },

        onCmInputWithCodeValuePress: function(){
            if(!this.oCmDialogHelp){
                this.oCmDialogHelp = new CmDialogHelp({
                    title: "{I18N>/PLANT_NAME}",
                    keyFieldLabel : "{I18N>/PLANT_CODE}",
                    textFieldLabel : "{I18N>/PLANT_NAME}",
                    keyField : "bizdivision_code",
                    textField : "bizdivision_name",
                    items: {
                        sorters: [
                            new Sorter("bizdivision_name", false)
                        ],
                        serviceName: "cm.util.OrgService",
                        entityName: "Division"
                    }
                });
                this.oCmDialogHelp.attachEvent("apply", function(oEvent){
                    this.byId("cmInputWithCodeDialog").setValue(oEvent.getParameter("item").bizdivision_code);
                }.bind(this));
            }
            this.oCmDialogHelp.open();
        },

        onMultiInputWithCodeValuePress: function(){
            if(!this.oCodeMultiSelectionValueHelp){
                this.oCodeMultiSelectionValueHelp = new CodeDialog({
                    title: "Choose Process Types",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("group_code", FilterOperator.EQ, "CM_PROCESS_TYPE_CODE")
                        ],
                        sorters: [
                            new Sorter("sort_no")
                        ],
                        serviceName: "cm.util.CommonService",
                        entityName: "Code"
                    }
                });
                this.oCodeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithCodeDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oCodeMultiSelectionValueHelp.open();
            this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithCodeDialog").getTokens());
        },

        onCompanyDetailDialogPress: function() {
            this.byId("CompanyDetailDialog").open();
        },

        onInputWithCompanyDetailValuePress: function(){
            this.byId("CompanyDetailDialog").open();
        },

        onCompanyDetailDialogApplyPress: function(oEvent){
            this.byId("inputWithCompanyDetailValueHelp").setValue(oEvent.getParameter("item").company_name);
        },

        onMultiInputWithCompanyDetailValuePress: function(){
            if(!this.oCompanyDetailMultiSelectionValueHelp){
                this.oCompanyDetailMultiSelectionValueHelp = new CompanyDetailDialog({
                    title: "{I18N>/COMPANY}",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oCompanyDetailMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithCompanyDetailValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oCompanyDetailMultiSelectionValueHelp.open();
            this.oCompanyDetailMultiSelectionValueHelp.setTokens(this.byId("multiInputWithCompanyDetailValueHelp").getTokens());
        },

        onInputWithEmployeeValuePress: function(){
            this.byId("employeeDialog").open();
        },

        onEmployeeDialogApplyPress: function(oEvent){
            this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        },

        onMultiInputWithEmployeeValuePress: function(){
            if(!this.oEmployeeMultiSelectionValueHelp){
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    closeWhenApplied: false,
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
                    oEvent.getSource().close();
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
        },

        onMaterialOrgMultiDialogPress: function(oEvent){
            if(!this.oSearchMultiMaterialOrgDialog){
                this.oSearchMultiMaterialOrgDialog = new MaterialOrgDialog({
                    title: "Choose MaterialOrg",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    },
                    orgCode: this.byId("searchMultiMaterialOrgFromDialog").getValue()
                });
                this.oSearchMultiMaterialOrgDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchMultiMaterialOrgFromDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            
            this.oSearchMultiMaterialOrgDialog.open();

            var aTokens = this.byId("searchMultiMaterialOrgFromDialog").getTokens();
            this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
            
            this.byId("searchMultiMaterialOrgFromDialog").setValue("");
        },



        // OP.. 
        
        onMultiInputWithOrderPress: function(){
            if(!this.oOrderMultiSelectionValueHelp){
                this.oOrderMultiSelectionValueHelp = new OrderDialog({
                    title: "Choose Orders",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("company_code", FilterOperator.EQ, "LGCKR"),
                        ]
                    }
                });
                this.oOrderMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithOrderValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oOrderMultiSelectionValueHelp.open();
            this.oOrderMultiSelectionValueHelp.setTokens(this.byId("multiInputWithOrderValueHelp").getTokens());
        },


        onMultiInputWithAssetPress: function(){
            if(!this.oAssetMultiSelectionValueHelp){
                this.oAssetMultiSelectionValueHelp = new AssetDialog({
                    title: "Choose Assets",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("company_code", FilterOperator.EQ, "LGCKR"),
                        ]
                    }
                });
                this.oAssetMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithAssetValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oAssetMultiSelectionValueHelp.open();
            this.oAssetMultiSelectionValueHelp.setTokens(this.byId("multiInputWithAssetValueHelp").getTokens());
        },

        onMultiInputWithAccountPress: function(){
            if(!this.oAccountMultiSelectionValueHelp){
                this.oAccountMultiSelectionValueHelp = new AccountDialog({
                    title: "Choose Accounts",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("company_code", FilterOperator.EQ, "LGCKR"),
                        ]
                    }
                });
                this.oAccountMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithAccountValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oAccountMultiSelectionValueHelp.open();
            this.oAccountMultiSelectionValueHelp.setTokens(this.byId("multiInputWithAssetValueHelp").getTokens());
        },


         onMultiInputWithCctrPress: function(){
            if(!this.oCctrMultiSelectionValueHelp){
                this.oCctrMultiSelectionValueHelp = new CctrDialog({
                    title: "Choose Cctrs",
                    multiSelection: true,
                    effectiveDate: this.getFormatDate( new Date()),
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("company_code", FilterOperator.EQ, "LGCKR"),
                        ]
                    }
                });
                this.oCctrMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithCctrValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oCctrMultiSelectionValueHelp.open();
            this.oCctrMultiSelectionValueHelp.setTokens(this.byId("multiInputWithCctrValueHelp").getTokens());
        },


        onMultiInputWithWbsPress: function(){
            if(!this.oWbsMultiSelectionValueHelp){
                this.oWbsMultiSelectionValueHelp = new WbsDialog({
                    title: "Choose Wbss",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("company_code", FilterOperator.EQ, "LGCKR"),
                        ]
                    }
                });
                this.oWbsMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithWbsValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oWbsMultiSelectionValueHelp.open();
            this.oWbsMultiSelectionValueHelp.setTokens(this.byId("multiInputWithWbsValueHelp").getTokens());
        },

        onInputSupplierWithOrgValuePress: function () {
                if (!this.oSupplierWithOrgValueHelp) {
                    this.oSupplierWithOrgValueHelp = new SupplierWithOrgDialog({
                        //title: "Supplier",
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ],
                            sorters: [new Sorter("company_code", true)]
                        },
                        multiSelection: false

                    });

                    this.oSupplierWithOrgValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_supplierwithorg_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oSupplierWithOrgValueHelp.open();
            },

            onMultiInputSupplierWithOrgValuePress: function () {
                if (!this.oSupplierWithOrgMultiValueHelp) {
                    this.oSupplierWithOrgMultiValueHelp = new SupplierWithOrgDialog({
                        multiSelection: true,
                    });

                    this.oSupplierWithOrgMultiValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_supplierwithorg_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oSupplierWithOrgMultiValueHelp.open();
                this.oSupplierWithOrgMultiValueHelp.setTokens(this.byId("multiinput_supplierwithorg_code").getTokens());
            },
            onInputSupplierValuePress: function () {

                if (!this.oCodeSelectionValueHelp) {
                    this.oCodeSelectionValueHelp = new SupplierDialog({
                        multiSelection: false
                    });

                    this.oCodeSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_supplier_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oCodeSelectionValueHelp.open();
            },

            onMultiInputSupplierValuePress: function () {
                if (!this.oCodeMultiSelectionValueHelp) {
                    this.oCodeMultiSelectionValueHelp = new SupplierDialog({
                        multiSelection: true
                    });

                    this.oCodeMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_supplier_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oCodeMultiSelectionValueHelp.open();
                this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiinput_supplier_code").getTokens());
            },

            onInputMakerValuePress: function () {
                if (!this.oMakerSelectionValueHelp) {
                    this.oMakerSelectionValueHelp = new MakerDialog({
                        multiSelection: false
                    });

                    this.oMakerSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_maker_code").setValue(oEvent.getParameter("item").maker_code);
                    }.bind(this));
                }
                this.oMakerSelectionValueHelp.open();

            },
            onMultiInputMakerValuePress: function () {
                if (!this.oMakerMultiSelectionValueHelp) {
                    this.oMakerMultiSelectionValueHelp = new MakerDialog({
                        multiSelection: true
                    });

                    this.oMakerMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_maker_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oMakerMultiSelectionValueHelp.open();
                this.oMakerMultiSelectionValueHelp.setTokens(this.byId("multiinput_maker_code").getTokens());
            },

            onInputBPValuePress: function () {
                if (!this.oBPSelectionValueHelp) {
                    this.oBPSelectionValueHelp = new BPDialog({
                        multiSelection: false
                    });

                    this.oBPSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_bp_code").setValue(oEvent.getParameter("item").business_partner_code);
                    }.bind(this));
                }
                this.oBPSelectionValueHelp.open();
            },
            onMultiInputBPValuePress: function () {
                if (!this.oBPMultiSelectionValueHelp) {
                    this.oBPMultiSelectionValueHelp = new BPDialog({
                        multiSelection: true
                    });

                    this.oBPMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_bp_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oBPMultiSelectionValueHelp.open();
                this.oBPMultiSelectionValueHelp.setTokens(this.byId("multiinput_bp_code").getTokens());
            },
        
        getFormatDate: function (date) {
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },


        // OP...



	});
});