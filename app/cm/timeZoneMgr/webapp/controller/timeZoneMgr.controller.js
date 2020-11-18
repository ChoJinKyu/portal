sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/ManagedListModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/table/TablePersoController",
  //"../model/formatter",
  "./timeZonePersoService"
],
  function (
    BaseController,
    JSONModel,
    ManagedListModel,
    Filter,
    FilterOperator,
    MessageToast,
    MessageBox,
    TablePersoController,
    //formatter,
    timeZonePersoService) {
    "use strict";

    return BaseController.extend("cm.timeZoneMgr.controller.timeZoneMgr", {

      //formatter: formatter,

      onInit: function () {
        this.getView().setModel(new ManagedListModel(), "list");
        // 개인화 - UI 테이블의 경우만 해당
        this._oTPC = new TablePersoController({
          customDataKey: "timeZoneMgr",
          persoService: timeZonePersoService
          // persoService: {
          //   getPersData: function () {
          //     var oDeferred = new $.Deferred();
          //     return oDeferred.promise();
          //   },
          //   setPersData: function (oBundle) {
          //     var oDeferred = new $.Deferred();
          //     oDeferred.resolve();
          //     return oDeferred.promise();
          //   },
          //   delPersData: function () {
          //     var oDeferred = new $.Deferred();
          //     oDeferred.resolve();
          //     return oDeferred.promise();
          //   }
          // }
        }).setTable(this.byId("mainTable"));
      },
      onMainTablePersoButtonPressed: function (event) {
        this._oTPC.openDialog();
      },
      // Display row number without changing data
      onAfterRendering: function () {
        this.onSearch();
      },
      onSearch: function () {
        var predicates = [];
        if (!!this.byId("searchTenantCombo").getSelectedKey()) predicates.push(new Filter("tenant_id", FilterOperator.Contains, this.byId("searchTenantCombo").getSelectedKey()));
        if (!!this.byId("searchTimeZoneCombo").getSelectedKey()) predicates.push(new Filter("timezone_code", FilterOperator.Contains, this.byId("searchTimeZoneCombo").getSelectedKey()));
        if (!!this.byId("searchCountryCombo").getSelectedKey()) predicates.push(new Filter("country_code", FilterOperator.Contains, this.byId("searchCountryCombo").getSelectedKey()));
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
      onAdd: function () {
        var [tId, mName, aCol] = arguments;
        var model = this.getView().getModel(mName);
        // 레코드추가
        model.addRecord(aCol.reduce((function (acc, col) {
          acc[col] = (this || {})[0][col] || "";
          return acc;
        }).bind(model.getData()), {
          "local_create_dtm": new Date(),
          "local_update_dtm": new Date()
        }), 0);
      },
      onSave: function () {
        var [tId, mName] = arguments;
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
          onClose: (function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              view.setBusy(true);
              model.submitChanges({
                success: (function (oEvent) {
                  view.setBusy(false);
                  MessageToast.show("Success to save.");
                  this.onSearch();
                }).bind(this)
              });
            }
          }).bind(this)
        })
      }
    });
  }
);