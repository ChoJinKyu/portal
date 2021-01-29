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

    var CountryDialog = Parent.extend("cm.util.control.ui.CountryDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "35em"},
                keyField: { type: "string", group: "Misc", defaultValue: "country_code" },
                textField: { type: "string", group: "Misc", defaultValue: "country_name" },
                visibleRowCount: { type: "int", group: "Appearance", defaultValue: 4 }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchKeyword = new Input({ placeholder: this.getModel("I18N").getText("/KEYWORD")});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/KEYWORD"), required: true}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/NAME")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    label: new Label({text: "EU Code"}),
                    template: new Text({text: "{eu_code}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/CODE")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                })
            ];
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [],
                aSorters = oParam.sorters || [];
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter({
                                path: this.getProperty("keyField"),
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: this.getProperty("textField"),
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            })
                        ],
                        and: false
                    })
                );
            }
            aSorters.push(new Sorter("country_name", false));
            this.oDialog.setBusy(true);
            ODataV2ServiceProvider.getService("cm.util.CommonService").read("/Country", {
                filters: aFilters,
                sorters: aSorters,
                success: function(oData, bHasMore){
                    this.oDialog.setData(oData.results, false);
                    if(!bHasMore) this.oDialog.setBusy(false);
                }.bind(this)
            });
        },

        beforeOpen: function(){
        }

    });

    return CountryDialog;
}, /* bExport= */ true);