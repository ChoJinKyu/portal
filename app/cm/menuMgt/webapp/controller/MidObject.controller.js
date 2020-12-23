sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/ValidatorUtil",
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
], function (BaseController, ValidatorUtil, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
  Filter, FilterOperator, Fragment, MessageBox, MessageToast,
  ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {

  "use strict";

  var oTransactionManager = Symbol();

  return BaseController.extend("cm.menuMgt.controller.MidObject", {

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
    selectionChange: function (event) {
      var combo = event.getSource().getParent().getCells()[3].getItems()[0];
      combo.clearSelection();
      combo.bindItems({
        path: 'org>/organization',
        filters: [
          new Filter('type', FilterOperator.EQ, event.getSource().getSelectedKey())
        ],
        template: new Item({
          key: "{org>code}", text: "{org>code}"
        })
      });
    },

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
    onInit: function () {

      // MidObject
      this.getView().setModel(new JSONModel({
        busy: true,
        delay: 0,
        screen: "",
        editMode: "",
        menuCode: "",
        menuName: "",
        mode: "R" // C, R, U, D
      }), "midObjectView");

      // 메뉴레벨
      this.getView().setModel(new JSONModel({
        items: [
          {
            level: 1
          },
          {
            level: 2
          },
          {
            level: 3
          },
          {
            level: 4
          },
        ]
      }), "menu_level");

      // Master
      this.setModel(new ManagedModel(), "master");

      // Languages
      this.setModel(new ManagedListModel(), "details");

      // TransactionManager - 일괄처리
      this[oTransactionManager] = new TransactionManager();
      this[oTransactionManager].addDataModel(this.getModel("master"));
      this[oTransactionManager].addDataModel(this.getModel("details"));
      this[oTransactionManager].setServiceModel(this.getOwnerComponent().getModel());

      // Router 에서 "pattern": "midObject/{layout}/{?query}" 인 경우마다 System Callback
      this
        .getRouter()
        .getRoute("midPage")
        .attachPatternMatched(
          function (oEvent) {
            var { menuCode, menuName, parentMenuCode } = oEvent.getParameter("arguments")["?query"];
            console.log(">>>>>> params", menuCode, menuName, parentMenuCode);
            this.getModel("midObjectView").setProperty("/mode", (!menuCode ? "C" : "R"));
            this.getModel("midObjectView").setProperty("/menuCode", menuCode);
            this.getModel("midObjectView").setProperty("/menuName", menuName);
            this.getModel("midObjectView").setProperty("/parentMenuCode", parentMenuCode);
            //this.getModel("midObjectView").setProperty("/mode", "R");
            // 신규(C)
            if (!menuCode) {
              this
                .getModel("master")
                .setData($.extend({
                  "tenant_id": "L2100",
                  "menu_code": "",
                  "chain_code": "CM",
                  "menu_display_flag": true,
                  "use_flag": true,
                  "local_create_dtm": new Date(),
                  "local_update_dtm": new Date()
                }, !!parentMenuCode ? { "parent_menu_code": parentMenuCode } : {}), "/Menu", false);
            }
            // 수정(U) 및 삭제(D)
            else /*if (!!menuCode)*/ {
              // menu
              this
                .getView()
                .setBusy(true)
                .getModel("master")
                .setTransactionModel(this.getOwnerComponent().getModel())
                .readP("/Menu", {
                  filters: [
                    // 조회조건
                    new Filter("menu_code", FilterOperator.EQ, menuCode)
                  ]
                })
                // 성공시
                .then((function (oData) {
                  this.getModel("master").setData(oData.results[0]);
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                  this.getView().setBusy(false);
                }).bind(this));
            }

            // languages
            this
              .getView()
              .setBusy(true)
              .getModel("details")
              .setTransactionModel(this.getOwnerComponent().getModel())
              .readP("/MenuLng", {
                filters: [
                  // 조회조건 - 일단 신규인 경우도 "99999" 를 던짐
                  new Filter("menu_code", FilterOperator.EQ, menuCode || "99999")
                ]
              })
              // 성공시
              .then((function (oData) {
              }).bind(this))
              // 실패시
              .catch(function (oError) {
              })
              // 모래시계해제
              .finally((function () {
                this.getView().setBusy(false);
              }).bind(this));
          }, this);

      // 하단의 Message 처리를 위함
      this.enableMessagePopover();
    },

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */
    /**
     * Event handler for Enter Full Screen Button pressed
     * @public
     */
    onFull: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        "?query": {
          menuCode: "",
          menuName: ""
        }
      });
    },
    /**
     * Event handler for Exit Full Screen Button pressed
     * @public
     */
    onExit: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
      this.getRouter().navTo("midPage", {
        layout: sNextLayout,
        "?query": {
          menuCode: "",
          menuName: ""
        }
      });
    },
    /**
     * Event handler for Nav Back Button pressed
     * @public
     */
    onNavBack: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
      this.getRouter().navTo("menuMgt", { layout: sNextLayout });
    },
    /**
     * Event handler for page edit button press
     * @public
     */
    onPageEdit: function () {
      this.getModel("midObjectView").setProperty("/mode", "U");
    },
    /**
     * Event handler for delete page entity
     * @public
     */
    onPageDelete: function () {
      var oView = this.getView(),
        oMasterModel = this.getModel("master"),
        that = this;
      MessageBox.confirm("메뉴정보를 삭제하시겠습니까?", {
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
                that.onNavBack.call(that);
                MessageToast.show("Success to delete.");
              }
            });
          };
        }
      });
    },
    /**
     * 리스트 레코드 추가
     * @public
     */
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

      oDetailsModel.addRecord({
        "tenant_id": "L2100",
        "language_code": "KO",
        "menu_name": "",
        "local_create_dtm": utc(new Date()),
        "local_update_dtm": utc(new Date())
      }, 0);

    },

    onDelete: function () {
      var [tId, mName, sEntity] = arguments;
      var table = this.byId(tId);
      var model = this.getView().getModel(mName);

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
    },

    /**
     * Event handler for saving page changes
     * @public
     */
    onSave: function () {

      var view = this.getView(),
        master = view.getModel("master"),
        detail = view.getModel("details"),
        that = this;

      // Validation
      if (!master.getData()["chain_code"]) {
        MessageBox.alert("Chain을 입력하세요");
        return;
      }
    //   if (!master.getData()["menu_code"]) {
    //     MessageBox.alert("테넌트를 입력하세요");
    //     return;
    //   }
    //   if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
    //     MessageBox.alert("변경사항이 없습니다.");
    //     return;
    //   }
      // Set Details (New)
      detail.getData()["MenuLng"].map(r => {
        if (r["_row_state_"] == "C") {
          r["tenant_id"] = master.getData()["tenant_id"];
          r["menu_code"] = master.getData()["menu_code"];
        }
        return r;
      });

      MessageBox.confirm("Are you sure ?", {
        title: "Comfirmation",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            view.setBusy(true);
            that[oTransactionManager].submit({
              success: function (ok) {
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
    onCancel: function () {
      // 신규("C"), 조회("R") 취소의 경우는 mainPage 로 복귀
      this.onNavBack.call(this);

      // 변경("U") 취소의 경우 초기화 : onInit 에서 등록된 Callback 이벤트를 타게됨.
      if (this.getModel("midObjectView").getProperty("/mode") == "U") {
        this.getRouter().navTo("midPage", {
          layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
          "?query": {
            menuCode: this.getModel("midObjectView").getProperty("/menuCode") || "",
            menuName: this.getModel("midObjectView").getProperty("/menuName") || ""
          }
        });
      }
    }
  });
});