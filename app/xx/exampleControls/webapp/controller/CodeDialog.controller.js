sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"ext/lib/control/ui/CodeValueHelp",
    "cm/util/control/ui/EmployeeDialog",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Controller, JSONModel, MessageBox, MessageToast, CodeValueHelp, EmployeeDialog,
        Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.CodeCombo", {

        onInit: function(){
            this.setModel(new JSONModel({
                    chain: "CM",
                    processTypes: [
                        {key: "PG01", text: "시장분석(MI)관리"}
                    ],
                    employee: "",
                    list: [{
                        timezone: ""
                    }]
                }));
        },

        onInputWithCodeValuePress: function(){
            if(!this.oCodeValueHelp){
                this.oCodeValueHelp = new CodeValueHelp({
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
                this.oCodeValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("inputWithCodeValueHelp").setValue(oEvent.getParameter("item").code);
                }.bind(this));
            }
            this.oCodeValueHelp.open();
        },

        onMultiInputWithCodeValuePress: function(){
            if(!this.oCodeMultiSelectionValueHelp){
                this.oCodeMultiSelectionValueHelp = new CodeValueHelp({
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
                    this.byId("multiInputWithCodeValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oCodeMultiSelectionValueHelp.open();
            this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithCodeValueHelp").getTokens());
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
        }

	});
});