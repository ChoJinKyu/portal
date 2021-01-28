sap.ui.define([
    "ext/lib/controller/BaseController",
    "sp/util/control/ui/SupplierDialog",
    "sp/util/control/ui/SupplierWithOrgDialog",
    "sp/util/control/ui/MakerDialog",
    "sp/util/control/ui/BPDialog",
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
        MakerDialog,
        BPDialog,
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
            onInputSupplierWithOrgValuePress: function () {

                if (!this.oSupplierWithOrgValueHelp) {
                    this.oSupplierWithOrgValueHelp = new SupplierWithOrgDialog({
                        //title: "Supplier",
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ],
                            sorters: [new Sorter("company_code", true)]
                        },
                        multiSelection: false

                    });

                    this.oSupplierWithOrgValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_supplierwithorg_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oSupplierWithOrgValueHelp.open();
            },

            onMultiInputSupplierWithOrgValuePress: function () {
                if (!this.oSupplierWithOrgMultiValueHelp) {
                    this.oSupplierWithOrgMultiValueHelp = new SupplierWithOrgDialog({
                        multiSelection: true,
                    });

                    this.oSupplierWithOrgMultiValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_supplierwithorg_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oSupplierWithOrgMultiValueHelp.open();
                this.oSupplierWithOrgMultiValueHelp.setTokens(this.byId("multiinput_supplierwithorg_code").getTokens());
            },
            onInputSupplierValuePress: function () {

                if (!this.oCodeSelectionValueHelp) {
                    this.oCodeSelectionValueHelp = new SupplierDialog({
                        multiSelection: false
                    });

                    this.oCodeSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_supplier_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oCodeSelectionValueHelp.open();
            },

            onMultiInputSupplierValuePress: function () {
                if (!this.oCodeMultiSelectionValueHelp) {
                    this.oCodeMultiSelectionValueHelp = new SupplierDialog({
                        multiSelection: true
                    });

                    this.oCodeMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_supplier_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oCodeMultiSelectionValueHelp.open();
                this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiinput_supplier_code").getTokens());
            },

            onInputMakerValuePress: function () {
                if (!this.oMakerSelectionValueHelp) {
                    this.oMakerSelectionValueHelp = new MakerDialog({
                        multiSelection: false
                    });

                    this.oMakerSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_maker_code").setValue(oEvent.getParameter("item").maker_code);
                    }.bind(this));
                }
                this.oMakerSelectionValueHelp.open();

            },
            onMultiInputMakerValuePress: function () {
                if (!this.oMakerMultiSelectionValueHelp) {
                    this.oMakerMultiSelectionValueHelp = new MakerDialog({
                        multiSelection: true
                    });

                    this.oMakerMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_maker_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oMakerMultiSelectionValueHelp.open();
                this.oMakerMultiSelectionValueHelp.setTokens(this.byId("multiinput_maker_code").getTokens());
            },

            onInputBPValuePress: function () {
                if (!this.oBPSelectionValueHelp) {
                    this.oBPSelectionValueHelp = new BPDialog({
                        multiSelection: false
                    });

                    this.oBPSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("input_bp_code").setValue(oEvent.getParameter("item").supplier_code);
                    }.bind(this));
                }
                this.oBPSelectionValueHelp.open();
            },
            onMultiInputBPValuePress: function () {
                if (!this.oBPMultiSelectionValueHelp) {
                    this.oBPMultiSelectionValueHelp = new BPDialog({
                        multiSelection: true
                    });

                    this.oBPMultiSelectionValueHelp.attachEvent("apply", function (oEvent) {
                        this.byId("multiinput_bp_code").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oBPMultiSelectionValueHelp.open();
                this.oBPMultiSelectionValueHelp.setTokens(this.byId("multiinput_bp_code").getTokens());
            }
        });
    });
