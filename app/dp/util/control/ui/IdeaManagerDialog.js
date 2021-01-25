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
    "sap/m/MultiInput",
    "ext/lib/control/m/CodeComboBox",
    "sap/m/SearchField",
    "ext/lib/model/ManagedModel",
    "cm/util/control/ui/CompanyDetailDialog"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, MultiInput, CodeComboBox, SearchField, ManagedModel, CompanyDetailDialog) {
    "use strict";

    var IdeaManagerDialog = Parent.extend("dp.util.control.ui.IdeaManagerDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "55em"},
                keyField: { type: "string", group: "Misc", defaultValue: "company_code" },
                textField: { type: "string", group: "Misc", defaultValue: "idea_manager_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            var that = this;

            this.oCompanyCode = new CodeComboBox({ 
                showSecondaryValues: true,
                useEmpty: true,
                keyField: 'company_code',
                textField: 'company_name',
                additionalText:"company_code",
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
                keyField: 'bizunit_code',
                textField: 'bizunit_name',
                additionalText:"bizunit_code",
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

            this.oLocalUserName = new SearchField({
                 placeholder: this.getModel("I18N").getText("/IDEA_MANAGER_NAME")
            });
            
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
                    label: new Label({text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                    template: new Text({text: "{company_code}"})
                }),
                new Column({
                    width: "15%",
                    label: new Label({text: this.getModel("I18N").getText("/BIZUNIT_CODE")}),
                    template: new Text({text: "{bizunit_code}"})
                }),
                new Column({
                    width: "20%",
                    label: new Label({text: this.getModel("I18N").getText("/IDEA_MANAGER_NAME")}),
                    template: new Text({text: "{idea_manager_name}"})
                }),
                new Column({
                    width: "50%",
                    label: new Label({text: this.getModel("I18N").getText("/DEPARTMENT_LOCAL_NAME")}),
                    template: new Text({text: "{department_local_name}"})
                })
            ];
        },

        onTest : function(){
            console.log("aaa");


        },

        loadIdeaManagersetModel : function(oThis){

            var that = oThis,
                oServiceModel = ODataV2ServiceProvider.getService("cm.util.OrgService"),
                cFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];

            that.oDialog.setModel(new ManagedModel(), "IDEAMANAGER");

            oServiceModel.read("/Company", {
               // filters: cFilters, 
                // sorters: [
                //     new Sorter("company_code", true)
                // ],
                success: function(oData){
                    var aRecords = oData.results;
                    console.log(aRecords);
                    that.oDialog.getModel("IDEAMANAGER").setProperty("/Company", aRecords);
                }.bind(this)
            });

            // oServiceModel.read("/Unit", {
            //     //filters: cFilters, 
            //     // sorters: [
            //     //     new Sorter("company_code", true)
            //     // ],
            //     success: function(oData){
            //         var aRecords = oData.results;
            //          console.log(aRecords);
            //         that.oDialog.getModel("IDEAMANAGER").setProperty("/Unit", aRecords);
            //         console.log(that.oDialog.getModel("IDEAMANAGER").getProperty("/Unit"));
            //     }.bind(this)
            // });


        },

        loadData: function(oThis){

            var that = this,
                sCompanyCode = this.oCompanyCode.mProperties.selectedKey,
                sBizunitCode = this.oBizunitCode.mProperties.selectedKey,
                sLocalUserName = this.oLocalUserName.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];

                console.log(sCompanyCode);
                console.log(sBizunitCode);
                console.log(sLocalUserName);

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
                    
                    if(!this.oDialog.getModel("IDEAMANAGER")){
                        this.loadIdeaManagersetModel(this);
                    }
                    this.oDialog.setBusy(false);
      
                }.bind(this)
            });
        }

    });

    return IdeaManagerDialog;
}, /* bExport= */ true);
