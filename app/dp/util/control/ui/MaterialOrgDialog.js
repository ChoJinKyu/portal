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
                orgCode: { type: "string", group: "Misc"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchCode = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_CODE") });
            this.oSearchDesc = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_DESC") });
            this.oSearchSpec = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")});
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
                        new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                        new Filter("org_type_code", FilterOperator.EQ, "PL")
                    ],
                    serviceUrl: 'srv-api/odata/v2/cm.PurOrgMgtService',
                    entityName: 'Pur_Operation_Org'
                }
            });

            this.oSearchOrg.oModels.undefined.setSizeLimit(10000);

            this.oSearchUIT = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'code',
                textField: 'code_name',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                        new Filter("group_code", FilterOperator.EQ, "DP_MM_USER_ITEM_TYPE")
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
                        new Filter("tenant_id", FilterOperator.EQ, "L2100")
                    ],
                    serviceUrl: 'srv-api/odata/v2/dp.HsCodeMgtService',
                    entityName: 'HsCode'
                }
            });

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ORG_CODE")}),  //조직코드
                        this.oSearchOrg
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE")}),    // 자재코드
                        this.oSearchCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC")}),    // 자재내역
                        this.oSearchDesc
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),   //자재스펙
                        this.oSearchSpec
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10", linebreak: true})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/HS_CODE") }),  //HS_CODE
                        this.oSearchHSCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/UIT") }),  //UIT
                        this.oSearchUIT
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),

            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "15%",
                    hAlign: "Left",
                    label: new Label({text: this.getModel("I18N").getText("/ORG_CODE")}),
                    template: new Text({text: "[{org_code}]{org_name}"})
                }),
                new Column({
                    width: "8%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),
                    template: new Text({text: "{material_code}"})
                }),
                new Column({
                    width: "30%",
                    hAlign: "Left",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_DESC"), textAlign:"Left"}),
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }),
                new Column({
                    hAlign: "Left",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),
                    template: new Text({text: "{material_spec}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/BASE_UOM_CODE")}),
                    template: new Text({text: "{base_uom_code}"})
                }),
                new Column({
                    width: "8%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/PURCHASING") + this.getModel("I18N").getText("/ENABLE") }),   // 구매가능
                    template: new Text({text: "{purchasing_enable_flag}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/HS_CODE")}),
                    template: new Text({text: "{hs_code}"})
                }),
                new Column({
                    width: "5%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/UIT")}),
                    template: new Text({text: "{user_item_type_code}"})
                })
            ];
        },
 
        loadData: function(){
            var sTenantId = "L2100";

            var oParam = this.getProperty("orgCode");
            var sOrg;
            var sOrgCode = false;
            if(oParam != "" ) {
                sOrg = this.oSearchOrg.setSelectedKey(oParam);
                this.oSearchOrg.setEnabled(false);
            } else if (oParam == "") {
                sOrg = this.oSearchOrg.getSelectedKey();
                this.oSearchOrg.setEnabled(true);
            } else {
                this.oSearchOrg.setEnabled(true);
                sOrg = this.oSearchOrg.getSelectedKey();
            }

             var sUIT = this.oSearchUIT.getSelectedKey(),
                sHSCode = this.oSearchHSCode.getSelectedKey(),
                sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];
                              
            if(sOrg){
                sOrgCode=true;
                var oParam = this.getProperty("orgCode");
                if(oParam != "") {
                    aFilters.push(new Filter("org_code", FilterOperator.EQ, oParam));
                } else {
                    aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg));
                }
            }

            if(sUIT){
                sOrgCode=true;
                aFilters.push(new Filter("user_item_type_code", FilterOperator.EQ, sUIT));
            }

            if(sHSCode){
                sOrgCode=true;
                aFilters.push(new Filter("hs_code", FilterOperator.EQ, sHSCode));
            }

            if(sCode){
                sOrgCode=true;
                aFilters.push(new Filter("tolower(material_code)", FilterOperator.Contains, "'" + sCode.toLowerCase().replace("'","''") + "'"));
            }

            if(sDesc){
                sOrgCode=true;
                aFilters.push(new Filter("tolower(material_desc)", FilterOperator.Contains, "'" + sDesc.toLowerCase().replace("'","''") + "'"));
            }
            
            if(sSpec){
                sOrgCode=true;
                aFilters.push(new Filter("tolower(material_spec)", FilterOperator.Contains, "'" + sSpec.toLowerCase().replace("'","''") + "'"));
            }

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.util.MmService/").read("/SearchMaterialOrgView", {
                filters: aFilters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
            
            //  if(sOrgCode || oParam != "") {
                
            // } 
            // else {
            //     MessageToast.show(this.getModel("I18N").getText("/ORG_CODE") + "는 " + this.getModel("I18N").getText("/ECM01001"));
            //     this.oDialog.setBusy(false);
            //     return;
            // }
        },
        
        beforeOpen: function() {
            
        }


    });

    return MaterialOrgDialog;
}, /* bExport= */ true);
