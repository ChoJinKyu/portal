sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/core/service/ODataV2ServiceProvider",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input"
], function (Parent, ODataV2ServiceProvider, Filter, FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    var EmployeeDialog = Parent.extend("cm.util.control.ui.EmployeeDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "50em"},
                keyField: { type: "string", group: "Misc", defaultValue: "employee_number" },
                textField: { type: "string", group: "Misc", defaultValue: "user_local_name" }
            }
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
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
            ODataV2ServiceProvider.getService("cm.util.HrService").read("/Employee", {
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
