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

    var MaterialClassDialog = Parent.extend("dp.util.control.ui.MaterialClassDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_class_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_class_code" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oMaterialClassCode = new Input();
            this.oMaterialClassName = new Input();
            
            this.oMaterialClassCode.attachEvent("change", this.loadData.bind(this));
            this.oMaterialClassName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CLASS")+" "+ this.getModel("I18N").getText("/CODE")}),
                        this.oMaterialClassCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CLASS")+" "+ this.getModel("I18N").getText("/NAME")}),
                        this.oMaterialClassName
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
                        text: this.getModel("I18N").getText("/CLASS")+" "+ this.getModel("I18N").getText("/CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{material_class_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "70%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/CLASS")+" "+ this.getModel("I18N").getText("/NAME"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{material_class_name}",
                        textAlign: "Left",
                        width: "100%"
                    })
                })
            ];
        },

        loadData: function(){
            var sMaterialClassCode = this.oMaterialClassCode.getValue(),
                sMaterialClassName = this.oMaterialClassName.getValue(),
                aFilters = this.getProperty("items").filters || [];

                if(sMaterialClassCode){
                    aFilters.push(new Filter("tolower(material_class_code)", FilterOperator.Contains, "'" + sMaterialClassCode.toLowerCase().replace("'","''") + "'"));
                }

                if(sMaterialClassName){
                    aFilters.push(new Filter("tolower(material_class_name)", FilterOperator.Contains, "'" + sMaterialClassName.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/MaterialClass", {
                filters: aFilters,
                sorters: [
                    new Sorter("material_class_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return MaterialClassDialog;
}, /* bExport= */ true);
