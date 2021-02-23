sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
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
], function (Controller, JSONModel, MessageBox, MessageToast, 
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

        /*
         * MaterialOrg - Multi
         */
        onMaterialOrgMultiDialogPress: function(oEvent){
            if(!this.oSearchMultiMaterialOrgDialog){
                this.oSearchMultiMaterialOrgDialog = new MaterialOrgDialog({
                    title: "Choose MaterialOrg",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId())
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
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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

        onInputSupplierWithOrgDialogPress: function () {
                if (!this.oSupplierWithOrgValueHelp) {
                    this.oSupplierWithOrgValueHelp = new SupplierWithOrgDialog({
                        //title: "Supplier",
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId())
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

            onMultiInputSupplierWithOrgDialogPress: function () {
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
            onInputSupplierDialogPress: function () {

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

            onMultiInputSupplierDialogPress: function () {
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

            onInputMakerDialogPress: function () {
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
            onMultiInputMakerDialogPress: function () {
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

            onInputBPDialogPress: function () {
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
            onMultiInputBPDialogPress: function () {
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


	});
});