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
    "sap/m/Input"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var PurOperationOrgDialog = Parent.extend("cm.util.control.ui.PurOperationOrgDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "org_code" },
                textField: { type: "string", group: "Misc", defaultValue: "org_name" }
            }
        },
        

        renderer: Renderer,

        createSearchFilters: function(){
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ORG_CODE") +" or "+ this.getModel("I18N").getText("/ORG_NAME")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            //타이틀 다국어 처리
            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/OPERATION_ORG"));
            return [
                new Column({
                    width: "30%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/ORG_CODE")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "70%",
                    label: new Label({text: this.getModel("I18N").getText("/ORG_NAME")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                })
                
            ];
        },

        extractBindingInfo(oValue, oScope){
            if(oValue && (oValue.filters || oValue.sorters)){
                var oParam = jQuery.extend(true, {}, oValue);

                this.oFilters = oValue.filters || [];
                this.oSorters = oValue.sorters || [];
            }else{
                return Parent.prototype.extractBindingInfo.call(this, oValue, oScope);
            }
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                aFilters = this.oFilters || [],
                aSorters = this.oSorters || [];
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter({path: this.getProperty("keyField"), operator: FilterOperator.Contains, value1: sKeyword, caseSensitive: false}),
                            new Filter({path: this.getProperty("textField"), operator: FilterOperator.Contains, value1: sKeyword, caseSensitive: false})
                        ],
                        and: false
                    })
                );
                this.sKeywordFlag = true;
            }else{
                this.sKeywordFlag = false;
            }
            ODataV2ServiceProvider.getService("cm.util.OrgService").read("/Pur_Operation_Mapping", {
                
                filters: aFilters,
                sorters: aSorters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
            if(this.sKeywordFlag === true){
                aFilters.length = aFilters.length -1;
            }
        }

    });

    return PurOperationOrgDialog;
}, /* bExport= */ true);