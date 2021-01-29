sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [
            {
                id: "ucContractMgt-mainTable-mainDocumentNo",
                order: i++,
                text: "단기계약그룹번호",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainDegree",
                order: i++,
                text: "차수",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainTitle",
                order: i++,
                text: "계약명",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainItemClass",
                order: i++,
                text: "대분류(공종)",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainSupplierName",
                order: i++,
                text: "협력사명",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainStartDate",
                order: i++,
                text: "계약시작일자",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainEndDate",
                order: i++,
                text: "계약종료일자",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainStatusCode",
                order: i++,
                text: "계약진행상태",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainEffectiveStatusName",
                order: i++,
                text: "계약유효상태",
                visible: true
            },
            {
                id: "ucContractMgt-mainTable-mainDayCount",
                order: i++,
                text: "계약일수",
                visible: true
            }         
        ];
        // Very simple page-context personalization
        // persistence service, not for productive use!
        var UcContractListPersoService = {

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

        UcContractListPersoService.delPersData = UcContractListPersoService.resetPersData;
        return UcContractListPersoService;

    });
