sap.ui.define([
    "op/util/controller/BaseController",

    "sap/ui/model/json/JSONModel",
    "cm/util/control/ui/EmployeeDialog",    
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    
    "dp/util/control/ui/MaterialMasterDialog",
], function (BaseController, JSONModel, EmployeeDialog, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, MessageBox, MessageToast, Fragment, MaterialMasterDialog, Aop) {
    "use strict";

    var toggleButtonId = "";

    return BaseController.extend("op.pu.prReviewMgt.controller.MainList", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // call the base controller's init function
            BaseController.prototype["op.init"].apply(this, arguments);
            // today
            var lToday = new Date();
            var uToday = new Date(Date.UTC(lToday.getFullYear(), lToday.getMonth(), lToday.getDate()));
            var uStart = new Date(Date.UTC(lToday.getFullYear(), lToday.getMonth(), lToday.getDate()-30));
            // 화면제어
            this.setModel(new JSONModel(), "mainListViewModel");
            // 조회조건 : 
            this.setModel(new JSONModel({
                tenant_id: "L2100",
                company_code: "LGCKR",
                pr_type_code: {
                    FilterOperator: FilterOperator.Any,
                    values: []
                },
                pr_number: {
                    FilterOperator: FilterOperator.Contains,
                    values: []
                },
                pr_item_number: null,
                org_type_code: null,
                org_code: {
                    FilterOperator: FilterOperator.Any,
                    values: []
                },
                material_code: null,
                material_group_code: null,
                pr_desc: {
                    FilterOperator: FilterOperator.Contains,
                    values: []
                },
                pr_quantity: null,
                pr_unit: null,
                requestor_empno: null,
                requestor_name: null,
                request_date: {
                    FilterOperator: FilterOperator.BT,
                    values: [ uStart, uToday ]
                },
                accept_date: {
                    FilterOperator: FilterOperator.BT,
                    values: [ null, null ]
                },
                delivery_request_date: null,
                buyer_empno: null,
                purchasing_group_code: null,
                estimated_price: null,
                currency_code: null,
                price_unit: null,
                pr_progress_status_code: {
                    FilterOperator: FilterOperator.Any,
                    // 30: 결재완료, 50: 생성완료
                    values: ["30", "50"]
                },
                remark: null,
                attch_group_number: null,
                delete_flag: null,
                closing_flag: null,
                item_category_code: null,
                account_assignment_category_code: null,
                sloc_code: null
            }), "jSearch");

            // 화면 호출 될 때마다 실행
            this.getRouter()
                .getRoute("mainPage")
                .attachPatternMatched(function() {
                    this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
                }, this);
        },
        // 화면호출시실행
        onRenderedFirst: function () {
            return this.search("jSearch", "list", "Pr_ReviewListView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        // 공통 다이얼로그 호출
        onValueHelpRequest: function() {
            // Declare
            var [event, bindings] = arguments;
            var [model, paths] = bindings.split(">");
            var Dialog = this.onValueHelpRequest[bindings];
            // Dialog Set
            !Dialog
            &&
            (Dialog = this.onValueHelpRequest[bindings] = new MaterialMasterDialog({
                title: "Choose MaterialMaster",
                MultiSelection: true,
                items: {
                    filters: [
                        new Filter("tenant_id", "EQ", "L2100")
                    ]
                }
            }))
            .attachEvent("apply", (function (event) {
                // Default - material_code
                this.getModel(model).setProperty(
                    paths, 
                    event.mParameters.item[paths.split("/")[paths.split("/").length-1]]
                );
            }).bind(this));
            // Dialog Open
            Dialog.open();
        },
        // 조회
        onSearch: function (event) {
            // Call Service
            return this.search("jSearch", "list", "Pr_ReviewListView");
        },
		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event}
		 * @public
		 */
        onColumnListItemPress: function () {

            var [event, record] = arguments;

            this.getRouter().navTo("midView", {
                layout: this.getOwnerComponent()
                            .getHelper()
                            .getNextUIState(1)
                            .layout,
                "?query": {
                    tenant_id: record.tenant_id,
                    company_code: record.company_code,
                    pr_number: record.pr_number,
                    pr_item_number: record.pr_item_number
                }
            });
        },
        onButtonPress: function () {

            var [event, action, ...args] = arguments;
            var value;

            // 재작성요청
            action == 'REWRITE'
            &&
            (value = (function() {
            })());

            // 마감
            action == 'CLOSING'
            &&
            (value = (function() {
            })());

            // 구매담당자변경
            action == 'CHANGE'
            &&
            (value = (function() {
            })());

            return {action, value};
        },
        
        // Excel Download - 추가 화일명이 필요한 경우, arguments 뒤에 인자로 붙인다.
        // 어쩔 수 없음, Binding Expression 에서 함수 Parsing 해결이 되면, 다시 재작성
        onExcelDownload: function () {

            return BaseController.prototype["onExcel"].call(this, arguments);
        }
    });
});