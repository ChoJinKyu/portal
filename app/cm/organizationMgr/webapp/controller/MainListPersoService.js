sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _aColunns = [
            {
                id: "organizationMgr-mainList-mainColumnState",
                order: 9,
                text: "State",
                visible: false
            },
            {
                id: "organizationMgr-mainList-mainColumnChainCode",
                order: 1,
                text: "{I18N>/CHAIN}",
                visible: true
            },
            {
                id: "organizationMgr-mainList-mainColumnLanguageCode",
                order: 2,
                text: "{I18N>/LANGUAGE}",
                visible: true
            },
            {
                id: "organizationMgr-mainList-mainColumnMessageCode",
                order: 3,
                text: "{I18N>/CODE}",
                visible: true
            },
            {
                id: "organizationMgr-mainList-mainColumnMessageContents",
                order: 4,
                text: "{I18N>/CONTENTS}",
                visible: true
            },
            {
                id: "organizationMgr-mainList-mainColumnMessageTypeCode",
                order: 5,
                text: "{I18N>/TYPE}",
                visible: true
            }
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var MainListPersoService = {

            oData: {
                _persoSchemaVersion: "1.0",
                aColumns: _aColunns
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
                debugger;
                this._oBundle = oBundle;
                oDeferred.resolve();
                return oDeferred.promise();
            },

            resetPersData: function () {
                var oDeferred = new jQuery.Deferred();
                var oInitialData = {
                    _persoSchemaVersion: "1.0",
                    aColumns: _aColunns
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
                        return oColumn.getHeader().getText() + " (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnChainCode") != -1 ||
                    sId.indexOf("mainColumnLanguageCode") != -1 ||
                    sId.indexOf("mainColumnMessageCode") != -1) {
                    return "Keys";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
