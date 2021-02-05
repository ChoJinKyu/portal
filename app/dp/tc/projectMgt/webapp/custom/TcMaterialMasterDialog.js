sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/ui/ValueHelpDialog",
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
], function (Parent, ValueHelpDialog, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, CodeComboBox, MessageToast) {
    "use strict";

    var MaterialMasterDialog = Parent.extend("dp.tc.projectMgt.custom.TcMaterialMasterDialog", {
        
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                closeWhenApplied: {type: "boolean", group: "Misc", defaultValue: true},
                keyField: { type: "string", group: "Misc", defaultValue: "material_code" },
                textField: { type: "string", group: "Misc", defaultValue: "material_desc" },
                searchCode: { type: "string", group: "Misc", defaultValue: ""},
                tenantId: { type: "string", group: "Misc", defaultValue: ""},
                company_code: { type: "string", group: "Misc", defaultValue: ""},
                org_type_code: { type: "string", group: "Misc", defaultValue: ""},
                org_code: { type: "string", group: "Misc", defaultValue: ""},
                aggregations: {
                    filters: [
                        {path: 'tenant_id', operator: 'EQ', value1: this.tenantId}
                    ]
                }
            }
        },

        createDialog: function(){
            this.oSearchKeyword = new Input({ placeholder: this.getModel("I18N").getText("/KEYWORD")});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));

            this.oDialog = new ValueHelpDialog({
                draggable: this.getProperty("draggable"),
                closeWhenApplied: this.getProperty("closeWhenApplied"),
                multiSelection: this.getProperty("multiSelection"),
                visibleRowCount: this.getProperty("visibleRowCount"),
                keyField: this.getProperty("keyField"),
                textField: this.getProperty("textField"),
                filters: this.createSearchFilters(),
                columns: this.createTableColumns(),
                tableOptions: this.getTableOptions ? this.getTableOptions() : {}
            });

            this.oDialog.setTitle(this.getProperty("title"));
            if(this.getProperty("contentWidth"))
                this.oDialog.setContentWidth(this.getProperty("contentWidth"));
            if(this.getProperty("contentHeight"))
                this.oDialog.setContentHeight(this.getProperty("contentHeight"));

            this.oDialog.attachEvent("searchPress", function(oEvent){
                this.loadData();
            }.bind(this));

            this.oDialog.attachEvent("apply", function(oEvent){
                this.fireEvent("apply", { 
                    items: oEvent.getParameter("items"),
                    item: oEvent.getParameter("item")
                });
            }.bind(this));

            this.oDialog.attachEvent("cancel", function(oEvent){
                this.fireEvent("cancel");
            }.bind(this));

            if(this.openWasRequested){
                this.open();
                if(this.aTokens && this.aTokens.length > 0)
                    this.oDialog.setTokens(this.aTokens);
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
            this.oSearchCode.attachEvent("submit", this.loadData.bind(this));
            this.oSearchDesc.attachEvent("submit", this.loadData.bind(this));
            this.oSearchSpec.attachEvent("submit", this.loadData.bind(this));

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
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_CODE")}),  // 자재코드
                    template: new Text({text: "{material_code}", textAlign: "Begin", width: "100%"})
                }),
                new Column({
                    width: "37%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL_DESC"), textAlign:"Center", width: "100%"}),  // 자재설명
                    template: new Text({text: "{material_desc}", textAlign: "Begin", width: "100%"})
                }),
                new Column({
                    width: "35%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/MATERIAL") + this.getModel("I18N").getText("/SPECIFICATION")}),
                    template: new Text({text: "{material_spec}", textAlign: "Begin", width: "100%"})
                }),
                new Column({
                    width: "13%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/BASE_UOM_CODE")}),  // 단위
                    template: new Text({text: "{uom_name}", textAlign: "Begin", width: "100%"})
                })
            ];
        },
        
        loadData: function(){
            var sCode = this.oSearchCode.getValue(),
                sDesc = this.oSearchDesc.getValue(),
                sSpec = this.oSearchSpec.getValue();

            if(!sCode && !sDesc && !sSpec) {
                return;
            }

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantId")),
                    new Filter("company_code", FilterOperator.EQ, this.getProperty("company_code")),
                    new Filter("org_type_code", FilterOperator.EQ, this.getProperty("org_type_code")),
                    new Filter("org_code", FilterOperator.EQ, this.getProperty("org_code")),
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

            ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/dp.McstBomMgtService").read("/Org_Material", {
                filters: aFilters,
                success: function(oData){
                    //debugger;
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }
    });

    return MaterialMasterDialog;
}, /* bExport= */ true);
