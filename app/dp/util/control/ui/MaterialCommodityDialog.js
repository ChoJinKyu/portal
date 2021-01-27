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
    "sap/m/SearchField"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, SearchField) {
    "use strict";

    var MaterialCommodityDialog = Parent.extend("dp.util.control.ui.MaterialCommodityDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "40em"},
                keyField: { type: "string", group: "Misc", defaultValue: "commodity_code" },
                textField: { type: "string", group: "Misc", defaultValue: "commodity_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oMaterialCommodity = new SearchField({ placeholder: this.getModel("I18N").getText("/COMMODITY")});
            
            this.oMaterialCommodity.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMMODITY")}),
                        this.oMaterialCommodity
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M6 S12"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "30%",
                    label: new Label({text: this.getModel("I18N").getText("/COMMODITY")}),
                    template: new Text({text: "{commodity_code}"})
                }),
                new Column({
                    width: "70%",
                    label: new Label({text: this.getModel("I18N").getText("/COMMODITY")+" "+this.getModel("I18N").getText("/NAME")}),
                    template: new Text({text: "{commodity_name}"})
                })
            ];
        },

        loadData: function(){
            var sMaterialCommodity = this.oMaterialCommodity.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];

                if(sMaterialCommodity){
                    aFilters.push(new Filter("tolower(commodity_code)", FilterOperator.Contains, "'" + sMaterialCommodity.toLowerCase().replace("'","''") + "'"));
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
