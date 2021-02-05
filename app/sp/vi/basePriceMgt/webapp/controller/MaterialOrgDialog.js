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
    var _oPurOrg = {}, _that;

    var MaterialOrgDialog = Parent.extend("sp.vi.basePriceMgt.controller.MaterialOrgDialog", {
        
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                tenantId: { type: "string", group: "Misc", defaultValue: "" },
                aggregations: {
                    filters: []
                }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            _that = this;

            //_oPurOrg = this.getProperty("purOrg");
            this.tenantId = this.getProperty("tenantId");
            this.oSearchCode = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_CODE") });
            this.oSearchDesc = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL_DESC") });
            this.oSearchSpec = new Input({ placeholder: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")});
            this.oSearchCode.attachEvent("change", this.loadData.bind(this));
            this.oSearchDesc.attachEvent("change", this.loadData.bind(this));
            this.oSearchSpec.attachEvent("change", this.loadData.bind(this));

            // this.oSearchCompany = new CodeComboBox({
            //     showSecondaryValues:true,
            //     useEmpty:true,
            //     keyField: 'company_code',
            //     textField: 'company_name',
            //     items:{
            //         path: '/',
            //         filters: [
            //             new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
            //         ],
            //         serviceUrl: 'srv-api/odata/v2/cm.util.OrgService/',
            //         entityName: 'Company'
            //     },
            //     required:true,
            //     change: this._onChangeCompany
            // });

            //this.oSearchCompany.setSelectedKey(this.getProperty("companyCode"));

            // if( this.tenantId === "L2100" ) {
            //     this.oSearchOrg = new ComboBox();
            // }else {
            //     this.oSearchOrg = new CodeComboBox({
            //         showSecondaryValues:true,
            //         useEmpty:true,
            //         keyField: 'org_code',
            //         textField: 'org_name',
            //         items:{
            //             path: '/',
            //             filters: [
            //                 new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
            //             ],
            //             serviceUrl: 'srv-api/odata/v2/cm.PurOrgMgtService',
            //             entityName: 'Pur_Operation_Org'
            //         },
            //         required:true
            //     });
            // }
            //this._onChangeCompany();

            // this.oSearchUIT = new CodeComboBox({
            //     showSecondaryValues:true,
            //     useEmpty:true,
            //     keyField: 'code',
            //     textField: 'code_description',
            //     items:{
            //         path: '/',
            //         filters: [
            //             new Filter("tenant_id", FilterOperator.EQ, this.tenantId),
            //             new Filter("group_code", FilterOperator.EQ, 'DP_MM_USER_ITEM_TYPE')
            //         ],
            //         serviceUrl: 'srv-api/odata/v2/cm.util.CommonService',
            //         entityName: 'Code'
            //     }
            // });

            // this.oSearchHSCode = new CodeComboBox({
            //     showSecondaryValues:true,
            //     useEmpty:true,
            //     keyField: 'hs_code',
            //     textField: 'hs_code',
            //     items:{
            //         path: '/',
            //         filters: [
            //             new Filter("tenant_id", FilterOperator.EQ, this.tenantId)
            //         ],
            //         serviceUrl: 'srv-api/odata/v2/dp.HsCodeMgtService',
            //         entityName: 'HsCode'
            //     }
            // });

            var aFiltersControl = [];
                        
            aFiltersControl.push(new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_CODE")}),            // 자재코드
                        this.oSearchCode
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }));
            aFiltersControl.push(new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/MATERIAL_DESC")}),    // 자재내역
                        this.oSearchDesc
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }));

            return aFiltersControl;
        },

        createTableColumns: function(){
            var aColumnsControl = [];
            
            //자재코드
            aColumnsControl.push(new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),
                    template: new Text({text: "{material_code}"})
                }));
            //자재명
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_NAME"), textAlign:"Center"}),
                    template: new Text({text: "{material_desc}", textAlign:"Begin"})
                }));
            //협력사코드
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/VENDOR_POOL_CODE")}),
                    template: new Text({text: "{vendor_pool_code}"})
                }));
            //협력사명
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/VP_LOCAL_NAME")}),
                    template: new Text({text: "{vendor_pool_local_name}"})
                }));
            //플랜트
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/PLANT_CODE")}),
                    template: new Text({text: "{plant_code}"})
                }));
            //수량단위
            aColumnsControl.push(new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/QUANTITY_UNIT")}),
                    template: new Text({text: "{base_uom_code}"})
                }));

            return aColumnsControl;
        },
        
        loadData: function(){
            var sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId"))
                ];
                              

            if(sCode){
                aFilters.push(new Filter("tolower(material_code)", FilterOperator.Contains, "'" + sCode.toLowerCase().replace("'","''") + "'"));
            }

             if(sDesc){
                aFilters.push(new Filter("tolower(material_desc)", FilterOperator.Contains, "'" + sDesc.toLowerCase().replace("'","''") + "'"));
            }

             if(true) {
                var sDetailUrl = "/Base_Price_Aprl_Material";

                ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/sp.BasePriceArlService/").read(sDetailUrl, {
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
