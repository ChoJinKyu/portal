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
            this.setModel(new JSONModel(), "listModel");
            this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);
        },

        onAfterRendering: function () {
           
        },
        
        _getBasePriceDetail: function () {
            let oView = this.getView();
            let oBasePriceListRootModel = this.getModel("basePriceListRootModel");
            let oSelectedData = oBasePriceListRootModel.getData();
            let oModel = this.getModel();
            let aFilters = [];
            aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
            aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

            oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Master", {
                filters : aFilters,
                urlParameters: {
                    "$expand": "details"
                },
                success : function(data){
                    oView.setBusy(false);
                     console.log("success", data);

                    if( data && data.results && 0<data.results.length ) {
                        oView.getModel("listModel").setData(data.results[0]);
                    }
                },
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        onBack: function () {
            this.getRouter().navTo("basePriceList");
        }
    });
  }
);