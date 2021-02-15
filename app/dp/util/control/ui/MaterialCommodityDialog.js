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
                contentWidth: { type: "string", group: "Appearance", defaultValue: "40em"},
                keyField: { type: "string", group: "Misc", defaultValue: "commodity_code" },
                textField: { type: "string", group: "Misc", defaultValue: "commodity_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oMaterialCommodity = new Input({ placeholder: this.getModel("I18N").getText("/COMMODITY")});
            
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
                    label: new Label({
                        text: this.getModel("I18N").getText("/COMMODITY"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{commodity_code}",
                        textAlign: "Center",
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
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101")
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
