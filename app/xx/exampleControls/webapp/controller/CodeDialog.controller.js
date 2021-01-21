sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"cm/util/control/ui/CodeDialog",
    "cm/util/control/ui/EmployeeDialog",
    "cm/util/control/ui/CompanyDetailDialog",
    "cm/util/control/ui/CmDialogHelp",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Controller, JSONModel, MessageBox, MessageToast, CodeDialog, EmployeeDialog, CompanyDetailDialog, CmDialogHelp,
        Filter, FilterOperator, Sorter) {
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
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
        },


	});
});