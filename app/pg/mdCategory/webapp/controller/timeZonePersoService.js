sap.ui.define(["jquery.sap.global"],
  function (jQuery) {
    "use strict";
    var i = 0;
    var _columns = [
      {
        id: "mdCategory-mainTable-mainStateColumn",
        order: i++,
        text: "S",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainTimezoneCodeColumn",
        order: i++,
        text: "코드",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainTimezoneNameColumn",
        order: i++,
        text: "타임존",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainCountryCodeColumn",
        order: i++,
        text: "국가",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainGmtOffsetColumn",
        order: i++,
        text: "GMT",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstFlagColumn",
        order: i++,
        text: "서머타임-적용여부",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstStartMonthColumn",
        order: i++,
        text: "서머타임시작-월",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstStartDayColumn",
        order: i++,
        text: "서머타임시작-일",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstStartWeekColumn",
        order: i++,
        text: "서머타임시작-주",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstStartDayOfWeekColumn",
        order: i++,
        text: "서머타임시작-요일",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstStartTimeRateColumn",
        order: i++,
        text: "서머타임시작-시간",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstEndMonthColumn",
        order: i++,
        text: "서머타임종료-월",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstEndDayColumn",
        order: i++,
        text: "서머타임종료-일",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstEndWeekColumn",
        order: i++,
        text: "서머타임종료-주",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstEndDayOfWeekColumn",
        order: i++,
        text: "서머타임종료-요일",
        visible: true
      },
      {
        id: "mdCategory-mainTable-mainDstEndTimeRateColumn",
        order: i++,
        text: "시간",
        visible: true
      }
    ];
    // Very simple page-context personalization
    // persistence service, not for productive use!
    var timeZornPersoService = {

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
        if (sId.indexOf("listMainColumnChainCode") != -1 ||
          sId.indexOf("listMainColumnLanguageCode") != -1 ||
          sId.indexOf("listMainColumnMessageCode") != -1) {
          return "Keys";
        }
        return "Others";
      }
      // getPersData() : jQuery Promise (http://api.jquery.com/promise/)
      // setPersData(oBundle) : jQuery Promise (http://api.jquery.com/promise/)
      // delPersData() : jQuery Promise (http://api.jquery.com/promise/)
    };

    // UI
    timeZornPersoService.delPersData = timeZornPersoService.resetPersData;
    return timeZornPersoService;
  }
);
