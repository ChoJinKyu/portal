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
    "sap/m/SearchField",
    "ext/lib/model/ManagedModel"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, CodeComboBox, ComboBox, Item, SearchField, ManagedModel) {
    "use strict";

    var CategoryDialog = Parent.extend("dp.util.control.ui.CategoryDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "55em"},
                keyField: { type: "string", group: "Misc", defaultValue: "category_code" },
                textField: { type: "string", group: "Misc", defaultValue: "category_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            var that = this;

            this.oCateGroupCode = new CodeComboBox({ 
                showSecondaryValues: true,
                useEmpty: true,
                keyField: 'code_name',
                textField: 'code',
                additionalText:"code_name",
                items: {
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("group_code", FilterOperator.EQ, 'DP_PD_CATEGORY_GROUP')
                    ],
                    serviceName: 'cm.util.CommonService',
                    entityName: 'Code'
                },
                required: true
            });          
            
            this.oCateGroupCode.attachEvent("change", this.loadData.bind(this));            
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CATEGORY_GROUP")}),
                        this.oCateGroupCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S12"})
                })                
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "20%",
                    label: new Label({text: this.getModel("I18N").getText("/CATEGORY_NAME")}),
                    template: new Text({text: "{category_name}"})
                }),
                new Column({
                    width: "60%",
                    label: new Label({text: this.getModel("I18N").getText("/PARENT_CATEGORY")}),
                    template: new Text({text: "{path}"})
                }),
                new Column({
                    width: "20%",
                    label: new Label({text: this.getModel("I18N").getText("/STATUS")}),
                    template: new Text({text: "{active_flag}"})
                })               
            ];
        },

        loadData: function(oThis){

               var that = this,
                sCateGroupCode = this.oCateGroupCode._lastValue                

                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101")
                ];

                if(sCateGroupCode){
                    aFilters.push(new Filter("tolower(company_code)", FilterOperator.Contains, "'" + sCateGroupCode.toLowerCase().replace("'","''") + "'"));
                }                

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.partBaseActivityService/").read("/PdPartBaseActivityCategoryPopView", {
                filters: aFilters,
                sorters: [
                    new Sorter("category_group_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                    this.oDialog.oTable.setBusy(false);
      
                }.bind(this)
            });
        }

    });

    return CategoryDialog;
}, /* bExport= */ true);
