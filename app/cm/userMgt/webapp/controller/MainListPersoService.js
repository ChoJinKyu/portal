sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "userMgt-mainList-mainColumnUserId",
                order: 0,
                text: "사용자ID",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnEmpNo",
                order: 1,
                text: "사번",
                visible: false
            },
            {
                id: "userMgt-mainList-mainColumnEmpName",
                order: 2,
                text: "이름",
                visible: false
            },
            {
                id: "userMgt-mainList-mainColumnEngEmpName",
                order: 3,
                text: "영문이름",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnEmail",
                order: 4,
                text: "이메일",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnStartDate",
                order: 5,
                text: "시작일자",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnEndDate",
                order: 5,
                text: "종료일자",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnCompany",
                order: 6,
                text: "회사",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnLanguage",
                order: 7,
                text: "언어",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnTimezone",
                order: 8,
                text: "타임존",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnDateFormat",
                order: 9,
                text: "일자서식",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnNumberFormat",
                order: 10,
                text: "숫자서식",
                visible: true
            },
            {
                id: "userMgt-mainList-mainColumnCurrency",
                order: 11,
                text: "통화",
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
                if (oColumn.mAggregations.label._sOwnerId === "container-userMgt") {
                    return "UserMgt (Important!)";
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnUserId") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });