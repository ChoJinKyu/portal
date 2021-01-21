sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "roleGroupMgt-mainList-mainColumnTenantId",
                order: 0,
                text: "테넌트ID",
                visible: true
            },
            {
                id: "roleGroupMgt-mainList-mainColumnRoleGroupCode",
                order: 1,
                text: "역할그룹코드",
                visible: false
            },
            {
                id: "roleGroupMgt-mainList-mainColumnRoleGroupName",
                order: 2,
                text: "역할그룹명",
                visible: false
            },
            {
                id: "roleGroupMgt-mainList-mainColumnRoleDesc",
                order: 3,
                text: "역할설명",
                visible: true
            },
            {
                id: "roleGroupMgt-mainList-mainColumnUpdateDtm",
                order: 4,
                text: "수정일자",
                visible: true
            },
            {
                id: "roleGroupMgt-mainList-mainColumnUpdateUserId",
                order: 5,
                text: "수정자",
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
                    if (oColumn.getHeader().getText() === "roleGroupMgt") {
                        return "roleGroupMgt (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnTenantId") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });