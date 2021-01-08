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
                //   var that = this;
                //   this.getOwnerComponent().getModel("org")
                //     .attachRequestCompleted(function(event){
                //         var params = event.getParameters();
                //         if (!params.url.includes("$count")) {
                //             var entity = params.url.split("/")[0];
                //             if (entity.includes("Org_Company")) {
                //                 console.log(">>>> this", that);
                //             }
                //         }
                //     });
                // this.getView().setModel(new JSONModel({
                //     tenant:{
                //         key: 'L2100',
                //         items: {
                //             path: 'org>/Org_Tenant',
                //             filters: [
                //             ]
                //         }
                //     },
                //     company: {
                //         key: '*',
                //         items: {
                //             path: 'org>/Org_Company',
                //             filters: [
                //                 {path: 'tenant_id', operator: 'EQ', value1: 'L2100'},
                //             ]
                //         }
                //     }
                // }).attachPropertyChange((function(event) {
                // }).bind(this)), "mSearch");
                //this.getView().getModel("org").data
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
                // Filter
                var predicates = [];
                if (!!this.byId("searchTenantCombo").getSelectedKey()) {
                    predicates.push(new Filter("tenant_id", FilterOperator.EQ, this.byId("searchTenantCombo").getSelectedKey()));
                }
                if (!!this.byId("searchCompanyCode").getSelectedKey()) {
                    predicates.push(new Filter("company_code", FilterOperator.EQ, this.byId("searchCompanyCode").getSelectedKey()));
                }
                if (!!this.byId("searchOrgTypeCombo").getSelectedKey()) {
                    predicates.push(new Filter("org_type_code", FilterOperator.EQ, this.byId("searchOrgTypeCombo").getSelectedKey()));
                }
                if (!!this.byId("searchUseFlag").getSelectedKey()) {
                    predicates.push(new Filter("use_flag", FilterOperator.EQ, this.byId("searchUseFlag").getSelectedKey()));
                }
                // Call Service
                (function(){
                    var oDeferred = new $.Deferred();
                    this.getView()
                        .setBusy(true)
                        .getModel().read("/Pur_Operation_Org", $.extend({
                        filters: predicates
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
