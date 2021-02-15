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

    var MaterialGroupDialog = Parent.extend("dp.util.control.ui.MaterialGroupDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_group_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_group_code" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            this.oMaterialGroup = new Input();
            this.oMaterialGroupName = new Input();

            this.oMaterialGroup.attachEvent("change", this.loadData.bind(this));
            this.oMaterialGroupName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/GROUP_CODE")}),
                        this.oMaterialGroup
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/GROUP_CODE_NAME")}),
                        this.oMaterialGroupName
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
                        text: this.getModel("I18N").getText("/GROUP_CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{material_group_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "70%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/GROUP_CODE_NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{material_group_name}",
                        textAlign: "Left",
                        width: "100%"
                    })
                })
            ];
        },

        loadData: function(){
            var sMaterialGroup = this.oMaterialGroup.getValue(),
                sMaterialGroupName = this.oMaterialGroupName.getValue(),
                aFilters = this.getProperty("items").filters || [];

                if(sMaterialGroup){
                    aFilters.push(new Filter("tolower(material_group_code)", FilterOperator.Contains, "'" + sMaterialGroup.toLowerCase().replace("'","''") + "'"));
                }

                if(sMaterialGroupName){
                    aFilters.push(new Filter("tolower(material_group_name)", FilterOperator.Contains, "'" + sMaterialGroupName.toLowerCase().replace("'","''") + "'"));
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
