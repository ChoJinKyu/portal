sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/ui/model/odata/v2/ODataModel",
    "ext/lib/util/Multilingual",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/core/Fragment", 
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
], function (Controller, ODataV2ServiceProvider, Filter
    , FilterOperator, Sorter, GridData, VBox, Column, Label, Text, Input, ODataModel, Multilingual
    , ComboBox, Item, Fragment , ManagedModel , ManagedListModel
) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/dp.MoldApprovalListService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    var oServiceModelOrg = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.OrgMgtService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    var oServiceModelPurOrg = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.PurOrgMgtService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });



    var oThis, oTableName, oArges, oCallback, oApproval_type_code;

    return Controller.extend("dp.md.util.controller.ReModelRepairItemDialog", {

        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
        },

        openPop: function (pThis, pArges, callback) {
            oThis = pThis;
            oArges = pArges;
            oCallback = callback;
            oThis.setModel(new ManagedModel(), "repairSearchCondition"); 
            oThis.setModel(new ManagedListModel(), "repairPlant"); 
            var oView = oThis.getView();
            var srch = oThis.getModel("repairSearchCondition");
            srch.setProperty("/company_code", oArges.company_code)
            srch.setProperty("/org_code", oArges.org_code)

            var aSearchFilters = [];
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2101'));
            aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, oArges.company_code));
            aSearchFilters.push(new Filter("org_type_code", FilterOperator.EQ, 'PL'));

            ODataV2ServiceProvider.getService("cm.util.OrgService").read("/Pur_Operation", {
                filters: aSearchFilters 
                , sorters : [ new Sorter("org_code", false) ]
                , success: function(oData){ 
                    console.log("odata>>> " , oData);
                    oThis.getModel("repairPlant").setData(oData, "/Pur_Operation");
                }.bind(this)
            });

            // var oButton = oEvent.getSource();
            if (!this._oRemodelRepairDialog) {
                this._oRemodelRepairDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.util.view.ReModelRepairItemPop",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            var that = this;
            this._oRemodelRepairDialog.then(function (oDialog) {
                oDialog.open();
                oThis.byId("reModelRepairSrchBtn").firePress(); // open 하자마자 조회 하여 보여줌 

            });


        },

        
        /**
         * @public 
         * @see close 
         */
        onExit: function () {
            if (this._oRemodelRepairDialog) {
                this._oRemodelRepairDialog.then(function (oDialog) {
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oRemodelRepairDialog = undefined;
            }

            // this._setInitPop();
            // oThis.byId("dialogMolItemSelection").close();
        },
        _searchModel : function( model, path, filters, callback ){
             var oView = oThis.getView(), 
                 oModel = oThis.getModel(model); 

            oView.setBusy(true);
            oModel.setTransactionModel(oServiceModelPurOrg);
            oModel.read( path , {
                filters: filters,
                success: function (oData) { 
                    callback(oData);
                    oView.setBusy(false);
                }
            });

        },

    });

}, /* bExport= */ true);
