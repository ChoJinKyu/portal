sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "detailSpecConfirm-mainList-mainCompany",
                order: 0,
                text: "Code",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainOrg",
                order: 1,
                text: "Name",
                visible: false
            },
            {
                id: "detailSpecConfirm-mainList-mainModel",
                order: 2,
                text: "Start Date",
                visible: false
            },
            {
                id: "detailSpecConfirm-mainList-mainMoldNumber",
                order: 3,
                text: "End Date",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainMoldSeq",
                order: 4,
                text: "Site",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainDesc",
                order: 5,
                text: "Company",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainStatus",
                order: 6,
                text: "Role",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainItemType",
                order: 7,
                text: "Organization",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainRequester",
                order: 8,
                text: "User",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainDate",
                order: 9,
                text: "User",
                visible: true
            },
            {
                id: "detailSpecConfirm-mainList-mainFamilyPartNumber",
                order: 10,
                text: "User",
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

        return MainListPersoService;

    });
