sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";

        var _columns = [
            {
                id: "forexDeclarationMgt-mainTable-mainPoNumber",
                order: 0,
                text: "PO번호",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPoName",
                order: 1,
                text: "PO명",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPlantName",
                order: 2,
                text: "플랜트",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainCurrencyName",
                order: 3,
                text: "통화",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPoAmount",
                order: 4,
                text: "PO금액",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPrepayAmount",
                order: 5,
                text: "선급금액",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainSupplierName",
                order: 6,
                text: "협력사",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPoDate",
                order: 7,
                text: "PO일자",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainReceiptScheduledDate",
                order: 8,
                text: "입고예정일자",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainReceiptDate",
                order: 9,
                text: "입고일자",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainDeclareScheduledDate",
                order: 10,
                text: "신고예정일자",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainDeclareDate",
                order: 11,
                text: "신고일자",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainManagementTargetFlag",
                order: 12,
                text: "관리대상여부",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainDeclareTargetFlag",
                order: 13,
                text: "신고대상여부",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainForexDeclareStatusName",
                order: 14,
                text: "진행상태",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainPurchasingDepartmentName",
                order: 15,
                text: "구매담당부서",
                visible: true
            },
            {
                id: "forexDeclarationMgt-mainTable-mainBuyerName",
                order: 16,
                text: "구매담당자",
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

        MainListPersoService.delPersData = MainListPersoService.resetPersData;
        return MainListPersoService;

    });
