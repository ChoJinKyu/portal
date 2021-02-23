sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"cm/util/control/ui/CodeDialog",
    "cm/util/control/ui/EmployeeDialog",
    "cm/util/control/ui/DepartmentDialog",
    "cm/util/control/ui/CompanyDetailDialog",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, JSONModel, MessageBox, MessageToast, 
        CodeDialog, EmployeeDialog, DepartmentDialog, CompanyDetailDialog, 
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

        /*
         * Code
         */
        onInputWithCodeDialogPress: function(){
            if(!this.oCodeDialog){
                this.oCodeDialog = new CodeDialog({
                    title: "Choose Chains",
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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

        /*
         * Code - Multi
         */
        onMultiInputWithCodeDialogPress: function(){
            if(!this.oCodeMultiSelectionValueHelp){
                this.oCodeMultiSelectionValueHelp = new CodeDialog({
                    title: "Choose Process Types",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId()),
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

        /*
         * CompanyDetail
         */
        onInputWithCompanyDetailDialogPress: function(){
            this.byId("companyDetailDialog").open();
        },
        onCompanyDetailDialogApplyPress: function(oEvent){
            this.byId("inputWithCompanyDetailValueHelp").setValue(oEvent.getParameter("item").company_name);
        },

        /*
         * CompanyDetail - Multi
         */
        onMultiInputWithCompanyDetailDialogPress: function(){
            if(!this.oCompanyDetailMultiSelectionValueHelp){
                this.oCompanyDetailMultiSelectionValueHelp = new CompanyDetailDialog({
                    title: "{I18N>/COMPANY}",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId())
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


        /*
         * Department
         */
        onInputWithDepartmentDialogPress: function(){
            this.byId("departmentDialog").open();
        },
        onDepartmentDialogApplyPress: function(oEvent){
            this.byId("inputWithDepartmentValueHelp").setValue(oEvent.getParameter("item").department_local_name);
        },

        /*
         * Emplolyee
         */
        onInputWithEmployeeDialogPress: function(){
            this.byId("employeeDialog").open();
        },
        onEmployeeDialogApplyPress: function(oEvent){
            this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        },

        /*
         * Emplolyee - Multi
         */
        onMultiInputWithEmployeeDialogPress: function(){
            if(!this.oEmployeeMultiSelectionValueHelp){
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    closeWhenApplied: false,
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getSessionTenantId())
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

        onCodeDialogPress: function(){
            this.onInputWithCodeDialogPress();
        },

        onCompanyDetailDialogPress: function() {
            this.byId("companyDetailDialog").open();
        },


        onGoScrumDialogExamplePress: function(){
			this.getRouter().navTo("example5_3", {}, true);
        }

	});
});