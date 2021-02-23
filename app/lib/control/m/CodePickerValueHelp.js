sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Parent, Dialog, Button, Text, Table, Column, ColumnListItem, Filter, FilterOperator, Sorter) {
    "use strict";

    var CodePickerValueHelp = Parent.extend("ext.lib.control.m.CodePickerValueHelp", {

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Choose a Code" },
                contentWidth: { type: "string", group: "Appearance" },
                contentHeight: { type: "string", group: "Appearance" },
                keyFieldHeaderText: { type: "string", group: "Misc", defaultValue: "Code" },
                textFieldHeaderText: { type: "string", group: "Misc", defaultValue: "Name" },
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" }
            },
            events: {
                apply: {},
                cancel: {}
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.oDialog = new Dialog();
            this.oDialog.addStyleClass("sapUiSizeCozy");
            this._firstTime = 0;
            this.oDialog.attachEvent("beforeOpen", this._onBeforeOpen.bind(this));
        },

        open: function(){
            this.oDialog.open();
        },

        onItemPress: function(oEvent){
            var oData = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            this.fireEvent("apply", {data: oData});
            this.oDialog.close();
        },


        _onBeforeOpen: function(){
            if(this._firstTime++ != 0) return;

            this.oDialog.setTitle(this.getProperty("title"));
            if(this.getProperty("contentWidth"))
                this.oDialog.setContentWidth(this.getProperty("contentWidth"));
            if(this.getProperty("contentHeight"))
                this.oDialog.setContentHeight(this.getProperty("contentHeight"));
            this.oDialog.setModel(this.getModel());
            this.oDialog.setBeginButton(new Button({
                text: "Cancel",
                press: function () {
                    this.fireEvent("cancel");
                    this.oDialog.close();
                }.bind(this)
            }));

            this.oTable = new Table({
                headerToolbar: new sap.m.OverflowToolbar({
                    content: [
                        new sap.m.ToolbarSpacer(),
                        new sap.m.SearchField({
                             width: "70%",
                             search: this._onTableFilterSearch.bind(this)
                        })
                    ]
                }),
                columns: [
                    new Column({
                        width: "75%",
                        header: new Text({text: this.getProperty("textFieldHeaderText")})
                    }),
                    new Column({
                        width: "25%",
                        hAlign: "Center",
                        header: new Text({text: this.getProperty("keyFieldHeaderText")})
                    })
                ],
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: "Active",
                        cells: [
                            new Text({text: "{"+this.getProperty("textField")+"}"}),
                            new Text({text: "{"+this.getProperty("keyField")+"}"})
                        ],
                        press: this.onItemPress.bind(this)
                    })
                }
            });
            this.oDialog.addContent(this.oTable);
        },

        _onTableFilterSearch: function(oEvent){
            var sValue = oEvent.getSource().getValue();
            this.oTable.getBinding("items").filter(new Filter({
                    filters: [
                        new Filter(this.getProperty("keyField"), FilterOperator.Contains, sValue),
                        new Filter(this.getProperty("textField"), FilterOperator.Contains, sValue)
                    ],
                    and: false
                }));
        }

    });

    return CodePickerValueHelp;
}, /* bExport= */ true);
