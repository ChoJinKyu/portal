sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 1;

        var _columns = [
            {
                id: "prMgt-mainList-mainColumnPR_NUMBER",
                order: 0,
                text: "Code",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnERP_PR_NUMBER",
                order: 1,
                text: "Name",
                visible: false
            },
            {
                id: "prMgt-mainList-mainColumnPR_DESC",
                order: 2,
                text: "Start Date",
                visible: false
            },
            {
                id: "prMgt-mainList-mainColumnPR_TYPE_CODE",
                order: 3,
                text: "End Date",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnPR_TYPE_CODE_2",
                order: 4,
                text: "Site",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnPR_TYPE_CODE_3",
                order: 5,
                text: "Company",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnPR_TEMPLATE_NUMBER",
                order: 5,
                text: "Role",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnREQUESTOR_DEPARTMENT_NAME",
                order: 6,
                text: "Organization",
                visible: true
            },
            {
                id: "prMgt-mainList-mainColumnREQUESTOR_NAME",
                order: 7,
                text: "User",
                visible: true
            }
            ,
            {
                id: "prMgt-mainList-mainColumnREQUESTOR_NAME",
                order: 7,
                text: "User1",
                visible: true
            }
            ,
            {
                id: "prMgt-mainList-mainColumnPURCHASE_REQUISITION",
                order: 7,
                text: "User2",
                visible: true
            }
            ,
            {
                id: "prMgt-mainList-mainColumnPR_COUNT",
                order: 7,
                text: "User3",
                visible: true
            }
             ,
            {
                id: "prMgt-mainList-mainColumnPR_CREATE_STATUS_CODE",
                order: 7,
                text: "User4",
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
