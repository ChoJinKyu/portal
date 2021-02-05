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

    var WbsDialog = Parent.extend("cm.util.control.ui.WbsDialog", {

        metadata: {
            properties: {
                loadWhenOpen: { type: "boolean", group: "Misc", defaultValue: false },
                aaa: { type: "string", group: "Appearance", defaultValue: "50em"},
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em"},
                keyField: { type: "string", group: "Misc", defaultValue: "wbs_code" },
                textField: { type: "string", group: "Misc", defaultValue: "wbs_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchWbsCode = new Input({ placeholder: this.getModel("I18N").getText("/WBS_CODE")});
            this.oSearchWbsCode.attachEvent("change", this.loadData.bind(this));

            this.oSearchWbsName = new Input({ placeholder: this.getModel("I18N").getText("/WBS_NAME")});
            this.oSearchWbsName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/WBS_CODE"), required: true}),
                        this.oSearchWbsCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/WBS_NAME"), required: true}),
                        this.oSearchWbsName
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
                    label: new Label({text: this.getModel("I18N").getText("/WBS_CODE")}),
                    template: new Text({text: "{wbs_code}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/WBS_NAME")}),
                    template: new Text({text: "{wbs_name}"})
                })
            ];
        },

        loadData: function(){
            var sWbsCode = this.oSearchWbsCode.getValue(),
                sWbsName = this.oSearchWbsName.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [],
                aSorters = oParam.sorters || [];
            if(sWbsCode){
                aFilters.push(new Filter({
                                path: "wbs_code",
                                operator: FilterOperator.Contains,
                                value1: sWbsCode,
                                caseSensitive: false
                            }));
            }
            if(sWbsName){
                aFilters.push(new Filter({
                                path: "wbs_name",
                                operator: FilterOperator.Contains,
                                value1: sWbsName,
                                caseSensitive: false
                            }));
            }
            
            aSorters.push(new Sorter("wbs_code", false));
            this.oDialog.setBusy(true);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/op.util.MstService/").read("/Wbs_Mst", {
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

    return WbsDialog;
}, /* bExport= */ true);