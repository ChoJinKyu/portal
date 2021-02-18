sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "partCategoryMgt-mainList-mainCategoryCodeColumn",
                order: 0,
                text: "Category 코드",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainSequenceColumn",
                order: 1,
                text: "Sequence",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainCategoryNameColumn",
                order: 2,
                text: "Category 명",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainCategoryGroupColumn",
                order: 3,
                text: "Category 그룹",
                visible: true
            },
            {
                id: "partCategoryMgt-mainList-mainCategoryGroupNameColumn",
                order: 4,
                text: "Category Group 명",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainActiveFlagColumn",
                order: 5,
                text: "상태",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainUpdateUserIdColumn",
                order: 6,
                text: "수정사용자ID",
                visible: true
            },            
            {
                id: "partCategoryMgt-mainList-mainLocalUpdateDtmColumn",
                order: 7,
                text: "로컬변경일시",
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
                if (sId.indexOf("mainCategoryCodeColumn") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
