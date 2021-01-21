sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/routing/HashChanger"
], function (BaseController, Multilingual, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, Component, ComponentContainer, HashChanger) {
    "use strict";

    return BaseController.extend("pg.mi.miBomList.controller.MainList", {


		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            var oi18nSearch = this.getModel("I18N").getText("/SEARCH");
            this.getView().byId("smartFilterBar")._oSearchButton.setText("조회");

        },

        onBeforeRebindTable: function (oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            var oTable = this.getView().byId("mainTable");
            var oSmtFilter = this.getView().byId("smartFilterBar");

            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue();
            var oSupplier_local_name = oSmtFilter.getControlByKey("supplier_local_name").getValue();
            
            var aSearchFilters = [];

            if (oMaterial_desc.length > 0) {
                var oMaterial_descFilter = new Filter("material_desc", FilterOperator.Contains, oMaterial_desc);
                aSearchFilters.push(oMaterial_descFilter);
            }

            if (oSupplier_local_name.length > 0) {
                var oSupplier_local_nameFilter = new Filter("supplier_local_name", FilterOperator.Contains, oSupplier_local_name);
                aSearchFilters.push(oSupplier_local_nameFilter);
            }

            var material_code = new sap.ui.model.Sorter("material_code", false);
            mBindingParams.sorter.push(material_code);
            mBindingParams.filters.push(new Filter(aSearchFilters, true));


        },

        onBeforeExport: function (oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");

            // Disable Worker as Mockserver is used in Demokit sample
            mExcelSettings.worker = false;
        },
        onSort: function () {
            var oSmartTable = this._getSmartTable();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Sort");
            }
        },

        onFilter: function () {
            var oSmartTable = this._getSmartTable();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Filter");
            }
        },

        onColumns: function () {
            var oSmartTable = this._getSmartTable();
            if (oSmartTable) {
                oSmartTable.openPersonalisationDialog("Columns");
            }
        },

        _getSmartTable: function () {
            if (!this._oSmartTable) {
                this._oSmartTable = this.getView().byId("smartTable_MainTable");
            }
            return this._oSmartTable;
        }




    });
});