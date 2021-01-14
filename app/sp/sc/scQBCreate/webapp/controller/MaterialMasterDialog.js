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

    var MaterialMasterDialog = Parent.extend("sp.sc.scQBMgt.controller.MaterialMasterDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" }
            }
        },

        createSearchFilters: function(){
            this.oSearchCode = new Input({ placeholder: "Search"});
            this.oSearchDesc = new Input({ placeholder: "Search"});
            this.oSearchSpec = new Input({ placeholder: "Search"});

            this.oSearchOrg = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'org_code',
                textField: 'org_name',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                    ],
                    serviceUrl: 'srv-api/odata/v2/cm.PurOrgMgtService',
                    entityName: 'Pur_Operation_Org'
                }
            });

            this.oSearchUIT = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'code',
                textField: 'code_description',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
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
                        new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                    ],
                    serviceUrl: 'srv-api/odata/v2/dp.HsCodeMgtService',
                    entityName: 'HsCode'
                }
            });

            return [
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
                }),

                new VBox({
                    items: [
                        new Label({ text: "조직코드"}),
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
                })
            ];
            
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "20%",
                    hAlign: "Center",
                    label: new Label({text: "조직코드"}),
                    template: new Text({text: "{org_code} {org_name}"})
                }),
                new Column({
                    width: "15%",
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
                    width: "30%",
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
                })
            ];
        },
        
        loadData: function(){
            var sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue(),
                sOrg = this.oSearchOrg.getSelectedKey(),
                sUIT = this.oSearchUIT.getSelectedKey(),
                sHSCode = this.oSearchHSCode.getSelectedKey(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L1100")
                ],
                orgCode = false,
                masterCode = false;

            if(sCode){
                masterCode=true;
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sCode));
            }

            if(sDesc){
                masterCode=true;
                aFilters.push(new Filter("material_desc", FilterOperator.Contains, sDesc));
            }
            
            if(sSpec){
                masterCode=true;
                aFilters.push(new Filter("material_spec", FilterOperator.Contains, sSpec));
            }

            if(sOrg){
                orgCode=true;
                aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg));
            }

            if(sUIT){
                orgCode=true;
                aFilters.push(new Filter("user_item_type_code", FilterOperator.EQ, sUIT));
            }

            if(sHSCode){
                orgCode=true;
                aFilters.push(new Filter("hs_code", FilterOperator.EQ, sHSCode));
            }

            if(orgCode){
                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/SearchMaterialOrgView", {
                    filters: aFilters,
                    success: function(oData){
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                    }.bind(this)
                });
            }
            
            // if(masterCode){
                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/SearchMaterialMstView", {
                    filters: aFilters,
                    success: function(oData){
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                        console.log(oData.results);
                    }.bind(this)
                });
            // }
        }

    });

    return MaterialMasterDialog;
}, /* bExport= */ true);
