sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"ext/lib/control/m/CodeValueHelp",
    "cm/util/control/CodePopUp",
    "cm/util/control/ui/EmployeeDialog",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "dp/util/control/ui/MaterialMasterDialog",
    "dp/util/control/ui/MaterialOrgDialog"
], function (Controller, JSONModel, MessageBox, MessageToast, CodeValueHelp, CodePopUp, EmployeeDialog,
        Filter, FilterOperator, Sorter, MaterialMasterDialog, MaterialOrgDialog) {
	"use strict";

	return Controller.extend("xx.exampleControls.controller.CodeCombo", {

        onInit: function(){
            this.setModel(new JSONModel([
                {
                    timezone: "AS054",
                    code: "EP",
                    tenants: ["L1300", "L2100"],
                }, {
                    timezone: "",
                    code: "",
                    tenants: [""],
                }
            ]), "list");

            this.cmCodePopUp = new CodePopUp();

        },

        onCheckButtonPress: function(){
            var sPickerCode = this.byId("searchCodePicker").getSelectedKey();
            var sPickerCodeText = this.byId("searchCodePicker").getValue();
            var sPickerTimezone = this.byId("searchTimezonePicker").getSelectedKey();
            var sPickerTimezoneText = this.byId("searchTimezonePicker").getValue();
            var sPickerTenant = this.byId("searchTenantPicker").getSelectedKey();
            var sPickerTenantText = this.byId("searchTenantPicker").getValue();
            var sPickerDepartment = this.byId("searchDepartmentPicker").getSelectedKey();
            var sPickerDepartmentText = this.byId("searchDepartmentPicker").getValue();
            
            var sComboCode = this.byId("searchCodeCombo").getSelectedKey();
            var sComboCodeText = this.byId("searchCodeCombo").getValue();
            var sComboCurrency = this.byId("searchCurrencyCombo").getSelectedKey();
            var sComboCurrencyText = this.byId("searchCurrencyCombo").getValue();
            var sComboTenant = this.byId("searchTenantCombo").getSelectedKey();
            var sComboTenantText = this.byId("searchTenantCombo").getValue();

            MessageBox.show("sPickerCode: " + sPickerCode + ", sPickerTimezone: " + sPickerTimezone + ", sPickerTenant: " + sPickerTenant + ",sPickerDepartment" + sPickerDepartment,{
                onClose : function(sButton) {
                    MessageBox.show("sPickerCodeText: " + sPickerCodeText + ", sPickerTimezone: " + sPickerTimezoneText + ", sPickerTenant: " + sPickerTenantText + ",sPickerDepartmentText" + sPickerDepartmentText);
                }.bind(this)
            });
            
            MessageBox.show("sComboCode: " + sComboCode + ", sComboCurrency: " + sComboCurrency + ", sComboTenant: " + sComboTenant, {
                onClose : function(sButton) {
                    MessageBox.show("sComboCodeText: " + sComboCodeText + ", sComboCurrencyText: " + sComboCurrencyText + ", sComboTenantText: " + sComboTenantText);
                }.bind(this)
            });
        },

        onTableTestButtonPress: function(){
            MessageBox.show(JSON.stringify(this.getModel("list").getData()));
        },
        
        onPressCodePopUp: function() {
            this.cmCodePopUp.attachEvent("ok", this.onCodePopUpPress.bind(this));
            this.cmCodePopUp.setSerachFieldCode("D");
            this.cmCodePopUp.open();
        },

        onCodePopUpPress: function(oEvent){
            var oData = oEvent.getParameter("data");
            this.byId("cmCodePopUpTenet_id").setText(oData.tenant_id);
            this.byId("cmCodePopUpCode").setText(oData.code);
            this.byId("cmCodePopUpCode_Description").setText(oData.code_description);
            this.byId("cmCodePopUpCode_Name").setText(oData.code_name);
            this.byId("cmCodePopUpGroup_Code").setText(oData.group_code);
        },

        onCodeDialogPress: function(){
            this.byId("employeeDialog").open();
        },

        onCodeDialogPressApply: function(oEvent){
            this.byId("searchCodeFromValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        },

        onCodeMultiDialogPress: function(){
            if(!this.oSearchMultiCodeDialog){
                this.oSearchMultiCodeDialog = new CodeValueHelp({
                    title: "Choose Chains",
                    multiSelection: true,
                    contentWidth: "30em",
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
                this.oSearchMultiCodeDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchMultiCodeFromValueHelp").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oSearchMultiCodeDialog.open();

            var aTokens = this.byId("searchMultiCodeFromValueHelp").getTokens();
            this.oSearchMultiCodeDialog.setTokens(aTokens);
        },

        onEmployeeMultiDialogPress: function(){
            if(!this.oSearchMultiEmployeeDialog){
                this.oSearchMultiEmployeeDialog = new EmployeeDialog({
                    title: "Choose Employee",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oSearchMultiEmployeeDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchMultiEmployeeFromDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oSearchMultiEmployeeDialog.open();

            var aTokens = this.byId("searchMultiEmployeeFromDialog").getTokens();
            this.oSearchMultiEmployeeDialog.setTokens(aTokens);
        },

        onMaterialMasterMultiDialogPress: function(){
            if(!this.oSearchMultiMaterialMasterDialog){
                this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                    title: "Choose MaterialMaster",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ]
                    }
                });
                this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchMultiMaterialMasterFromDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oSearchMultiMaterialMasterDialog.open();

            var aTokens = this.byId("searchMultiMaterialMasterFromDialog").getTokens();
            this.oSearchMultiMaterialMasterDialog.setTokens(aTokens);
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
                    oParam: this.byId("searchMultiMaterialOrgFromDialog").getValue()
                });
                this.oSearchMultiMaterialOrgDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchMultiMaterialOrgFromDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            
            this.oSearchMultiMaterialOrgDialog.open();

            var aTokens = this.byId("searchMultiMaterialOrgFromDialog").getTokens();
            this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
        },

	});
});