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
    "sap/ui/core/routing/HashChanger",
    "ext/lib/util/ExcelUtil"
], function (BaseController, Multilingual, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, Component, ComponentContainer, HashChanger, ExcelUtil) {
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

            this.setModel(new JSONModel(), "countModel");
            this.getModel("countModel").setProperty("/count", 0);
            this.setModel(new JSONModel(), "columnsModel");
            var colObj = {
                "tenant_id": "",
                "tenant_name": "",
                "category_code": "",
                "mi_bom_id": "",
                "system_update_dtm": "",
                "system_create_dtm": "",
                "update_user_id": "",
                "local_update_dtm": "",
                "local_create_dtm": "",
                "create_user_id": "",
                "supplier_local_name": ""
            };
            this.getModel("columnsModel").setData(colObj);

        },

        onBeforeRebindTable: function (oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            var oTable = this.byId("mainTable");
            var oSmtFilter = this.getView().byId("smartFilterBar");
            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue(),
                oSupplier_english_name = oSmtFilter.getControlByKey("supplier_english_name").getValue(),
                oMI_material_name = oSmtFilter.getControlByKey("mi_material_name").getValue(),
                aSearchFilters = [];

            if (oMaterial_desc.length > 0) {
                var oMaterial_descFilter = new Filter({
                    path: "material_desc",
                    operator: FilterOperator.Contains,
                    value1: oMaterial_desc,
                    caseSensitive: false
                });
                aSearchFilters.push(oMaterial_descFilter);
            }

            if (oSupplier_english_name.length > 0) {
                var oSupplier_local_nameFilter = new Filter({
                    path: "supplier_english_name",
                    operator: FilterOperator.Contains,
                    value1: oSupplier_english_name,
                    caseSensitive: false
                });
                aSearchFilters.push(oSupplier_local_nameFilter);
            }

            if (oMI_material_name.length > 0) {
                var oMI_material_nameFilter = new Filter({
                    path: "mi_material_name",
                    operator: FilterOperator.Contains,
                    value1: oMI_material_name,
                    caseSensitive: false
                });
                aSearchFilters.push(oMI_material_nameFilter);
            }
            // if (oMaterial_desc.length === 0 && oSupplier_english_name.length === 0 && oMI_material_name.length === 0) {
            //     mBindingParams.filters.push(new Filter([]));
            // }

            if (mBindingParams.filters.length === 0) {
                var use_flag = new Filter("use_flag", FilterOperator.EQ, true);
                aSearchFilters.push(use_flag);
            }
            // var material_code = new sap.ui.model.Sorter("material_code", false);
            // mBindingParams.sorter.push(material_code);
            mBindingParams.filters.push(new Filter(aSearchFilters, true));
            this._getListCount(mBindingParams.filters);

        },

        _getListCount: function (filtersParam) {
            var oView = this.getView(),
                oModel = this.getOwnerComponent().getModel();
            filtersParam = Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/MIMaterialCodeBOMManagementView/$count", {
                filters: filtersParam,
                success: function (data) {
                    oView.setBusy(false);
                    oView.getModel("countModel").setProperty("/count", data);
                }
            });
        },
        onPressExport: function (oEvt) {
            this.byId("smartTable_MainTable").fireBeforeExport();
        },

        onBeforeExport: function (oEvt) {
            var oTable = this.byId("mainTable");
            var sFileName = this.getModel("I18N").getText("/MIMATERIAL_BOM_LIST_TITLE");
            var oData = oTable.getBinding("items");
            if (oData) {
                var selectColumns = oData.mParameters.select.split(',');
                var oColumns = this.getModel("columnsModel").getData();
                var visibleFalseCols = ["tenant_id", "tenant_name", "category_code", "mi_bom_id", "system_update_dtm", "system_create_dtm", "update_user_id", "local_update_dtm", "local_create_dtm", "create_user_id", "supplier_local_name"];
                visibleFalseCols.forEach(function (col) {
                    if (selectColumns.includes(col)) {
                        oColumns[col] = "true";
                    }
                });
            }

            this.getModel("columnsModel").refresh();

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oData
            });
           


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