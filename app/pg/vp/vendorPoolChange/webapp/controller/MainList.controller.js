sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TreeListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/m/TablePersoController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Token",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    'sap/ui/core/Element',
    "sap/ui/core/syncStyleClass",
    'sap/m/Label',
    'sap/m/SearchField',
    "sap/f/library",
    "ext/lib/util/ControlUtil",
    "sap/ui/model/resource/ResourceModel"

], function (BaseController,
    History,
    JSONModel,
    TreeListModel,
    TransactionManager,
    ManagedModel,
    ManagedListModel,
    DateFormatter,
    TablePersoController,
    Filter,
    FilterOperator,
    Fragment,
    Sorter,
    MessageBox,
    MessageToast,
    ColumnListItem,
    ObjectIdentifier,
    Text,
    Token,
    Input,
    ComboBox,
    Item,
    Element,
    syncStyleClass,
    Label,
    SearchField,
    library,
    ControlUtil,
    ResourceModel
) {
    "use strict";
    //Popup Param
    var dialogId = "";
    var pop_h_path = "";
    var pop_lv = "";
    var pop_org = "";
    var pop_h_lv = "";
    var pop_t_id = "";
    var pop_com_cd = "";
    var pop_orgtype = "";
    var pop_o_unitcode = "";
    var pop_d_state;
    // var pop_vp_
    var pop_vp_cd = "";
    var pop_p_vp_cd = "";
    var pop_hierarchy_level = "";
    var pop_target_level = "";
    //routing param
    var pVendorPool = "";
    var pTenantId = "";
    var pOrg_code = "";
    var pOperation_unit_code = "";
    var pTemp_type = "";
    var btType = "";
    var oTransactionManager;
    var that;

    return BaseController.extend("pg.vp.vendorPoolChange.controller.MainList", {

        dateFormatter: DateFormatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {

            var oViewModel,
                oResourceBundle = this.getResourceBundle();

            this.oRouter = this.getOwnerComponent().getRouter();

            var i18nModel = new ResourceModel({
                bundleName: "pg.vp.vendorPoolChange.i18n.i18n_en",
                supportedLocales: [""],
                fallbackLocale: ""
            });

            var ReturnoData = {
                data: {
                    return_code: "",
                    return_msg: ""
                }
            };
            var oModel = new JSONModel(ReturnoData);
            this.setModel(oModel, "returnModel");

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                headerExpanded: true,
                mainListTableTitle: oResourceBundle.getText("mainListTableTitle"),
                tableNoDataText: oResourceBundle.getText("tableNoDataText")
            });
            this.setModel(oViewModel, "mainListView");

            // Add the mainList page to the flp routing history
            this.addHistoryEntry({
                title: oResourceBundle.getText("mainListViewTitle"),
                icon: "sap-icon://table-view",
                intent: "#Template-display"
            }, true);

            this._doInitSearch();
            this.setModel(new ManagedListModel(), "list");
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            that = this;
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";
            // this.getView().setModel(this.getOwnerComponent().getModel());
            var oView = this.getView();
            var today = new Date();

            // CHANGE_DATE의 오늘 기준으로 한달 간 기본 값 SetDate
            oView.byId("search_Operation_DATE_S").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            oView.byId("search_Operation_DATE_S").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            oView.byId("search_Operation_DATE_E").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            oView.byId("search_Operation_DATE_E").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        /**
        * @public
        * @see 사용처 DialogTreeCreate Fragment Open 이벤트
        */
        onDialogTreeCreate: function () {

            var oView = this.getView();

            if (!this.byId("search_Operation_ORG_E").getSelectedKey()) {
                MessageToast.show("ORG를 입력해주세요.");
            } else if (!this.byId("search_Operation_UNIT_E").getSelectedKey()) {
                MessageToast.show("ORG UNIT을 입력해주세요.");
            } else {
                if (!this.treeDialog) {
                    this.treeDialog = Fragment.load({
                        id: oView.getId(),
                        name: "pg.vp.vendorPoolChange.view.DialogCreateTree",
                        controller: this
                    }).then(function (tDialog) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(tDialog);
                        return tDialog;
                    });
                }
                this.treeDialog.then(function (tDialog) {
                    tDialog.open();
                    // this.onAfterDialog();
                }.bind(this));
            }
        },

        createTreePopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("ceateVpCategorytree").close();
        },

        handleTable: function (event) {

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"
            var oper_unit;
            if (sSurffix == "S") {
                oper_unit = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();
            }
            else if (sSurffix == "E") {
                oper_unit = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
            }
        },

        onDialogTreeSearch: function (event) {

            var treeVendor = [];

            if (!!this.byId("treepop_vendor_pool_local_name").getValue()) {
                treeVendor.push(new Filter({
                    path: 'keyword',
                    filters: [
                        new Filter("vendor_pool_local_name", FilterOperator.Contains, this.byId("treepop_vendor_pool_local_name").getValue())
                    ],
                    and: false
                }));
            }
            if (!!this.byId("search_Operation_ORG_E").getSelectedKey()) {
                treeVendor.push(new Filter("org_code", FilterOperator.Contains, this.byId("search_Operation_ORG_E").getSelectedKey()));
            }
            if (!!this.byId("search_Operation_UNIT_E").getSelectedKey()) {
                treeVendor.push(new Filter("operation_unit_code", FilterOperator.Contains, this.byId("search_Operation_UNIT_E").getSelectedKey()));
            }


            this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel("search"));
            this.getView().setBusy(true);
            this.treeListModel
                .read("/VpPopupView", {
                    filters: treeVendor
                })
                // 성공시
                .then((function (jNodes) {
                    this.getView().setModel(new JSONModel({
                        "VpPopupView": {
                            "nodes": jNodes
                        }
                    }), "tree");
                }).bind(this))
                // 실패시
                .catch(function (oError) {
                })
                // 모래시계해제
                .finally((function () {
                    this.getView().setBusy(false);
                }).bind(this));
        },

        selectTreeValue: function (event) {

            var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);

            this.getView().byId("search_Vp_Name").setValue(row.vendor_pool_local_name);
            this.getView().byId("search_Vp_Code").setValue(row.vendor_pool_code);

            this.byId("treepop_vendor_pool_local_name").setValue("");

            this.createTreePopupClose();
        },

        onAfterRendering: function () {
            // this.byId("pageSearchButton").firePress();
            // return;
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
        onMainTableUpdateFinished: function (oEvent) {
            // update the mainList's object counter after the table update
        },

        /**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */

        onPageSearchButtonPress: function (oEvent) {
            // 조회버튼 클릭 시 페이지의 HEADER 상태 확인 후 sSurffix 값 지정 
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            // 조회 조건 필터값을 위한 Array
            var aSearchFilters = [];

            // Load 할 동안 busy 세팅
            this.getView().setBusy(true);

            // Case1. 헤더가 접힌 경우 (필수값 4개 필드)
            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();
                var s_Opertaion_CHANGER_S = this.getView().byId("search_Operation_CHANGER_S").getSelectedKey();

                // if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0
                //     && s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0
                //     && s_Opertaion_CHANGER_S && s_Opertaion_CHANGER_S.length > 0) {
                //     var aSearchFilters_S = this._getSearchStates();
                //     this._applySearch(aSearchFilters_S);
                // }
                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0
                    && s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {
                    var aSearchFilters_S = this._getSearchStates();
                    this._applySearch(aSearchFilters_S);
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }
                this.getView().setBusy(false);
            }

            // Case2. 헤더가 펼쳐진 경우 
            else if (sSurffix === "E") {
                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                var s_Opertaion_CHANGER_E = this.getView().byId("search_Operation_CHANGER_E").getSelectedKey();

                // if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0
                //     && s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0
                //     && s_Opertaion_CHANGER_E && s_Opertaion_CHANGER_E.length > 0) {
                //     var aSearchFilters_E = this._getSearchStates();
                //     this._applySearch(aSearchFilters_E);
                // }
                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0
                    && s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {
                    var aSearchFilters_E = this._getSearchStates();
                    this._applySearch(aSearchFilters_E);
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }
                this.getView().setBusy(false);
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {

        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */

        _applySearch: function (aSearchFilters) {
            console.log("_applySearch!!!");
            that.mainTable = this.byId("mainTable");
            var oDataLen = 0;
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/VpChangeList", {
                filters: aSearchFilters,
                success: function (oData) {
                    console.log("_applySearch > success");
                    oView.setBusy(false);
                }, error: function (e) {
                    console.log("error occrupie!!!");
                    oView.setBusy(false);
                }
            });
        },

        /*
         *  Search 영역에서 입력 한 정보를 필터링 하기 위한 function
         * */
        _getSearchStates: function () {
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"
            var aSearchFilters = [];
            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();
                var s_Operation_DATE_S_FR = this.formatDate(this.getView().byId("search_Operation_DATE_S").getDateValue());
                var s_Operation_DATE_S_TO = this.formatDate(this.getView().byId("search_Operation_DATE_S").getSecondDateValue());
                var s_Opertaion_CHANGER_S = this.getView().byId("search_Operation_CHANGER_S").getSelectedKey();

                aSearchFilters.push(new Filter("change_date", FilterOperator.BT, s_Operation_DATE_S_FR, s_Operation_DATE_S_TO));

                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0) {
                    aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, s_Operation_ORG_S));
                }
                if (s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {
                    aSearchFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, s_Operation_UNIT_S));
                }
                if (s_Opertaion_CHANGER_S && s_Opertaion_CHANGER_S.length > 0) {
                    aSearchFilters.push(new Filter("changer_empno", FilterOperator.EQ, s_Opertaion_CHANGER_S));
                }
            }

            else if (sSurffix === "E") {
                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                var s_Operation_DATE_E_FR = this.formatDate(this.getView().byId("search_Operation_DATE_E").getDateValue());
                var s_Operation_DATE_E_TO = this.formatDate(this.getView().byId("search_Operation_DATE_E").getSecondDateValue());
                var s_Operation_CHANGER_E = this.getView().byId("search_Operation_CHANGER_E").getSelectedKey();
                var s_Operation_STATE_E = this.getView().byId("searchCodeSegmentButton").getSelectedKey();
                var s_Operation_VENDOR_E = this.getView().byId("search_Vp_Code").getValue();

                aSearchFilters.push(new Filter("change_date", FilterOperator.BT, s_Operation_DATE_E_FR, s_Operation_DATE_E_TO));

                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0) {
                    aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, s_Operation_ORG_E));
                }
                if (s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {
                    aSearchFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, s_Operation_UNIT_E));
                }
                if (s_Operation_CHANGER_E && s_Operation_CHANGER_E.length > 0) {
                    aSearchFilters.push(new Filter("changer_empno", FilterOperator.EQ, s_Operation_CHANGER_E));
                }
                if (s_Operation_VENDOR_E && s_Operation_VENDOR_E.length > 0) {
                    aSearchFilters.push(new Filter("vendor_pool_code", FilterOperator.EQ, s_Operation_VENDOR_E));
                }
                if (s_Operation_STATE_E !== "" && s_Operation_STATE_E > 0) {
                    //aSearchFilters.push(new Filter("approval_status", FilterOperator.EQ, s_Operation_STATE_E));
                    //aSearchFilters.push(new Filter("approval_status", FilterOperator.EQ, null));
                }
            }
            return aSearchFilters;
        },

        /*
         *  $List 영역에서 DATE 포맷을 위한 Formatter
         *  Input : date, Return : date.substring(0, 10), YYYY-MM-DD
         * */
        setDateFormatter: function (date) {
            if (date && date != null) {
                return date.substring(0, 10);
            } else {
                return null;
            }
        },

        /*
         *  $ DATE 포맷을 위한 Formatter
         *  Input : date, Return : [year, month, day].join('-') , YYYY-MM-DD
         * */
        formatDate: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        },

        /*
         *  $List 영역에서 Status Label 포맷을 위한 Formatter
         * */

        labelColorFormatter: function (sStautsCodeParam) {
            switch (sStautsCodeParam) {
                case 'IW':
                    return 3;
                case 'DR':
                    return 1;
                case 'RQ':
                    return 8;
                case 'IP':
                    return 9;
                default:
                    return null;
            }
        }

    });
});