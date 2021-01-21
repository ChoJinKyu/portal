sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 1;

        var _columns = [
            {
                id: "prReviewMgt-mainList-mainColumnCHK",
                order: 1,
                text: "CHK",
                visible: false
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_NUMBER",
                order: 0,
                text: "PR_NUMBER",
                visible: false
            },
            {
                id: "prReviewMgt-mainList-mainColumnERP_PR_NUMBER",
                order: 0,
                text: "ERP_PR_NUMBER",
                visible: false
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_DESC",
                order: 1,
                text: "PR_DESC",
                visible: false
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_TYPE_CODE",
                order: 3,
                text: "PR_TYPE_CODE",
                visible: true
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_TYPE_CODE_2",
                order: 4,
                text: "PR_TYPE_CODE_2",
                visible: true
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_TYPE_CODE_3",
                order: 5,
                text: "PR_TYPE_CODE_3",
                visible: true
            },
            {
                id: "prReviewMgt-mainList-mainColumnPR_TEMPLATE_NUMBER",
                order: 6,
                text: "PR_TEMPLATE_NUMBER",
                visible: true
            },
            {
                id: "prReviewMgt-mainList-mainColumnREQUESTOR_DEPARTMENT_NAME",
                order: 7,
                text: "REQUESTOR_DEPARTMENT_NAME",
                visible: true
            },
            {
                id: "prReviewMgt-mainList-mainColumnREQUESTOR_NAME",
                order: 8,
                text: "REQUESTOR_NAME",
                visible: true
            }
            ,
            {
                id: "prReviewMgt-mainList-mainColumnREQUESTOR_NAME",
                order: 9,
                text: "REQUESTOR_NAME",
                visible: true
            }
            ,
            {
                id: "prReviewMgt-mainList-mainColumnPURCHASE_REQUISITION",
                order: 10,
                text: "PURCHASE_REQUISITION",
                visible: true
            }
            ,
            {
                id: "prReviewMgt-mainList-mainColumnPR_COUNT",
                order: 11,
                text: "PR_COUNT",
                visible: true
            }
             ,
            {
                id: "prReviewMgt-mainList-mainColumnPR_CREATE_STATUS_CODE",
                order: 12,
                text: "PR_CREATE_STATUS_CODE",
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
                if (sId.indexOf("mainColumnPR_NUMBER") != -1 ||
                    sId.indexOf("mainColumnERP_PR_NUMBER") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
