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
    "sap/m/Input" ,
    "sap/ui/model/odata/v2/ODataModel", 
    "ext/lib/util/Multilingual",
], function (Parent, Renderer, ODataV2ServiceProvider, Filter
    , FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input,ODataModel, Multilingual) {
    "use strict";

     var oServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/dp.MoldApprovalListService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        });

    var ReModelRepairDialog = Parent.extend("dp.md.util.controller.ReModelRepairItemDialog", {
        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "employee_number" },
                textField: { type: "string", group: "Misc", defaultValue: "s_referer_name" }
            }
        },

        renderer: Renderer,

        onInit: function () { 
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
         } ,

        createSearchFilters: function(){
            this.oDepartment = new Input({ placeholder: "Item."});
            this.oDepartment.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: "Division"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
                ,  new VBox({
                    items: [
                        new Label({ text: "Part No"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
                ,  new VBox({
                    items: [
                        new Label({ text: "Description"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
                ,  new VBox({
                    items: [
                        new Label({ text: "Model"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
                ,  new VBox({
                    items: [
                        new Label({ text: "Vendor Name"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
                ,  new VBox({
                    items: [
                        new Label({ text: "Repair Type"}),
                        new Input({ placeholder: "Item."})
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
            ];
        },

        createTableColumns: function(){
            return [
                new Column({ 
                    width: "15rem",
                    label: new Label({text: "Request No" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "5rem",
                    hAlign: "Center",
                    label: new Label({text: "Model" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "5rem",
                    hAlign: "Center",
                     label: new Label({text: "Part No" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "5rem",
                    hAlign: "Center",
                    label: new Label({text: "Seq" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "10rem",
                    hAlign: "Center",
                    label: new Label({text: "Spare Part" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "10rem",
                    hAlign: "Center",
                    label: new Label({text: "Item Name" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "15rem",
                    hAlign: "Center",
                    label: new Label({text: "Family Part No" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "15rem",
                    hAlign: "Center",
                    label: new Label({text: "Item Type" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "15rem",
                    hAlign: "Center",
                    label: new Label({text: "Repair Vendor" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "15rem",
                    hAlign: "Center",
                    label: new Label({text: "Order Supplier" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "10rem",
                    hAlign: "Center",
                    label: new Label({text: "Prod Supplier" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "15rem",
                    hAlign: "Center",
                    label: new Label({text: "Reason" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "5rem",
                    hAlign: "Center",
                    label: new Label({text: "Currency" }),
                    template: new Text({text: ""})
                }),
                new Column({
                    width: "5rem",
                    hAlign: "Center",
                    label: new Label({text: "Amount" }),
                    template: new Text({text: ""})
                })
            ];
        },

        loadData : function(){
            var sKeyword = this.oSearchKeyword.getValue() ,
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("tolower("+this.getProperty("keyField")+")", FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'"),
                            new Filter("tolower("+this.getProperty("textField")+")", FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'")
                        ],
                        and: false
                    })
                );
            }
          
            oServiceModel.read("/RefererSearch", {
                filters: aFilters,
                sorters: [
                    new Sorter("user_local_name", true)
                ],
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this)
            });
        }

    });

    return ReModelRepairDialog;
}, /* bExport= */ true);
