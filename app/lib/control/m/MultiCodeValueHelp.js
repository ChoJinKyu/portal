sap.ui.define([
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Parent, Renderer, ODataV2ServiceProvider, Button, Text, Table, Column, ColumnListItem, JSONModel, Filter, FilterOperator, Sorter) {
    "use strict";

    var MultiCodeValueHelp = Parent.extend("ext.lib.control.m.MultiCodeValueHelp", {

        renderer: Renderer,

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Choose a Code" },
                keyFieldHeaderText: { type: "string", group: "Misc", defaultValue: "Code" },
                textFieldHeaderText: { type: "string", group: "Misc", defaultValue: "Name" },
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" }
            },
            aggregations: {
                bodyContent: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "item",
                    bindable: "bindable"
                },
            },
            events: {
                apply: {},
                cancel: {}
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.setModel(new JSONModel());
            this.addStyleClass("sapUiSizeCompact");
            this._firstTime = 0;
            this.attachEvent("beforeOpen", this._onBeforeOpen.bind(this));
        },

        onItemPress: function(oEvent){
            var oData = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            this.fireEvent("apply", {items: oData});
            this.close();
        },

        extractBindingInfo(oValue, oScope){
            // var oBindingInfo = Parent.prototype.extractBindingInfo.apply(this, arguments);
            if(oValue && (oValue.serviceName || oValue.serviceUrl) && oValue.entityName){
                var sKey = "{"+ this.getProperty("keyField") +"}",
                    sText = "{"+ this.getProperty("textField") +"}";

                this.oServiceModel = oValue.serviceName ? 
                    ODataV2ServiceProvider.getService(oValue.serviceName) : ODataV2ServiceProvider.getServiceByUrl(oValue.serviceUrl);
                    
                this.oServiceModel.read("/" + oValue.entityName, jQuery.extend(oValue, {
                    success: function(oData){
                        var aRecords = oData.results;
                        this.getModel().setSizeLimit(aRecords.length || 100);
                        this.getModel().setData(aRecords, false);
                    }.bind(this)
                }));

                delete oValue.serviceName;
                delete oValue.entityName;
                delete oValue.filters;
                delete oValue.sorter;
                oValue.path = "/";
                this.oCustomContent = oValue.template;
                // oValue.template = new sap.ui.core.Control();
            }
            return Parent.prototype.extractBindingInfo.call(this, oValue, oScope);
        },

        _onBeforeOpen: function(){
            if(this._firstTime++ != 0) return;

            this.setBeginButton(new Button({
                text: "Cancel",
                press: function () {
                    this.fireEvent("cancel");
                    this.close();
                }.bind(this)
            }));
            this.setEndButton(new Button({
                text: "Apply",
                press: function () {
                    this.fireEvent("apply", {items : [{ items: "hello"}]});
                    this.close();
                }.bind(this)
            }));

            // this.oCustomContent = new Table({
            //     headerToolbar: new sap.m.OverflowToolbar({
            //         content: [
            //             new sap.m.ToolbarSpacer(),
            //             new sap.m.SearchField({
            //                  width: "70%",
            //                  search: this._onTableFilterSearch.bind(this)
            //             })
            //         ]
            //     }),
            //     columns: [
            //         new Column({
            //             width: "75%",
            //             header: new Text({text: this.getProperty("textFieldHeaderText")})
            //         }),
            //         new Column({
            //             width: "25%",
            //             hAlign: "Center",
            //             header: new Text({text: this.getProperty("keyFieldHeaderText")})
            //         })
            //     ],
            //     items: {
            //         path: "/",
            //         template: new ColumnListItem({
            //             type: "Active",
            //             cells: [
            //                 new Text({text: "{"+this.getProperty("textField")+"}"}),
            //                 new Text({text: "{"+this.getProperty("keyField")+"}"})
            //             ],
            //             press: this.onItemPress.bind(this)
            //         })
            //     }
            // });
            this.addContent(this.oCustomContent);
        },

        _onTableFilterSearch: function(oEvent){
            var sValue = oEvent.getSource().getValue();
            this.oCustomContent.getBinding("items").filter(new Filter({
                    filters: [
                        new Filter(this.getProperty("keyField"), FilterOperator.Contains, sValue),
                        new Filter(this.getProperty("textField"), FilterOperator.Contains, sValue)
                    ],
                    and: false
                }));
        }

    });

    return MultiCodeValueHelp;
}, /* bExport= */ true);
