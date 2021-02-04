sap.ui.define([
  "ext/lib/controller/BaseController",
  "ext/lib/util/Validator",
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
  "sap/f/LayoutType",
  "ext/lib/util/Multilingual",
], function (BaseController, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
  Filter, FilterOperator, Fragment, MessageBox, MessageToast,
  ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, LayoutType, Multilingual) {

  "use strict";

  var oTransactionManager = Symbol();

  return BaseController.extend("cm.menuMgt.controller.MidObject", {

    validator: new Validator(),

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

      // Multilingual
      this.getView().setModel((new Multilingual()).getModel(), "I18N");

      // midObjectView
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
            var { menuCode, menuName, parentMenuCode, chainCode } = oEvent.getParameter("arguments")["?query"];
            //console.log(">>>>>> params", menuCode, menuName, parentMenuCode);
            this.getModel("midObjectView").setProperty("/mode", (!menuCode ? "C" : "R"));
            this.getModel("midObjectView").setProperty("/menuCode", menuCode);
            this.getModel("midObjectView").setProperty("/menuName", menuName.replaceAll("^", "#"));
            this.getModel("midObjectView").setProperty("/parentMenuCode", parentMenuCode);
            //this.getModel("midObjectView").setProperty("/mode", "R");
            // 신규(C)
            if (!menuCode) {
              this
                .getModel("master")
                .setData($.extend({
                  "tenant_id": "L2100",
                  "menu_code": "",
                  "chain_code": chainCode || "CM",
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
      this.getModel("fcl").setProperty("/layout", LayoutType.MidColumnFullScreen);
      this.getModel("midObjectView").setProperty("/screen", "Full");
    },
    /**
     * Event handler for Exit Full Screen Button pressed
     * @public
     */
    onExit: function () {
      this.getModel("fcl").setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
      this.getModel("midObjectView").setProperty("/screen", "");
    },
    /**
     * Event handler for Nav Back Button pressed
     * @public
     */
    onNavBack: function () {
      this.getModel("fcl").setProperty("/layout", LayoutType.OneColumn);
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
      MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
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
                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
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
        length = 0,
        that = this;

      // Validation
    //   if(!oModel.isChanged()) {
    //     MessageToast.show(this.getModel("I18N").getText("/NCM01006"));
    //     return;
    //   }

      // Master
      this.validator.setModel(this.getModel("form"), "form");
      if(this._validatorCheck() === "Error"){
          return;
      }
        
    //   if (!Validator.isValid(this.byId("pageSectionMainForm"))) return ;
    //   // Detail
    //   if (!Validator.isValid(this.byId("midTable"))) return ;
      // Set Details (New)
      (length = detail.getData()["MenuLng"].length) 
      && 
      detail.getData()["MenuLng"].map(r => {
        if (r["_row_state_"] == "C") {
          r["tenant_id"] = master.getData()["tenant_id"];
          r["menu_code"] = master.getData()["menu_code"];
        }
        return r;
      });

      // 다국어를 등록하세요.
      if (length <= 0) {
          MessageBox.alert(this.getModel("I18N").getText("/NCM02003", this.getModel("I18N").getText("/MULTILINGUAL")));
          return;
      }

      MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
        title: "Comfirmation",
        initialFocus: sap.m.MessageBox.Action.CANCEL,
        onClose: function (sButton) {
          if (sButton === MessageBox.Action.OK) {
            view.setBusy(true);
            that[oTransactionManager].submit({
              success: function (ok) {
                view.setBusy(false);
                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                // MessageToast.show(this.getModel("I18N").getText("/NCM01001"));
                MessageToast.show("저장 되었습니다.");
              }
            });
          };
        }
      });
    },

    _validatorCheck: function () {
        var sValidatorCheck;
        if(this.validator.validate(this.byId("pageSectionMainFormHBoxLine1")) !== true){sValidatorCheck = "Error";}
        if(this.validator.validate(this.byId("pageSectionMainFormHBoxLine2")) !== true){sValidatorCheck = "Error";}
        if(this.validator.validate(this.byId("pageSectionMainFormHBoxLine3")) !== true){sValidatorCheck = "Error";}
        if(this.validator.validate(this.byId("pageSectionMainFormHBoxLine4")) !== true){sValidatorCheck = "Error";}
        if(this.validator.validate(this.byId("pageSectionMainFormHBoxLine5")) !== true){sValidatorCheck = "Error";}
        if(this.validator.validate(this.byId("midTable")) !== true) {
            sValidatorCheck = "Error";
        }
        return sValidatorCheck;
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