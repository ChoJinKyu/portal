sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;

        var _columns = [
            {
                id: "moldApprovalList-approvalList-mainColumnApprovalCategory",
                order: 0,
                text: "Approval Category",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnCompany",
                order: 1,
                text: "Company",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnPlant",
                order: 2,
                text: "Contents",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnApprovalNo",
                order: 3,
                text: "Type",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnSubject",
                order: 4,
                text: "Plant",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnRequestor",
                order: 5,
                text: "Plant",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnRequestDate",
                order: 6,
                text: "Plant",
                visible: false
            },
            {
                id: "moldApprovalList-approvalList-mainColumnStatus",
                order: 7,
                text: "Plant",
                visible: true
            },
            {
                id: "moldApprovalList-approvalList-mainColumnEmail",
                order: 8,
                text: "Plant",
                visible: false
            },
            {
                id: "moldApprovalList-approvalList-mainColumnModel",
                order: 9,
                text: "Plant",
                visible: false
            },
            {
                id: "moldApprovalList-approvalList-mainColumnMoldNumber",
                order: 10,
                text: "Plant",
                visible: false
            }
            
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var ApprovalListPersoService = {

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
                // if (sId.indexOf("moldProductionTypeColumn") != -1 ||
                //     sId.indexOf("mainColumnCompany") != -1 ||
                //     sId.indexOf("mainColumnPlant") != -1 ||
                //     sId.indexOf("mainColumnApprovalNo") != -1 ||
                //     sId.indexOf("mainColumnSubject") != -1) {
                //     return "Primary Group";
                // }
                // return "";
            }
        };

        return ApprovalListPersoService;

    });
