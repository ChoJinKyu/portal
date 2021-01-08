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

            var oTable = this.getView().byId("mainTable");



            // setTimeout(function () {
            //     // console.log('Works!');
            //         var aRows = oTable.getRows();
            //         if (aRows && aRows.length > 0) {
            //             var pRow;
            //             aRows.map((aRow, i) => {
            //                 if (i > 0) {
            //                     var cCells = aRow.getCells();
            //                     var pCells = pRow.getCells();

            //                     // if theCols is empty we use aggregation for all cells in a row
            //                     if (theCols.length < 1) byCols = cCells.map((x, i) => i);

            //                     if (byCols.filter(x => pCells[x].getText() == cCells[x].getText()).length == byCols.length) {
            //                         theCols.forEach(i => {
            //                             if (pCells[i].getText() == cCells[i].getText()) {
            //                                 $("#" + cCells[i].getId()).css("visibility", "hidden");
            //                                 $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
            //                             }
            //                         });
            //                     }

            //                 }
            //                 pRow = aRow;
            //             });
            //         }
            // }, 500);


            // group by the cols "byCols"
            var byCols = [0, 2];

            // the cols "theCols" (if none selected, we will use all)
            var theCols = [0, 1, 2, 3, 4, 5, 6];

            // oTable.onAfterRendering = function () {
            //     sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
            //     var aRows = oTable.getRows();
            //     if (aRows && aRows.length > 0) {
            //         var pRow;
            //         aRows.map((aRow, i) => {
            //             if (i > 0) {
            //                 var cCells = aRow.getCells();
            //                 var pCells = pRow.getCells();

            //                 // if theCols is empty we use aggregation for all cells in a row
            //                 if (theCols.length < 1) byCols = cCells.map((x, i) => i);

            //                 if (byCols.filter(x => pCells[x].getText() == cCells[x].getText()).length == byCols.length) {
            //                     theCols.forEach(i => {
            //                         if (pCells[i].getText() == cCells[i].getText()) {
            //                             $("#" + cCells[i].getId()).css("visibility", "hidden");
            //                             $("#" + pRow.getId() + "-col" + i).css("border-bottom-style", "hidden");
            //                         }
            //                     });
            //                 }

            //             }
            //             pRow = aRow;
            //         });
            //     }
            // };
            // Aggregate columns (by cols) for similar values







        },


        addBindingListener: function (oBindingInfo, sEventName, fHandler) {

            oBindingInfo.events = oBindingInfo.events || {};

            if (!oBindingInfo.events[sEventName]) {
                oBindingInfo.events[sEventName] = fHandler;
            } else {
                // Wrap the event handler of the other party to add our handler.
                var fOriginalHandler = oBindingInfo.events[sEventName];
                oBindingInfo.events[sEventName] = function () {
                    fHandler.apply(this, arguments);
                    fOriginalHandler.apply(this, arguments);
                };
            }
        },

        // onAfterRendering: function () {

        //     alert(1);
        //     var oTable = this.getView().byId("mainTable");
        //     var aRows = oTable.getRows();
        //     var cCell = aRows[0].getCells()[0];

        // var aRows = oTable.getRows();
        // if (aRows && aRows.length > 0) {
        //     var pRow = {};
        //     for (var i = 0; i < aRows.length; i++) {
        //         if (i > 0) {
        //             var pCell = pRow.getCells()[0],
        //                 cCell = aRows[i].getCells()[0];
        //             if (cCell.getText() === pCell.getText()) {
        //                 $("#" + cCell.getId()).css("visibility", "hidden");
        //                 $("#" + pRow.getId() + "-col0").css("border-bottom-style", "hidden");
        //             }
        //         }
        //         pRow = aRows[i];
        //     }
        // }
        // },

        /**
         * Smart Table Filter Event onBeforeRebindTable
         * @param {sap.ui.base.Event} oEvent 
         */


        onBeforeRebindTable: function (oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            // var oTable = this.getView().byId("mainTable");
            // mBindingParams.events = {
            //     "dataReceived": function (oEvent) {
            //         var aReceivedData = oEvent.getParameter('data');

            //         var aRows = oTable.getRows()[8];
            //         var pRow = {};
                    // for (var i = 0; i < aReceivedData.results.length; i++) {
                    //     for (var a = 0; a < 7; a++) {

                    //         var pCell = pRow[i].getCells()[a],
                    //             cCell = aRows[i+1].getCells()[a];
                    //         if (aReceivedData.results[i].material_code === aReceivedData.results[a].material_code) {
                    //             $("#" + cCell.getId()).css("visibility", "hidden");
                    //             $("#" + pRow.getId() + "-col0").css("border-bottom-style", "hidden");
                    //         }


                    //     }

                    // }

            //     },
            //     //More event handling can be done here
            // };

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