sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var i = 0;

        var _columns = [
            {
                id: "remodelRepairMgtSup-moldMstTable-moldFamilyFlagColumn",
                order: 7,
                text: "Family Y/N",
                visible: true
            },
            {
                id: "container-remodelRepairMgtSup---remodelRepairMgtSup--moldProductionTypeColumn",
                order: 8,
                text: "Production Type",
                visible: true
            },
            {
                id: "container-remodelRepairMgtSup---remodelRepairMgtSup--moldMstTable_hdr9",
                order: 9,
                text: "Item Type",
                visible: true
            },
            {
                id: "container-remodelRepairMgtSup---remodelRepairMgtSup--moldMoldTypeColumn",
                order: 10,
                text: "Mold Type",
                visible: true
            },
            {
                id: "remodelRepairMgtSup-moldMstTable-moldEDTypeColumn",
                order: 11,
                text: "Export/Domestic Type",
                visible: true
            }
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var remodelRepairMgtSupPersoService = {

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
                if (sId.indexOf('moldAffiliateColumn') != -1 ||
                    sId.indexOf('moldDivisionColumn') != -1 ||
                    sId.indexOf('moldModelColumn') != -1 ||
                    sId.indexOf('moldPartNoColumn') != -1 ||
                    sId.indexOf('moldSeqColumn') != -1 ||
                    sId.indexOf('moldDescriptionColumn') != -1 ||
                    sId.indexOf('moldStatusColumn') != -1) {
                    return "Primary Group";
                }
                return "Others";
            }
        };

        remodelRepairMgtSupPersoService.delPersData = remodelRepairMgtSupPersoService.resetPersData;
        return remodelRepairMgtSupPersoService;

    });
