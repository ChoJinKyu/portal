sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Item",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
	/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
    function (Controller, JSONModel, Item, Filter, FilterOperator, Fragment, Sorter, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("cm.purOrgMgt.controller.purOrgMgt", {
            onInit: function () {
                // 테넌트
                this.getOwnerComponent().getModel("org")
                .attachRequestCompleted((function(event){
                    var params = event.getParameters();
                    if (!params.url.includes("$count")) {
                        var entity = params.url.split("/")[0];
                        if (entity.includes("Org_Tenant")) {
                            setTimeout((function(){
                                (!this.byId("searchTenantCombo").getFirstItem() || this.byId("searchTenantCombo").getFirstItem().getKey())
                                &&
                                this.byId("searchTenantCombo")
                                    .insertItem(new Item({ key: "", text: "전체" }), 0)
                                    .setSelectedItemId(this.byId("searchTenantCombo").getFirstItem().getId());
                            }).bind(this), 0);
                        }
                    }
                }).bind(this));
                // 회사
                this.getOwnerComponent().getModel("org")
                .attachRequestCompleted((function(event){
                    var params = event.getParameters();
                    if (!params.url.includes("$count")) {
                        var entity = params.url.split("/")[0];
                        if (entity.includes("Org_Company")) {
                            setTimeout((function(){
                                (!this.byId("searchCompanyCode").getFirstItem() || this.byId("searchCompanyCode").getFirstItem().getKey() != "*")
                                &&
                                this.byId("searchCompanyCode")
                                    .insertItem(new Item({ key: "*", text: "전체[*]" }), 0)
                                    .setSelectedItemId(this.byId("searchCompanyCode").getFirstItem().getId());
                            }).bind(this), 0);
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
                            setTimeout((function(){
                                (!this.byId("searchOrgTypeCombo").getFirstItem() || this.byId("searchOrgTypeCombo").getFirstItem().getKey())
                                &&
                                this.byId("searchOrgTypeCombo")
                                    .insertItem(new Item({ key: "", text: "전체" }), 0)
                                    .setSelectedItemId(this.byId("searchOrgTypeCombo").getFirstItem().getId());
                            }).bind(this), 0);
                        }
                    }
                }).bind(this));
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
                        ],
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
                        ],
                        template: new Item({
                            key: "{util>code}", text: "{util>code} : {util>code_description}"
                        })
                    });
                }
            },
            onSelect: function (event) {
                // event 객체를 통해 레코드(ROW)를 가져온다.
                var row = this.getView().getModel("list").getProperty(event.getSource().getBindingContext("list").getPath());
                // 라우팅 한다.
                this.getRouter().navTo("midPage", {
                    layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        tenantId: row.tenant_id,
                        companyCode: row.company_code,
                        orgTypeCode: row.org_type_code,
                        orgCode: row.org_code,
                        orgName: row.org_name
                    }
                });
            },
            onAdd: function () {
                this.getRouter().navTo("midPage", {
                    layout: this.getOwnerComponent().getHelper().getNextUIState(1).layout,
                    "?query": {
                        tenantId: "",
                        companyCode: "",
                        orgTypeCode: "",
                        orgCode: "",
                        orgName: ""
                    }
                });
            },
            onSearch: function () {
                // Call Service
                (function(){
                    var oDeferred = new $.Deferred();
                    this.getView()
                        .setBusy(true)
                        .getModel().read("/Pur_Operation_Org", $.extend({
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.byId("searchTenantCombo").getSelectedKey() || ""),
                            new Filter("company_code", FilterOperator.EQ, this.byId("searchCompanyCode").getSelectedKey() || ""),
                            new Filter("org_type_code", FilterOperator.EQ, this.byId("searchOrgTypeCombo").getSelectedKey() || ""),
                            new Filter("use_flag", FilterOperator.EQ, this.byId("searchUseFlag").getSelectedKey() || ""),
                        ].filter(
                            f => f.oValue1 || (typeof f.oValue1 == "boolean") || (typeof f.oValue2 == "number") || 
                                 f.oValue2 || (typeof f.oValue2 == "boolean") || (typeof f.oValue2 == "number")
                        ),
                    }, {
                        success: oDeferred.resolve,
                        error: oDeferred.reject
                    }));
                    return oDeferred.promise();
                }).call(this)
                // 성공시
                .done((function (oData) {
                    this.getView().setModel(new JSONModel({
                        "Pur_Operation_Org": oData.results
                    }), "list");
                }).bind(this))
                // 실패시
                .fail(function (oError) {
                })
                // 모래시계해제
                .always((function () {
                    this.getView().setBusy(false);
                }).bind(this));
            },
            onMstUpdateFinished: function (oEvent) {
            }
        });
    }
);
