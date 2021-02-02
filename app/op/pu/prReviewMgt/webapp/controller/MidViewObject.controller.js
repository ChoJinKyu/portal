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

            var [ event, type, item, ...args ] = arguments;
            var { action, service, entry, tId } = args[args.length-1];
            var message, value;
            var table = this.byId(tId);

            // Transaction
            (
                // 마감취소
                (action == 'CLOSING_CANCEL' && (message = "(메세지)마감취소를 진행하시겠습니까?"))
            )
            &&
            (function() {
                MessageBox.confirm(message, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            if (action == 'CLOSING_CANCEL') {
                                // 사유입력
                                this.fragment("reason", {
                                    name: "op.pu.prReviewMgt.view.Reason"
                                }, {
                                    onAfterOpen: (function() {
                                        this.setModel(new JSONModel({
                                            "reason": {
                                                action: action,
                                                buyerEmpno: "",
                                                processedReason: ""
                                            }
                                        }), "fragment");
                                    }).bind(this),
                                    onCommit: function() {
                                        var [event, action, value, ...args] = arguments;
                                        if (!value.processedReason) {
                                            MessageBox.alert("(미정)사유를 입력하세요.");
                                            return false;
                                        }
                                        return value;
                                    },
                                    onCancel: function() {
                                        var [event, action, ...args] = arguments;
                                        return ;
                                    }
                                }, this).done(result => {
                                    var { buyerEmpno, buyerDepartmentCode, processedReason } = result;
                                    this.procedure(service, entry, {
                                        inputData: {
                                            jobType: action,
                                            prItemTbl: [item].map(function(e) { 
                                                return { 
                                                    transaction_code: e.transaction_code, 
                                                    tenant_id: e.tenant_id, 
                                                    company_code: e.company_code, 
                                                    pr_number: e.pr_number, 
                                                    pr_item_number: e.pr_item_number 
                                                };
                                            }),
                                            buyerEmpno: buyerEmpno,
                                            buyerDepartmentCode: buyerDepartmentCode,
                                            processedReason: processedReason,
                                            userId: this.$session.user_id
                                        }
                                    })
                                    .done((function(result) {
                                        console.log(">>>>>>>>> Success", result);
                                        this.search("jSearch", "list", "Pr_ReviewListView");
                                    }).bind(this))
                                    .fail(e => console.log(">>>>>>>>> failure", e));
                                });
                            }
                            else {
                            }
                        }
                    }).bind(this)
                });
            }).call(this);
        }
	});
});