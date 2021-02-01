sap.ui.define([
    "op/util/controller/BaseController",

	"sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",

], function (BaseController, History, JSONModel, Filter, FilterOperator, Fragment, MessageBox, MessageToast) {
     "use strict";

    /**
     * @description 구매요청 Create 화면 
     * @author OhVeryGood
     * @date 2020.12.01
     */
	return BaseController.extend("op.pu.prReviewMgt.controller.MidViewObject", {

		/* =========================================================== */
        /* lifecycle methods                                           */
		/* =========================================================== */
		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit : function () { 
            // call the base controller's init function
            BaseController.prototype["op.init"].apply(this, arguments);

            // 화면 호출 될 때마다 실행
            this.getRouter()
                .getRoute("midView")
                .attachPatternMatched(function(event) {
                    var { tenant_id, company_code, pr_number, pr_item_number } = event.getParameter("arguments")["?query"];
                    // 상세
                    this.search(new JSONModel({ 
                        tenant_id, 
                        company_code, 
                        pr_number, 
                        pr_item_number 
                    }), "detail", "Pr_ReviewDtlView", true);
                    // 계정지정정보
                    this.search(new JSONModel({ 
                        tenant_id, 
                        company_code, 
                        pr_number, 
                        pr_item_number 
                    }), "accounts", "Pr_ReviewDtlAcctView");
                }, this);
        },
        onButtonPress: function () {
            var [event, action, ...args] = arguments;
            var value;

            // 공사물량
            action == 'builds'
            &&
            (value = (function() {
            })());

            // 변경이력
            action == 'changed'
            &&
            (value = (function() {
            })());

            // 발주이력
            action == 'ordered'
            &&
            (value = (function() {
            })());

            // 사용실적
            action == 'results'
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