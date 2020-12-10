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

    return BaseController.extend("dp.basePriceList.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel(), "filterModel");
        },

        onAfterRendering: function () {
            let afilters = [];
            this._getBasePriceList(this, afilters);
        },

        onSearch: function () {
            let oFilterModel = this.getModel("filterModel"),
                oFilterModelData = oFilterModel.getData(),
                afilters = [], 
                sRfaNo = oFilterModelData.rfa_no, 
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // RFA No가 있는 경우
            if( sRfaNo ) {
                afilters.push(new Filter("approval_number", FilterOperator.EQ, sRfaNo));
            }

            // RFA No가 있는 경우
            if( oDateValue ) {
                afilters.push(new Filter({
					filters: [
						new Filter("local_create_dtm", FilterOperator.GT, this._getNowDayAndTimes(true, oDateValue)),
						new Filter("local_create_dtm", FilterOperator.LT, this._getNowDayAndTimes(true, oSecondDateValue))
					]
				}));
            }

            this._getBasePriceList(this, afilters);
        },

        _getNowDayAndTimes: function (bTimesParam, oDateParam) {
            let oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            let sReturnValue = "" + iYear + "-" + this._getPreZero(iMonth) + "-" + this._getPreZero(iDate) + "T";
            let sTimes = "" + this._getPreZero(iHours) + ":" + this._getPreZero(iMinutes) + ":" + this._getPreZero(iSeconds) + "Z";

            if( bTimesParam ) {
                sReturnValue += sTimes;
            }else {
                sReturnValue += "00:00:00";
            }

            return sReturnValue;
        },

        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        },

        _getBasePriceList: function(thatParam, filtersParam) {
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
                    let aSetData = [];

                    for( let i=0; i<data.results.length; i++ ) {
                        let oDataResults = data.results[i];

                        for( let k=0; k<oDataResults.details.results.length; k++ ) {
                            let oDetailResults = oDataResults.details.results[k];
                            oDetailResults.approval_number = oDataResults.approval_number;
                            oDetailResults.org_code = oDataResults.org_code;
                            oDetailResults.approval_status_code = oDataResults.approval_status_code;
                            // oDataResults["item_sequence"] = oDetailResults.item_sequence;
                            // oDataResults["au_code"] = oDetailResults.au_code;
                            // oDataResults["supplier_code"] = oDetailResults.supplier_code;
                            // oDataResults["material_code"] = oDetailResults.material_code;

                            aSetData.push(oDetailResults);
                        }
                    }

                    oView.getModel("listModel").setData(aSetData);
                },
                error : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);
                }
            });
        },

        /**
         * 상세 페이지로 이동
         */
        onGoDetail: function (oEvent) {
            // let oListModel = this.getModel("listModel");
            // let sPath = oEvent.getParameter("rowContext").getPath();

            this.getRouter().navTo("basePriceDetail");
        },

        onSearch2: function () {
            let afilters = [];
            this._getBasePriceList2(this, afilters);
        },

        _getBasePriceList2: function(thatParam, filtersParam) {
            let oView = thatParam.getView();
            let oModel = thatParam.getModel();
            //oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Detail", {
                filters : filtersParam,
                urlParameters: {
                    "$expand": "master"
                },
                success : function(data){
                    //oView.setBusy(false);
                    console.log("=====success");
                    console.log(data);
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