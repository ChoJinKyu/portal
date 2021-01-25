sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [
            {
                id: "partActivityMgt-mainTable-mainLoiNumber",
                order: i++,
                text: "LOI번호",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainItemSequence",
                order: i++,
                text: "Line No.",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRequestDepartmentName",
                order: i++,
                text: "요청부서",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRequestorName",
                order: i++,
                text: "요청자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPurchasingDepartmentName",
                order: i++,
                text: "구매부서",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainBuyerName",
                order: i++,
                text: "구매담당자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainLoiRequestTitle",
                order: i++,
                text: "요청명",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainItemDesc",
                order: i++,
                text: "품명",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainSupplierName",
                order: i++,
                text: "협력사",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPublishDate",
                order: i++,
                text: "발행일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainDeliveryRequestDate",
                order: i++,
                text: "납기일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRequestQuantity",
                order: i++,
                text: "수량",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainCurrencyCode",
                order: i++,
                text: "통화",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRequestAmount",
                order: i++,
                text: "금액",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainLoiSelectionStatusCode",
                order: i++,
                text: "업체선정진행상태",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainLoiPublishStatusCode",
                order: i++,
                text: "LOI발행상태",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPoStatusCode",
                order: i++,
                text: "발주상태",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRequestDate",
                order: i++,
                text: "요청일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainSystemCreateDtm",
                order: i++,
                text: "작성일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainSupplierOpinion",
                order: i++,
                text: "VOS",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPoNumber",
                order: i++,
                text: "발주번호",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPurchasingRequestDate",
                order: i++,
                text: "구매요청일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPoDate",
                order: i++,
                text: "발주일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainPoDate2",
                order: i++,
                text: "입고일자",
                visible: true
            },
            {
                id: "partActivityMgt-mainTable-mainRemark",
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
