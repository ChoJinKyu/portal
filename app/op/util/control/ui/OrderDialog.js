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
    "sap/m/Input"
], function (Parent, Renderer, ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var OrderDialog = Parent.extend("op.util.control.ui.OrderDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},                
                keyField:  { type: "string", group: "Misc", defaultValue: "order_number" },
                textField: { type: "string", group: "Misc", defaultValue: "order_name" },
                items: { type: "sap.ui.core.Control"}
            }
        },
        

        renderer: Renderer,

        createSearchFilters: function(){
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/ORDER_NUMBER") +" or "+ this.getModel("I18N").getText("/ORDER_NAME")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/ORDER"));
            return [
                // new Column({
                //     width: "20%",
                //     hAlign: "Center",
                //     label: new Label({text: this.getModel("I18N").getText("/COMPANY_CODE")}),
                //     template: new Text({text: "{company_code}"})
                // }),
                new Column({
                    width: "30%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/ORDER_NUMBER")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "70%",
                    label: new Label({text: this.getModel("I18N").getText("/ORDER_NAME")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                })
                
            ];
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                aFilters = [
                        // new Filter("tenant_id", FilterOperator.EQ, "L2100")
                    ],
                oFilters = this.getProperty("items").filters || [],
                aSorters = this.getProperty("items").sorters || [];


            // aFilters.push(
            //     new Filter({
            //         filters: [                            
            //             new Filter("tenant_id", FilterOperator.EQ, this.getProperty("tenantid") )
            //         ],
            //         and: true
            //     })
            // );



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

            oFilters.forEach(function(oItem){
                aFilters.push(oItem)
            });

             

             aSorters.push(new Sorter("order_number", false));

            // var oQuery = {
            //     // urlParameters: {
            //     //     "$select": "company_code,order_number,order_name"
            //     // },             
                
            // };

           
            this.oDialog.setBusy(true);
            ServiceProvider.getServiceByUrl("srv-api/odata/v2/op.pu.mstService/").read("/Order_Mst", {
                fetchAll: true,  //TODL: please disable fetchAll option for performance
                filters: aFilters,
                sorters: aSorters,
                success: function(oData, bHasMore){
                    this.oDialog.setData(oData.results, false);
                    if(!bHasMore) this.oDialog.setBusy(false);
                }.bind(this),
                fetchAllSuccess: function(aDatas){
                    var aDialogData = this.oDialog.getData();
                    aDatas.forEach(function(oData){
                        aDialogData = aDialogData.concat(oData.results);
                    }.bind(this));
                    this.oDialog.setData(aDialogData);
                    this.oDialog.setBusy(false);
                }.bind(this)
            });          
        }
    });

    return OrderDialog;
}, /* bExport= */ true);