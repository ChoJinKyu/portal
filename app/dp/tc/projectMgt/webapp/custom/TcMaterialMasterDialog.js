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
    "ext/lib/control/m/CodeComboBox"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, CodeComboBox) {
    "use strict";

    var MaterialMasterDialog = Parent.extend("dp.tc.projectMgt.custom.TcMaterialMasterDialog", {
        
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" },
                searchCode: { type: "string", group: "Misc", defaultValue: ""},
                tenantId: { type: "string", group: "Misc", defaultValue: ""},
                aggregations: {
                    filters: [
                        {path: 'tenant_id', operator: 'EQ', value1: this.tenantId}
                    ]
                }
            }
        },

        createSearchFilters: function(){
            let sSearchCode = this.getProperty("searchCode");
            if(sSearchCode) {
                this.oSearchCode = new Input({ value: sSearchCode });
            } else {
                this.oSearchCode = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_CODE") });
            }
            
            this.oSearchDesc = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_DESC") });
            this.oSearchSpec = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")});
            this.oSearchCode.attachEvent("change", this.loadData.bind(this));
            this.oSearchDesc.attachEvent("change", this.loadData.bind(this));
            this.oSearchSpec.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE") }),   // 자재코드
                        this.oSearchCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC") }),   // 자재설명
                        this.oSearchDesc
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}), // 자재스펙
                        this.oSearchSpec
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "20%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),  // 자재코드
                    template: new Text({text: "{material_code}"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Left",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_DESC"), textAlign:"Center", width: "100%"}),  // 자재설명
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }),
                new Column({
                    width: "45%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),
                    template: new Text({text: "{material_spec}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/BASE_UOM_CODE")}),  // 단위
                    template: new Text({text: "{base_uom_code}"})
                })
            ];
        },
        
        loadData: function(){
            var sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId"))
                ];

            if(sCode){
                aFilters.push(new Filter("tolower(material_code)", FilterOperator.Contains, "'" + sCode.toLowerCase().replace("'","''") + "'"));
            }

            if(sDesc){
                aFilters.push(new Filter("tolower(material_desc)", FilterOperator.Contains, "'" + sDesc.toLowerCase().replace("'","''") + "'"));
            }
            
            if(sSpec){
                aFilters.push(new Filter("tolower(material_spec)", FilterOperator.Contains, "'" + sSpec.toLowerCase().replace("'","''") + "'"));
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/SearchMaterialMstView", {
                filters: aFilters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }
    });

    return MaterialMasterDialog;
}, /* bExport= */ true);
