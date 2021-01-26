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

    var MaterialGroupDialog = Parent.extend("dp.util.control.ui.MaterialGroupDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "40em"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_group_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_group_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            this.oMaterialGroup = new SearchField({ placeholder: "Group Name(x)"});
            this.oMaterialGroup.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: "Group Name(x)"}),
                        this.oMaterialGroup
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M6 S12"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "30%",
                    label: new Label({text: "Group Code(x)"}),
                    template: new Text({text: "{material_group_code}"})
                }),
                new Column({
                    width: "70%",
                    label: new Label({text: "Group Name(x)"}),
                    template: new Text({text: "{material_group_name}"})
                })
            ];
        },

        loadData: function(){
            var sMaterialGroup = this.oMaterialGroup.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];

                if(sMaterialGroup){
                    aFilters.push(new Filter("tolower(material_group_code)", FilterOperator.Contains, "'" + sMaterialGroup.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/MaterialGroup", {
                filters: aFilters,
                sorters: [
                    new Sorter("material_group_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return MaterialGroupDialog;
}, /* bExport= */ true);
