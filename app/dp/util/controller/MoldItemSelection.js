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
], function (Controller, ODataModel, Dialog, Renderer, ODataV2ServiceProvider,
    Sorter, Filter, FilterOperator,
    Button, Text, Table, Column, ColumnListItem, Fragment) {
    "use strict";

    var oServiceModel = new ODataModel({
        serviceUrl: "srv-api/odata/v2/dp.util.MoldItemSelectionService/",
        defaultBindingMode: "OneWay",
        defaultCountMode: "Inline",
        refreshAfterChange: false,
        useBatch: true
    });

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
        },
        /**
         * @param vThis : view page의 this 
         *       , oEvent : 이벤트 
         * ,     , oArges : company_code , org_code 
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        handleTableSelectDialogPress: function (oThis, oEvent, oArges) {
            console.log("[ step ] handleTableSelectDialogPress Item for Budget Execution 항목의 Add 버튼 클릭 ");

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
                that.byId("moldItemSelectionSearch").firePress(); // open 하자마자 조회 하여 보여줌 

            });
        },


    });

});