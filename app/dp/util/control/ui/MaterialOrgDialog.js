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
    "ext/lib/control/m/CodeComboBox",
    "sap/m/MessageToast"
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, CodeComboBox, MessageToast) {
    "use strict";

    var MaterialOrgDialog = Parent.extend("dp.util.control.ui.MaterialOrgDialog", {
        
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" },
                aggregations: {
                    filters: [
                        {path: 'tenant_id', operator: 'EQ', value1: 'L2100'}
                    ]
                }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            //this.oTenantId = this.getMetadata()._mProperties.aggregations.appData.filters[0].value1;
            this.oSearchCode = new Input({ placeholder: "Search"});
            this.oSearchDesc = new Input({ placeholder: "Search"});
            this.oSearchSpec = new Input({ placeholder: "Search"});
            this.oSearchCode.attachEvent("change", this.loadData.bind(this));
            this.oSearchDesc.attachEvent("change", this.loadData.bind(this));
            this.oSearchSpec.attachEvent("change", this.loadData.bind(this));
            

            this.oSearchOrg = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'org_code',
                textField: 'org_name',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100')
                    ],
                    serviceUrl: 'srv-api/odata/v2/cm.PurOrgMgtService',
                    entityName: 'Pur_Operation_Org'
                },
                required:true
            });

            this.oSearchUIT = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'code',
                textField: 'code_description',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("group_code", FilterOperator.EQ, 'DP_MM_USER_ITEM_TYPE')
                    ],
                    serviceUrl: 'srv-api/odata/v2/cm.util.CommonService',
                    entityName: 'Code'
                }
            });

            this.oSearchHSCode = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'hs_code',
                textField: 'hs_code',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100')
                    ],
                    serviceUrl: 'srv-api/odata/v2/dp.HsCodeMgtService',
                    entityName: 'HsCode'
                }
            });

            return [
                new VBox({
                    items: [
                        new Label({ text: "조직코드", required:true}),
                        this.oSearchOrg
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: "UIT"}),
                        this.oSearchUIT
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: "HS코드"}),
                        this.oSearchHSCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: "자재코드"}),
                        this.oSearchCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: "자재내역"}),
                        this.oSearchDesc
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: "자재스펙"}),
                        this.oSearchSpec
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "13%",
                    hAlign: "Center",
                    label: new Label({text: "조직코드"}),
                    template: new Text({text: "[{org_code}]{org_name}"})
                }),
                new Column({
                    width: "12%",
                    hAlign: "Center",
                    label: new Label({text: "자재코드"}),
                    template: new Text({text: "{material_code}"})
                }),
                new Column({
                    width: "20%",
                    hAlign: "Center",
                    label: new Label({text: "자재내역", textAlign:"Center"}),
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: "자재스팩"}),
                    template: new Text({text: "{material_spec}"})
                }),
                new Column({
                    width: "5%",
                    hAlign: "Center",
                    label: new Label({text: "단위"}),
                    template: new Text({text: "{base_uom_code}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: "구매가능"}),
                    template: new Text({text: "{purchasing_enable_flag}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: "HS코드"}),
                    template: new Text({text: "{hs_code}"})
                }),
                new Column({
                    width: "5%",
                    hAlign: "Center",
                    label: new Label({text: "UIT"}),
                    template: new Text({text: "{user_item_type_code}"})
                })
            ];
        },
        
        loadData: function(){
            var sOrg = this.oSearchOrg.getSelectedKey(),
                sUIT = this.oSearchUIT.getSelectedKey(),
                sHSCode = this.oSearchHSCode.getSelectedKey(),
                sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ],
                sOrgCode = false;
                              
            if(sOrg){
                sOrgCode = true;
                aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg));
            }

            if(sUIT){
                sOrgCode = true;
                aFilters.push(new Filter("user_item_type_code", FilterOperator.EQ, sUIT));
            }

            if(sHSCode){
                sOrgCode = true;
                aFilters.push(new Filter("hs_code", FilterOperator.EQ, sHSCode));
            }

            if(sCode){
                sOrgCode = true;
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sCode));
            }

            if(sDesc){
                sOrgCode = true;
                aFilters.push(new Filter("material_desc", FilterOperator.Contains, sDesc));
            }
            
            if(sSpec){
                sOrgCode = true;
                aFilters.push(new Filter("material_spec", FilterOperator.Contains, sSpec));
            }

            if(sOrgCode) {
                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/SearchMaterialOrgView", {
                    filters: aFilters,
                    success: function(oData){
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                    }.bind(this)
                });
            } else {
                MessageToast.show("조직코드는 필수 선택 항목입니다.");
                this.oDialog.setBusy(false);
                return;
            }
        }
    });

    return MaterialOrgDialog;
}, /* bExport= */ true);
