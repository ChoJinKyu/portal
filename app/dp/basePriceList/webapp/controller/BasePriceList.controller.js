sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/util/Multilingual",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
],
  function (BaseController, JSONModel, ManagedListModel, Multilingual, DateFormatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("dp.basePriceList.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            let oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel(), "filterModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this._getBasePriceList, this);
        },

        /**
         * Search 버튼 클릭 시 List 조회
         */
        onSearch: function () {
            let oFilterModel = this.getModel("filterModel"),
                oFilterModelData = oFilterModel.getData(),
                aFilters = [], 
                sRfaNo = oFilterModelData.rfa_no, 
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // RFA No가 있는 경우
            if( sRfaNo ) {
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, sRfaNo));
            }

            // RFA No가 있는 경우
            if( oDateValue ) {
                aFilters.push(new Filter("local_create_dtm", FilterOperator.BT, oDateValue, oSecondDateValue));
            }

            this._getBasePriceList(aFilters);
        },

        /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10T00:00:00
         */
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

        /**
         * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
         */
        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        },

        /**
         * 상세 페이지로 이동
         */
        onGoDetail: function (oEvent) {
            let oListModel = this.getModel("listModel");
            let sPath = oEvent.getSource().getBindingContext("listModel").getPath();
            let oBasePriceListRootModel = this.getModel("basePriceListRootModel");
            oBasePriceListRootModel.setData(oListModel.getProperty(sPath));

            this.getRouter().navTo("basePriceDetail");
        },

        /**
         * Base Price Progress List 조회
         */
        _getBasePriceList: function(filtersParam) {
            let oView = this.getView();
            let oModel = this.getModel();
            filtersParam =  Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Detail", {
                filters : filtersParam,
                urlParameters: {
                    "$expand": "approval_number_fk"
                },
                success : function(data){
                    oView.setBusy(false);

                    oView.getModel("listModel").setData(data);
                },
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        }
    });
  }
);