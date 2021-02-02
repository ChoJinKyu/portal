sap.ui.define([
    "op/util/controller/BaseController",

    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",

    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",

    "cm/util/control/ui/EmployeeDialog",    
    "dp/util/control/ui/MaterialOrgDialog",
    "cm/util/control/ui/PlantDialog",
], function (BaseController, JSONModel, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, Sorter, MessageBox, MessageToast, Fragment, 
    EmployeeDialog,
    MaterialOrgDialog, 
    PlantDialog) {
    "use strict";

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
            // 조회조건
            this.setModel(new JSONModel({
                // 테넌트
                tenant_id: this.$session.tenant_id,
                // 회사
                company_code: this.$session.company_code,
                // 구매요청 유형
                pr_type_code: {
                    FilterOperator: FilterOperator.Any,
                    values: []
                },
                // 구매요청 번호
                pr_number: {
                    FilterOperator: FilterOperator.Contains,
                    values: []
                },
                // 품목 번호
                pr_item_number: null,
                // 조직코드
                org_code: {
                    FilterOperator: FilterOperator.Any,
                    values: []
                },
                // 자재코드
                material_code: null,
                // 구매요청 품명
                pr_desc: {
                    FilterOperator: FilterOperator.Contains,
                    values: []
                },
                // 구매요청 생성자
                requestor_empno: null,
                // 구매요청 생성일자
                request_date: {
                    FilterOperator: FilterOperator.BT,
                    values: [ uStart, uToday ]
                },
                // 구매담당자 
                buyer_empno: this.$session.employee_number,
                // 구매요청생성상태코드
                pr_create_status_code: {
                    FilterOperator: FilterOperator.Any,
                    // 30: 결재완료, 50: 생성완료
                    values: ["30", "50"]
                }
            }), "jSearch");

            // 화면 호출 될 때마다 실행
            this.getRouter()
                .getRoute("mainPage")
                .attachPatternMatched(function() {
                    this.getModel("mainListViewModel")
                        .setProperty("/headerExpanded", true);
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

            var [event, action, ...args] = arguments;

            // 자재코드
            action == "material"
            &&
            this.dialog(new MaterialOrgDialog({
                title: "Choose Material Code",
                MultiSelection: false,
                items: {
                    filters: [
                        new Filter("tenant_id", "EQ", this.$session.tenant_id)
                    ]
                },
                orgCode: ""
            }), function(result) {
                this.getModel("jSearch").setProperty(
                    "/material_code", 
                    result.mParameters.item["/material_code".split("/")["/material_code".split("/").length-1]]
                );
            });

            // 조직코드
            action == "org"
            &&
            this.dialog(new PlantDialog({
                title: "(미정)조직을 선택하세요.)",
                MultiSelection: false,
                items: {
                    filters: [
                        new Filter("company_code", FilterOperator.EQ, this.$session.company_code)                            
                    ],
                    sorters: [
                        new Sorter("plant_name")
                    ]
                }
            }), 
            function(result) {
                //debugger;
                // result.getSource().getTokens()[0].getKey()
                // selectedKeys="{jSearch>/org_code/values}"
                // this.getModel("jSearch").setProperty(
                //     "/material_code", 
                //     result.mParameters.item["/material_code".split("/")["/material_code".split("/").length-1]]
                // );
            });
        },
        // 조회
        onSearch: function (event) {
            // Call Service
            this.search("jSearch", "list", "Pr_ReviewListView");
        },
		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event}
		 * @public
		 */
        onColumnListItemPress: function () {

            var [ event, type, model, ...args ] = arguments,
                layout = this.getOwnerComponent()
                            .getHelper()
                            .getNextUIState(1)
                            .layout,
                record = this.getModel(model).getProperty(event.getSource().getBindingContextPath());

            this.getRouter().navTo("midView", {
                layout: layout,
                "?query": {
                    tenant_id: record.tenant_id,
                    company_code: record.company_code,
                    pr_number: record.pr_number,
                    pr_item_number: record.pr_item_number
                }
            });
            this.getModel("mainListViewModel")
                .setProperty("/headerExpanded", layout !== "TwoColumnsMidExpanded"); 
        },
        onButtonPress: function () {
            var [ event, ...args ] = arguments;
            var { action, service, entry, tId } = args[args.length-1];
            var message, value;
            var table = this.byId(tId);
            var items = table
                        .getSelectedContexts()
                        .reduce((acc, e) => [...acc, e.getObject()], []);

            // 선택된 건이 없으면 메시지 출력(NCM01008 : 데이터를 선택해 주세요.)
            if (items.length <= 0) {
                // 데이터를 선택해 주세요
                MessageBox.alert(this.getModel("I18N").getText("/NCM01008"));
                return;
            }
            // 아래의 모든 작업은 진행상태가 결재완료(30), 생성완료(50) 상태에서만 가능하다.
            if (items.filter(e => !(e.pr_create_status_code == "30" || e.pr_create_status_code == "50")).length > 0) {
                // 결재완료, 생성완료만 선택가능합니다.
                MessageBox.alert("(메세지)결재완료, 생성완료만 처리 할 수 있습니다.");
                return ;
            }
            // 구매담당자가 본인이 아닐 경우 Confirm 메시지 띄움.
            if (items.filter(e => !(e.buyer_empno != this.$session.employee_number)).length > 0) {
                message = "(메세지)본인 담당이 아닌 구매요청건이 존재합니다.\n확인시 자동으로 본인 담당으로 변경됩니다.\nRFQ작성을 진행하시겠습니까?";
            }
            // 잔량이 없는 PR은 선택이 불가능하다 = 요청수량 0
            // if (items.filter(e => (+e.pr_quantity) <= 0 || !e).length > 0) {
            //     MessageBox.alert("(메세지)요청수량(잔량)이 없는 PR 은 선택 할 수 없습니다.");
            //     return;
            // }

            // Transaction
            (
                // 구매담당자변경
                (action == 'CHANGE' && (message = "(메세지)구매담당자 담당자 변경을 진행하시겠습니까?"))
                ||
                // 재작성요청
                (action == 'REWRITE' && (message = "(메세지)재작성요청을 진행하시겠습니까?"))
                ||
                // 마감
                (action == 'CLOSING' && (message = "(메세지)마감을 진행하시겠습니까?"))
                ||
                // RFQ작성
                (action == 'RFQ' && (message = message || "(메세지)RFQ작성을 진행하시겠습니까?"))
                ||
                // 입찰작성
                (action == 'BIDDING' && (message = "(메세지)입찰작성을 진행하시겠습니까?"))
            )
            &&
            (function() {
                MessageBox.confirm(message, {
                    title: "Comfirmation",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: (function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            if (action == 'CLOSING' || action == 'CHANGE' || action == 'REWRITE') {
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
                                        if (value.action == 'CHANGE' && !value.buyerEmpno) {
                                            MessageBox.alert("(미정)구매담당자를 선택하세요.");
                                            return false;
                                        }
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
                                }, this)
                                .done(result => {
                                    var { buyerEmpno, buyerDepartmentCode, processedReason } = result;
                                    console.log(">>>>>>>>>>>>> done", result);
                                    this.procedure(service, entry, {
                                        inputData: {
                                            jobType: action,
                                            prItemTbl: items.map(function(e) { 
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
                                            employeeNumber: this.$session.employee_number
                                        }
                                    })
                                    .done((function(r) {
                                        this.search("jSearch", "list", "Pr_ReviewListView");
                                    }).bind(this));
                                });
                            }
                            else {
                                this.procedure(service, entry, {
                                    inputData: {
                                        jobType: action,
                                        prItemTbl: items.map(function(e) { 
                                            return { 
                                                transaction_code: e.transaction_code, 
                                                tenant_id: e.tenant_id, 
                                                company_code: e.company_code, 
                                                pr_number: e.pr_number, 
                                                pr_item_number: e.pr_item_number 
                                            };
                                        }),
                                        buyerEmpno: "",
                                        buyerDepartmentCode: "",
                                        processedReason: "",
                                        employeeNumber: this.$session.employee_number
                                    }
                                })
                                .done((function(r) {
                                    this.search("jSearch", "list", "Pr_ReviewListView");
                                }).bind(this))
                            }
                        }
                    }).bind(this)
                });
            }).call(this);
        }
    });
});