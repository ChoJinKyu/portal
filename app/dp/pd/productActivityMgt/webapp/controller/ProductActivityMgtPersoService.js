sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "templateListViewAndObjectEdit-mainList-mainColumnChainCode",
                order: 0,
                text: "Chain",
                visible: true
            },
            {
                id: "templateListViewAndObjectEdit-mainList-mainColumnLanguageCode",
                order: 1,
                text: "Language",
                visible: false
            },
            {
                id: "templateListViewAndObjectEdit-mainList-mainColumnMessageCode",
                order: 4,
                text: "Code",
                visible: false
            },
            {
                id: "templateListViewAndObjectEdit-mainList-mainColumnMessageContents",
                order: 2,
                text: "Contents",
                visible: true
            },
            {
                id: "templateListViewAndObjectEdit-mainList-mainColumnMessageTypeCode",
                order: 3,
                text: "Type",
                visible: true
            }
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var ProductActivityMgtPersoService = {

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
                if (sId.indexOf("mainColumnChainCode") != -1 ||
                    sId.indexOf("mainColumnLanguageCode") != -1 ||
                    sId.indexOf("mainColumnMessageCode") != -1) {
                    return "Keys";
                }
                return "Others";
            }
        };

        return ProductActivityMgtPersoService;

    });
