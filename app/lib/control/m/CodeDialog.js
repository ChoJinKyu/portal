sap.ui.define([
    "sap/m/Dialog",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
], function (Dialog, ODataV2ServiceProvider,
        Sorter, Filter, FilterOperator,
        Button, Text, Table, Column, ColumnListItem) {
    "use strict";

    var CodeDialog = Dialog.extend("ext.lib.control.m.CodeDialog", {
        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Choose a Code" },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "500px" },
                contentHeight: { type: "string", group: "Appearance", defaultValue: "300px" },
                groupCode: { type: "string", group: "Misc" }
            },
            events: {
                applyPress: {},
                cancelPress: {}
            }
        },

        init: function () {
            Dialog.prototype.init.call(this);
            this.setModel(ODataV2ServiceProvider.getCommonService());
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

            var aFilters = [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("group_code", FilterOperator.EQ, this.getProperty("groupCode"))
                ], aSorters = [
                    new Sorter("sort_no", false)
                ];
                //sLanguageCode = this.getUserChoices().getLanguage();
            this.oTable = new Table({
                columns: [
                    new Column({
                        width: '100px',
                        header: new Text({text: 'Code'})
                    }),
                    new Column({
                        width: '300px',
                        header: new Text({text: 'Description'})
                    })
                ],
                items: {
                    path: "/Code",
                    filters: aFilters,
                    sorters: aSorters,
                    template: new ColumnListItem({
                        type: "Active",
                        cells: [
                            new Text({text: '{code}'}),
                            new Text({text: '{code_name}'})
                        ],
                        press: this.onTablePress.bind(this)
                    })
                }
            });
            this.addContent(this.oTable);
        }

    });


    return CodeDialog;
}, /* bExport= */ true);
