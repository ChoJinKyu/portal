sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _aColunns = [
            {
                id: "templateListInlineEdit-mainList-mainColumnState",
                order: 0,
                text: "State",
                visible: false
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnChainCode",
                order: 0,
                text: "{i18nd>/lblChain}",
                visible: true
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnLanguageCode",
                order: 1,
                text: "{i18nd>/lblLanguage}",
                visible: false
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnMessageCode",
                order: 2,
                text: "{i18nd>/lblCode}",
                visible: false
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnMessageContents",
                order: 3,
                text: "{i18nd>/lblContents}",
                visible: true
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnGroupCode",
                order: 4,
                text: "{i18nd>/lblGroup}",
                visible: true
            },
            {
                id: "templateListInlineEdit-mainList-mainColumnMessageTypeCode",
                order: 5,
                text: "{i18nd>/lblType}",
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
                        return "Code (Important!)";
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
