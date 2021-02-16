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
    "sap/ui/core/ListItem",
     "sap/ui/model/json/JSONModel",
], function (Parent, Renderer, SppUserSessionUtil, ODataModel, ManagedModel, Filter, FilterOperator, Sorter, GridData, VBox, Column
            , Label, Text, Input, ComboBox, ManagedListModel ,Item, ListItem, JSONModel) {
    "use strict";

    var oServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/sp.supplierMasterMgtService/",
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

            this.setModel(oDpOrgServiceModel, 'company');
            this.setModel(oCompanyServiceModel, 'org');

            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/SELECT_SUPPLIER"));
            var items = this.getProperty("items"); 
    
            var tenant_id = "";
            var company_code = "";
            var company_name = "";
            var org_code = "";
            var org_name = "";

            items.filters.forEach(function(data){
                if(data.sPath == 'company_code'){
                    company_code = data.oValue1;
                }else if(data.sPath == 'company_name'){
                    company_name = data.oValue1;
                }else if(data.sPath == 'org_code'){
                    org_code = data.oValue1;
                }else if(data.sPath == 'org_name'){
                    org_name = data.oValue1;
                }else if(data.sPath == 'tenant_id'){
                    tenant_id = data.oValue1;
                }
            });

            var sTenantId = tenant_id;
            var cFilters = [ new Filter("tenant_id", FilterOperator.EQ, sTenantId), ];
/*
showSecondaryValues: true,
					items: {
						path: "/items",
						template: oItemTemplate
					}
*/
            //this.oSearchField = new sap.m.SearchField({ placeholder: "검색"});
            this.oCompanyCode = new Input({value : "["+ company_code + "] " + company_name , editable : false}) 
            this.oOrgCode = new Input({value : "["+ org_code + "] " + org_name , editable : false})  
            this.oSupplierCode = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
            this.oSupplierName = new Input({submit : this.loadData.bind(this), placeholder:"Search"});
    
            return [

                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/COMPANY_CODE") , required : true}),
                        this.oCompanyCode
                    ],
                    layoutData: new GridData({ span: "XL6 L6 M12 S12"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/PLANT_CODE"), required : true}),
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
                })
                
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
                })
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
      
            var items = this.getProperty("items"); 
    
            var tenant_id = "";
            var company_code = "";
            var org_code = "";

            items.filters.forEach(function(data){
                if(data.sPath == 'company_code'){
                    company_code = data.oValue1;
                }else if(data.sPath == 'org_code'){
                    org_code = data.oValue1;
                }else if(data.sPath == 'tenant_id'){
                    tenant_id = data.oValue1;
                }
            });

            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, tenant_id)],
                aSorters = [new Sorter("supplier_code", true)],
                sSupplierCode = this.oSupplierCode.getValue(),
                sSupplierName = this.oSupplierName.getValue() ;
               //  aFilters.push(new Filter("company_code", FilterOperator.EQ, company_code));
              //  aFilters.push(new Filter("org_code", FilterOperator.EQ, org_code));

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

            oServiceModel.read("/supplierMaster", {
                filters: aFilters,
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
