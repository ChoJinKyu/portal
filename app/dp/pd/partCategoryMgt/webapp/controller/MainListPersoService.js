sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "partCategoryMgt-mainList-mainColumnCom",
                order: 0,
                text: "회사",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainColumnAU",
                order: 1,
                text: "조직코드",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainColumnPC",
                order: 2,
                text: "Part Category",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnPT",
                order: 3,
                text: "Project Type",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainColumnAC",
                order: 4,
                text: "Activity 코드",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnAN",
                order: 5,
                text: "Activity 명",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnUseYn",
                order: 6,
                text: "사용여부",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnS",
                order: 7,
                text: "s",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnA",
                order: 8,
                text: "a",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnB",
                order: 9,
                text: "b",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnC",
                order: 10,
                text: "c",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnD",
                order: 11,
                text: "d",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnUDM",
                order: 12,
                text: "수정일자",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainColumnUUI",
                order: 13,
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
                    if (oColumn.getHeader().getText() === "partCategoryMgt") {
                        return "partCategoryMgt (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnCom") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
