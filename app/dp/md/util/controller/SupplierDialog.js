sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/util/SppUserSessionUtil",  
    "ext/lib/model/v2/ODataModel",
    "ext/lib/model/ManagedModel",
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
    "ext/lib/model/ManagedListModel",
    "sap/ui/core/Item",
], function (Parent, Renderer, SppUserSessionUtil, ODataModel, ManagedModel, Filter, FilterOperator, Sorter, GridData, VBox, Column
            , Label, Text, Input, ComboBox, ManagedListModel ,Item) {
    "use strict";

    var oServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/sp.supplierViewService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        }) 
        , oDpOrgServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.util.DpMdCommonService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        })
        , oCompanyServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/cm.OrgMgtService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        });

 /**
  * 단건 선택 supplier 
  */
    var SupplierDialog = Parent.extend("dp.util.SupplierDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                textField: { type: "string", group: "Misc", defaultValue: "supplier_code" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){

            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/SELECT_SUPPLIER"));

            console.log("searchFilters >> " , this.getProperty("items"));
            var items = this.getProperty("items"); 
            var company_code = "";
            var org_code = "";
            items.filters.forEach(function(data){
                if(data.sPath == 'company_code'){
                    company_code = data.oValue1;
                }else if(data.sPath == 'org_code'){
                    org_code = data.oValue1;
                }
            });

            //this.oSearchField = new sap.m.SearchField({ placeholder: "검색"});
            this.oCompanyCode =    new ComboBox({
                                        selectedKey: company_code,
                                        items: {
                                        path: 'company>/Org_Company',
                                        filters: [
                                        ],
                                        template: new Item({
                                            key: "{company_code}",
                                            text: "{= '['+ ${company_code} + '] ' + ${company_name}}"
                                            })
                                        },
                                        editable: false,
                                        required: true ,
                                        width : '100%'
                                    }); 
            this.oOrgCode =    new ComboBox({
                                        selectedKey: org_code,
                                        items: {
                                        path: 'plant>/Divisions',
                                        filters: [
                                        ],
                                        template: new Item({
                                            key: "{org_code}",
                                            text: "{= '['+ ${org_code} + '] ' + ${org_name}}"
                                        })
                                        },
                                        editable: false,
                                        required: true,
                                        width : '100%'
                                    }); 
            this.oSupplierCode = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            //this.oSupplierCode.attachEvent("change", this.loadData.bind(this));
            this.oSupplierName = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
           // this.oTaxId = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            this.oOldSupplierCode = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            // this.oStatus = new sap.m.SegmentedButton({
            //      items : {
            //         path : "SUPPLIERVIEW>/supplierStatus",
            //         template: new sap.m.SegmentedButtonItem({
            //             key :"{SUPPLIERVIEW>code}",
            //             text :"{SUPPLIERVIEW>code_name}"
            //         })
            //     }, 
            //     selectionChange : this.loadData.bind(this)
            // });

            return [

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                        this.oCompanyCode
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M12 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/PLANT_CODE")}),
                        this.oOrgCode
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M12 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_CODE")}),
                        this.oSupplierCode
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M12 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/SUPPLIER_NAME")}),
                        this.oSupplierName
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M12 S12"})
                }),
                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/TAX_ID")}),
                //         this.oTaxId
                //     ],
                //     layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                // }),
                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE")}),
                //         this.oOldSupplierCode
                //     ],
                //     layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                // }),
                // new VBox({
                //     items: [
                //         new Label({ text: this.getModel("I18N").getText("/STATUS")}),
                //         this.oStatus
                //     ],
                //     layoutData: new GridData({ span: "XL4 L4 M5 S10"})
                // })
                   
                
            ]
        },

        createTableColumns: function(){
            return [
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_CODE")}),
                    template: new Text({text: "{supplier_code}"})
                }),
                new Column({
                    width: "35%",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_LOCAL_NAME")}),
                    template: new Text({text: "{supplier_local_name}", wrapping:false})
                }),
                new Column({
                    width: "35%",
                    label: new Label({text: this.getModel("I18N").getText("/SUPPLIER_ENGLISH_NAME")}),
                    template: new Text({text: "{supplier_english_name}", wrapping:false})
                }),
                // new Column({
                //     hAlign: "Center",
                //     label: new Label({text: this.getModel("I18N").getText("/TAX_ID")}),
                //     template: new Text({text: "{tax_id}", wrapping:false})
                // }),
                // new Column({
                //     label: new Label({text: this.getModel("I18N").getText("/OLD_SUPPLIER_CODE")}),
                //     template: new Text({text: "{old_supplier_code}"})
                // }),
                // new Column({
                //     hAlign: "Center",
                //     label: new Label({text: this.getModel("I18N").getText("/STATUS")}),
                //     template: new sap.tnt.InfoLabel(
                //                 {text: "{supplier_status_name}", displayOnly:true}
                //             ).bindProperty("colorScheme", {
                //                 parts:[
                //                     {path: "supplier_status_code" }
                //                 ],
                //                 formatter: function(code){
                //                     //sap.tnt.sample.InfoLabelInTable.Formatter.availableState
                //                     var oColor = 6;
                //                     if(code == "S")oColor = 1;
                //                     else if(code == "O")oColor = 2;
                //                     return oColor;
                //                 }
                //              }),
                // })
            ];
        },


        // loadSupplierData : function(oThis){
        //     var that = oThis,
        //     sTenantId = SppUserSessionUtil.getUserInfo().TENANT_ID ? SppUserSessionUtil.getUserInfo().TENANT_ID : "L2100";
        //     var cFilters = that.getProperty("items") && that.getProperty("items").filters || [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
        //     that.oDialog.setModel(new ManagedModel(), "SUPPLIERVIEW");

        //     //if(!that.getModel("SUPPLIERVIEW").getProperty("/supplierStatus")){
        //         oServiceModel.read("/supplierStatusView", {
        //             filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
        //             sorters: [new Sorter("code", true)],
        //             success: function(oData){
        //                 var aRecords = oData.results;
        //                 aRecords.unshift({code:"", code_name: that.getModel("I18N").getText("/ALL")});
        //                 that.oDialog.getModel("SUPPLIERVIEW").setProperty("/supplierStatus", aRecords);
        //             }.bind(this)
        //         })
        //     //}

            
        //     that.oDialog.setBusy(false);

            
        //},

        loadData : function(){ 
         
            var that = this;
            var cFilters = that.getProperty("items") && that.getProperty("items").filters || [new Filter("tenant_id", FilterOperator.EQ, sTenantId)]; 
            console.log(" cFilters ", cFilters);
            that.oDialog.setModel(new ManagedListModel(), 'company');
            that.oDialog.setModel(new ManagedListModel(), 'org');
            var sTenantId = SppUserSessionUtil.getUserInfo().TENANT_ID ? "L2100" : "L2100";
            var cFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)],
                aSorters = [new Sorter("supplier_code", true)],
                sSupplierCode = this.oSupplierCode.getValue(),
                sSupplierName = this.oSupplierName.getValue()
               // sTaxId = this.oTaxId.getValue(),
              //  sOldSupplierCode = this.oOldSupplierCode.getValue()
                // sStatus = this.oStatus.getSelectedKey()
                ;

                oCompanyServiceModel.read("/Org_Company", {
                    filters: cFilters,
                   // filters: cFilters.concat(new Filter("language_cd", FilterOperator.EQ, "KO")),
                    sorters: [new Sorter("company_code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        that.oDialog.getModel("company").setProperty("/Org_Company", aRecords);
                    }.bind(this)
                });

                oDpOrgServiceModel.read("/Divisions", {
                    filters: cFilters,
                    sorters: [new Sorter("org_code", true)],
                    success: function(oData){
                        var aRecords = oData.results;
                        that.oDialog.getModel("company").setProperty("/Org_Company", aRecords);
                    }.bind(this)
                });



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
         

            this.oDialog.setBusy(true);

            oServiceModel.read("/supplierWithoutOrgView", {
                filters: cFilters,
                sorters: aSorters,
                success: function(oData){
                    console.log("oData>>>>" , oData);
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                    this.oDialog.setBusy(false);
                    // if(!this.oDialog.getModel("SUPPLIERVIEW")){
                    //     this.oDialog.setBusy(true);
                    //     this.loadSupplierData(this);
                    // }
                }.bind(this)
            });
        }

    });

    return SupplierDialog;
}, /* bExport= */ true);
