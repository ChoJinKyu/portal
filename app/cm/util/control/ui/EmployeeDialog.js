/*
소스 정리 필요
*/

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
                loadWhenOpen: { type: "boolean", group: "Misc", defaultValue: false },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "70em"},
                keyField: { type: "string", group: "Misc", defaultValue: "employee_number" },
                textField: { type: "string", group: "Misc", defaultValue: "user_local_name" }
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            this.oSearchKeyword = new Input({ placeholder: this.getModel("I18N").getText("/KEYWORD")});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));

            this.oDepartment = new Input({ placeholder: this.getModel("I18N").getText("/KEYWORD")});
            this.oDepartment.attachEvent("change", this.loadData.bind(this));
            
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/EMPLOYEE"), required: true}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/DEPARTMENT"), required: true}),
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

        extractBindingInfo(oValue, oScope){
            if(oValue && (oValue.filters || oValue.sorters)){
                var oParam = jQuery.extend(true, {}, oValue);
                this.oFilters = oValue.filters || [];
                this.oSorters = oValue.sorters || [];
            }else{
                return Parent.prototype.extractBindingInfo.call(this, oValue, oScope);
            }
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                sDepartment = this.oDepartment.getValue(),
                // oParam = this.getServiceParameters(),
                aFilters = this.oFilters || [],
                aSorters = this.oSorters || [];
            if(sKeyword){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter({
                                path: this.getProperty("keyField"),
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: this.getProperty("textField"),
                                operator: FilterOperator.Contains,
                                value1: sKeyword,
                                caseSensitive: false
                            })
                        ],
                        and: false
                    })
                );
                this.sKeywordFlag = true;
            }else{
                this.sKeywordFlag = false;
            }
            if(sDepartment){
                aFilters.push(
                    new Filter({
                        filters: [
                            new Filter({
                                path: "department_local_name",
                                operator: FilterOperator.Contains,
                                value1: sDepartment,
                                caseSensitive: false
                            }),
                            new Filter({
                                path: "department_id",
                                operator: FilterOperator.Contains,
                                value1: sDepartment,
                                caseSensitive: false
                            })
                        ],
                        and: false
                    })
                );
                this.sDepartmentFlag = true;
            }else{
                this.sDepartmentFlag = false;
            }

            ODataV2ServiceProvider.getService("cm.util.HrService").read("/Employee", {
             fetchOthers: true,
                filters: aFilters,
                sorters: aSorters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                }.bind(this),
                fetchOthersSuccess: function(aDatas){
                    var aDialogData = this.oDialog.getData();
                    aDatas.forEach(function(oData){
                        aDialogData = aDialogData.concat(oData.results);
                    }.bind(this));
                    this.oDialog.setData(aDialogData);
                    this.oDialog.setBusy(false);
                }.bind(this)
            });
                
            if(this.sKeywordFlag === true){
                aFilters.length = aFilters.length -1;
            }
            if(this.sDepartmentFlag === true){
                aFilters.length = aFilters.length -1;
            }
        },
        
        beforeOpen: function(){
        }

    });

    return EmployeeDialog;
}, /* bExport= */ true);