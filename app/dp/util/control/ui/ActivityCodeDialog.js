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

    var ActivityCodeDialog = Parent.extend("dp.util.control.ui.ActivityCodeDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "40em"},
                keyField: { type: "string", group: "Misc", defaultValue: "activity_code" },
                textField: { type: "string", group: "Misc", defaultValue: "activity_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            this.oActivityName = new SearchField({ placeholder: this.getModel("I18N").getText("/ACTIVITY_NAME")});
            this.oActivityName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ACTIVITY_NAME")}),
                        this.oActivityName
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M6 S12"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "40%",
                    label: new Label({text: this.getModel("I18N").getText("/ACTIVITY_CODE")}),
                    template: new Text({text: "{activity_code}"})
                }),
                new Column({
                    width: "40%",
                    label: new Label({text: this.getModel("I18N").getText("/ACTIVITY_NAME")}),
                    template: new Text({text: "{activity_name}"})
                }),
                new Column({
                    width: "20%",
                    label: new Label({text: this.getModel("I18N").getText("/STATUS")}),
                    template: new Text({text: "{active_flag_val}"})
                })
            ];
        },

        loadData: function(){
            var sActivityName = this.oActivityName.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101")
                ];

                if(sActivityName){
                    aFilters.push(new Filter("tolower(activity_name)", FilterOperator.Contains, "'" + sActivityName.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.partActivityService/").read("/PdSelectAnActivityView", {
                filters: aFilters,
                sorters: [
                    new Sorter("activity_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return ActivityCodeDialog;
}, /* bExport= */ true);
