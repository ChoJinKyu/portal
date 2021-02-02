sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/core/Fragment",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedModel",
], function (
    Controller, ODataModel, Dialog, Renderer,
    Sorter, Filter, FilterOperator,
    Button, Text, Table, Column, ColumnListItem, Fragment
    , ManagedListModel
    , JSONModel
    , ManagedModel 
) {
    "use strict";

        var oServiceModel = new ODataModel({
            serviceUrl: "srv-api/odata/v2/cm.util.HrService/",
            defaultBindingMode: "OneWay",
            defaultCountMode: "Inline",
            refreshAfterChange: false,
            useBatch: true
        });
    
   
    /**
     * @param : oThis 호출한 페이지의 this 
     * @param : oTableName 호출한 페이지에 추가할 테이블 아이디 
     */
    var oThis, oTableName, oCallback;

    /**
     * @description MoldSelection 
     * @author jinseon.lee
     * @date   2020.12.02 
     */
    return Controller.extend("dp.md.util.controller.DeptSelection", {

        /**
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code 
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        openDeptSelectionPop: function (pThis, callback) {

            oThis = pThis;
            oCallback = callback;

            oThis.setModel(new ManagedModel(), "deptPop");
            oThis.setModel(new ManagedListModel(), "deptPopList");
  
            var oView = oThis.getView();
            if (!this._oDialogTableSelect) {
                this._oDialogTableSelect = Fragment.load({
                    id: oView.getId(),
                    name: "dp.md.util.view.DeptSelection",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            var that = this;
            this._oDialogTableSelect.then(function (oDialog) {
                oDialog.open();
                oThis.byId("btnDeptPopSearch").firePress(); // open 하자마자 조회 하여 보여줌 

            });
        },
        _getSearchDeptSelection: function () {
            var aSearchFilters = [];
            // tenant_id  
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2101'));
            var dept = oThis.byId('dept').getValue().trim();
            if (dept != undefined && dept != "" && dept != null) {
                aSearchFilters.push(new Filter("department_local_name", FilterOperator.Contains, dept))
            }
            console.log(" aSearchFilters >>>>> ", aSearchFilters);
            return aSearchFilters;
        },
        /**
         * @description onDeptSelection Search Button 누를시 
         * @param {*} oEvent 
         */
        onDeptSelection: function (oEvent) {
            console.log(oEvent.getParameters());
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchDeptSelection();
                this._applyDeptSelection(aSearchFilters); // 로드하자마자 조회 
            }
        },

        /**
         * @description onDeptSelectionh Button 누를시 
         * @param {*} oEvent 
         */
        _applyDeptSelection: function (aSearchFilters) {
            console.log(" [step] Dept Item Selection Search Button Serch ", aSearchFilters);
            var oView = oThis.getView(),
                oModel = oThis.getModel("deptPopList") ;

            oView.setBusy(true);
            oModel.setTransactionModel(oServiceModel);
            oModel.read("/Department", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(" oData ", oData);
                    oView.setBusy(false);
                }
            });
        },
        /**
      * @public 
      * @see 사용처 Participating Supplier Fragment 취소 이벤트
      */
        onExit: function () { 
              if (this._oDialogTableSelect) {
                this._oDialogTableSelect.then(function (oDialog) {
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialogTableSelect = undefined;
            }
            // this._setInitPop();
           // oThis.byId("dialogDeptSelection").close();
        },
      
        /**
         * @description  클릭한거랑 검색 조건 초기화 
         */
        _setInitPop: function () {
            // var oTable = oThis.byId("popMoldItemSelectTable");
            //  oTable.clearSelection();
            oThis.byId('dept').setVaue("");

        },

        /**
        * @description  Participating Supplier Fragment Apply 버튼 클릭시 
        */
        onDeptSelectionApply: function (oEvent) {
            console.log(" [step] Participating Supplier Fragment Apply 버튼 클릭시 ", oEvent);
            var popList = oThis.getModel("deptPopList").getData();

            var oTable = oThis.byId("popDeptSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            var datas = []; 
            var mold_id_arr = [];
  
            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    department_id: oItem.getCells()[0].getText()
                    , department_local_name: oItem.getCells()[1].getText()
                
                });
                datas.push(obj);
            });
                   
            oCallback(datas);
            this.onExit();
        },

    });

});