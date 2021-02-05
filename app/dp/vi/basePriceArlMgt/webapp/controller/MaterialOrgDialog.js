sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "ext/lib/control/m/CodeComboBox",
    "sap/m/MessageToast"
], function (Parent, Renderer, ODataV2ServiceProvider, JSONModel, Filter, FilterOperator, Sorter, 
            GridData, VBox, Column, Label, Text, Input, ComboBox, Item, CodeComboBox, MessageToast) {
    "use strict";

    var MaterialOrgDialog = Parent.extend("dp.vi.basePriceArlMgt.controller.MaterialOrgDialog", {
        
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                tenantId: { type: "string", group: "Misc", defaultValue: "" },
                companyCode: { type: "string", group: "Misc", defaultValue: "" },
                orgCode: { type: "string", group: "Misc", defaultValue: "" },
                purOrg: { type: "object", group: "Misc", defaultValue: {} },
                type: { type: "string", group: "Misc", defaultValue: "" },
                aggregations: {
                    filters: []
                }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.tenantId = this.getProperty("tenantId");
            this.oSearchCode = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_CODE") });
            this.oSearchDesc = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_DESC") });
            this.oSearchSpec = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")});
            this.oSearchCode.attachEvent("change", this.loadData.bind(this));
            this.oSearchDesc.attachEvent("change", this.loadData.bind(this));
            this.oSearchSpec.attachEvent("change", this.loadData.bind(this));

            this.oSearchCompany = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'company_code',
                textField: 'company_name',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
                    ],
                    serviceUrl: 'srv-api/odata/v2/cm.util.OrgService/',
                    entityName: 'Company'
                },
                required:true,
                change: this._onChangeCompany.bind(this)
            });

            this.oSearchCompany.setSelectedKey(this.getProperty("companyCode"));

            if( this.tenantId === "L2100" ) {
                this.oSearchOrg = new ComboBox();
            }else {
                this.oSearchOrg = new CodeComboBox({
                    showSecondaryValues:true,
                    useEmpty:true,
                    keyField: 'org_code',
                    textField: 'org_name',
                    items:{
                        path: '/',
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
                        ],
                        serviceUrl: 'srv-api/odata/v2/cm.PurOrgMgtService',
                        entityName: 'Pur_Operation_Org'
                    },
                    required:true
                });
            }

            this._onChangeCompany.apply(this);

            this.oSearchUIT = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'code',
                textField: 'code_description',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this.tenantId),
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
                        new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
                    ],
                    serviceUrl: 'srv-api/odata/v2/dp.HsCodeMgtService',
                    entityName: 'HsCode'
                }
            });

            var aFiltersControl = [];

            if( this.tenantId === "L2100" ) {
                aFiltersControl.push(new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY"), required:true}),  //회사코드
                        this.oSearchCompany
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }));
            }
            
            aFiltersControl.push(new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/VI_APPROVE_ORG_CODE")}),  //조직코드
                        this.oSearchOrg
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }));
            aFiltersControl.push(new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE")}),            // 자재코드
                        this.oSearchCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }));
            // aFiltersControl.push(new VBox({
            //         items: [
            //             new Label({ text: this.getModel("I18N").getText("/UIT") }),  //UIT
            //             this.oSearchUIT
            //         ],
            //         layoutData: new GridData({ span: "XL2 L3 M5 S10"})
            //     }));
            // aFiltersControl.push(new VBox({
            //         items: [
            //             new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC")}),    // 자재내역
            //             this.oSearchDesc
            //         ],
            //         layoutData: new GridData({ span: "XL2 L3 M5 S10"})
            //     }));
            // aFiltersControl.push(new VBox({
            //         items: [
            //             new Label({ text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),   //자재스펙
            //             this.oSearchSpec
            //         ],
            //         layoutData: new GridData({ span: "XL2 L3 M5 S10"})
            //     }));
            // aFiltersControl.push(new VBox({
            //         items: [
            //             new Label({ text: this.getModel("I18N").getText("/HS_CODE") }),  //HS_CODE
            //             this.oSearchHSCode
            //         ],
            //         layoutData: new GridData({ span: "XL2 L3 M5 S10"})
            //     }));

            return aFiltersControl;
        },

        createTableColumns: function(){
            var aColumnsControl = [];

            if( this.tenantId === "L2100" ) {
                aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/COMPANY")}),
                    template: new Text({text: "[{company_code}]{company_name}"})
                }));
            }
            
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/VI_APPROVE_ORG_CODE")}),
                    template: new Text({text: "[{org_code}]{org_name}"})
                }));
            aColumnsControl.push(new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),
                    template: new Text({text: "{material_code}"})
                }));
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_DESC"), textAlign:"Center"}),
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }));
            aColumnsControl.push(new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),
                    template: new Text({text: "{material_spec}"})
                }));
            aColumnsControl.push(new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/BASE_UOM_CODE")}),
                    template: new Text({text: "{base_uom_code}"})
                }));
            aColumnsControl.push(new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/STATUS") }),
                    template: new Text({text: "{material_status_code_name}"})
                }));
            // aColumnsControl.push(new Column({
            //         width: "10%",
            //         hAlign: "Center",
            //         label: new Label({text: this.getModel("I18N").getText("/HS_CODE")}),
            //         template: new Text({text: "{hs_code}"})
            //     }));
            // aColumnsControl.push(new Column({
            //         width: "5%",
            //         hAlign: "Center",
            //         label: new Label({text: this.getModel("I18N").getText("/UIT")}),
            //         template: new Text({text: "{user_item_type_code}"})
            //     }));

            return aColumnsControl;
        },

        _onChangeCompany: function (oEvent) {
            var sSelectedCompany = oEvent ? oEvent.getSource().getSelectedKey() : this.getProperty("companyCode");
            var aPurOrg = this.getProperty("purOrg")[sSelectedCompany];
            //var oPlantComboBox = this.getParent().getParent().getAggregation("fields")[1].getAggregation("items")[1];
            var oPlantComboBox = this.oSearchOrg;
            oPlantComboBox.removeAllItems();
            oPlantComboBox.setSelectedKey("");

            for( var i=0; i<aPurOrg.length; i++ ) {
                oPlantComboBox.addItem(new Item({key:aPurOrg[i].org_code, text:aPurOrg[i].org_name}));
            }
        },
        
        loadData: function(){
            var sCompany = this.oSearchCompany.getSelectedKey(),
                sOrg = this.oSearchOrg.getSelectedKey(),
                sUIT = this.oSearchUIT.getSelectedKey(),
                sHSCode = this.oSearchHSCode.getSelectedKey(),
                sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId"))
                ];
                              
            if(sCompany){
                aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompany));
            }

            if(sOrg){
                aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg));
            }

            if(sUIT){
                aFilters.push(new Filter("user_item_type_code", FilterOperator.EQ, sUIT));
            }

            if(sHSCode){
                aFilters.push(new Filter("hs_code", FilterOperator.EQ, sHSCode));
            }

            if(sCode){
                aFilters.push(new Filter("tolower(material_code)", FilterOperator.Contains, "'" + sCode.toLowerCase().replace("'","''") + "'"));
            }

            if(sDesc){
                aFilters.push(new Filter("tolower(material_spec)", FilterOperator.Contains, "'" + sDesc.toLowerCase().replace("'","''") + "'"));
            }
            
            if(sSpec){
                aFilters.push(new Filter("tolower(material_spec)", FilterOperator.Contains, "'" + sSpec.toLowerCase().replace("'","''") + "'"));
            }

             if(true) {
                var sDetailUrl = "/Material_Vw";

                if( this.getProperty("type") === "Change" ) {
                    sDetailUrl = "/Base_Price_Mst";
                }

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.BasePriceArlService/").read(sDetailUrl, {
                    filters: aFilters,
                    success: function(oData){
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                    }.bind(this),
                    error: function(e){
                        console.log(e);
                    }.bind(this)
                });
            } else {
                MessageToast.show(this.getModel("I18N").getText("/ORG_CODE") + "는 " + this.getModel("I18N").getText("/ECM01001"));
                //this.oDialog.getContent()[0].getItems()[1].setBusy(false);
                return;
            }
        }
    });

    return MaterialOrgDialog;
}, /* bExport= */ true);
