/**
 * @Deprecated
 * 
 */

sap.ui.define([
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/layout/GridData",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/VBox",
    "sap/m/FlexBox",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/MultiInput",
    "sap/m/Token",
    "sap/m/Table",
    "sap/m/ColumnListItem",
    "sap/ui/thirdparty/jquery"
], function (Parent, Renderer, Multilingual, JSONModel, GridData, SimpleForm, VBox, FlexBox, Label, Button, MultiInput, Token, Table, ColumnListItem, jQuery) {
    "use strict";

    var ValueHelpDialog = Parent.extend("ext.lib.control.m.ValueHelpDialog", {

        renderer: Renderer,

        metadata: {
            properties: {
                multiSelection: { type: "boolean", group: "Misc", defaultValue: false },
                keyField: { type: "string", group: "Misc", defaultValue: "key" },
                textField: { type: "string", group: "Misc", defaultValue: "text" }
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

        constructor: function(){
            Parent.apply(this, arguments);
            this.setModel(new JSONModel());
            this.addStyleClass("sapUiSizeCompact");
            
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            if(this.getModel("I18N").isReady()){
                this.createContent();
            }else{
                oMultilingual.attachEvent("ready", function(){
                    this.createContent();
                }.bind(this));
            }
        },

        createContent: function(){
            var isMultiSelection = this.getProperty("multiSelection");

            var oLayout = new VBox();
            this.addContent(oLayout);

            this.setBeginButton(new Button({
                text: this.getModel("I18N").getText("/CANCEL"),
                press: function () {
                    this.fireEvent("cancel");
                    this.close();
                }.bind(this)
            }));
            if(isMultiSelection){
                this.setEndButton(this.oApplyButton = new Button({
                    type: "Emphasized",
                    text: this.getModel("I18N").getText("/APPLY"),
                    enabled: isMultiSelection == true ? false : true,
                    press: function () {
                        this.doApply();
                        this.close();
                    }.bind(this)
                }));
            }

            var oForm = new SimpleForm({
                maxContainerCols: 2,
                editable: true,
                layout: "ResponsiveGridLayout",
                adjustLabelSpan: false,
                labelSpanL: 4,
                labelSpanM: 4,
                emptySpanL: 0,
                emptySpanM: 0,
                columnsL: 2,
                columnsM: 2,
                content: this.getAggregation("filters")
            });
            oForm.addStyleClass("searchBox");
            oLayout.addItem(oForm);

            var oSearchButton = new FlexBox({
                alignItems: "End",
                justifyContent: "End",
                items: [
                    new Button({
                        type: "Emphasized",
                        text: this.getModel("I18N").getText("/SEARCH"),
                        press: this._onSearchPress.bind(this)
                    })
                ],
                layoutData: new GridData({span: "XL12 L12 M12 S12"})
            })
            oSearchButton.addStyleClass("searchBoxButtonArea");
            oForm.addContent(oSearchButton);

            var oTable = new Table({
                noDataText: this.getModel("I18N").getText("/NCM01004"),
                mode: isMultiSelection ? "MultiSelect" : "None",
                columns: this.getAggregation("columns"),
                items: {
                    path: "/",
                    template: new ColumnListItem({
                        type: isMultiSelection ? "Inactive" : "Active",
                        cells: this.getAggregation("cells"),
                        press: this._onTableItemPress.bind(this)
                    })
                },
                selectionChange: this._onTableItemSelect.bind(this)
            });
            oLayout.addItem(oTable);
            this.oTable = oTable;

            if(isMultiSelection){
                var oMultiInput = new MultiInput({
                    showValueHelp: false,
                    tokenUpdate: this._onSelectedTokenUpdate.bind(this)
                });
                var oSelectionForm = new SimpleForm({
                    maxContainerCols: 2,
                    editable: false,
                    layout: "ResponsiveGridLayout",
                    adjustLabelSpan: false,
                    labelSpanL: 4,
                    labelSpanM: 4,
                    emptySpanL: 0,
                    emptySpanM: 0,
                    columnsL: 2,
                    columnsM: 2,
                    content: [new VBox({
                        items: [
                            new Label({ text: this.getModel("I18N").getText("/SELECTED_ITEMS")}),
                            oMultiInput
                        ],
                        layoutData: new GridData({ span: "XL12 L12 M12 S12"})
                    })]
                });
                oSelectionForm.addStyleClass("searchBox");

                oLayout.addItem(oSelectionForm);
                this.oMultiInput = oMultiInput;
            }
        },

        doApply: function(oItem){
            if(this.getProperty("multiSelection")) {
                var sKeys = jQuery.map(this.oMultiInput.getTokens(), function(oToken){
                    return oToken.getKey();
                }).join(",");
                var aItems = jQuery.map(this.getModel().getData(), function(oData){
                    if(sKeys.indexOf(oData[this.getProperty("keyField")]) > -1)
                        return oData;
                }.bind(this));
                this.fireEvent("apply", {items: aItems});
            } else {
                this.fireEvent("apply", {item: oItem, items: [oItem]});
            }
        },

        setData: function(aRecords){
            this.oTable.removeSelections(true);
            this.getModel().setSizeLimit(aRecords.length || 100);
            this.getModel().setData(aRecords, false);
            
            if(this.oMultiInput){
                var oItems = this.oTable.getItems(),
                    oModel = this.getModel(),
                    aTokens = this.oMultiInput.getTokens();
                if(aTokens.length > 0){
                    aTokens.forEach(function(oToken){
                        oItems.forEach(function(oItem){
                            var oData = oModel.getProperty(oItem.getBindingContextPath());
                            if(oData[this.getProperty("keyField")] == oToken.getKey()){
                                this.oTable.setSelectedItem(oItem, true);
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }
        },

        getData: function(){
            return this.getModel().getData();
        },

        getTokens: function(){
            if(this.oMultiInput)
                return jQuery.map(this.oMultiInput.getTokens(), function(oToken){
                    return oToken.clone();
                });
            else
                return [];
        },

        setTokens: function(aTokens){
            if(this.oMultiInput){
                this.oMultiInput.setTokens(jQuery.map(aTokens, function(oToken){
                    return new Token({
                        key: oToken.getProperty("key"),
                        text: oToken.getProperty("text"),
                    });
                }));
            }
        },

        _onSearchPress: function(oEvent){
            this.fireEvent("searchPress");
        },

        _onTableItemPress: function(oEvent){
            var oItem = this.getModel().getProperty(oEvent.getSource().getBindingContextPath());
            this.doApply(oItem);
            this.close();
        },

        _onTableItemSelect: function(oEvent){
            var bSelected = oEvent.getParameter("selected"),
                oData;
            oEvent.getParameter("listItems").forEach(function(oItem){
                oData = this.getModel().getProperty(oItem.getBindingContextPath());
                if(bSelected === true){
                    this.oMultiInput.addToken(new Token({
                        key: oData[this.getProperty("keyField")], 
                        text: oData[this.getProperty("textField")]
                    }));
                }else{
                    this.oMultiInput.getTokens().some(function(oToken){
                        if(oToken.getKey() == oData[this.getProperty("keyField")]){
                            this.oMultiInput.removeToken(oToken);
                            return false;
                        }
                    }.bind(this))
                }
            }.bind(this));
            this.oApplyButton.setEnabled(this.oMultiInput.getTokens().length > 0);
        },

        _onSelectedTokenUpdate: function(oEvent){
            var oItems = this.oTable.getItems(),
                oModel = this.getModel(),
                aRemovedTokens = oEvent.getParameter("removedTokens");
            if(aRemovedTokens.length > 0){
                oItems.forEach(function(oItem){
                    var oData = oModel.getProperty(oItem.getBindingContextPath());
                    if(oData[this.getProperty("keyField")] == aRemovedTokens[0].getKey()){
                        this.oTable.setSelectedItem(oItem, false);
                    }
                }.bind(this));
            }
        }

    });

    return ValueHelpDialog;
}, /* bExport= */ true);
