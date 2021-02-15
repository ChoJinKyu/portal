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

    var HsCodeDialog = Parent.extend("dp.util.control.ui.HsCodeDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "hs_code" },
                textField: { type: "string", group: "Misc", defaultValue: "hs_code" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oCompanyCode = new Input();
            this.oCompanyHsCode = new Input();
            this.oCompanyHsText = new Input();
            
            this.oCompanyCode.attachEvent("change", this.loadData.bind(this));
            this.oCompanyHsCode.attachEvent("change", this.loadData.bind(this));
            this.oCompanyHsText.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COUNTRY_CODE")}),
                        this.oCompanyCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/HS_CODE")}),
                        this.oCompanyHsCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/HS_TEXT")}),
                        this.oCompanyHsText
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M3 S10"})
                })

            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "10%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/COUNTRY_CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{country_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "15%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/HS_CODE"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{hs_code}",
                        textAlign: "Left",
                        width: "100%"
                    })
                }),
                new Column({
                    width: "75%",
                    label: new Label({
                        text: this.getModel("I18N").getText("/HS_TEXT"),
                        textAlign: "Center",
                        width: "100%"
                    }),
                    template: new Text({
                        text: "{hs_text}",
                        textAlign: "Left",
                        width: "100%"
                    })
                })
            ];
        },

        loadData: function(){
            var sCompanyCode = this.oCompanyCode.getValue(),
                sCompanyHsCode = this.oCompanyHsCode.getValue(),
                sCompanyHsText = this.oCompanyHsText.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2101")
                ];

                if(sCompanyCode){
                    aFilters.push(new Filter("tolower(country_code)", FilterOperator.Contains, "'" + sCompanyCode.toLowerCase().replace("'","''") + "'"));
                }

                if(sCompanyHsCode){
                    aFilters.push(new Filter("tolower(hs_code)", FilterOperator.Contains, "'" + sCompanyHsCode.toLowerCase().replace("'","''") + "'"));
                }

                if(sCompanyHsText){
                    aFilters.push(new Filter("tolower(hs_text)", FilterOperator.Contains, "'" + sCompanyHsText.toLowerCase().replace("'","''") + "'"));
                }


            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/HsCode", {
                filters: aFilters,
                sorters: [
                    new Sorter("country_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return HsCodeDialog;
}, /* bExport= */ true);
