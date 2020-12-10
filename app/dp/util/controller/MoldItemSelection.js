sap.ui.define([
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
], function (Controller, ODataModel, Dialog, Renderer, ODataV2ServiceProvider,
    Sorter, Filter, FilterOperator,
    Button, Text, Table, Column, ColumnListItem, Fragment, ManagedListModel) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/dp.util.MoldItemSelectionService/",
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
    var oThis, oTableName, oArges, oCallback ; 

    /**
     * @description MoldSelection 
     * @author jinseon.lee
     * @date   2020.12.02 
     */
    return Controller.extend("dp.util.controller.MoldItemSelection", {

        onInit: function () {

            /* 다국어 처리*/
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            console.log("MoldItemSelection Controller 호출");

            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "moldItemPop");
            this.setModel(new ManagedListModel(), "moldItemPopList");
        },
        /**
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code 
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        openMoldItemSelectionPop : function (pThis, oEvent, pArges, callback) { 

            oThis = pThis;
            oArges = pArges;
            oCallback = callback;
            this.getModel('moldItemPop').setProperty('/company_code', oArges.company_code);
            this.getModel('moldItemPop').setProperty('/org_code', oArges.plant_code); 

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
                oThis.byId("mItemPopSrch").firePress(); // open 하자마자 조회 하여 보여줌 

            });
        }, 
         _getSearchMoldSelection: function () {
            var aSearchFilters = [];
            // tenant_id  
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L1100'));
            var company = pView.byId('pCompany').mProperties.selectedKey;
            var plant = pView.byId('Plant').mProperties.selectedKey;
            var model = pView.byId('mItemModel').getValue().trim();
            var partNo = pView.byId('mItemPartNo').getValue().trim();

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
                aSearchFilters.push(new Filter("part_number", FilterOperator.Contains, partNo))
            }

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
            var oView = pView.getView(),
                oModel = pView.getModel("moldItemPopList");

         

            oView.setBusy(true);
            oModel.setTransactionModel(oServiceModel);
            oModel.read("/MoldItemSelect", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log(" oData ", oData);
                    oView.setBusy(false);
                }
            });
            console.log("omdel", oModel);
        },
           /**
         * @public 
         * @see 사용처 Participating Supplier Fragment 취소 이벤트
         */
        onExit: function () {
            pView.byId("dialogMolItemSelection").close();
        },

          /**
        * @description  Participating Supplier Fragment Apply 버튼 클릭시 
        */
        onMoldItemSelectionApply: function (oEvent) {
            console.log(" [step] Participating Supplier Fragment Apply 버튼 클릭시 ", oEvent);

            var oTable = pView.byId("popMoldItemSelectTable");
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
                    , budget_amount: oItem.getCells()[7].getText()
                    , family_part_number_1: famList.join(",")
                });
                datas.push(obj);
            });

            oCallback(datas);

            this.onExit();
        },

    });

});