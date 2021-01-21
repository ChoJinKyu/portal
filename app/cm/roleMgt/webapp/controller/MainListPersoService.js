sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "Role-mainList-mainRoleCodeColumn",
                order: 0,
                text: "역할코드",
                visible: true
            },
            {
                id: "Role-mainList-mainRoleNameColumn",
                order: 1,
                text: "역할명",
                visible: true
            },
            {
                id: "Role-mainList-mainChainColumn",
                order: 2,
                text: "체인",
                visible: true
            },
            {
                id: "Role-mainList-mainRoleDescColumn",
                order: 3,
                text: "설명",
                visible: true
            },
            {
                id: "Role-mainList-mainUseFlagColumn",
                order: 4,
                text: "사용여부",
                visible: true
            },
            {
                id: "Role-mainList-mainCreateUserIdColumn",
                order: 5,
                text: "생성자",
                visible: true
            },
            {
                id: "Role-mainList-mainSystemCreateDtmColumn",
                order: 6,
                text: "시스템생성일시",
                visible: true
            },
            {
                id: "Role-mainList-mainUpdateUserIdColumn",
                order: 7,
                text: "변경자",
                visible: true
            },
            {
                id: "Role-mainList-mainSystemUpdateDtmColumn",
                order: 8,
                text: "시스템변경일시",
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
                    if (oColumn.getHeader().getText() === "Role") {
                        return "Role (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainRoleCodeColumn") != -1 ){
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
