sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (BaseController, Multilingual, JSONModel, Filter, FilterOperator, MessageBox, MessageToast) {
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
        onFirstVisibleRowChanged: function () {
            var oTable = this.getView().byId("mainTable");
            setTimeout(function () {
                // group by the cols "byCols"
                var byCols = [0, 2];
                // the cols "theCols" (if none selected, we will use all)
                var theCols = [0, 1, 2, 3, 4, 5, 6];
                // console.log('Works!');
                var aRows = oTable.getRows();
                if (aRows && aRows.length > 0) {
                    var pRow;
                    aRows.map((aRow, i) => {
                        if (i > 0) {
                            var cCells = aRow.getCells();
                            var pCells = pRow.getCells();

                            // if theCols is empty we use aggregation for all cells in a row
                            if (theCols.length < 1) byCols = cCells.map((x, i) => i);

                            if (byCols.filter(x => pCells[x].getText() == cCells[x].getText()).length == byCols.length) {
                                theCols.forEach(i => {
                                    if (pCells[i].getText() == cCells[i].getText()) {
                                        $("#" + cCells[i].getId()).css("visibility", "hidden");
                                        $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
                                    }
                                });
                            }

                        }
                        pRow = aRow;
                    });
                }
            }, 50);

        },


        onBeforeRebindTable: function (oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            var oTable = this.getView().byId("mainTable");
            // mBindingParams.events = {
            //     "dataReceived": function (oEvent) {
            //         var aReceivedData = oEvent.getParameter('data');
            //         // group by the cols "byCols"
            //         var byCols = [0, 2];
            //         // the cols "theCols" (if none selected, we will use all)
            //         var theCols = [0, 1, 2, 3, 4, 5, 6];
            //         setTimeout(function () {
            //             // console.log('Works!');
            //             var aRows = oTable.getRows();
            //             if (aRows && aRows.length > 0) {
            //                 var pRow;
            //                 aRows.map((aRow, i) => {
            //                     if (i > 0) {
            //                         var cCells = aRow.getCells();
            //                         var pCells = pRow.getCells();

            //                         // if theCols is empty we use aggregation for all cells in a row
            //                         if (theCols.length < 1) byCols = cCells.map((x, i) => i);

            //                         if (byCols.filter(x => pCells[x].getText() == cCells[x].getText()).length == byCols.length) {
            //                             theCols.forEach(i => {
            //                                 if (pCells[i].getText() == cCells[i].getText()) {
            //                                     $("#" + cCells[i].getId()).css("visibility", "hidden");
            //                                     $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
            //                                 }
            //                             });
            //                         }

            //                     }
            //                     pRow = aRow;
            //                 });
            //             }
            //         }, 50);
            //     },
            //     //More event handling can be done here
            // };


            var oSmtFilter = this.getView().byId("smartFilterBar");

            var oMaterial_desc = oSmtFilter.getControlByKey("material_desc").getValue();
            var oSupplier_local_name = oSmtFilter.getControlByKey("supplier_local_name").getValue();
            
            //var oMi_Material_code = oSmtFilter.getControlByKey("mi_material_code").getValue();
            //oSmtFilter.getControlByKey("mi_material_code").setValue(oMi_Material_code.toUpperCase());
            var oMi_Material_name = oSmtFilter.getControlByKey("mi_material_name").getValue();

            var aSearchFilters = [];

            if (oMaterial_desc.length > 0) {
                var oMaterial_descFilter = new Filter("material_desc", FilterOperator.Contains, oMaterial_desc);
                aSearchFilters.push(oMaterial_descFilter);
            }

            if (oSupplier_local_name.length > 0) {
                var oSupplier_local_nameFilter = new Filter("supplier_local_name", FilterOperator.Contains, oSupplier_local_name);
                aSearchFilters.push(oSupplier_local_nameFilter);
            }

            // if (oMi_Material_code.length > 0) {
            //     var oMi_Material_codeFilter = new Filter("mi_material_code", FilterOperator.Contains, oMi_Material_code);
            //     aSearchFilters.push(oMi_Material_codeFilter);
            // }

            if (oMi_Material_name.length > 0) {
                var oMi_Material_nameFilter = new Filter("mi_material_name", FilterOperator.Contains, oMi_Material_name);
                aSearchFilters.push(oMi_Material_nameFilter);
            }

            //  var vGroup = function (oContext) {
            //     var supplier_code = oContext.getProperty("material_code");
            //     var supplier_code = oContext.getProperty("supplier_code");
                
            // };
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
        },



    });
});