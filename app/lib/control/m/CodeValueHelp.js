sap.ui.define([
    "sap/ui/core/Control",
    "ext/lib/control/m/ValueHelpDialog",
    "ext/lib/core/service/ODataV2ServiceProvider",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input"
], function (Parent, ValueHelpDialog, ODataV2ServiceProvider, Filter, FilterOperator, GridData, VBox, Column, Label, Text, Input) {
    "use strict";

    //TODO : Localization (Title)
    var CodeValueHelp = Parent.extend("ext.lib.control.m.CodeValueHelp", {

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance" },
                multiSelection: { type: "boolean", group: "Misc", defaultValue: false },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "35em"},
                contentHeight: { type: "string", group: "Appearance" },
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" }
            },
            defaultAggregation: "items",
            aggregations: {
                items: {}
            },
            events: {
                apply: {},
                cancel: {}
            }
        },

        constructor: function () {
            Parent.apply(this, arguments);
            this.createDialog();
        },

        createDialog: function(){
            this.oSearchKeyword = new Input({ placeholder: "Keyword"});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));

            this.oDialog = new ValueHelpDialog({
                multiSelection: this.getProperty("multiSelection"),
                keyField: this.getProperty("keyField"),
                textField: this.getProperty("textField"),
                filters: this.createSearchFilters(),
                columns: this.createTableColumns(),
                cells: this.createTableCells()
            });

            this.oDialog.setTitle(this.getProperty("title"));
            if(this.getProperty("contentWidth"))
                this.oDialog.setContentWidth(this.getProperty("contentWidth"));
            if(this.getProperty("contentHeight"))
                this.oDialog.setContentHeight(this.getProperty("contentHeight"));

            this.oDialog.attachEvent("searchPress", function(oEvent){
                this.loadData();
            }.bind(this));

            this.oDialog.attachEvent("apply", function(oEvent){
                this.fireEvent("apply", { 
                    items: oEvent.getParameter("items"),
                    item: oEvent.getParameter("item")
                });
            }.bind(this));

            this.oDialog.attachEvent("cancel", function(oEvent){
                this.fireEvent("cancel");
            }.bind(this));
        },

        createSearchFilters: function(){
            return [
                new VBox({
                    items: [
                        new Label({ text: "Keyword"}),
                        this.oSearchKeyword
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ];
        },

        createTableColumns: function(){
            return [
                new Column({
                    width: "75%",
                    header: new Text({text: "Text"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    header: new Text({text: "Code"})
                })
            ];
        },

        createTableCells: function(){
            return [
                new Text({text: "{"+this.getProperty("textField")+"}"}),
                new Text({text: "{"+this.getProperty("keyField")+"}"})
            ];
        },

        getTokens: function(){
            return this.oDialog.getTokens();
        },

        setTokens: function(aTokens){
            return this.oDialog.setTokens(aTokens);
        },

        extractBindingInfo(oValue, oScope){
            if(oValue && (oValue.serviceName || oValue.serviceUri) && oValue.entityName){
                var oParam = jQuery.extend(true, {}, oValue);

                delete oValue.filters;
                delete oValue.sorters;
                delete oValue.parameters;
                delete oValue.serviceName;
                delete oValue.serviceUri;
                delete oValue.entityName;

                this.oServiceModel = oParam.serviceName ? 
                    ODataV2ServiceProvider.getService(oParam.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oParam.serviceUri);
                this.oServiceParam = jQuery.extend(oParam, {
                    success: function(oData){
                        var aRecords = oData.results;
                        this.oDialog.setData(aRecords, false);
                    }.bind(this)
                });
            }else{
                return Parent.prototype.extractBindingInfo.call(this, oValue, oScope);
            }
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                oParam = jQuery.extend(true, {}, this.oServiceParam);
            if(sKeyword){
                oParam.filters.push(
                    new Filter({
                        filters: [
                            new Filter("tolower("+this.getProperty("keyField")+")", FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'"),
                            new Filter("tolower("+this.getProperty("textField")+")", FilterOperator.Contains, "'" + sKeyword.toLowerCase().replace("'","''") + "'")
                        ],
                        and: false
                    })
                );
            }
            this.oServiceModel.read("/" + oParam.entityName, oParam);
        },
        
        open: function(){
            this.loadData();
            this.oDialog.open();
        }

    });

    return CodeValueHelp;
}, /* bExport= */ true);
