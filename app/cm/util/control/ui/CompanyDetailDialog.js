/* 
tenant_id session 미처리
*/

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

    var CompanyDetailDialog = Parent.extend("cm.util.control.ui.CompanyDetailDialog", {

        metadata: {
            properties: {
                loadWhenOpen: { type: "boolean", group: "Misc", defaultValue: false },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "company_code" },
                textField: { type: "string", group: "Misc", defaultValue: "company_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oCompanyCode = new Input({ placeholder: "CompanyCode"});
            this.oSearchCompanyName = new Input({ placeholder: "CompanyName"});
            this.oCompanyCode.attachEvent("change", this.loadData.bind(this));
            this.oSearchCompanyName.attachEvent("change", this.loadData.bind(this));
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                        this.oCompanyCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_NAME")}),
                        this.oSearchCompanyName
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "45%",
                    label: new Label({ text: this.getModel("I18N").getText("/COMPANY_NAME")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/CURRENCY_CODE")}),
                    template: new Text({text: "{currency_code}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/COUNTRY_CODE")}),
                    template: new Text({text: "{country_code}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/LANGUAGE_CODE")}),
                    template: new Text({text: "{language_code}"})
                }),
                new Column({
                    width: "12%",
                    hAlign: "Center",
                    label: new Label({ text: this.getModel("I18N").getText("/AFFILIATE_CODE")}),
                    template: new Text({text: "{affiliate_code}"})
                })
            ];
        },

        loadData: function(){
            var sCompanyCode = this.oCompanyCode.getValue(),
                sCompanyName = this.oSearchCompanyName.getValue(),
                aFilters = [
                    // new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];
            if(sCompanyCode){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("company_code", FilterOperator.Contains, sCompanyCode)
                        ],
                        and: false
                    })
                );
            }    
            if(sCompanyName){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("company_name", FilterOperator.Contains, sCompanyName )
                        ],
                        and: false
                    })
                );
            }
            ODataV2ServiceProvider.getService("cm.util.OrgService").read("/Company", {
                filters: aFilters,
                sorters: [
                    new Sorter("company_code", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return CompanyDetailDialog;
}, /* bExport= */ true);
