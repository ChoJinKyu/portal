sap.ui.define([
    "sap/ui/core/Control",
    "ext/lib/control/DummyRenderer",
    "ext/lib/util/Multilingual",
    "ext/lib/control/ui/ValueHelpDialog",
    "ext/lib/core/service/ODataV2ServiceProvider",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/ui/thirdparty/jquery"
], function (Parent, Renderer, Multilingual, ValueHelpDialog, ODataV2ServiceProvider, Filter, FilterOperator, GridData, VBox, Column, Label, Text, Input, jQuery) {
    "use strict";

    //TODO : Localization (Title)
    var CodeValueHelp = Parent.extend("ext.lib.control.ui.CodeValueHelp", {

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance" },
                closeWhenApplied: { type: "boolean", group: "Misc", defaultValue: true },
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

        renderer: Renderer,

        constructor: function () {
            Parent.prototype.constructor.apply(this, arguments);

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            if(this.getModel("I18N").isReady()){
                this.createDialog();
            }else{
                oMultilingual.attachEvent("ready", function(){
                    this.createDialog();
                }.bind(this));
            }
        },

        createDialog: function(){
            this.oSearchKeyword = new Input({ placeholder: this.getModel("I18N").getText("/KEYWORD")});
            this.oSearchKeyword.attachEvent("change", this.loadData.bind(this));

            this.oDialog = new ValueHelpDialog({
                closeWhenApplied: this.getProperty("closeWhenApplied"),
                multiSelection: this.getProperty("multiSelection"),
                keyField: this.getProperty("keyField"),
                textField: this.getProperty("textField"),
                filters: this.createSearchFilters(),
                columns: this.createTableColumns()
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

            if(this.openWasRequested){
                this.open();
                if(this.aTokens && this.aTokens.length > 0)
                    this.oDialog.setTokens(this.aTokens);
            }
        },

        createSearchFilters: function(){
            return [
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/KEYWORD")}),
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
                    label: new Label({text: this.getModel("I18N").getText("/VALUE")}),
                    template: new Text({text: "{"+this.getProperty("textField")+"}"})
                }),
                new Column({
                    width: "25%",
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/CODE")}),
                    template: new Text({text: "{"+this.getProperty("keyField")+"}"})
                })
            ];
        },

        getTokens: function(){
            return this.oDialog.getTokens();
        },

        setTokens: function(aTokens){
            if(this.oDialog)
                this.oDialog.setTokens(aTokens);
            else
                this.aTokens = aTokens;
        },

        extractBindingInfo(oValue, oScope){
            if(oValue && (oValue.serviceName || oValue.serviceUri) && oValue.entityName){
                var oParam = jQuery.extend(true, {}, oValue);

                this.aFilters = oValue.filters;
                this.aSorters = oValue.sorters;
                this.aParameters = oValue.parameters;

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

        getServiceParameters: function(){
            var oParam = jQuery.extend(true, {}, this.oServiceParam || {}),
                aFilters = oParam.filters || [],
                aTenantFilter = jQuery.map(aFilters, function(oItem){
                    if(oItem.sPath == "tenant_id") return oItem;
                });
            if(aTenantFilter.length < 1)
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
            oParam.filters = aFilters;
            return oParam;
        },

        getServiceModel: function(oParam){
            return this.oServiceModel || ODataV2ServiceProvider.getService(oParam.serviceName);
        },

        loadData: function(){
            var sKeyword = this.oSearchKeyword.getValue(),
                oParam = this.getServiceParameters(),
                aFilters = oParam.filters || [];
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
            }
            this.getServiceModel(oParam).read("/" + oParam.entityName, oParam);
        },
        
        open: function(){
            if(!this.oDialog) {
                this.openWasRequested = true;
                return;
            }
            this.loadData();
            if(this.beforeOpen)
                this.beforeOpen.call(this);
            this.oDialog.open();
        },

        close: function(){
            this.oDialog.close();
        }

    });

    return CodeValueHelp;
}, /* bExport= */ true);
