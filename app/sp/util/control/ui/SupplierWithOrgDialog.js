sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/util/SppUserSessionUtil",  
    "ext/lib/control/m/CodeComboBox",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "ext/lib/model/ManagedModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input"
], function (Parent, SppUserSessionUtil, CodeComboBox, Renderer, ODataV2ServiceProvider, ManagedModel, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var oServiceModel = ODataV2ServiceProvider.getServiceByUrl("srv-api/odata/v2/sp.supplierViewService/");

    var SupplierWithOrgDialog = Parent.extend("sp.util.control.ui.SupplierWithOrgDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                textField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                items: { type: "sap.ui.core.Control"},
                filters: []
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            var oThis = this;
            var sTenantId = SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
            var oFilter = { tenantId : new Filter("tenant_id", FilterOperator.EQ, sTenantId), 
                            languageCd : new Filter("language_cd", FilterOperator.EQ, "KO")};

            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/SELECT_SUPPLIER"));

            //this.oSearchField = new sap.m.SearchField({ placeholder: "검색"});
            this.oSupplierCode = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            //this.oSupplierCode.attachEvent("change", this.loadData.bind(this));
            this.oSupplierName = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            this.oTaxId = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            this.oCompny = new sap.m.ComboBox({
                width: "100%",
                placeholder : this.getModel("I18N").getText("/ALL"),
                selectionChange : this.loadData.bind(this),
                items : {
                    path : "SUPPLIERVIEW>/company",
                    template: new sap.ui.core.ListItem({
                        key :"{SUPPLIERVIEW>company_code}",
                        text :"[{SUPPLIERVIEW>company_code}] {SUPPLIERVIEW>company_name}"
                    })

                }, 
            });

            this.oOrg = new sap.m.ComboBox({
                width: "100%",
                placeholder : this.getModel("I18N").getText("/ALL"),
                selectionChange : this.loadData.bind(this),
                items : {
                    path : "SUPPLIERVIEW>/bizUnit",
                    template: new sap.ui.core.ListItem({
                        key :"{SUPPLIERVIEW>bizunit_code}",
                        text :"[{SUPPLIERVIEW>bizunit_code}] {SUPPLIERVIEW>bizunit_name}"
                    })

                }, 
            });

            this.oType = new sap.m.ComboBox({
                width: "100%",
                placeholder : this.getModel("I18N").getText("/ALL"),
                selectionChange : this.loadData.bind(this),
                items : {
                    path : "SUPPLIERVIEW>/supplierType",
                    template: new sap.ui.core.ListItem({
                        key :"{SUPPLIERVIEW>code}",
                        text :"[{SUPPLIERVIEW>code}] {SUPPLIERVIEW>code_name}"
                        /* text : { parts:[
                                    {path: "SUPPLIERVIEW>code" },
                                    {path: "SUPPLIERVIEW>code_name" }
                                ],
                                formatter: function(code, name){
                                    return code === "" ? name : "["+code+"] "+name;
                                }} */
                    })
  
                },
            });

             /*this.oType = new CodeComboBox({
                width: "100%",
                showSecondaryValues : true, 
                emptyText: this.getModel("I18N").getText("/ALL"),
                keyField:"code",
                textField:"code_name",
                useEmpty:true,
                items : {
                    path: "/",
                    serviceUrl: "srv-api/odata/v2/sp.supplierViewService/",
                    entityName: "supplierTypeView",
                    filters: [
                        oFilter.tenantId,
                        oFilter.languageCd  
                    ],
                    sorter: {
                        path: "code_name",
                        descending: true
                    } 

                }
            
            }); */

            this.oOldSupplierCode = new Input({submit : this.loadData.bind(this), placeholder:"Search"});

            this.oStatus = new sap.m.SegmentedButton({
                 items : {
                    path : "SUPPLIERVIEW>/supplierStatus",
                    template: new sap.m.SegmentedButtonItem({
                        key :"{SUPPLIERVIEW>code}",
                        text :"{SUPPLIERVIEW>code_name}"
                    })
                }, 
                selectionChange : this.loadData.bind(this)
            });

            /* var oOrgtypeItemTemplate = new sap.m.SegmentedButtonItem({
                key : "{SUPPLIERVIEW>code}",
                text : "{SUPPLIERVIEW>code_name}"
            });
            this.oStatus.bindItems("SUPPLIERVIEW>/supplierStatus", oOrgtypeItemTemplate);  */

            return [

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE")}),
                        this.oSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_NAME")}),
                        this.oSupplierName
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/TAX_ID")}),
                        this.oTaxId
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY")}),
                        this.oCompny
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ORG")}),
                        this.oOrg
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_TYPE_CODE")}),
                        this.oType
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE")}),
                        this.oOldSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/STATUS")}),
                        this.oStatus
                    ],
                    layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                })
                   
                
            ]
        },

        createTableColumns: function(){
            return [
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/COMPANY")}),
                    template: new Text({text: "{company_code}"})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/ORG")}),
                    template: new Text({text: "{org_name}"})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_TYPE_CODE")}),
                    template: new Text({text: "{type_name}"})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_CODE")}),
                    template: new Text({text: "{supplier_code}"})
                }),
                new Column({
                    width: "15%",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME")}),
                    template: new Text({text: "{supplier_local_name}", wrapping:false})
                }),
                new Column({
                    width: "15%",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_ENGLISH_NAME")}),
                    template: new Text({text: "{supplier_english_name}", wrapping:false})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/TAX_ID")}),
                    template: new Text({text: "{tax_id}", wrapping:false})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE")}),
                    template: new Text({text: "{old_supplier_code}"})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/STATUS")}),
                    template: new sap.tnt.InfoLabel(
                                {text: "{supplier_status_name}", displayOnly:true}
                            ).bindProperty("colorScheme", {
                                parts:[
                                    {path: "supplier_status_code" }
                                ],
                                formatter: function(code){
                                    //sap.tnt.sample.InfoLabelInTable.Formatter.availableState
                                    var oColor = 6;
                                    if(code == "S")oColor = 1;
                                    else if(code == "O")oColor = 2;
                                    return oColor;
                                }
                             }),
                })
            ];
        },

        loadSupplierData : function(oThis){
            var that = oThis,
            sTenantId = SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
            var cFilters = that.getProperty("items") && that.getProperty("items").filters || [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            that.oDialog.setModel(new ManagedModel(), "SUPPLIERVIEW");

            //if(!that.getModel("SUPPLIERVIEW").getProperty("/company")){
                oServiceModel.read("/companyView", {
                    filters: cFilters,
                    sorters: [new Sorter("company_code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        //aRecords.unshift({company_code:"", company_name: that.getModel("I18N").getText("/ALL")});
                        that.oDialog.getModel("SUPPLIERVIEW").setProperty("/company", aRecords);
                    }
                });
            //}

            //if(!that.getModel("SUPPLIERVIEW").getProperty("/bizUnit")){
                oServiceModel.read("/bizUnitView", {
                    filters: cFilters,
                    sorters: [new Sorter("bizunit_code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        //aRecords.unshift({bizunit_code:"", bizunit_name: that.getModel("I18N").getText("/ALL")});
                        that.oDialog.getModel("SUPPLIERVIEW").setProperty("/bizUnit", aRecords);
                    }
                });
            //}

            //if(!that.getModel("SUPPLIERVIEW").getProperty("/supplierType")){
                oServiceModel.read("/supplierTypeView", {
                    filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                    sorters: [new Sorter("code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        //aRecords.unshift({code:"", code_name: that.getModel("I18N").getText("/ALL")});
                        that.oDialog.getModel("SUPPLIERVIEW").setProperty("/supplierType", aRecords);
                    }
                });
            //}

            //if(!that.getModel("SUPPLIERVIEW").getProperty("/supplierStatus")){
                oServiceModel.read("/supplierStatusView", {
                    filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                    sorters: [new Sorter("code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        aRecords.unshift({code:"", code_name: that.getModel("I18N").getText("/ALL")});
                        that.oDialog.getModel("SUPPLIERVIEW").setProperty("/supplierStatus", aRecords);
                    }.bind(this)
                })
            //}

            
            that.oDialog.setBusy(false);

            
        },
        loadData: function(obj){
            var sTenantId = SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)],
                aSorters = [new Sorter("supplier_code", true)],
                sSupplierCode = this.oSupplierCode.getValue(),
                sSupplierName = this.oSupplierName.getValue(),
                sTaxId = this.oTaxId.getValue(),
                sCompny = this.oCompny.getSelectedKey(),
                sOrg = this.oOrg.getSelectedKey(),
                sType = this.oType.getSelectedKey(),
                sOldSupplierCode = this.oOldSupplierCode.getValue(),
                sStatus = this.oStatus.getSelectedKey();

            if(sSupplierCode){
                sSupplierCode = sSupplierCode.toUpperCase();
                this.oSupplierCode.setValue(sSupplierCode);
                aFilters.push(new Filter("supplier_code", FilterOperator.Contains, sSupplierCode));
            }
            if(sSupplierName){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("supplier_local_name", FilterOperator.Contains, sSupplierName ),
                            new Filter("supplier_english_name", FilterOperator.Contains, sSupplierName )
                        ],
                        and: false
                    })
                )
            }
            if(sTaxId)aFilters.push(new Filter("tax_id", FilterOperator.Contains, sTaxId));
            if(sCompny)aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompny));
            if(sOrg)aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrg)); 
            if(sType)aFilters.push(new Filter("type_code", FilterOperator.EQ, sType));
            if(sOldSupplierCode){
                sOldSupplierCode = sOldSupplierCode.toUpperCase();
                this.oOldSupplierCode.setValue(sOldSupplierCode);
                aFilters.push(new Filter("old_supplier_code", FilterOperator.Contains, sOldSupplierCode));
            }
            if(sStatus)aFilters.push(new Filter("supplier_status_code", FilterOperator.EQ, sStatus));
            
            this.oDialog.setBusy(true);

            oServiceModel.read("/supplierView", {
                filters: aFilters,
                sorters: aSorters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, "supplierList");
                    this.oDialog.setBusy(false);
                    if(!this.oDialog.getModel("SUPPLIERVIEW")){
                        this.oDialog.setBusy(true);
                        this.loadSupplierData(this);
                    }
                }.bind(this)
            });

        }

    });

    return SupplierWithOrgDialog;
}, /* bExport= */ true);
