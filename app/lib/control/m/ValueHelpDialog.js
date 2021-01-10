sap.ui.define([
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/layout/GridData",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/FlexBox",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function (Parent, Renderer, ODataV2ServiceProvider, GridData, SimpleForm, FlexBox, Button, Text, Table, Column, ColumnListItem, JSONModel, Filter, FilterOperator, Sorter) {
    "use strict";

    var ValueHelpDialog = Parent.extend("ext.lib.control.m.ValueHelpDialog", {

        renderer: Renderer,

        metadata: {
            properties: {
                multiSelection: { type: "boolean", group: "Misc", defaultValue: false }
            },
            aggregations: {
                filters: {
                    type: "sap.ui.core.Control"
                },
                columns: {
                    type: "sap.m.Column",
                    multiple: true,
                    singularName: "tableColumn",
                    bindable: "bindable"
                },
                cells: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    singularName: "tableItem",
                    bindable: "bindable"
                }
            },
            events: {
                searchPress: {},
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

        bindAggregation: function(sName, oBindingInfo){
            Parent.prototype.bindAggregation.call(this, sName, oBindingInfo);
            return this;
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
                type: "Emphasized",
                text: "Apply",
                press: function () {
                    this.fireEvent("apply", {items : [{ items: "hello"}]});
                    this.close();
                }.bind(this)
            }));

            var oForm = new SimpleForm({
                maxContainerCols: 2,
                editable: true,
                layout: "ResponsiveGridLayout" ,
                adjustLabelSpan: false ,
                labelSpanL: 4 ,
                labelSpanM: 4 ,
                emptySpanL: 0 ,
                emptySpanM: 0 ,
                columnsL: 2 ,
                columnsM: 2,
                content: this.getAggregation("filters")
            });
            oForm.addStyleClass("searchBox");

            var oSearchButton = new FlexBox({
                alignItems: "End",
                justifyContent: "End",
                items: [
                    new Button({
                        type: "Transparent",
                        text: "Search",
                        press: this._onSearchPress.bind(this)
                    })
                ],
                layoutData: new GridData({span: "XL12 L12 M12 S12"})
            })
            oSearchButton.addStyleClass("searchBoxButtonArea");
            oForm.addContent(oSearchButton);
            
            var oTable = new Table({
                columns: this.getAggregation("columns"),
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: "Active",
                        cells: this.getAggregation("cells"),
                        press: this.onItemPress.bind(this)
                    })
                }
            });
            this.addContent(oForm);
            this.addContent(oTable);
        },

        _onSearchPress: function(oEvent){
            this.fireEvent("searchPress");
        }

    });

    return ValueHelpDialog;
}, /* bExport= */ true);
