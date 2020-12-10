sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter"
],
  function (
    BaseController,
    JSONModel,
    ManagedListModel,
    DateFormatter) {
    "use strict";

    return BaseController.extend("dp.basePriceList.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            let oListModel = new JSONModel();
            this.setModel(oListModel, "listModel");
        },

        onAfterRendering: function () {
            let afilters = [];
            this._getBasePriceList(this, afilters);
        },

        onSearch: function () {
            let afilters = [];
            this._getBasePriceList(this, afilters);
        },

        _getBasePriceList: function(thatParam, filtersParam) {
            let oView = thatParam.getView();
            let oModel = thatParam.getModel();
            //oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Master", {
                filters : filtersParam,
                // urlParameters: {
                //     "$expand": "details"
                // },
                success : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);
                    oView.getModel("listModel").setData(data);
                },
                error : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);
                }
            });
        },

        onSearch2: function () {
            let afilters = [];
            this._getBasePriceList2(this, afilters);
        },

        _getBasePriceList2: function(thatParam, filtersParam) {
            let oView = thatParam.getView();
            let oModel = thatParam.getModel();
            //oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Master", {
                filters : filtersParam,
                urlParameters: {
                    "$expand": "details"
                },
                success : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);

                    for( let i=0; i<data.results.length; i++ ) {
                        let oDataResults = data.results[i];

                        for( let k=0; k<oDataResults.details.results.length; k++ ) {
                            let oDetailResults = oDataResults.details.results[k];
                            oDataResults["item_sequence"] = oDetailResults.item_sequence;
                            oDataResults["au_code"] = oDetailResults.au_code;
                            oDataResults["supplier_code"] = oDetailResults.supplier_code;
                            oDataResults["material_code"] = oDetailResults.material_code;
                        }
                    }

                    oView.getModel("listModel").setData(data);
                },
                error : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);
                }
            });
        }
    });
  }
);