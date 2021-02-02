sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "ext/lib/formatter/DateFormatter",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/DatePicker",
], function (Parent, Renderer, ServiceProvider, DateFormatter, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, DatePicker) {
    "use strict";

    var CctrDialog = Parent.extend("op.util.control.ui.CctrDialog", {
        
        dateFormatter: DateFormatter,

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},                
                keyField:  { type: "string", group: "Misc", defaultValue: "cctr_code" },
                textField: { type: "string", group: "Misc", defaultValue: "cctr_name" },
                effectiveDate: { type: "date", group: "Misc", defaultValue: "2020-01-01" },
                items: { type: "sap.ui.core.Control"}
            }
        },
        
        

        renderer: Renderer,

        createSearchFilters: function(){

            this.oSearcheffectiveDate = new DatePicker({
                                                value: this.getProperty("effectiveDate"),
                                                dateDisplayFormat:"yyyy-MM-dd",
                                                valueFormat:"yyyy-MM-dd"
                                            });
            this.oSearcheffectiveDate.attachEvent("change", this.loadData.bind(this));

            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/CCTR_CODE") +" or "+ this.getModel("I18N").getText("/CCTR_NAME")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EFFECTIVE_DATE"), required: true}),
                        this.oSearcheffectiveDate
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , this.getModel("I18N").getText("/CCTR"));
            return [
                new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/EFFECTIVE_START_DATE")}),
                    template: new Text({text: {
                                            path: 'effective_start_date',
                                            type: 'sap.ui.model.type.Date',
                                            formatter: '.dateFormatter.toDateString'
                                            } })
                }),
                 new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/EFFECTIVE_END_DATE")}),
                    template: new Text({text: {
                                            path: 'effective_end_date',
                                            type: 'sap.ui.model.type.Date',
                                            formatter: '.dateFormatter.toDateString'
                                            } })
                }),
                 new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/LANGUAGE_CODE")}),
                    template: new Text({text: "{language_code}"})
                }),                
                new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/CCTR_CODE")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "45%",
                    label: new Label({text: this.getModel("I18N").getText("/CCTR_NAME")}),
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

            if(this.oSearcheffectiveDate.getValue()){
                aFilters.push(
                    new Filter({
                        filters: [                            
                            new Filter("effective_start_date", FilterOperator.LE, this.oSearcheffectiveDate.getValue()),
                            new Filter("effective_end_date", FilterOperator.GE, this.oSearcheffectiveDate.getValue())
                        ],
                        and: true
                    })
                );
            }

            oFilters.forEach(function(oItem){
                aFilters.push(oItem)
            });

             

             aSorters.push(new Sorter("cctr_code", false));
           
            this.oDialog.setBusy(true);
            ServiceProvider.getServiceByUrl("srv-api/odata/v2/op.util.MstService/").read("/Cctr_Mst", {
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

    return CctrDialog;
}, /* bExport= */ true);