sap.ui.define([
	"./Empty.controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/cm/util/control/codePopUp"
], function (Controller, JSONModel, MessageBox, MessageToast, codePopUp) {
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

            this.cmCodePopUp = new codePopUp();

        },

        onCheckButtonPress: function(){
            debugger;
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


	});
});