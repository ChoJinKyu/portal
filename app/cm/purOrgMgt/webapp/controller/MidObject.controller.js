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

  return BaseController.extend("cm.purOrgMgt.controller.MidObject", {

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
      // 테넌트 : 회사코드, 구매조직코드, 사업본부
      // 테넌트 & 회사(*아님) : 플랜트
      // 테넌트 & 회사(*) : 테넌트 하위 전체 플랜트
      // 테넌트 & 사업본부 : 사업부
      // 사업부 : HQ/AU
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
        // ?query
        tenantId: "",
        companyCode: "",
        orgTypeCode: "",
        orgCode: "",
        orgName: "",
        // C, R, U, D
        mode: "R"
      }), "midObjectView");

      // Master
      this.setModel(new ManagedModel(), "master");

      // TransactionManager - 일괄처리
      this[oTransactionManager] = new TransactionManager();
      this[oTransactionManager].addDataModel(this.getModel("master"));
      this[oTransactionManager].setServiceModel(this.getOwnerComponent().getModel());

      // Router 에서 "pattern": "midObject/{layout}/{?query}" 인 경우마다 System Callback
      this
        .getRouter()
        .getRoute("midPage")
        .attachPatternMatched(
          function (oEvent) {
            var { tenantId, companyCode, orgTypeCode, orgCode, orgName } = oEvent.getParameter("arguments")["?query"];
            this.getModel("midObjectView").setProperty("/mode", (!tenantId ? "C" : "R"));
            this.getModel("midObjectView").setProperty("/tenantId", tenantId);
            this.getModel("midObjectView").setProperty("/companyCode", companyCode);
            this.getModel("midObjectView").setProperty("/orgTypeCode", orgTypeCode);
            this.getModel("midObjectView").setProperty("/orgCode", orgCode);
            this.getModel("midObjectView").setProperty("/orgName", orgName);
            // 신규(C)
            if (!tenantId) {
              this
                .getModel("master")
                .setData({
                  "use_flag": true,
                }, "/Pur_Operation_Org", false);
            }
            // 수정(U) 및 삭제(D)
            else /*if (!!tenantId)*/ {
              // menu
              this
                .getView()
                .setBusy(true)
                .getModel("master")
                .setTransactionModel(this.getOwnerComponent().getModel())
                .readP("/Pur_Operation_Org", {
                  filters: [
                    // 조회조건
                    new Filter("tenant_id", FilterOperator.EQ, tenantId),
                    new Filter("company_code", FilterOperator.EQ, companyCode),
                    new Filter("org_type_code", FilterOperator.EQ, orgTypeCode),
                    new Filter("org_code", FilterOperator.EQ, orgCode)
                  ]
                })
                // 성공시
                .then((function (oData) {
                  this.getModel("master").setData({});
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
            tenantId: "",
            companyCode: "",
            orgTypeCode: "",
            orgCode: "",
            orgName: "",
        }
      });
      this.getModel("midObjectView").setProperty("/screen", "Full");
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
            tenantId: "",
            companyCode: "",
            orgTypeCode: "",
            orgCode: "",
            orgName: "",
        }
      });
      this.getModel("midObjectView").setProperty("/screen", "");
    },
    /**
     * Event handler for Nav Back Button pressed
     * @public
     */
    onNavBack: function () {
      var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
      this.getRouter().navTo("purOrgMgt", { layout: sNextLayout });
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
      MessageBox.confirm("구매운영조직정보를 삭제하시겠습니까?", {
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
     * Event handler for saving page changes
     * @public
     */
    onSave: function () {

      var view = this.getView(),
        master = view.getModel("master"),
        that = this;

      // Validation
      // if (!master.getData()["chain_code"]) {
      //   MessageBox.alert("Chain을 입력하세요");
      //   return;
      // }
      // if (!master.getData()["menu_code"]) {
      //   MessageBox.alert("테넌트를 입력하세요");
      //   return;
      // }
      // if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
      //   MessageBox.alert("변경사항이 없습니다.");
      //   return;
      // }

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
            tenantId: this.getModel("midObjectView").getProperty("/tenantId") || "",
            companyCode: this.getModel("midObjectView").getProperty("/companyCode") || "",
            orgTypeCode: this.getModel("midObjectView").getProperty("/orgTypeCode") || "",
            orgCode: this.getModel("midObjectView").getProperty("/orgCode") || "",
            orgName: this.getModel("midObjectView").getProperty("/orgName") || "",
          }
        });
      }
    }
  });
});