sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "productActivityMgt-mainList-mainColumnProductActivityCode",
                order: 0,
                text: "부품 Activity Code",
                visible: true
            },
            {
                id: "productActivityMgt-mainList-mainColumnActivityName",
                order: 1,
                text: "부품 Activity 명",
                visible: false
            },
            {
                id: "productActivityMgt-mainList-mainColumnDescription",
                order: 2,
                text: "설명",
                visible: false
            },
            {
                id: "productActivityMgt-mainList-mainColumnSequence",
                order: 3,
                text: "순번",
                visible: true
            },
            {
                id: "productActivityMgt-mainList-mainColumnActiveFlag",
                order: 4,
                text: "상태",
                visible: true
            },
            {
                id: "productActivityMgt-mainList-mainColumnLocalUpdateDtm",
                order: 5,
                text: "로컬변경일시",
                visible: true
            },
            {
                id: "productActivityMgt-mainList-mainColumnUpdateUserId",
                order: 5,
                text: "수정사용자ID",
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
                    if (oColumn.getHeader().getText() === "부품 Activity 코드") {
                        return "부품 Activity 코드 (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnProductActivityCode") != -1 ||
                    sId.indexOf("mainColumnActivityName") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        MainListPersoService.delPersData = MainListPersoService.resetPersData;
        return MainListPersoService;

    });
