sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"ext/lib/control/m/CodeDialog",
    "cm/util/control/CodePopUp",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Controller, JSONModel, MessageBox, MessageToast, CodeDialog, CodePopUp, 
        Filter, FilterOperator, Sorter) {
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
            if(!this.oSearchCodeDialog){
                this.oSearchCodeDialog = new CodeDialog({
                    title: "Choose a Country",
                    multiSelection: false,
                    contentWidth: "25em",
                    keyField: "country_code",
                    textField: "country_code_name",
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100")
                        ],
                        serviceName: "cm.util.CommonService",
                        entityName: "Country"
                    }
                });
                this.oSearchCodeDialog.attachEvent("apply", function(oEvent){
                    this.byId("searchCodeFromValueHelp").setValue(oEvent.getParameter("item").country_code);
                }.bind(this));
            }
            this.oSearchCodeDialog.open();
        },

        onCodeMultiDialogPress: function(){
            if(!this.oSearchMultiCodeDialog){
                this.oSearchMultiCodeDialog = new CodeDialog({
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


	});
});