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

    var MaterialCommodityDialog = Parent.extend("dp.util.control.ui.MaterialCommodityDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "commodity_code" },
                textField: { type: "string", group: "Misc", defaultValue: "commodity_code" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oMaterialCommodity = new Input();
            this.oMaterialCommodityName = new Input();
            
            this.oMaterialCommodity.attachEvent("change", this.loadData.bind(this));
            this.oMaterialCommodityName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMMODITY")}),
                        this.oMaterialCommodity
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMMODITY")+" "+this.getModel("I18N").getText("/NAME")}),
                        this.oMaterialCommodityName
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "30%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/COMMODITY"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{commodity_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "70%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/COMMODITY")+" "+this.getModel("I18N").getText("/NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{commodity_name}",
                        textAlign: "Left",
                        width: "100%"
                    })
                })
            ];
        },

        loadData: function(){
            var sMaterialCommodity = this.oMaterialCommodity.getValue(),
                sMaterialCommodityName = this.oMaterialCommodityName.getValue(),
                aFilters = [];

                if(this.getProperty("items").filters.length > 0){
                    for(var i=0 ; i < this.getProperty("items").filters.length ; i++){
                        aFilters.push(this.getProperty("items").filters[i])
                    }
                }

                if(sMaterialCommodity){
                    aFilters.push(new Filter("tolower(commodity_code)", FilterOperator.Contains, "'" + sMaterialCommodity.toLowerCase().replace("'","''") + "'"));
                }

                if(sMaterialCommodityName){
                    aFilters.push(new Filter("tolower(commodity_name)", FilterOperator.Contains, "'" + sMaterialCommodityName.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/MaterialCommodity", {
                filters: aFilters,
                sorters: [
                    new Sorter("commodity_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return MaterialCommodityDialog;
}, /* bExport= */ true);
