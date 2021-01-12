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

    var MaterialMstDialog = Parent.extend("dp.util.control.m.MaterialMstDialog", {

        metadata: {
            properties: {
                title: { type: "string", group: "Appearance", defaultValue: "Select Material" },
                contentWidth: { type: "string", group: "Appearance" },
                contentHeight: { type: "string", group: "Appearance" }
            },
            events: {
                ok: {},
                cancel: {}
            }
        },

        init: function () {
            Parent.prototype.init.call(this);
            this.oDialog = new Dialog();
            this.oDialog.addStyleClass("sapUiSizeCompact");
            this._firstTime = 0;
            this.oDialog.attachEvent("beforeOpen", this._onBeforeOpen.bind(this));
        },

        open: function(){
            this.oDialog.open();
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

            this.oDialog.setEndButton(new Button({
                text: "Apply",
                type: "Emphasized",
                press: function () {
                    this.fireEvent("Apply");
                    this.oDialog.close();
                }.bind(this)
            }));

            this.oTable = new Table({
                id: "materialMstTable",
                mode: "MultiSelect",
                selectionChange: this.onItemPress.bind(this),
                rememberSelections: false,
                headerToolbar: new sap.m.OverflowToolbar({
                    content: [
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Label({
                            labelFor: "labeledGroup1",
                            text: "자재코드",
                            layoutData: new sap.m.OverflowToolbarLayoutData({
                                group: 1
                            })
                        }),
                        new sap.m.SearchField({
                            id: "labeledGroup1",
                            width: "30%",
                            search: this._onTableFilterSearch.bind(this),
                            layoutData: new sap.m.OverflowToolbarLayoutData({
                                group: 1,
                                shrinkable: true,
                                minWidth: "150px"
                            })
                        }),
                        
                        new sap.m.Label({
                            labelFor: "labeledGroup2",
                            text: "조직코드",
                            layoutData: new sap.m.OverflowToolbarLayoutData({
                                group: 2
                            })
                        }),
                        new sap.m.SearchField({
                            id: "labeledGroup2",
                            width: "30%",
                            search: this._onTableFilterSearch2.bind(this),
                            layoutData: new sap.m.OverflowToolbarLayoutData({
                                group: 2,
                                shrinkable: true,
                                minWidth: "150px"
                            })
                        })
                    ]
                }),
                columns: [
                    new Column({
                        width: "5%",
                        hAlign: "Center",
                        header: new sap.m.Button({
                            icon : "sap-icon://unfavorite",
                            type:"Transparent"
                        })
                    }),
                    new Column({
                        width: "10%",
                        hAlign: "Center",
                        header: new Text({text: "조직코드"})
                    }),
                    new Column({
                        width: "20%",
                        hAlign: "Center",
                        header: new Text({text: "자재코드"})
                    }),
                    new Column({
                        width: "20%",
                        hAlign: "Center",
                        header: new Text({text: "자재내역"})
                    }),
                    new Column({
                        width: "25%",
                        hAlign: "Center",
                        header: new Text({text: "자재스팩"})
                    }),
                    new Column({
                        width: "10%",
                        hAlign: "Center",
                        header: new Text({text: "단위"})
                    }),
                    new Column({
                        width: "10%",
                        hAlign: "Center",
                        header: new Text({text: "구매가능"})
                    })
                ],
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: "Active",
                        cells: [
                            new sap.m.Button({
                                icon:"sap-icon://unfavorite",
                                type:"Transparent"
                            }),
                            new Text({text: "{org_code} {org_name}"}),
                            new Text({text: "{material_code}"}),
                            new Text({text: "{material_desc}"}),
                            new Text({text: "{material_spec}"}),
                            new Text({text: "{base_uom_code}"}),
                            new Text({text: "{purchasing_enable_flag}"})
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
                    new Filter("material_code", FilterOperator.Contains, sValue)
                ],
                and: false
            }));
        },

        _onTableFilterSearch2: function(oEvent){
            var sValue = oEvent.getSource().getValue();
            this.oTable.getBinding("items").filter(new Filter({
                filters: [
                    new Filter("org_code", FilterOperator.Contains, sValue)
                ],
                and: false
            }));
        },

        onItemPress: function(oEvent){
            var oData = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            oEvent.getSource().setSelected(true, oData);
            this.fireEvent("ok", {data: oData});
        },
        
    });

    return MaterialMstDialog;
}, /* bExport= */ true);
