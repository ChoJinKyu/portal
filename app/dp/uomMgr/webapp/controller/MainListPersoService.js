sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "uomMgr-mainList-mainColumnUOM",
                order: 0,
                text: "UOM",
                visible: true
            },
            {
                id: "uomMgr-mainList-mainColumnCC",
                order: 1,
                text: "Commercial Code",
                visible: false
            },
            {
                id: "uomMgr-mainList-mainColumnCN",
                order: 2,
                text: "Commercial Name",
                visible: false
            },
            {
                id: "uomMgr-mainList-mainColumnBU",
                order: 3,
                text: "Base Unit",
                visible: true
            },
            {
                id: "uomMgr-mainList-mainColumnClass",
                order: 4,
                text: "Class",
                visible: true
            },
            {
                id: "uomMgr-mainList-mainColumnTC",
                order: 5,
                text: "Technical Code",
                visible: true
            },
            {
                id: "uomMgr-mainList-mainColumnTN",
                order: 6,
                text: "Technical Name",
                visible: true
            },
            {
                id: "uomMgr-mainList-mainColumnDD",
                order: 7,
                text: "Disable Date",
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
                    if (oColumn.getHeader().getText() === "UOM") {
                        return "UOM (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnUOM") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
