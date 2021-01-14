sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "loiRequestMgt-mainTable-mainLoiNumber",
                order: 0,
                text: "LOI번호",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainRequestDepartmentCode",
                order: 1,
                text: "요청부서",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainRequestorEmpno",
                order: 2,
                text: "요청자",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainRequestDate",
                order: 3,
                text: "요청일자",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainLoiRequestTitle",
                order: 4,
                text: "요청명",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainLoiRequestStatusCode",
                order: 5,
                text: "진행상태",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainBuyerEmpno",
                order: 6,
                text: "구매담당자",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainPublishDate",
                order: 7,
                text: "발행일자",
                visible: true
            },
            {
                id: "loiRequestMgt-mainTable-mainVendorPoolCode",
                order: 8,
                text: "협력사",
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
