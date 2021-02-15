sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "ext/lib/control/m/CodeComboBox",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/model/ManagedModel"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, CodeComboBox, ComboBox, Item, ManagedModel) {
    "use strict";

    var IdeaManagerDialog = Parent.extend("dp.util.control.ui.IdeaManagerDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "idea_manager_empno" },
                textField: { type: "string", group: "Misc", defaultValue: "idea_manager_empno" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            var that = this;

            this.oCompanyCode = new CodeComboBox({ 
                showSecondaryValues: true,
                useEmpty: true,
                keyField: 'company_name',
                textField: 'company_code',
                additionalText:"company_name",
                items: {
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100')
                    ],
                    serviceName: 'cm.util.OrgService',
                    entityName: 'Company'
                },
                required: true
            });
            

            this.oBizunitCode = new CodeComboBox({ 
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'bizunit_name',
                textField: 'bizunit_code',
                additionalText:"bizunit_name",
                items: {
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100')
                    ],
                    serviceName: 'cm.util.OrgService',
                    entityName: 'Unit'
                },
                required: true
            });

            this.oLocalUserName = new Input();
            
            this.oCompanyCode.attachEvent("change", this.loadData.bind(this));
            this.oBizunitCode.attachEvent("change", this.loadData.bind(this));
            this.oLocalUserName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                        this.oCompanyCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/BIZUNIT_CODE")}),
                        this.oBizunitCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/IDEA_MANAGER_NAME")}),
                        this.oLocalUserName
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "10%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/COMPANY_CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{company_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "15%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/BIZUNIT_CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{bizunit_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "20%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/IDEA_MANAGER_NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{idea_manager_name}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "50%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/DEPARTMENT_LOCAL_NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{department_local_name}",
                        textAlign: "Left",
                        width: "100%"
                    })
                })
            ];
        },

        loadData: function(oThis){

               var that = this,
                sCompanyCode = this.oCompanyCode._lastValue,
                sBizunitCode = this.oBizunitCode._lastValue,
                sLocalUserName = this.oLocalUserName.getValue(),

                aFilters = this.getProperty("items").filters || [];

                if(sCompanyCode){
                    aFilters.push(new Filter("tolower(company_code)", FilterOperator.Contains, "'" + sCompanyCode.toLowerCase().replace("'","''") + "'"));
                }

                if(sBizunitCode){
                    aFilters.push(new Filter("tolower(bizunit_code)", FilterOperator.Contains, "'" + sBizunitCode.toLowerCase().replace("'","''") + "'"));
                }

                if(sLocalUserName){
                    aFilters.push(new Filter("tolower(idea_manager_name)", FilterOperator.Contains, "'" + sLocalUserName.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.ImService/").read("/IdeaManager", {
                filters: aFilters,
                sorters: [
                    new Sorter("company_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                    this.oDialog.oTable.setBusy(false);
      
                }.bind(this)
            });
        }

    });

    return IdeaManagerDialog;
}, /* bExport= */ true);
