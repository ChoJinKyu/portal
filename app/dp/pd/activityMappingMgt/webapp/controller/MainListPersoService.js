sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "activityMappingMgt-mainList-mainColumnstat",
                order: 0,
                text: "state",
                visible: false
            },
            {
                id: "activityMappingMgt-mainList-mainColumnBizUnit",
                order: 1,
                text: "사업본부",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnPAC",
                order: 2,
                text: "Product Activity Code",
                visible: true
            },
            {
                id: "activityMappingMgt-mainList-mainColumnPACN",
                order: 3,
                text: "Product Activity Code명",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnDependency",
                order: 4,
                text: "종속유형",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnAC",
                order: 5,
                text: "Activity Code",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnACN",
                order: 6,
                text: "Activity Code명",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnUDT",
                order: 7,
                text: "수정일자",
                visible: true
            },            
            {
                id: "activityMappingMgt-mainList-mainColumnUDU",
                order: 8,
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
                    if (oColumn.getHeader().getText() === "activityMappingMgt") {
                        return "activityMappingMgt (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnBizUnit") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        return MainListPersoService;

    });
