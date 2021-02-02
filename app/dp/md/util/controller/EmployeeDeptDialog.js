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

    var EmployeeDialog = Parent.extend("dp.md.util.controller.EmployeeDeptDialog", {

        
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
            this.oDepartment = new Input({ placeholder: "Department Name or No."});
            this.oDepartment.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EMPLOYEE")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }) 
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/NAME") + " / "+this.getModel("I18N").getText("/POSITION")+" / " +this.getModel("I18N").getText("/DEPARTMENT")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    width: "15%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/EMPLOYEE_NUMBER")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                })
            ];
        },

        loadData: function(){
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

    return EmployeeDialog;
}, /* bExport= */ true);
