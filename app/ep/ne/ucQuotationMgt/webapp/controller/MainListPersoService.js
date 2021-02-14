sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [
            {
                id: "ucQuotationMgt-mainTable-mainUcConstQuotationNumber",
                order: i++,
                text: "견적서번호",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcOrgCode",
                order: i++,
                text: "운영단위",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcConstName",
                order: i++,
                text: "공사명",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcConstEndDate",
                order: i++,
                text: "협력사명",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcConstStartDate",
                order: i++,
                text: "공사시작일자",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcConstEndDate",
                order: i++,
                text: "공사종료일자",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcQuotationStatusCode",
                order: i++,
                text: "진행상태",
                visible: true
            },       
            {
                id: "ucQuotationMgt-mainTable-mainUcPrNumber",
                order: i++,
                text: "PR번호",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcConstPersonEmpno",
                order: i++,
                text: "물량검토자",
                visible: true
            },
            {
                id: "ucQuotationMgt-mainTable-mainUcBuyerEmpno",
                order: i++,
                text: "구매담당자",
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
