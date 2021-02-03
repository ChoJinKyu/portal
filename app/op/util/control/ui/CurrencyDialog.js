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

    var CurrencyDialog = Parent.extend("cm.util.control.ui.CurrencyDialog", {

        metadata: {
            properties: {
                aaa: { type: "string", group: "Appearance", defaultValue: "50em"},
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em"},
                keyField: { type: "string", group: "Misc", defaultValue: "currency_code" },
                textField: { type: "string", group: "Misc", defaultValue: "currency_code_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchCurrencyCode = new Input({ placeholder: this.getModel("I18N").getText("/CURRENCY_CODE")});
            this.oSearchCurrencyCode.attachEvent("change", this.loadData.bind(this));

            this.oSearchCurrencyName = new Input({ placeholder: this.getModel("I18N").getText("/CURRENCY_CODE_NAME")});
            this.oSearchCurrencyName.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CURRENCY_CODE"), required: true}),
                        this.oSearchCurrencyCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CURRENCY_CODE_NAME"), required: true}),
                        this.oSearchCurrencyName
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
                    label: new Label({text: this.getModel("I18N").getText("/CURRENCY_CODE")}),
                    template: new Text({text: "{currency_code}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/CURRENCY_CODE_NAME")}),
                    template: new Text({text: "{currency_code_name}"})
                })
            ];
        },

        loadData: function(){
            var sCurrencyCode = this.oSearchCurrencyCode.getValue(),
                sCurrencyName = this.oSearchCurrencyName.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [],
                aSorters = oParam.sorters || [];
            if(sCurrencyCode){
                aFilters.push(new Filter({
                                path: "currency_code",
                                operator: FilterOperator.Contains,
                                value1: sCurrencyCode,
                                caseSensitive: false
                            }));
            }
            if(sCurrencyName){
                aFilters.push(new Filter({
                                path: "currency_code_name",
                                operator: FilterOperator.Contains,
                                value1: sCurrencyName,
                                caseSensitive: false
                            }));
            }
            
            aSorters.push(new Sorter("currency_code", false));
            this.oDialog.setBusy(true);
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/cm.util.CommonService/").read("/Currency", {
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

    return CurrencyDialog;
}, /* bExport= */ true);