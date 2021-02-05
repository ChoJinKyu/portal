sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [           
            {
                id: "partBaseActivityMgt-mainList-mainColumnProductActivityCode",
                order: i++,
                text: "제품 Activity 코드",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnActivityName",
                order: i++,
                text: "제품 Activity 명",
                visible: true
            },            
            {
                id: "partBaseActivityMgt-mainList-mainColumnDescription",
                order: i++,
                text: "설명",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnSequence",
                order: i++,
                text: "순번",
                visible: true
            },            
            {
                id: "partBaseActivityMgt-mainList-mainColumnActiveFlagVal",
                order: i++,
                text: "Status",
                visible: true
            },            
            {
                id: "partBaseActivityMgt-mainList-mainColumnLocalUpdateDtm",
                order: i++,
                text: "수정일시",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnUpdateUserId",
                order: i++,
                text: "수정자",
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
                    if (oColumn.getHeader().getText() === "제품 Activity 코드") {
                        return "제품 Activity 코드 (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnActivityCode") != -1 ||
                    sId.indexOf("mainColumnActivityName") != -1 ) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        MainListPersoService.delPersData = MainListPersoService.resetPersData;
        return MainListPersoService;

    });
