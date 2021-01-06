sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter"
    ],
    /**
     * 
     * @param {*} BaseController 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {*} ManagedListModel 
     * @param {*} DateFormatter 
     */
  function (BaseController, JSONModel, ManagedListModel, DateFormatter) {
    "use strict";

    return BaseController.extend("dp.tc.projectMgt.controller.blocks.project.BlockPrice", {

        dateFormatter: DateFormatter

        , onInit: function () {
            this._pivottingData();
        }

         /**
         * Table Control 에 pivot type 으로 binding 시키기 위함.
         */
        , _pivottingData: function() {
            var oDetailData = this.getOwnerComponent().getModel("detailModel").getData();
            //Grid Table 별로 re
            var oEvents = oDetailData.events ? oDetailData.events.results : [];//개발일정

            var oMtlmob = oDetailData.mtlmob ? oDetailData.mtlmob.results : [];//판가/물동/원가의 예상물동
            var oSalesPrice = oDetailData.sales_price ? oDetailData.sales_price.results : [];//판가/물동/원가의 판가
            var oPrcsCost = oDetailData.prcs_cost ? oDetailData.prcs_cost.results : [];//판가/물동/원가의 가공비
            var oSgna = oDetailData.sgna ? oDetailData.sgna.results : [];//판가/물동/원가의 판관비
            
            var oBaseExtra = oDetailData.base_extra ? oDetailData.base_extra.results : [];//환율

            //events
            var aEventsData = this._reCompositData(oEvents, "develope_event_code", "start_date");
            this.setModel(new JSONModel(aEventsData), "eventsModel");
            this._factoryTableColumns("tblEvents", "Center");


            //판가/물동/원가
            oMtlmob.unshift({"period_code" : "구분", "addition_type_value" : "예상물동"});
            oSalesPrice.unshift({"period_code" : "구분", "addition_type_value" : "판가"});
            oPrcsCost.unshift({"period_code" : "구분", "addition_type_value" : "가공비"});
            oSgna.unshift({"period_code" : "구분", "addition_type_value" : "판관비"});

            var aPriceData = this._reCompositData(oMtlmob, "period_code", "addition_type_value");
            if(aPriceData.datas && aPriceData.datas.length > 0) {
                //aPriceData.datas.concat(oSalesPrice).concat(oPrcsCost).concat(oSgna);
                aPriceData.datas.push(this._addRowToPivotObj(oSalesPrice, aPriceData.datas[0], "period_code", "addition_type_value", {"remark" : "판가"}));
                aPriceData.datas.push(this._addRowToPivotObj(oPrcsCost, aPriceData.datas[0], "period_code", "addition_type_value", {"remark" : "가공비"}));
                aPriceData.datas.push(this._addRowToPivotObj(oSgna, aPriceData.datas[0], "period_code", "addition_type_value", {"remark" : "판관비"}));

                this.setModel(new JSONModel(aPriceData), "priceModel");
                this._factoryTableColumns("tblPrice", "End");
            }
            //환율
            var aExchange = this._reCompositMultiRowData(oBaseExtra, "currency_code", "period_code", "exrate", {"name" : "구분", "data" : "currency_code"});
            this.setModel(new JSONModel(aExchange), "exchangeModel");
            this._factoryTableColumns("tblExchange", "End");
            
        }

        /**
         * 전달받은 array data 를 Pivotting 하려는 Object 형태로 리턴한다.
         * @param aRowData {Array} 
         * @param oObj {Array} 
         * @param sValue {Array} 
         */
        , _addRowToPivotObj: function(aRowData, oObj, sName, sText) {
            var newObj = {};
            aRowData.forEach(function(oRowData, idx) {
                $.each(Object.keys(oObj), function(idx2, sKey) {
                    if(oRowData[sName] === sKey) {
                        newObj[sKey] = oRowData[sText];
                        return false;
                    }
                });
            });
            return newObj;
        }

        /**
         * 모델에 적용 COL-TEXT 형태로 pivotting 한 Data 적용 (1Row)
         * @param aDatas {Array} row data
         * @param sKeyName {string} 칼럼 name 으로 지정할 property 명
         * @param sTextName {string} 칼럼 value 값으로 지정할 property 명
         * @return newDatas {Array} 재조합된 data
         */
        , _reCompositData: function (aRowDatas, sKeyName, sTextName) {
            var aDatas = [];
            var aCols  = [];
            var oNewData = {};
            var newObj = {};
            aRowDatas.forEach(function(oData, idx) {
                let sKey, sTxt;
                    sKey = oData[sKeyName] || "";
                if(typeof oData[sTextName] === "string") {
                    sTxt = oData[sTextName] || "";
                } else {// typeOf Object
                    if(sTextName.indexOf("_date") > -1) {
                        sTxt = oData[sTextName].getFullYear() + "-" + (oData[sTextName].getMonth() < 10 ? "0" + (oData[sTextName].getMonth()+1) : (oData[sTextName].getMonth()+1));
                    }
                }
                //newObj.set(sKey, sTxt);
                newObj[sKey] = sTxt;
                aCols.push({name: sKey, text: sKey});
            });
            if(Object.keys(newObj).length > 0 && newObj.constructor === Object) {
                aDatas.push(newObj);
            }
            return {columns: aCols, datas: aDatas};
        }

        /**
         * {columns:[], data:[]} 구조의 모델정보를 바탕으로 table aggregation binding 한다.
         * @param {string} biding 하고자 하는 table name
         */
        , _factoryTableColumns: function(sTableName, sHAlign) {
            var oTable = this.getView().byId(sTableName);
            var sModelName = oTable.getBindingInfo("items").model;
            var oModel  = oTable.getModel(sModelName);
            var aCols  = oModel.getProperty("/columns");
            var aDatas = oModel.getProperty("/datas");
            
            oTable.bindAggregation("columns", sModelName + ">/columns", function(sId, oContext) {
                return new sap.m.Column({
                    hAlign : sHAlign || "Center",
                    header : new sap.m.Label({
                                text : oContext.getObject().text
                             })
                });
            });

            oTable.bindAggregation("items", sModelName + ">/datas", function() {
                return new sap.m.ColumnListItem({
                    cells : aCols.map(function (column) {
                                console.log(column);
                                return new sap.m.Text({text : "{"+ sModelName +">" + column.name + "}"})
                            })
                });
            });

        }

        /**
         * 모델에 적용 COL-TEXT 형태로 pivotting 한 Data 적용 (multi row - 특정 필드기준으로 row 변경)
         * @param {Array} aRowDatas original data passed
         * @param {string} breakName new line field
         * @param {string} column binding name 
         * @param {string} column text
         */
        , _reCompositMultiRowData: function(aRowDatas, breakName, sKeyName, sTextName, oRemark) {
            var aDatas = [];//row
            var aCols  = [];//column
            var returnObj = {};
            var newObj = {};//aDatas 에 담을 object
            var currentCd, lastCd;
            var bFirstRow = true;
            aRowDatas.forEach(function(oData, idx) {
                currentCd = oData[breakName];
                if(idx === 0) {
                    newObj[oRemark.name] = oData[oRemark.data];
                }
                if(idx > 0 && currentCd !== lastCd) {// new line break

                    aCols.unshift({name: oRemark.name, text: oRemark.name});
                    if(bFirstRow) {
                        returnObj.columns = aCols;//column 정보만 먼저 담는다.
                    }
                    
                    if(Object.keys(newObj).length > 0 && newObj.constructor === Object) {
                        aDatas.push(newObj);
                    }
                    newObj = {};
                    newObj[oRemark.name] = oData[oRemark.data];
                    bFirstRow = false;
                }

                let sKey, sTxt;
                    sKey = oData[sKeyName] || "";
                if(typeof oData[sTextName] === "string") {
                    sTxt = oData[sTextName] || "";
                } else {// typeOf Object
                    if(sTextName.indexOf("_date") > -1) {
                        sTxt = oData[sTextName].getFullYear() + "-" + (oData[sTextName].getMonth() < 10 ? "0" + (oData[sTextName].getMonth()+1) : (oData[sTextName].getMonth()+1));
                    }
                }
                //newObj.set(sKey, sTxt);
                newObj[sKey] = sTxt;
                if(bFirstRow) {
                    aCols.push({name: sKey, text: sKey});
                }

                if((idx === aRowDatas.length-1) && Object.keys(newObj).length > 0 && newObj.constructor === Object) {//last push in array
                    aDatas.push(newObj);
                }

                lastCd = currentCd;
            });
            
            return {columns: aCols, datas: aDatas};
        }
    });
  }
);