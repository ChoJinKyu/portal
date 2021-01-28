sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/model/TransactionManager",
  "ext/lib/model/ManagedModel",
  "ext/lib/model/ManagedListModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/m/ColumnListItem",
  "sap/m/ObjectIdentifier",
  "sap/m/Text",
  "sap/m/Input",
  "sap/m/ComboBox",
  "sap/ui/core/Item",
], function (BaseController, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
  Filter, FilterOperator, Fragment, MessageBox, MessageToast,
  ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {

  "use strict";

  var oTransactionManager;

  return BaseController.extend("cm.controlOptionMgt.controller.MidObject", {

    dateFormatter: DateFormatter,

    formatter: (function () {
      return {
        toYesNo: function (oData) {
          return oData === true ? "YES" : "NO"
        },
      }
    })(),

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */
    onSelectionChange: function () {
        var [event, field] = arguments;
        let combo, key = this.getModel("details").getProperty(event.getSource().mBindingInfos.selectedKey.binding.oContext.sPath)[field];
        this["onSelectionChange"][field] = key;
        // 제어옵션레벨코드
        if (field == "control_option_level_code") {
            // 조직유형코드
            combo = event.getSource().getParent().getCells()[2];
            combo.setEnabled(key === "O");
            key != "O" && combo.setSelectedKey();
            key == "T" && event.getSource().getParent().getCells()[3].getItems()[1].setValue("Default");
        }
        // 조직유형코드
        else if (field == "org_type_code") {
            // 제어옵션레벨값
            //if (key !== "O") return ;
            if (!key) return ;
            combo = event.getSource().getParent().getCells()[3].getItems()[0];
            combo.clearSelection();
            combo.bindItems({
                path: 'org>/organization',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, "L2100"),
                    new Filter('type', FilterOperator.EQ, key)
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>code}", text: "{org>code}"
                })
            });
        }
    },

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
    onInit: function () {
      // combo count
      this.getOwnerComponent().getModel("org").setSizeLimit(1000);

      // Model used to manipulate controlstates. The chosen values make sure,
      // detail page shows busy indication immediately so there is no break in
      // between the busy indication for loading the view's meta data
      var oViewModel = new JSONModel({
        busy: true,
        delay: 0,
        screen: "",
        editMode: ""
      });
      this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
      this.setModel(oViewModel, "midObjectView");

      this.setModel(new ManagedModel(), "master");
      this.setModel(new ManagedListModel(), "details");

      oTransactionManager = new TransactionManager();
      oTransactionManager.addDataModel(this.getModel("master"));
      oTransactionManager.addDataModel(this.getModel("details"));

      this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

      this._initTableTemplates();
      this.enableMessagePopover();
    },

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */
		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
    onPageEnterFullScreenButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        tenantId: this._sTenantId,
        controlOptionCode: this._sControlOptionCode
      });
      this.getModel("midObjectView").setProperty("/screen", "Full");
    },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
    onPageExitFullScreenButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        tenantId: this._sTenantId,
        controlOptionCode: this._sControlOptionCode
      });
      this.getModel("midObjectView").setProperty("/screen", "");
    },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
    onPageNavBackButtonPress: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
      this.getRouter().navTo("mainPage", { layout: sNextLayout });
    },

		/**
		 * Event handler for page edit button press
		 * @public
		 */
    onPageEditButtonPress: function () {
      this._toEditMode();
    },

		/**
		 * Event handler for delete page entity
		 * @public
		 */
    onPageDeleteButtonPress: function () {
      var oView = this.getView(),
        oMasterModel = this.getModel("master"),
        that = this;
      MessageBox.confirm("Are you sure to delete this control option and details?", {
        title: "Comfirmation",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            oView.setBusy(true);
            oMasterModel.removeData();
            oMasterModel.setTransactionModel(that.getModel());
            oMasterModel.submitChanges({
              success: function (ok) {
                oView.setBusy(false);
                that.onPageNavBackButtonPress.call(that);
                MessageToast.show("Success to delete.");
              }
            });
          };
        }
      });
    },

    onAdd: function () {
      var oTable = this.byId("midTable"),
        oDetailsModel = this.getModel("details");

      var transition = function (f) {
        return function (v) {
          return f(v);
        };
      };

      var utc = transition(function (lDate) {
        var yyyy = lDate.getFullYear() + "";
        var mm = lDate.getMonth() + 1 + "";
        var dd = lDate.getDate() + "";
        var hh = lDate.getHours() + "";
        var mi = lDate.getHours() + "";
        var ss = lDate.getSeconds() + "";
        // YYYY-MM-DDTHH:mm:ss.sssZ
        return new Date([
          yyyy,
          mm.length == 1 ? "0" + mm : mm,
          dd.length == 1 ? "0" + dd : dd
        ].join("-") + (function () {
          if (!hh && !mi && !ss) {
            return "";
          }
          return "T" + [
            hh.length == 1 ? "0" + hh : hh,
            mi.length == 1 ? "0" + mi : mi,
            ss.length == 1 ? "0" + ss : ss,
          ].join(":");
        })());
      });
      // Lock 설정
      oTable.data("lock", true);
      // Record 추가
      oDetailsModel.addRecord({
        "tenant_id": this._sTenantId || "",
        "control_option_code": this._sControlOptionCode || "",
        // "control_option_level_code": "",
        "org_type_code": "",
        // "control_option_level_val": "",
        // "control_option_val": "",
        "start_date": utc(new Date()),
        "end_date": utc(new Date()),
        "local_create_dtm": utc(new Date()),
        "local_update_dtm": utc(new Date())
      }, 0);
    
      // Lock 해제
      setTimeout((function() {
        oTable.data("lock", false);
      }).bind(this), 500);
    //   // Item 추가
    //   setTimeout((function() {
    //     var columns = oTable.getColumns();
    //     var row = oTable.getItems()[0/*oDetailsModel.getCreatedRecords().length - 1*/];
    //     var cells = row.getCells();
    //     var key;
    //     ///////////////////////////////////////////////////
    //     // 제어옵션레벨코드
    //     ///////////////////////////////////////////////////
    //     key = cells[1].getSelectedKey();
    //     !!cells[1].getFirstItem().getKey()
    //     &&
    //     cells[1]
    //           .insertItem(new Item({ key: "", text: "선택하세요" }), 0);
    //     cells[1]
    //           .setSelectedItemId(cells[1].getFirstItem().getId());
    //     setTimeout((function(){
    //         key && cells[1].setSelectedKey(key);
    //     }).bind(this), 0);
    //     ///////////////////////////////////////////////////
    //     // 조직유형
    //     ///////////////////////////////////////////////////
    //     key = cells[2].getSelectedKey();
    //     !!cells[2].getFirstItem().getKey()
    //     &&
    //     cells[2]
    //           .insertItem(new Item({ key: "*", text: "전체[*]" }), 0)
    //           .insertItem(new Item({ key: "", text: "선택하세요" }), 0);
    //     cells[2]
    //           .setSelectedItemId(cells[2].getFirstItem().getId());
    //     setTimeout((function(){
    //         key && cells[2].setSelectedKey(key);
    //     }).bind(this), 0);
    //     ///////////////////////////////////////////////////
    //     // 제어옵션레벨값
    //     ///////////////////////////////////////////////////
    //     key = cells[3].getItems()[0].getSelectedKey();
    //     !!cells[3].getItems()[0].getFirstItem().getKey()
    //     &&
    //     cells[3]
    //           .getItems()[0].insertItem(new Item({ key: "", text: "선택하세요" }), 0);
    //     cells[3]
    //           .getItems()[0].setSelectedItemId(cells[3].getItems()[0].getFirstItem().getId());
    //     setTimeout((function(){
    //         key && cells[3].getItems()[0].setSelectedKey(key);
    //     }).bind(this), 0);
    //   }).bind(this), 500);
    },

    onMidTableDeleteButtonPress: function () {
      var [tId, mName, sEntity] = arguments;
      var table = this.byId(tId);
      var model = this.getView().getModel(mName);

      // lock
      table.data("lock", true);

      //debugger;
      table
        .getSelectedItems()
        .map(item => model.getData()[sEntity].indexOf(item.getBindingContext("details").getObject()))
        //.getSelectedIndices()
        .reverse()
        // 삭제
        .forEach(function (idx) {
          model.markRemoved(idx);
        });
      table
        //.clearSelection()
        .removeSelections(true);

      // unlock
      setTimeout((function() {
        table.data("lock", false);
      }).bind(this), 500)
    },

    /**
     * Event handler for saving page changes
     * @public
     */
    onPageSaveButtonPress: function () {
      var view = this.getView(),
        master = view.getModel("master"),
        detail = view.getModel("details"),
        length,
        that = this;

      console.log(">>> detail", detail.getData());

      // Validation
      if (!master.getData()["chain_code"]) {
        MessageBox.alert("Chain을 입력하세요");
        return;
      }
      if (!master.getData()["tenant_id"]) {
        MessageBox.alert("테넌트를 입력하세요");
        return;
      }
      if (!master.getData()["control_option_code"]) {
        MessageBox.alert("제어옵션코드를 입력하세요");
        return;
      }
      if (!master.getData()["control_option_name"]) {
        MessageBox.alert("제어옵션명을 입력하세요");
        return;
      }
      if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
        MessageBox.alert("변경사항이 없습니다.");
        return;
      }
      // Set Details (New)
      if (master.getData()["_state_"] == "C") {
        detail.getData()["ControlOptionDetails"].map(r => {
          r["tenant_id"] = master.getData()["tenant_id"];
          r["control_option_code"] = master.getData()["control_option_code"];
          return r;
        });
      }
    //   length = detail.getData()["ControlOptionDetails"].length
    //   && 
    //   detail.getData()["ControlOptionDetails"].map(r => {
    //     if (r["_row_state_"] == "C") {
    //       r["tenant_id"] = master.getData()["tenant_id"];
    //       r["control_option_code"] = master.getData()["control_option_code"];
    //     }
    //     if (r["control_option_level_code"] == "O") {
    //         r["org_type_code"] = "*";
    //     }
    //     return r;
    //   });
      // transaction
      MessageBox.confirm("Are you sure ?", {
        title: "Comfirmation",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            view.setBusy(true);
            oTransactionManager.submit({
              success: function (ok) {
                that._toShowMode();
                view.setBusy(false);
                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                MessageToast.show("Success to save.");
              }
            });
          };
        }
      });

    },

    /**
     * Event handler for cancel page editing
     * @public
     */
    onPageCancelEditButtonPress: function () {
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        this.onPageNavBackButtonPress.call(this);
      } else {
        this._toShowMode();
        // ljh - 재조회
        this.getModel("details")
          .setTransactionModel(this.getModel())
          .read("/ControlOptionDetails", {
            filters: [
              new Filter("tenant_id", FilterOperator.EQ, this._sTenantId || "XXXXX"),
              new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode)
            ],
            success: function (oData) {
            }
          });
      }
    },

    /* =========================================================== */
    /* internal methods                                            */
    /* =========================================================== */

    _onMasterDataChanged: function (oEvent) {
      if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        var oMasterModel = this.getModel("master");
        var oDetailsModel = this.getModel("details");
        var sTenantId = oMasterModel.getProperty("/tenant_id");
        var sControlOPtionCode = oMasterModel.getProperty("/control_option_code");
        var oDetailsData = oDetailsModel.getData();
        oDetailsData.forEach(function (oItem, nIndex) {
          oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
          oDetailsModel.setProperty("/" + nIndex + "/control_option_code", sControlOPtionCode);
        });
        oDetailsModel.setData(oDetailsData);
      }
    },

    /**
     * When it routed to this page from the other page.
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
     * @private
     */
    _onRoutedThisPage: function (oEvent) {
      var oArgs = oEvent.getParameter("arguments"),
        oView = this.getView();
      this._sTenantId = oArgs.tenantId;
      this._sControlOptionCode = oArgs.controlOptionCode;
      if (oArgs.tenantId == "new" && oArgs.controlOptionCode == "code") {
        //It comes Add button pressed from the before page.
        this.getModel("midObjectView").setProperty("/isAddedMode", true);

        var oMasterModel = this.getModel("master");
        oMasterModel.setData({
          "tenant_id": "L2100",
          "chain_code": "",
          "control_option_code": "",
          "control_option_name": "",
          "group_code": "",
          "local_create_dtm": new Date(),
          "local_update_dtm": new Date()
        }, "/ControlOptionMasters", 0);

        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/ControlOptionDetails", {
          filters: [
            new Filter("tenant_id", FilterOperator.EQ, "XXXXX"),
          ],
          success: (function (oData) {
            this.byId()
          }).bind(this)
        });

        this._toEditMode();
      }
      else {
        this.getModel("midObjectView").setProperty("/isAddedMode", false);

        this._bindView("/ControlOptionMasters(tenant_id='" + this._sTenantId + "',control_option_code='" + this._sControlOptionCode + "')");
        oView.setBusy(true);
        var oDetailsModel = this.getModel("details");
        oDetailsModel.setTransactionModel(this.getModel());
        oDetailsModel.read("/ControlOptionDetails", {
          filters: [
            new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
            new Filter("control_option_code", FilterOperator.EQ, this._sControlOptionCode),
          ],
          success: (function (oData) {
            oView.setBusy(false);
          }).bind(this)
        });
        this._toShowMode();
      }
      oTransactionManager.setServiceModel(this.getModel());
    },

    /**
     * Binds the view to the object path.
     * @function
     * @param {string} sObjectPath path to the object to be bound
     * @private
     */
    _bindView: function (sObjectPath) {
      var oView = this.getView(),
        oMasterModel = this.getModel("master");
      oView.setBusy(true);
      oMasterModel.setTransactionModel(this.getModel());
      oMasterModel.read(sObjectPath, {
        success: function (oData) {
          oView.setBusy(false);
        }
      });
    },

    _toEditMode: function () {
      var FALSE = false;
      this._showFormFragment('MidObject_Edit');
      this.byId("page").setSelectedSection("pageSectionMain");
      //this.byId("page").setProperty("showFooter", !FALSE);
      this.byId("pageEditButton").setEnabled(FALSE);
      this.byId("pageDeleteButton").setEnabled(FALSE);
      this.byId("pageNavBackButton").setEnabled(FALSE);

      this.byId("midTableAddButton").setEnabled(!FALSE);
      this.byId("midTableDeleteButton").setEnabled(!FALSE);
      //this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
      //this._bindMidTable(this.oEditableTemplate, "Edit");
    },

    _toShowMode: function () {
      var TRUE = true;
      this._showFormFragment('MidObject_Show');
      this.byId("page").setSelectedSection("pageSectionMain");
      //this.byId("page").setProperty("showFooter", !TRUE);
      this.byId("pageEditButton").setEnabled(TRUE);
      this.byId("pageDeleteButton").setEnabled(TRUE);
      this.byId("pageNavBackButton").setEnabled(TRUE);

      this.byId("midTableAddButton").setEnabled(!TRUE);
      this.byId("midTableDeleteButton").setEnabled(!TRUE);
      //this.byId("midTable").setMode(sap.m.ListMode.None);
      //this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
    },

    _initTableTemplates: function () {
      this.oReadOnlyTemplate = new ColumnListItem({
        cells: [
          new Text({
            text: "{details>_row_state_}"
          }),
          new ObjectIdentifier({
            text: "{details>control_option_code}"
          }),
          new ObjectIdentifier({
            text: "{details>control_option_level_code}"
          }),
          new Text({
            text: "{details>control_option_level_val}"
          }),
          new Text({
            text: "{details>control_option_val}"
          })
        ],
        type: sap.m.ListType.Inactive
      });
    },

    _bindMidTable: function (oTemplate, sKeyboardMode) {
      this.byId("midTable").bindItems({
        path: "details>/ControlOptionDetails",
        template: oTemplate
      }).setKeyboardMode(sKeyboardMode);
    },

    _oFragments: {},
    _showFormFragment: function (sFragmentName) {
      var oPageSubSection = this.byId("pageSubSection1");
      this._loadFragment(sFragmentName, function (oFragment) {
        oPageSubSection.removeAllBlocks();
        oPageSubSection.addBlock(oFragment);
      })
    },
    _loadFragment: function (sFragmentName, oHandler) {
      if (!this._oFragments[sFragmentName]) {
        Fragment.load({
          id: this.getView().getId(),
          name: "cm.controlOptionMgt.view." + sFragmentName,
          controller: this
        }).then(function (oFragment) {
          this._oFragments[sFragmentName] = oFragment;
          if (oHandler) oHandler(oFragment);
        }.bind(this));
      } else {
        if (oHandler) oHandler(this._oFragments[sFragmentName]);
      }
    },
    onMidTableUpdateFinished: function(event, tId, mName) {
        // Item 존재시에만, Lock 상태에서는 미처리
        if (event.getParameters().total <= 0 || event.getSource().data("lock")) return ;
        // Aggregations
        var table = event.getSource();
        var columns = table.getColumns();
        var rows = table.getItems();
        // Setting - Combo
        rows.forEach((function(row, r) {
            columns.forEach((function(column, c){
                let combo, 
                    record = row.getModel(mName).getProperty(row.getBindingContextPath()),
                    key, 
                    customData = column.getCustomData()[0] || "",
                    field = customData ? column.getCustomData()[0].getValue()["sap.ui.core.CustomData"]["field"] : "";

                field 
                && 
                (function() {
                    if (tId != 'midTable') {
                        return false;
                    }
                    // 조직유형코드
                    if (field == "org_type_code") {
                        // Source
                        combo = row.getCells()[c];
                        key = row.getCells()[c].getSelectedKey();
                        // Target - 제어옵션레벨값
                        combo = row.getCells()[
                            columns.findIndex(function(column) {
                                return (
                                    column.getCustomData()[0] 
                                    && 
                                    column.getCustomData()[0].getValue()["sap.ui.core.CustomData"]["field"] 
                                ) == "control_option_level_val"
                            })
                        ].getItems()[0];
                        // 재조회
                        combo.bindItems({
                            path: 'org>/organization',
                            filters: [
                                new Filter('tenant_id', FilterOperator.EQ, record["tenant_id"] || "L2100"),
                                new Filter('type', FilterOperator.EQ, key)
                            ].filter(f => f.oValue1 || f.oValue2),
                            template: new Item({
                                key: "{org>code}", text: "{org>code}"
                            })
                        });
                    }
                    return true;
                }).call(this)
            }).bind(this));
        }).bind(this));
    }
  });
});