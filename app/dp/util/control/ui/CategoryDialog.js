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
                textField: { type: "string", group: "Misc", defaultValue: "category_name" },
                items: { type: "sap.ui.core.Control"}
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
                    width: "15%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/CATEGORY_GROUP"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{category_group_name}",
                        textAlign: "Center",
		                width: "100%"
                    })
                }),
                new Column({
                    width: "25%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/CATEGORY_NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{category_name}",
                        textAlign: "Left",
		                width: "100%"
                    })
                }),
                new Column({
                    width: "45%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/PARENT_CATEGORY"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{path}",
                        textAlign: "Left",
		                width: "100%"
                    })
                }),
                new Column({
                    width: "15%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/STATUS"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{active_flag_val}",
                        textAlign: "Center",
		                width: "100%"
                    })
                })               
            ];
        },

        loadData: function(oThis){

                var that = this,
                
                    sCateGroupCode = this.oCateGroupCode._lastValue,  
                
                    aFilters = [];

                if(this.getProperty("items").filters.length > 0){
                    for(var i=0 ; i < this.getProperty("items").filters.length ; i++){
                        aFilters.push(this.getProperty("items").filters[i]);
                    }
                }                

                if(sCateGroupCode){
                    aFilters.push(new Filter("tolower(category_group_code)", FilterOperator.Contains, "'" + sCateGroupCode.toLowerCase().replace("'","''") + "'"));
                }                

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.partBaseActivityService/").read("/PdPartBaseActivityCategoryPopView", {
                filters: aFilters,
                sorters: [
                    new Sorter("category_code", true)
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
