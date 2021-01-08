sap.ui.define([
	"./Empty.controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"ext/lib/control/m/ValueHelpDialog",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "ext/cm/util/control/CodePopUp"
], function (Controller, JSONModel, MessageBox, MessageToast, ValueHelpDialog, Filter, FilterOperator,
    GridData, VBox, Label, Text, Input, Table, Column, ColumnListItem, CodePopUp) {
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

        onTestPress1: function(){
            if(!this.oSearchMultiCodeFromValueHelpDialog){
                var oTemplate = new Table({
                    columns: [
                        new Column({
                            width: "75%",
                            header: new Text({text: "Text"})
                        }),
                        new Column({
                            width: "25%",
                            hAlign: "Center",
                            header: new Text({text: "Code"})
                        })
                    ],
                    items: {
                        path: "/",
                        template: new ColumnListItem({
                            type: "Active",
                            cells: [
                                new Text({text: "{code_name}"}),
                                new Text({text: "{code}"})
                            ],
                            // press: this.onItemPress.bind(this)
                        })
                    }
                });

                this.oSearchMultiCodeFromValueHelpDialog = new ValueHelpDialog({
                    bodyContent: {
                        path: '/',
                        filters: [
                            new Filter("tenant_id", FilterOperator.Contains, "L2100"),
                            new Filter("group_code", FilterOperator.Contains, "CM_CHAIN_CD")
                        ],
                        serviceName: 'cm.util.CommonService',
                        entityName: 'Code',
                        template: oTemplate
                    }
                }).open();
                this.oSearchMultiCodeFromValueHelpDialog.attachEvent("apply", function(oEvent){
    
                }.bind(this));
                this.oSearchMultiCodeFromValueHelpDialog.attachEvent("cancel", function(oEvent){
    
                }.bind(this));
            }
            this.oSearchMultiCodeFromValueHelpDialog.open();
        },

        _onTableFilterSearch: function(){
            debugger;
        },
        

        onTestPress: function(){
            if(!this.oSearchMultiCodeFromValueHelpDialog){
                var oDialogSearchKeyword1 = new Input({ id: "dialogSearchKeyword1", placeholder: "Keyword"}),
                    oDialogSearchKeyword2 = new Input({ id: "dialogSearchKeyword2", placeholder: "Keyword"});
                this.oSearchMultiCodeFromValueHelpDialog = new ValueHelpDialog({
                    filters: [
                        new VBox({
                            items: [
                                new Label({ text: "Keyword"}),
                                oDialogSearchKeyword1
                            ],
                            layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                        }),
                        new VBox({
                            items: [
                                new Label({ text: "Keyword"}),
                                oDialogSearchKeyword2
                            ],
                            layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                        })
                    ],
                    columns: [
                        new Column({
                            width: "75%",
                            header: new Text({text: "Text"})
                        }),
                        new Column({
                            width: "25%",
                            hAlign: "Center",
                            header: new Text({text: "Code"})
                        })
                    ],
                    cells: [
                        new Text({text: "{code_name}"}),
                        new Text({text: "{code}"})
                    ]
                }).open();
                this.oSearchMultiCodeFromValueHelpDialog.attachEvent("searchPress", function(oEvent){
                    var oValueHelp = oEvent.getSource();
                    oValueHelp.load({
                        filters: [
                            new Filter("tenant_id", FilterOperator.Contains, "L2100"),
                            new Filter("group_code", FilterOperator.Contains, "CM_CHAIN_CD")
                        ],
                        serviceName: 'cm.util.CommonService',
                        entityName: 'Code',
                    })

                }.bind(this));

                this.oSearchMultiCodeFromValueHelpDialog.attachEvent("apply", function(oEvent){
    
                }.bind(this));

                this.oSearchMultiCodeFromValueHelpDialog.attachEvent("cancel", function(oEvent){
    
                }.bind(this));
            }
            this.oSearchMultiCodeFromValueHelpDialog.open();
        },


	});
});