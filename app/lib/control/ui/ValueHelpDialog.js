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
    "sap/ui/table/Table",
    "sap/m/ColumnListItem"
], function (Parent, Renderer, Multilingual, JSONModel, GridData, SimpleForm, VBox, FlexBox, Label, Button, MultiInput, Token, Table, ColumnListItem) {
    "use strict";

    //TODO : Localization (Buttons - apply, cancel, search, table no-data, multiInput title)
    var ValueHelpDialog = Parent.extend("ext.lib.control.ui.ValueHelpDialog", {

        renderer: Renderer,

        metadata: {
            properties: {
                multiSelection: { type: "boolean", group: "Misc", defaultValue: false },
                keyField: { type: "string", group: "Misc", defaultValue: "key" },
                textField: { type: "string", group: "Misc", defaultValue: "text" },
                visibleRowCount: { type: "int", group: "Appearance", defaultValue: 7 }
            },
            aggregations: {
                filters: {
                    type: "sap.ui.core.Control"
                },
                columns: {
                    type: "sap.ui.table.Column",
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
                        type: "Transparent",
                        text: this.getModel("I18N").getText("/SEARCH"),
                        press: this._onSearchPress.bind(this)
                    })
                ],
                layoutData: new GridData({span: "XL12 L12 M12 S12"})
            })
            oSearchButton.addStyleClass("searchBoxButtonArea");
            oForm.addContent(oSearchButton);

            var oTable = new Table({
                selectionMode: isMultiSelection ? "MultiToggle" : "Single",
                columns: this.getAggregation("columns"),
                rows: {
                    path: "/"
                },
                visibleRowCountMode: "Fixed",
                visibleRowCount: this.getProperty("visibleRowCount"),
                selectionBehavior: "Row",
                rowSelectionChange: this._onTableItemSelect.bind(this)
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
                            new Label({ text: "Selected Items"}),
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
                var sTokens = jQuery.map(this.oMultiInput.getTokens(), function(oToken){
                    return oToken.getKey();
                }).join(",");
                var aItems = jQuery.map(this.getModel().getData(), function(oData){
                    if(sTokens.indexOf(oData[this.getProperty("keyField")]) > -1)
                        return oData;
                }.bind(this));
                this.fireEvent("apply", {items: aItems});
            } else {
                this.fireEvent("apply", {item: oItem, items: [oItem]});
            }
        },

        setData: function(aRecords){
            this.getModel().setSizeLimit(aRecords.length || 100);
            this.getModel().setData(aRecords, false);
            this.oTable.clearSelection();

            if(this.oMultiInput){
                var aRows = this.getModel().getProperty("/"),
                    aTokens = this.oMultiInput.getTokens();
                if(aTokens.length > 0){
                    aRows.forEach(function(oRow, nIndex){
                        var isMatched = false;
                        aTokens.some(function(oToken){
                            if(oRow[this.getProperty("keyField")] == oToken.getKey()){
                                this.oTable.addSelectionInterval(nIndex, nIndex);
                                isMatched = true;
                                return false;
                            }
                        }.bind(this));
                        if(isMatched !== true)
                            this.oTable.removeSelectionInterval(nIndex, nIndex);
                    }.bind(this));
                }
                this.oTable.setBusy(false);
            }else{
                this.oTable.setBusy(false);
            }
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
                    return oToken.clone();
                }));
            }
        },

        _onSearchPress: function(oEvent){
            this.fireEvent("searchPress");
            this.oTable.setBusy(true);
        },

        _onTableItemSelect: function(oEvent){
            if(oEvent.getParameter("userInteraction") !== true) return;
            if(this.getProperty("multiSelection")) {
                var aIndices = oEvent.getSource().getSelectedIndices(),
                    aRowIndices = oEvent.getParameter("rowIndices"),
                    aSelectedInfos = jQuery.map(aRowIndices, function(nRowIndex){
                        return {
                            index: nRowIndex,
                            selected: aIndices.indexOf(nRowIndex) > -1
                        };
                    }),
                    oData;
                aSelectedInfos.forEach(function(oInfo){
                    oData = this.getModel().getProperty("/" + oInfo.index);
                    if(oInfo.selected === true){
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
            }else{
                var oItem = this.getModel().getProperty(oEvent.getParameter("rowContext").getPath());
                this.doApply(oItem);
                this.close();
            }
        },

        _onSelectedTokenUpdate: function(oEvent){
            var aRows = this.getModel().getProperty("/"),
                aRemovedTokens = oEvent.getParameter("removedTokens");
            if(aRemovedTokens.length > 0){
                aRows.forEach(function(oRow, nIndex){
                    if(oRow[this.getProperty("keyField")] == aRemovedTokens[0].getKey()){
                        this.oTable.removeSelectionInterval(nIndex, nIndex);
                    }
                }.bind(this));
            }
        }

    });

    return ValueHelpDialog;
}, /* bExport= */ true);
