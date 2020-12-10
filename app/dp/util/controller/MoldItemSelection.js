sap.ui.define([
    "sap/ui/core/mvc/Controller" 
    , "sap/ui/model/odata/v2/ODataModel" 
    , "sap/m/Dialog",
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
], function (Controller,ODataModel,Dialog, Renderer, ODataV2ServiceProvider,
        Sorter, Filter, FilterOperator,
        Button, Text, Table, Column, ColumnListItem) {
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
    
        
        /**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
		init : function () { 
            console.log("init >>> ");
            Parent.prototype.init.call(this);
            this.setModel(new JSONModel());
                
            this.handleTableSelectDialogPress();
        },
           handleTableSelectDialogPress: function (oEvent) {
            console.log("[ step ] handleTableSelectDialogPress Item for Budget Execution 항목의 Add 버튼 클릭 ");

            var oView = this.getView();
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