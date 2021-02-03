sap.ui.define([
  "ext/lib/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("pg.md.mdVpItemList.controller.App", {

    onInit : function () {
        // apply content density mode to root view
        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    },

    onColumnResize: function(oEvent) {
        // This event is ideal to call scrollToIndex function of the Table
        var oMasterView = oEvent.getSource().getBeginColumnPages()[0];
        // if (oMasterView.getController().iIndex) {
        // 	var oTable = oMasterView.byId("productsTable");
        // 	oTable.scrollToIndex(oMasterView.getController().iIndex);
        // }
        
        var sLayout = this.getView().getModel("fcl").getProperty("/layout");
        if (sLayout !== 'TwoColumnsMidExpanded') {
            // var oTable = oMasterView.byId("productsTable");
            // oTable.scrollToIndex(0);
        }

    }
        

  });

});