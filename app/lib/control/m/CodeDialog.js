sap.ui.define([
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
], function (Dialog, Renderer, ODataV2ServiceProvider,
        Sorter, Filter, FilterOperator,
        Button, Text, Table, Column, ColumnListItem) {
    "use strict";

    var CodeDialog = Dialog.extend("ext.lib.control.m.CodeDialog", {

        renderer: Renderer,

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Choose a Code" },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "500px" },
                contentHeight: { type: "string", group: "Appearance", defaultValue: "300px" },
                keyField: { type: "string", group: "Misc", defaultValue: "code" },
                textField: { type: "string", group: "Misc", defaultValue: "code_name" }
            },
            events: {
                applyPress: {},
                cancelPress: {}
            }
        },

        init: function () {
            Dialog.prototype.init.call(this);
            this.setBeginButton(new Button({
                text: "Cancel",
                press: function () {
                    this.fireEvent("cancelPress");
                    this.close();
                }.bind(this)
            }));
            // this.setEndButton(new Button({
            //     text: "Apply",
            //     press: function () {
            //         this.close();
            //     }.bind(this)
            // }));

            this._firstTime = 0;
            this.attachEvent("beforeOpen", this._onBeforeOpen);
        },

        onTablePress: function(oEvent){
            var oData = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            this.fireEvent("applyPress", {data: oData});
            this.close();
        },

        _onBeforeOpen: function(){
            if(this._firstTime++ != 0) return;
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
                        width: "100px",
                        header: new Text({text: "Code"})
                    }),
                    new Column({
                        width: "300px",
                        header: new Text({text: "Name"})
                    })
                ],
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: "Active",
                        cells: [
                            new Text({text: "{"+this.getProperty("keyField")+"}"}),
                            new Text({text: "{"+this.getProperty("textField")+"}"})
                        ],
                        press: this.onTablePress.bind(this)
                    })
                }
            });
            this.addContent(this.oTable);
        },

        _onTableFilterSearch: function(oEvent){
            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("group_code", FilterOperator.EQ, this.getProperty("groupCode")),
                    new Filter("code_name", FilterOperator.EQ, oEvent.getSource().getValue())
                ], aSorters = [
                    new Sorter("sort_no", false)
                ]
            this.oTable.getBinding("items").filter({
                path: "/Code",
                filters: aFilters
            })
        }

    });


    return CodeDialog;
}, /* bExport= */ true);
