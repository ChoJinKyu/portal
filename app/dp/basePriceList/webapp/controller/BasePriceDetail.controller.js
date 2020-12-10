sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
],
  function (BaseController, JSONModel, ManagedListModel, DateFormatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.basePriceList.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);
        },

        onAfterRendering: function () {
           
        },

        _getBasePriceDetail: function (oEvent) {
            let oSelectedData = oEvent.getParameter("arguments");
            let oModel = this.getModel();

            oModel.read

        },

        onBack: function () {
            this.getRouter().navTo("basePriceList");
        }
    });
  }
);