sap.ui.define([
    "ext/lib/control/ui/CodeValueHelp",
    "ext/lib/control/DummyRenderer",
    "ext/lib/model/v2/ODataModel",
    "ext/lib/model/ManagedModel",
    "sap/ui/base/Event",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "ext/lib/control/m/CodeSelect",
    "ext/lib/control/m/CodeComboBox",
    "sap/m/Button"
], function (Parent, Renderer, ODataModel, ManagedModel, Event, Filter, FilterOperator, Sorter, GridData, VBox, HBox, Column, Label, Text, Input, CodeSelect, CodeComboBox, Button) {
    "use strict";

    var sServiceUrl = "srv-api/odata/v2/ep.UcContractMgtService/";

    var oServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/ep.UcContractMgtService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: false
            // useBatch: true
        }); 

    var UcItemDialog = Parent.extend("sp.util.control.ui.UcItemDialog", {

        metadata: {
            properties: {
                contentWidth: { type: "string", group: "Appearance", defaultValue: "65%"},
                largeEpItem: { type: "string", group: "Misc", defaultValue: "" },
                items: { type: "sap.ui.core.Control"}
            }
        },

        renderer: Renderer,

        createSearchFilters: function(){
            
            this.getProperty("title") ? this.getProperty("title") : this.setProperty("title" , "설비공사품목조회");

            this.oLargeEpItem = new CodeSelect({
                showSecondaryValues : true,
                keyField: 'ep_item_class_code',
                textField: 'ep_item_class_name',
                items:{
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                        new Filter("level_number", FilterOperator.EQ, 1)
                    ],
                    serviceUrl: "srv-api/odata/v2/ep.UcContractMgtService/",
                    entityName: 'UcItemClass'
                },
                change : this.onLargeEpItemChange
            }).attachComplete(function(oEvent){
                var sFirstKey = this.getProperty("largeEpItem");
                if(sFirstKey){
                    oEvent.getSource().setSelectedKey(sFirstKey);
                }else{
                    sFirstKey = oEvent.getSource().getItems().length && oEvent.getSource().getItems()[0].getKey();
                };
                
                if(sFirstKey){
                    var oCreateEvent = new Event(
                        "change",
                        this.oLargeEpItem,
                        {selectedItem:oEvent.getSource().getSelectedItem()}
                    )
                    this.onLargeEpItemChange(oCreateEvent);
                };
            }.bind(this));

            this.oMiddleEpItem = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'ep_item_class_code',
                textField: 'ep_item_class_name',
                items:{
                    path: '/',
                    filters: [],
                    serviceUrl: 'srv-api/odata/v2/ep.UcContractMgtService/',
                    entityName: 'UcItemClass'
                },
                selectionChange: this.onMiddleEpItemSelectionChange
            });
            this.oMiddleEpItem.addStyleClass("sapUiTinyMarginBegin");

            this.oSmallEpItem = new CodeComboBox({
                showSecondaryValues:true,
                useEmpty:true,
                keyField: 'ep_item_class_code',
                textField: 'ep_item_class_name',
                items:{
                    path: '/',
                    serviceUrl: 'srv-api/odata/v2/ep.UcContractMgtService/',
                    entityName: 'UcItemClass'
                }
            });
            this.oSmallEpItem.addStyleClass("sapUiTinyMarginBegin");

            this.oKeyWordId = new Input({submit : this.loadData.bind(this), placeholder:"Item Code or Item Name"});

            return [
                new VBox({
                    items: [
                        new Label({ text: "분류 :"}),
                        new HBox({
                            items:[
                                this.oLargeEpItem,
                                this.oMiddleEpItem,
                                this.oSmallEpItem
                            ]
                        })
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                }),
                new VBox({
                    items: [
                        new Label({ text: this.getModel("I18N").getText("/KEYWORD")+" :"}),
                        this.oKeyWordId
                    ],
                    layoutData: new GridData({ span: "XL2 L3 M5 S10"})
                })
            ]
        },

        onLargeEpItemChange : function(oEvent){
            var sSelectKey = oEvent.getParameter("selectedItem").getKey();
            var oMiddleEpItem = oEvent.getSource().getParent().getItems()[1];
            var oSmallEpItem = oEvent.getSource().getParent().getItems()[2];
            
            oMiddleEpItem.clearSelection();
            oMiddleEpItem.setValue(null);
            oMiddleEpItem.destroyItems();
            oMiddleEpItem.extractBindingInfo({
                path: '/',
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                    new Filter("level_number", FilterOperator.EQ, 2),
                    new Filter("parent_ep_item_class_code", FilterOperator.EQ, sSelectKey)
                ],
                serviceUrl: "srv-api/odata/v2/ep.UcContractMgtService/",
                entityName: 'UcItemClass'
            });

            oSmallEpItem.destroyItems();
            oSmallEpItem.clearSelection();
            oSmallEpItem.setValue(null);
        },

        onMiddleEpItemSelectionChange : function(oEvent){
            var sSelectKey = oEvent.getParameter("selectedItem") && oEvent.getParameter("selectedItem").getKey();
            var oSmallEpItem = oEvent.getSource().getParent().getItems()[2];
            
            oSmallEpItem.destroyItems();
            oSmallEpItem.clearSelection();
            oSmallEpItem.setValue(null);
            if(sSelectKey){
                oSmallEpItem.extractBindingInfo({
                    path: '/',
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                        new Filter("level_number", FilterOperator.EQ, 3),
                        new Filter("parent_ep_item_class_code", FilterOperator.EQ, sSelectKey)
                    ],
                    serviceUrl: "srv-api/odata/v2/ep.UcContractMgtService/",
                    entityName: 'UcItemClass'
                });
            }
        },

        createTableColumns: function(){
            return [
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/ITEM_CODE")}),
                    template: new Text({text: "{ep_item_code}"})
                }),
                new Column({
                    width: "25%",
                    label: new Label({text: this.getModel("I18N").getText("/ITEM_DESC"), textAlign:"Center", width:"100%"}),
                    template: new Text({text: "{ep_item_name}", wrapping:false})
                }),
                new Column({
                    width: "25%",
                    label: new Label({text: this.getModel("I18N").getText("/SPECIFICATION"), textAlign:"Center", width:"100%"}),
                    template: new Text({text: "{spec_desc}", wrapping:false})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: this.getModel("I18N").getText("/UNIT")}),
                    template: new Text({text: "{unit}", wrapping:false})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: "자재적용"}),
                    template: new Text({text: "{material_apply_yn}"})
                }),
                new Column({
                    hAlign: "Center",
                    label: new Label({text: "노무적용"}),
                    template: new Text({text: "{labor_apply_yn}"})
                })
            ];
        },

        loadData: function(){
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, "L2100")],
                // aSorters = [new Sorter("supplier_code", true)],
                sLargeEpItem = this.oLargeEpItem.getSelectedKey(),
                sMiddleEpItem = this.oMiddleEpItem.getSelectedKey(),
                sSmallEpItem = this.oSmallEpItem.getSelectedKey(),
                sSearchKeyword = this.oKeyWordId.getValue();

            if(sLargeEpItem){
                aFilters.push(new Filter("large_class_code", FilterOperator.Contains, sLargeEpItem));
            }
            if(sMiddleEpItem){
                aFilters.push(new Filter("medium_class_code", FilterOperator.Contains, sMiddleEpItem));
            }
            if(sSmallEpItem){
                aFilters.push(new Filter("small_class_code", FilterOperator.Contains, sSmallEpItem));
            }

            if(sSearchKeyword){
                var aKeywordFilters = {
                    filters: [
                        new Filter("ep_item_code", FilterOperator.Contains, sSearchKeyword),
                        new Filter("ep_item_name", FilterOperator.Contains, sSearchKeyword)
                    ],
                    and: false
                };
                aFilters.push(new Filter(aKeywordFilters));
            }

            this.oDialog.setBusy(true);

            oServiceModel.read("/UcItemView", {
                filters: aFilters,
                // sorters: aSorters,
                success: function(oData){
                    var aRecords = oData.results;
                    this.oDialog.setData(aRecords, false);
                    this.oDialog.setBusy(false);
                    // if(!this.oDialog.getModel("SUPPLIERVIEW")){
                    //     this.oDialog.setBusy(true);
                    // }
                }.bind(this)
            });
        }

    });

    return UcItemDialog;
}, /* bExport= */ true);
