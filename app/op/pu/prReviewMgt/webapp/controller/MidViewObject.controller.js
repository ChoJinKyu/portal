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
        /* lifecycle methods                                  
                 */
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
                    this.setModel(new JSONModel({ tenant_id, company_code, pr_number, pr_item_number }), "jSearchDetail");
                    // Call Service
                    this.search("jSearchDetail", "Pr_ReviewDtlView", "detail", true);
                }, this);
        },
        onButtonPress: function () {
            var [event, action, ...args] = arguments;
            var value;
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
        }
	});
});