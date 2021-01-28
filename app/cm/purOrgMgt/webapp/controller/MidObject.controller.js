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
  "sap/ui/core/Item"
], function (BaseController, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
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
    /**
     * Called when the midObject controller is instantiated.
     * @public
     */
    onInit: function () {
        // 테넌트
        this.getOwnerComponent().getModel("org")
        .attachRequestCompleted((function(event){
            var params = event.getParameters();
            if (!params.url.includes("$count")) {
                var entity = params.url.split("/")[0];
                // 테넌트
                if (entity.includes("Org_Tenant")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("searchTenantCombo"));
                }
                // 회사
                else if (entity.includes("Org_Company")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "*", text: "전체[*]" }), 0)
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0);

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);

                    }).bind(this), 0, this.byId("searchCompanyCode"));
                }
                // 구매조직
                else if (entity.includes("Org_Purchasing")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());
                        
                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("purchaseOrgCombo"));
                }
                // 플랜트
                else if (entity.includes("Org_Plant")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("plantCodeCombo"));
                }
                // 사업본부
                else if (entity.includes("Org_Unit")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("bizunitCodeCombo"));
                }
                else if (entity.includes("Org_Division")) {
                    // 사업부
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("bizdivisionCodeCombo"));

                    // PLANT
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());

                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("hqAuCodeCombo"));
                }
            }
        }).bind(this));
        // 조직유형
        this.getOwnerComponent().getModel("util")
        .attachRequestCompleted((function(event){
            var params = event.getParameters();
            if (!params.url.includes("$count")) {
                var entity = params.url.split("/")[0];
                if (entity.includes("Code")) {
                    setTimeout((function(combo){
                        let key = combo.getSelectedKey();
                        !!combo.getFirstItem().getKey()
                        &&
                        combo
                            .insertItem(new Item({ key: "", text: "선택하세요" }), 0)
                            .setSelectedItemId(combo.getFirstItem().getId());
                        
                        combo.setSelectedItemId(combo.getFirstItem().getId());
                        setTimeout((function(){
                            key && combo.setSelectedKey(key);
                        }).bind(this), 0);
                    }).bind(this), 0, this.byId("searchOrgTypeCombo"));
                }
            }
        }).bind(this));

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
    // Data
    onSelectionChange: function() {
        var [event, field] = arguments;
        var combo, key = event.getSource().getSelectedKey();
        this["onSelectionChange"][field] = key;
        // 테넌트
        if (field == "tenant_id") {
            // 회사코드
            combo = this.byId("searchCompanyCode");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'org>/Org_Company',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, key)
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>company_code}", text: "{org>company_code} : {org>company_name}"
                })
            });
            // 조직유형
            combo = this.byId("searchOrgTypeCombo");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'util>/Code',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, key),
                    new Filter('group_code', FilterOperator.EQ, 'CM_ORG_TYPE_CODE'),
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{util>code}", text: "{util>code} : {util>code_description}"
                })
            });
            // 구매조직
            combo = this.byId("purchaseOrgCombo");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'org>/Org_Purchasing',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, key),
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>purchase_org_code}", text: "{org>purchase_org_code} : {org>purchase_org_name}"
                })
            });
            // 사업본부
            combo = this.byId("bizunitCodeCombo");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'org>/Org_Unit',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, key),
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>bizunit_code}", text: "{org>bizunit_code} : {org>bizunit_name}"
                })
            });
        }
        // 테넌트 or 회사(*아님) : 플랜트
        // 테넌트 or 회사(*) : 테넌트 하위 전체 플랜트
        if (field == "tenant_id" || field == "company_code") {
            // 플랜트
            combo = this.byId("plantCodeCombo");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'org>/Org_Plant',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, this["onSelectionChange"]["tenant_id"] || ""),
                    new Filter('company_code', FilterOperator.EQ, this["onSelectionChange"]["company_code"] || "")
                ].filter(f => (f.oValue1 && f.oValue1 != "*") || (f.oValue2 && f.oValue2 != "*")),
                template: new Item({
                    key: "{org>plant_code}", text: "{org>plant_code} : {org>plant_name}"
                })
            });
        }
        // 테넌트 or 사업본부
        if (field == "tenant_id" || field == "bizunit_code") {
            // 사업부
            combo = this.byId("bizdivisionCodeCombo");
            combo.setSelectedKey(); 
            combo.bindItems({
                path: 'org>/Org_Division',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, this["onSelectionChange"]["tenant_id"] || ""),
                    new Filter('bizunit_code', FilterOperator.EQ, this["onSelectionChange"]["bizunit_code"] || "")
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>bizdivision_code}", text: "{org>bizdivision_code} : {org>bizdivision_name}"
                })
            });
        }
        // 사업부
        if (field == "bizdivision_code") {
            // 사업부에서 선택된 Item 데이터를 가져온다.
            var path = key ? event.getParameters().selectedItem.oBindingContexts.org.sPath : "";
            var item = this.getModel("org").getProperty(path) || {};
            // HQ/AU
            combo = this.byId("hqAuCodeCombo");
            combo.setSelectedKey((item["hq_au_flag"] ? item["bizdivision_code"] : ""));
            combo.bindItems({
                path: 'org>/Org_Division',
                filters: [
                    new Filter('tenant_id', FilterOperator.EQ, this["onSelectionChange"]["tenant_id"] || ""),
                    new Filter('bizunit_code', FilterOperator.EQ, this["onSelectionChange"]["bizunit_code"] || ""),
                    new Filter('hq_au_flag', FilterOperator.EQ, !item["hq_au_flag"])
                ].filter(f => f.oValue1 || f.oValue2),
                template: new Item({
                    key: "{org>bizdivision_code}", text: "{org>bizdivision_code} : {org>bizdivision_name}"
                })
            });
            combo.setEnabled(!item["hq_au_flag"]);
        }
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