sap.ui.define([
    "ext/lib/controller/BaseController",
    "sp/util/control/ui/SupplierDialog",
    "sp/util/control/ui/SupplierWithOrgDialog",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/Text",
    "sap/m/Token",
    "sap/m/Input",
    'sap/m/Label',
    'sap/m/SearchField',
    "sap/f/library",
    "ext/lib/util/ControlUtil"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        SupplierDialog,
        SupplierWithOrgDialog,
        History,
        JSONModel,
        Filter,
        FilterOperator,
        Fragment,
        Sorter,
        Text,
        Token,
        Input,
        Label,
        SearchField,
        library,
        ControlUtil
    ) {
        "use strict";
        var that;
        return BaseController.extend("sp.sm.makerDialog.controller.MainList", {
            onInit: function () {
                var oViewModel,
                    oResourceBundle = this.getResourceBundle();

                this.oRouter = this.getOwnerComponent().getRouter();

                // Model used to manipulate control states
                oViewModel = new JSONModel({});
                this.setModel(oViewModel, "mainListView");
                this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
                that = this;
            },
            onInputSupplierWithOrgValuePress: function(){

                if(!this.oSupplierWithOrgValueHelp){
                    this.oSupplierWithOrgValueHelp = new SupplierWithOrgDialog({
                        //title: "Supplier",
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ],
                            sorters : [new Sorter("company_code", true)]
                        }, 
                        multiSelection: false
                        
                    });
                    
                    this.oSupplierWithOrgValueHelp.attachEvent("apply", function(oEvent){
                        this.byId("input_supplierwithorg_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oSupplierWithOrgValueHelp.open();
            },

            onMultiInputSupplierWithOrgValuePress: function(){
                if(!this.oSupplierWithOrgMultiValueHelp){
                    this.oSupplierWithOrgMultiValueHelp = new SupplierWithOrgDialog({
                        multiSelection: true,
                    });
                    
                    this.oSupplierWithOrgMultiValueHelp.attachEvent("apply", function(oEvent){
                        this.byId("multiinput_supplierwithorg_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oSupplierWithOrgMultiValueHelp.open();
                this.oSupplierWithOrgMultiValueHelp.setTokens(this.byId("multiinput_supplierwithorg_code").getTokens());
            },
            onInputSupplierValuePress: function(){

                if(!this.oCodeSelectionValueHelp){
                    this.oCodeSelectionValueHelp = new SupplierDialog({
                        multiSelection: false
                    });
                    
                    this.oCodeSelectionValueHelp.attachEvent("apply", function(oEvent){
                        this.byId("input_supplier_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oCodeSelectionValueHelp.open();
            },

            onMultiInputSupplierValuePress: function(){
                if(!this.oCodeMultiSelectionValueHelp){
                    this.oCodeMultiSelectionValueHelp = new SupplierDialog({
                        multiSelection: true
                    });
                    
                    this.oCodeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        this.byId("multiinput_supplier_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oCodeMultiSelectionValueHelp.open();
                this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiinput_supplier_code").getTokens());
            }

        });
    });
