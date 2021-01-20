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
], function (Parent, Renderer, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var EmployeeDialog = Parent.extend("cm.util.control.ui.EmployeeDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "800px"},
                keyField: { type: "string", group: "Misc", defaultValue: "employee_number" },
                textField: { type: "string", group: "Misc", defaultValue: "user_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oEmployee = new Input({ placeholder: "EMPLOYEE Name."});
            this.oSearchKeyword.setPlaceholder("EMPLOYEE Number.");
            this.oEmployee.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EMPLOYEE_NUMBER")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EMPLOYEE_NAME")}),
                        this.oEmployee
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "13%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/EMPLOYEE_NUMBER")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "10%",
                    label: new Label({text: this.getModel("I18N").getText("/EMPLOYEE_NAME")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    width: "45%",
                    label: new Label({text: this.getModel("I18N").getText("/DEPARTMENT")}),
                    template: new Text({text: "{department_local_name}"})
                }),
                new Column({
                    label: new Label({text: this.getModel("I18N").getText("/EMAIL")}),
                    template: new Text({text: "{email_id}"})
                })
            ];
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                sEmployee = this.oEmployee.getValue(),
                aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100")
                ];
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter(this.getProperty("keyField"), FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'")
                            // new Filter("tolower("+this.getProperty("textField")+")", FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'")
                        ],
                        and: false
                    })
                );
            }
            if(sEmployee){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter(this.getProperty("textField"), FilterOperator.Contains, "'" + sEmployee.toLowerCase().replace("'","''") + "'")
                            // new Filter("tolower(department_id)", FilterOperator.Contains, "'" + sEmployee.toLowerCase().replace("'","''") + "'")
                        ],
                        and: false
                    })
                );
            }
            ODataV2ServiceProvider.getService("cm.util.HrService").read("/Employee", {
                filters: aFilters,
                sorters: [
                    new Sorter("user_local_name", false)
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
