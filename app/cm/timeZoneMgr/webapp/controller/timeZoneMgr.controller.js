sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "ext/lib/model/ManagedListModel",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/FilterType",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/format/DateFormat",
  "sap/ui/model/ChangeReason"
],
  function (Controller, ManagedListModel, Fragment, JSONModel, Filter, FilterOperator, FilterType, MessageToast, MessageBox, DateFormat, ChangeReason) {
    "use strict";

    return Controller.extend("cm.timeZoneMgr.controller.timeZoneMgr", {
      onInit: function () {
        this.getView().setModel(new ManagedListModel(), "list");
        this.onSearch();
      },
      // Display row number without changing data
      onAfterRendering: function () {
      },
      onSearch: function () {
        var predicates = [];
        if (!!this.byId("searchTenantCombo").getSelectedKey()) predicates.push(new Filter("tenant_id", FilterOperator.Contains, this.byId("searchTenantCombo").getSelectedKey()));
        if (!!this.byId("searchTimeZoneCombo").getSelectedKey()) predicates.push(new Filter("timezone_code", FilterOperator.Contains, this.byId("searchTimeZoneCombo").getSelectedKey()));
        this.getView()
          .setBusy(true)
          .getModel("list")
          .setTransactionModel(this.getView().getModel())
          .read("/TimeZone", {
            filters: predicates,
            success: (function (oData) {
              this.getView().setBusy(false);
            }).bind(this)
          });
      },
      onDelete: function () {
        var [tId, mName] = arguments;
        var table = this.byId(tId);
        var model = this.getView().getModel(mName);
        var rows = model.getData();
        table
          .getSelectedIndices()
          .reverse()
          // 1. 삭제표시
          .map(function (idx) {
            if (rows[idx]["_row_state_"] != "C") {
              model.markRemoved(idx);
            }
            return idx;
          })
          // 2. 생성 후 삭제(화면에서 사라짐)
          .forEach(function (idx) {
            if (rows[idx]["_row_state_"] == "C") {
              rows.splice(idx, 1);
              model.refresh();
            }
          });
        table
          .clearSelection()
          .removeSelections(true);
      },
      onCreate: function () {
        var [tId, mName, aCol] = arguments;
        var table = this.byId(tId);
        var model = this.getView().getModel(mName);
        // 레코드추가
        model.addRecord(aCol.reduce((function (acc, col) {
          acc[col] = (this || {})[0][col] || "";
          return acc;
        }).bind(model.getData()), {}), 0);
      }
    });
  });