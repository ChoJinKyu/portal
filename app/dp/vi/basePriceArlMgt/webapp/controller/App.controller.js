sap.ui.define([
  "ext/lib/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("dp.vi.basePriceArlMgt.controller.App", {

    onInit: function () {
      // apply content density mode to root view
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    },

    
    /**
     * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
     */
    _changeDateFormat: function (oDateParam, sGubun) {
        var oDate = oDateParam || new Date(),
            sGubun = sGubun || "",
            iYear = oDate.getFullYear(),
            iMonth = oDate.getMonth()+1,
            iDate = oDate.getDate(),
            iHours = oDate.getHours(),
            iMinutes = oDate.getMinutes(),
            iSeconds = oDate.getSeconds();

        var sReturnValue = "" + iYear + sGubun + this._getPreZero(iMonth) + sGubun + this._getPreZero(iDate);

        return sReturnValue;
    },

    /**
     * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
     */
    _getPreZero: function (iDataParam) {
        return (iDataParam<10 ? "0"+iDataParam : iDataParam);
    },
    
  });

});