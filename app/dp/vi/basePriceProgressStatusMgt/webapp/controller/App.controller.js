sap.ui.define([
  "ext/lib/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("dp.vi.basePriceProgressStatusMgt.controller.App", {

    onInit: function () {
      // apply content density mode to root view
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    },

    /**
     * 20200808을 symbol에 맞게 변경. 예) symbol이 fr-ca일 경우 2020-08-08
     */
    onChangeDateFormat: function (sDatePararmm) {
        var sReturnValue = "";

        if( sDatePararmm ) {
            var oDate = new Date(sDatePararmm.substring(0,4), parseInt(sDatePararmm.substring(4,6))-1, sDatePararmm.substring(6));
            sReturnValue = new Intl.DateTimeFormat('fr-ca').format(oDate);
        }

        return sReturnValue;
    },
  });

});