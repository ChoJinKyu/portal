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

    var IdeaManagerDialog = Parent.extend("dp.util.control.ui.IdeaManagerDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "company_code" },
                textField: { type: "string", group: "Misc", defaultValue: "idea_role_code" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oCompanyCode = new Input({ placeholder: this.getModel("I18N").getText("/COMPANY_CODE")});
            this.oBizunitCode = new Input({ placeholder: this.getModel("I18N").getText("/BIZUNIT_CODE")});
            this.oLocalUserName = new Input({ placeholder: this.getModel("I18N").getText("/LOCAL_USER_NAME")});
            this.oCompanyCode.attachEvent("change", this.loadData.bind(this));
            this.oBizunitCode.attachEvent("change", this.loadData.bind(this));
            this.oLocalUserName.attachEvent("change", this.loadData.bind(this));
            
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
                        new Label({ text: this.getModel("I18N").getText("/BIZUNIT_CODE")}),
                        this.oBizunitCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/LOCAL_USER_NAME")}),
                        this.oLocalUserName
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                    template: new Text({text: "{company_code}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/BIZUNIT_CODE")}),
                    template: new Text({text: "{bizunit_code}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/IDEA_MANAGER_NAME")}),
                    template: new Text({text: "{idea_manager_name}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/DEPARTMENT_LOCAL_NAME")}),
                    template: new Text({text: "{department_local_name}"})
                })
            ];
        },

        loadData: function(){
            var sCompanyCode = this.oCompanyCode.getValue(),
                sBizunitCode = this.oBizunitCode.getValue(),
                sLocalUserName = this.oLocalUserName.getValue(),
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
            if(sBizunitCode){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("bizunit_code", FilterOperator.Contains, sBizunitCode )
                        ],
                        and: false
                    })
                );
            }    
            if(sLocalUserName){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("idea_manager_name", FilterOperator.Contains, sLocalUserName )
                        ],
                        and: false
                    })
                );
            }
            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.ImService/").read("/IdeaManager", {
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

    return IdeaManagerDialog;
}, /* bExport= */ true);
