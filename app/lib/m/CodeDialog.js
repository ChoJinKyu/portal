sap.ui.define([
    "sap/m/Dialog",
    "sap/ui/model/json/JSONModel",
    "../thirdparty/QueryBuilder",
    "./ServiceUrlProvider",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
], function (Dialog, JSONModel, QB, ServiceUrlProvider, Button, Text, Table, Column, ColumnListItem) {
    "use strict";

    var CodeDialog = Dialog.extend("ext.lib.m.CodeDialog", {
        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Code" },
                contentWidth: { type: "string", group: "Appearance", defaultValue: "500px" },
                contentHeight: { type: "string", group: "Appearance", defaultValue: "300px" }
            }
        },

        init: function () {
            var sUrl = ServiceUrlProvider.getServiceUtils('CodeList'),
                oQueryBuilder = new QueryBuilder(),
                sQuery = oQueryBuilder.count()
                    .filter(f => f.filterExpression('group_code', 'eq', 'DP_SC_TYPE'))
                    .select('code,code_description')
                    .toQuery(),
                oModel = new JSONModel(sUrl + sQuery);

            Dialog.prototype.init.call(this);
            this.setModel(oModel);
            this.setBeginButton(new Button({
                text: "Close",
                press: function () {
                    this.close();
                }.bind(this)
            }));
            this.setEndButton(new Button({
                text: "Apply",
                press: function () {
                    this.close();
                }.bind(this)
            }));

            var oColumnList = new ColumnListItem({
                type="Navigation",
                cells: [
                    new Text({text: '{code}'}),
                    new Text({text: '{code_description}'})
                ]
            });
            oColumnList.attachPress(this.onTablePress);

            this.addContent(new Table({
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
                    path: "/value",
                    template: oColumnList
                }
            }));
                
        },

        onTablePress: function(oEvent){
            debugger;
        }

    });


    return CodeDialog;
}, /* bExport= */ true);
