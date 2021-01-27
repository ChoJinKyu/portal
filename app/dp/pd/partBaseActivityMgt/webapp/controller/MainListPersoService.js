sap.ui.define(["jquery.sap.global"],
    function (jQuery) {
        "use strict";
        var i = 0;            
        var _columns = [           
            {
                id: "partBaseActivityMgt-mainList-mainColumnCompany",
                order: i++,
                text: "Company",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnOrg",
                order: i++,
                text: "조직코드",
                visible: true
            },            
            {
                id: "partBaseActivityMgt-mainList-mainColumnPartProjectType",
                order: i++,
                text: "Project Type",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnActivity",
                order: i++,
                text: "Activity 명",
                visible: true
            },            
            {
                id: "partBaseActivityMgt-mainList-mainColumnDevelopeEvent",
                order: i++,
                text: "EVENT",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnActualRole",
                order: i++,
                text: "역할",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnAttachmentMandatory",
                order: i++,
                text: "산출물 필수",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnApproveMandatory",
                order: i++,
                text: "결재 필수",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnActivityCompleteType",
                order: i++,
                text: "Activity 완료 유형",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnJobType",
                order: i++,
                text: "업무 유형",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnLocalUpdateDtm",
                order: i++,
                text: "수정일시",
                visible: true
            },
            {
                id: "partBaseActivityMgt-mainList-mainColumnUpdateUserId",
                order: i++,
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
                    if (oColumn.getHeader().getText() === "Company") {
                        return "Company (Important!)";
                    }
                }
                return null;
            },

            getGroup: function (oColumn) {
                var sId = oColumn.getId();
                if (sId.indexOf("mainColumnCompany") != -1 ||
                    sId.indexOf("mainColumnOrg") != -1 ||
					sId.indexOf("mainColumnPartProjectType") != -1 ||
					sId.indexOf("mainColumnActivity") != -1) {
                    return "Columns of Key";
                }
                return "Others";
            }
        };

        MainListPersoService.delPersData = MainListPersoService.resetPersData;
        return MainListPersoService;

    });
