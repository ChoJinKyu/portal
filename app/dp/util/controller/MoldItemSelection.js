sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/Dialog",
    "sap/m/DialogRenderer",
    "ext/lib/core/service/ODataV2ServiceProvider",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/ui/core/Fragment",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedModel",
], function (BaseController, Controller, ODataModel, Dialog, Renderer, ODataV2ServiceProvider,
    Sorter, Filter, FilterOperator,
    Button, Text, Table, Column, ColumnListItem, Fragment, Multilingual, ManagedListModel, JSONModel, ManagedModel) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/dp.util.MoldItemSelectionService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    var oServiceModel2 = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.OrgMgrService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });
    var oServiceModel3 = new ODataModel({
        serviceUrl: "srv-api/odata/v2/cm.PurOrgMgrService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

    /**
     * @param : oThis 호출한 페이지의 this 
     * @param : oTableName 호출한 페이지에 추가할 테이블 아이디 
     * @param : oArges (company_code, org_code) 
     */
    var oThis, oTableName, oArges, oCallback;

    /**
     * @description MoldSelection 
     * @author jinseon.lee
     * @date   2020.12.02 
     */
    return Controller.extend("dp.util.controller.MoldItemSelection", {

        /**
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code 
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        openMoldItemSelectionPop: function (pThis, oEvent, pArges, callback) {
            console.log("args >>>> ", pArges);
            oThis = pThis;
            oArges = pArges;
            oCallback = callback;

            oThis.setModel(new ManagedModel(), "moldItemPop");
            oThis.setModel(new ManagedListModel(), "moldItemPopList");
            oThis.setModel(new ManagedListModel(), "moldSelectionCompanyPopList");
            oThis.setModel(new ManagedListModel(), "moldSelectionPlantPopList");

            oThis.getModel('moldItemPop').setProperty('/company_code', oArges.company_code);
            oThis.getModel('moldItemPop').setProperty('/org_code', oArges.org_code);

            var oView = oThis.getView();
            var oButton = oEvent.getSource();
            if (!this._oDialogTableSelect) {
                this._oDialogTableSelect = Fragment.load({
                    id: oView.getId(),
                    name: "dp.util.view.MoldItemSelection",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            var that = this;
            this._oDialogTableSelect.then(function (oDialog) {
                oDialog.open();
                oThis.byId("btnMoldItemPopSearch").firePress(); // open 하자마자 조회 하여 보여줌 

            });
        },
        _getSearchMoldSelection: function () {
            var aSearchFilters = [];
            // tenant_id  
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            var company = oThis.byId('moldItemPopCompany').mProperties.selectedKey;
            var plant = oThis.byId('moldItemPopPlant').mProperties.selectedKey;
            var model = oThis.byId('moldItemPopModel').getValue().trim();
            var partNo = oThis.byId('moldItemPopPartNo').getValue().trim();

            if (company != undefined && company != "" && company != null) {
                aSearchFilters.push(new Filter("company_code", FilterOperator.EQ, company))
            }
            if (plant != undefined && plant != "" && plant != null) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, plant))
            }
            if (model != undefined && model != "" && model != null) {
                aSearchFilters.push(new Filter("model", FilterOperator.Contains, model))
            }
            if (partNo != undefined && partNo != "" && partNo != null) {
                aSearchFilters.push(new Filter("mold_number", FilterOperator.Contains, partNo))
            }

            // 추가 검색 조건 
            if(oArges.mold_progress_status_code != undefined){
                aSearchFilters.push(new Filter("mold_progress_status_code", FilterOperator.EQ , oArges.mold_progress_status_code));
            }

            if (oArges.mold_id_arr != undefined && oArges.mold_id_arr.length > 0) { 

                 var nFilters = [];
                oArges.mold_id_arr.forEach(function (mold_id) { 
                    nFilters.push(new Filter("mold_id", FilterOperator.NotContains, String(mold_id)));
                 });

                var oNotInFilter = {
                    filters: nFilters,
                    and: true
                 };

                aSearchFilters.push(new Filter(oNotInFilter));
            }
            console.log(" aSearchFilters >>>>> " , aSearchFilters);
            return aSearchFilters;
        },
        /**
         * @description Mold Item Selection Search Button 누를시 
         * @param {*} oEvent 
         */
        onMoldItemSelection: function (oEvent) {
            console.log(oEvent.getParameters());
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchMoldSelection();
                this._applyMoldSelection(aSearchFilters); // 로드하자마자 조회 
            }
        },

        /**
         * @description Mold Item Selection Search Button 누를시 
         * @param {*} oEvent 
         */
        _applyMoldSelection: function (aSearchFilters) {
            console.log(" [step] Mold Item Selection Search Button Serch ", aSearchFilters);
            var oView = oThis.getView(),
                oModel = oThis.getModel("moldItemPopList"),
                companyModel = oThis.getModel("moldSelectionCompanyPopList"),
                plantModel = oThis.getModel("moldSelectionPlantPopList")

                ;

            oView.setBusy(true);
            oModel.setTransactionModel(oServiceModel);
            oModel.read("/MoldItemSelect", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(" oData ", oData);
                    oView.setBusy(false);
                }
            });

            oView.setBusy(true);
            companyModel.setTransactionModel(oServiceModel2);
            companyModel.read("/Org_Company", {
                filters: [new Filter("tenant_id", FilterOperator.EQ, 'L1100')],
                success: function (oData) {
                    console.log(" company >>>>  ", oData);
                    oView.setBusy(false);
                }
            });

            oView.setBusy(true);
            plantModel.setTransactionModel(oServiceModel3);
            plantModel.read("/Pur_Operation_Org", {
                filters: [new Filter("tenant_id", FilterOperator.EQ, 'L1100')
                      , new Filter("company_code", FilterOperator.EQ, oThis.getModel('moldItemPop').oData.company_code)
                ],
                success: function (oData) {
                    console.log(" plant >>>>> ", oData);
                    oView.setBusy(false);
                }
            });

        },
        /**
      * @public 
      * @see 사용처 Participating Supplier Fragment 취소 이벤트
      */
        onExit: function () {
            // this._setInitPop();
            oThis.byId("dialogMolItemSelection").close();
        },
        selectMoldItemChange: function (oEvent) {
            var oTable = oThis.byId("popMoldItemSelectTable");
            var aItems = oTable.getSelectedItems();

            oThis.getModel('moldItemPop').setProperty('/sLength', aItems == undefined ? 0 : aItems.length);

        },
        /**
         * @description  클릭한거랑 검색 조건 초기화 
         */
        _setInitPop: function () {
            // var oTable = oThis.byId("popMoldItemSelectTable");
            //  oTable.clearSelection();
            oThis.byId('moldItemPopModel').setVaue("");
            oThis.byId('moldItemPopPartNo').setVaue("");
        },

        /**
        * @description  Participating Supplier Fragment Apply 버튼 클릭시 
        */
        onMoldItemSelectionApply: function (oEvent) {
            console.log(" [step] Participating Supplier Fragment Apply 버튼 클릭시 ", oEvent);

            var oTable = oThis.byId("popMoldItemSelectTable");
            var aItems = oTable.getSelectedItems();
            var that = this;
            var datas = [];
            aItems.forEach(function (oItem) {
                console.log(" getSelectedItems >>>", oItem);
                var famList = [];
                if (oItem.getCells()[8].getText()) {
                    famList.push(oItem.getCells()[8].getText()); // family_part_number_1 
                }
                if (oItem.getCells()[9].getText()) {
                    famList.push(oItem.getCells()[9].getText()); // family_part_number_2 
                }
                if (oItem.getCells()[10].getText()) {
                    famList.push(oItem.getCells()[10].getText()); // family_part_number_3 
                }
                if (oItem.getCells()[11].getText()) {
                    famList.push(oItem.getCells()[11].getText()); // family_part_number_4 
                }
                if (oItem.getCells()[12].getText()) {
                    famList.push(oItem.getCells()[12].getText()); // family_part_number_5 
                }

                var obj = new JSONModel({
                    mold_id: Number(oItem.getCells()[0].getText())
                    , model: oItem.getCells()[1].getText()
                    , mold_number: oItem.getCells()[2].getText()
                    , mold_sequence: oItem.getCells()[3].getText()
                    , spec_name: oItem.getCells()[4].getText()
                    , mold_item_type_code: oItem.getCells()[5].getSelectedKey()
                    , book_currency_code: oItem.getCells()[6].getText()
                    , provisional_budget_amount: oItem.getCells()[7].getText()
                    , family_part_number_1: famList.join(",")
                    , currency_code: oItem.getCells()[13].getText()
                    , purchasing_amount: oItem.getCells()[14].getText()
                    , supplier_code: oItem.getCells()[15].getText()
                    , target_amount: oItem.getCells()[16].getText()
                    , mold_production_type_code: oItem.getCells()[17].getText()
                });
                datas.push(obj);
            });

            oCallback(datas);
            this.onExit();
        },

    });

});