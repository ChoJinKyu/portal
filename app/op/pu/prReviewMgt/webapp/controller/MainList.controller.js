sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "cm/util/control/ui/EmployeeDialog",    
    "ext/lib/util/Validator",
    "sap/m/TablePersoController",
    "./MainListPersoService",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "ext/lib/util/ExcelUtil",
    "dp/util/control/ui/MaterialMasterDialog",
], function (BaseController, Multilingual, ManagedListModel, JSONModel, DateFormatter, NumberFormatter, EmployeeDialog, Validator,
    TablePersoController, MainListPersoService,
    Filter, FilterOperator, MessageBox, MessageToast, Fragment, ExcelUtil, MaterialMasterDialog) {
    "use strict";

    var toggleButtonId = "";

    return BaseController.extend("op.pu.prReviewMgt.controller.MainList", {

        dateFormatter: DateFormatter,
        numberFormatter: NumberFormatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var lToday = new Date();
            var uToday = new Date(Date.UTC(lToday.getFullYear(), lToday.getMonth(), lToday.getDate()));
            // 다국어
            this.setModel(new Multilingual().getModel(), "I18N");
            // 화면제어
            this.setModel(new JSONModel(), "mainListViewModel");
            // 조회조건
            this.setModel(new JSONModel({
                tenant_id: "L2100",
                company_code: null,
                pr_type_code: [],
                pr_number: null,
                pr_item_number: null,
                org_type_code: null,
                org_code: [],
                material_code: null,
                material_group_code: null,
                pr_desc: null,
                pr_quantity: null,
                pr_unit: null,
                requestor_empno: null,
                requestor_name: null,
                request_date: [
                    uToday, uToday
                ],
                accept_date: [null, null],
                delivery_request_date: null,
                buyer_empno: null,
                purchasing_group_code: null,
                estimated_price: null,
                currency_code: null,
                price_unit: null,
                pr_progress_status_code: [],
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
            this.onSearch();
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
            .attachEvent("apply", (function (oEvent) {
                // Default - material_code
                this.getModel(model).setProperty(
                    paths, 
                    oEvent.mParameters.item[paths.split("/")[paths.split("/").length-1]]
                );
            }).bind(this));
            // Dialog Open
            Dialog.open();
        },
		
        onExcelDownload: function () {
            var [event, tId, bindings] = arguments;
            var [model, paths] = bindings.split(">");
            ExcelUtil.fnExportExcel({
                fileName: "PR Review List",
                table: this.byId(tId),
                data: this.getModel(model||"").getProperty(paths)
            });
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onSearch: function (oEvent) {
            // Call Service
            (function _search(){
                var oDeferred = new $.Deferred();
                var jSearch = this.getModel("jSearch").getData();
                this.getView()
                    .setBusy(true)
                    .getModel().read("/Pr_ReviewListView", $.extend({
                        filters: Object.keys(jSearch)
                            // EQ, BT 만 해당
                            .filter(
                                path => 
                                    // Primitive
                                    typeof jSearch[path] == "boolean" || typeof jSearch[path] == "number" ||
                                    (jSearch[path] && typeof jSearch[path] == "string") || 
                                    // Array 형태
                                    (jSearch[path] instanceof Array && jSearch[path].length > 0 && (jSearch[path][0] || jSearch[path][1])) ||
                                    // Object (연산자필드포함)
                                    (jSearch[path] && jSearch[path]["Contains"])
                            )
                            .reduce(function(acc, path) {
                                return [
                                    ...acc, 
                                    jSearch[path] instanceof Array
                                    ? new Filter(path, FilterOperator.BT, (jSearch[path][0]), (jSearch[path][1]))
                                    : (jSearch[path] && jSearch[path]["Contains"])
                                    ? new Filter(path, FilterOperator.Contains, jSearch[path])
                                    : new Filter(path, FilterOperator.EQ, jSearch[path])
                                ]
                            }, []),
                    }, {
                        success: oDeferred.resolve,
                        error: oDeferred.reject
                    }));
                    return oDeferred.promise();
                }).call(this)
                // 성공시
                .done((function (oData) {
                    //console.log(">>>>>>>>>>> oData", oData);
                    this.getView().setModel(new JSONModel({
                        "Pr_ReviewListView": oData.results
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

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableItemPress: function (oEvent) {
          
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("midView", {
                layout: oNextUIState.layout,
                vMode: "VIEW",
                tenantId: oRecord.tenant_id,
                company_code: oRecord.company_code,
                pr_number: oRecord.pr_number
            });

            if (oNextUIState.layout === "TwoColumnsMidExpanded") {   
                this.getModel("mainListViewModel").setProperty("/headerExpanded", false);             
                //this.getView().getModel("mainListViewModel").setProperty("/headerExpandFlag", false);
            }

            var oItem = oEvent.getSource();
            oItem.setNavigated(true);
            var oParent = oItem.getParent();
            // store index of the item clicked, which can be used later in the columnResize event
            this.iIndex = oParent.indexOfItem(oItem);
        },

        /**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
        onUpdateFinished: function (event) {},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onPersonalize: function (oEvent) {},
    });
});