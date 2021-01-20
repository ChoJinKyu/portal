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

    var CmDialogHelp = Parent.extend("cm.util.control.ui.CmDialogHelp", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyFieldLabel: { type: "string", group: "Misc", defaultValue: "" },
                textFieldLabel: { type: "string", group: "Misc", defaultValue: "" },
                keyField: { type: "string", group: "Misc", defaultValue: "" },
                textField: { type: "string", group: "Misc", defaultValue: "" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oEmployee = new Input({ placeholder: this.getProperty("textFieldLabel")});
            this.oSearchKeyword.setPlaceholder(this.getProperty("keyFieldLabel"));
            this.oEmployee.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getProperty("keyFieldLabel")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getProperty("textFieldLabel")}),
                        this.oEmployee
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: this.getProperty("keyFieldLabel")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "75%",
                    label: new Label({text: this.getProperty("textFieldLabel")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                })
                
            ];
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                sEmployee = this.oEmployee.getValue(),
                aDefaultFilters = this.mAggregations.items[0].oParent.oServiceParam.filters,
                aFilters = [];
                aDefaultFilters ? aFilters.push(aDefaultFilters) : aDefaultFilters;
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter(this.getProperty("keyField"), FilterOperator.Contains, sKeyword)
                        ],
                        and: false
                    })
                );
            }
            if(sEmployee){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter(this.getProperty("textField"), FilterOperator.Contains, sEmployee)
                        ],
                        and: false
                    })
                );
            }
            var oEntityName = this.mAggregations.items[0].oParent.oServiceParam.entityName,
                oServicename = this.mAggregations.items[0].oParent.oServiceParam.serviceName,
                sPath = this.mAggregations.items[0].oParent.oServiceParam.sorters[0].sPath,
                bDescending = this.mAggregations.items[0].oParent.oServiceParam.sorters[0].bDescending;

            ODataV2ServiceProvider.getService(oServicename).read("/"+oEntityName, {
                filters: aFilters,
                sorters: [
                    new Sorter(sPath, bDescending)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return CmDialogHelp;
}, /* bExport= */ true);
