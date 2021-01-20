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
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "employee_number" },
                textField: { type: "string", group: "Misc", defaultValue: "user_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchKeyword = new Input({ placeholder: "Keyword"});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));

            this.oDepartment = new Input({ placeholder: "Department Name or No."});
            this.oDepartment.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EMPLOYEE")}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/DEPARTMENT")}),
                        this.oDepartment
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    label: new Label({text: "Name"}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    label: new Label({text: "e-Mail"}),
                    template: new Text({text: "{email_id}"})
                }),
                new Column({
                    width: "50%",
                    label: new Label({text: "Department"}),
                    template: new Text({text: "{department_local_name}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: "Employee No."}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                }),
                new Column({
                    width: "10%",
                    hAlign: "Center",
                    label: new Label({text: "Job Title"}),
                    template: new Text({text: "{job_title}"})
                })
            ];
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                sDepartment = this.oDepartment.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [],
                aSorters = oParam.sorters || [];
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
            if(sDepartment){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter("tolower(department_local_name)", FilterOperator.Contains, "'" + sDepartment.toLowerCase().replace("'","''") + "'"),
                            new Filter("tolower(department_id)", FilterOperator.Contains, "'" + sDepartment.toLowerCase().replace("'","''") + "'")
                        ],
                        and: false
                    })
                );
            }
            aSorters.push(new Sorter("user_local_name", true));
            ODataV2ServiceProvider.getService("cm.util.HrService").read("/Employee", {
                filters: aFilters,
                sorters: aSorters,
                success: function(oData){
                    this.oDialog.setData(oData.results, false);
                }.bind(this)
            });
        }

    });

    return EmployeeDialog;
}, /* bExport= */ true);
