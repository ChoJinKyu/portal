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

    var UomDialog = Parent.extend("cm.util.control.ui.UomDialog", {

        metadata: {
            properties: {
                loadWhenOpen: { type: "boolean", group: "Misc", defaultValue: false },
                aaa: { type: "string", group: "Appearance", defaultValue: "50em"},
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em"},
                keyField: { type: "string", group: "Misc", defaultValue: "uom_code" },
                textField: { type: "string", group: "Misc", defaultValue: "uom_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchUomCode = new Input({ placeholder: this.getModel("I18N").getText("/UOM_CODE")});
            this.oSearchUomCode.attachEvent("change", this.loadData.bind(this));

            this.oSearchUomName = new Input({ placeholder: this.getModel("I18N").getText("/UOM_NAME")});
            this.oSearchUomName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/UOM_CODE"), required: true}),
                        this.oSearchUomCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/UOM_NAME"), required: true}),
                        this.oSearchUomName
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "30%",
                    hAlign: "Left",
                    label: new Label({text: this.getModel("I18N").getText("/UOM_CODE")}),
                    template: new Text({text: "{uom_code}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/UOM_NAME")}),
                    template: new Text({text: "{uom_name}"})
                })
            ];
        },

        loadData: function(){
            var sUomCode = this.oSearchUomCode.getValue(),
                sUomName = this.oSearchUomName.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [],
                aSorters = oParam.sorters || [];
            if(sUomCode){
                aFilters.push(new Filter({
                                path: "uom_code",
                                operator: FilterOperator.Contains,
                                value1: sUomCode,
                                caseSensitive: false
                            }));
            }
            if(sUomName){
                aFilters.push(new Filter({
                                path: "uom_name",
                                operator: FilterOperator.Contains,
                                value1: sUomName,
                                caseSensitive: false
                            }));
            }
            
            aSorters.push(new Sorter("uom_code", false));
            this.oDialog.setBusy(true);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/Uom", {
                fetchOthers: true,  //TODO: 가능하면 fetchOthers 옵션을 false 하세요.
                filters: aFilters,
                sorters: aSorters,
                success: function(oData){
                    this.oDialog.setData(oData.results, false);
                }.bind(this),
                fetchOthersSuccess: function(aDatas){
                    var aDialogData = this.oDialog.getData();
                    aDatas.forEach(function(oData){
                        aDialogData = aDialogData.concat(oData.results);
                    }.bind(this));
                    this.oDialog.setData(aDialogData);
                    this.oDialog.setBusy(false);
                }.bind(this)
            });
        },

        beforeOpen: function(){
        }

    });

    return UomDialog;
}, /* bExport= */ true);