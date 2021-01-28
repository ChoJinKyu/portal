sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [
            {
                id: "dialogTest-mainTable-mainLoiNumber",
                order: i++,
                text: "LOI번호",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainItemSequence",
                order: i++,
                text: "Line No.",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRequestDepartmentName",
                order: i++,
                text: "요청부서",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRequestorName",
                order: i++,
                text: "요청자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPurchasingDepartmentName",
                order: i++,
                text: "구매부서",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainBuyerName",
                order: i++,
                text: "구매담당자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainLoiRequestTitle",
                order: i++,
                text: "요청명",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainItemDesc",
                order: i++,
                text: "품명",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainSupplierName",
                order: i++,
                text: "협력사",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPublishDate",
                order: i++,
                text: "발행일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainDeliveryRequestDate",
                order: i++,
                text: "납기일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRequestQuantity",
                order: i++,
                text: "수량",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainCurrencyCode",
                order: i++,
                text: "통화",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRequestAmount",
                order: i++,
                text: "금액",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainLoiSelectionStatusCode",
                order: i++,
                text: "업체선정진행상태",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainLoiPublishStatusCode",
                order: i++,
                text: "LOI발행상태",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPoStatusCode",
                order: i++,
                text: "발주상태",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRequestDate",
                order: i++,
                text: "요청일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainSystemCreateDtm",
                order: i++,
                text: "작성일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainSupplierOpinion",
                order: i++,
                text: "VOS",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPoNumber",
                order: i++,
                text: "발주번호",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPurchasingRequestDate",
                order: i++,
                text: "구매요청일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPoDate",
                order: i++,
                text: "발주일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainPoDate2",
                order: i++,
                text: "입고일자",
                visible: true
            },
            {
                id: "dialogTest-mainTable-mainRemark",
                order: i++,
                text: "비고",
                visible: true
            }            
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var MainListPersoService = {

            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: _columns
            },

            getPersData: function () {
                var oDeferred = new jQuery.Deferred();
                if (!this._oBundle) {
                    this._oBundle = this.oData;
                }
                var oBundle = this._oBundle;
                oDeferred.resolve(oBundle);
                return oDeferred.promise();
            },

            setPersData: function (oBundle) {
                var oDeferred = new jQuery.Deferred();
                this._oBundle = oBundle;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            resetPersData: function () {
                var oDeferred = new jQuery.Deferred();
                var oInitialData = {
                    _persoSchemaVersion: "1.0",
                    aColumns: _columns
                };

                //set personalization
                this._oBundle = oInitialData;

                oDeferred.resolve();
                return oDeferred.promise();
            },

            //this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
            //to 'Weight (Important!)', but will leave all other column names as they are.
            getCaption: function (oColumn) {
                if (oColumn.getHeader() && oColumn.getHeader().getText) {
                    if (oColumn.getHeader().getText() === "Code") {
                        return "Code (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnCode") != -1 ||
                    sId.indexOf("mainColumnName") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        MainListPersoService.delPersData = MainListPersoService.resetPersData;
        return MainListPersoService;

    });
