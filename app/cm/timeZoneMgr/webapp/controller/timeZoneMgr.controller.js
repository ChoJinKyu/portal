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
          // 삭제
          .forEach(function (idx) {
            model.markRemoved(idx);
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
        }).bind(model.getData()), {
          "local_create_dtm": new Date(),
          "local_update_dtm": new Date(),
        }), 0);
      },
      onSave: function () {
        var [tId, mName] = arguments;
        var table = this.byId(tId);
        var view = this.getView();
        var model = view.getModel(mName);
        // Validation
        if (model.getChanges() <= 0) {
          MessageBox.alert("변경사항이 없습니다.");
          reutn;
        }
        MessageBox.confirm("Are you sure ?", {
          title: "Comfirmation",
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                success: function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show("Success to save.");
                }
              });
            };
          }
        });
      }
    });
  });