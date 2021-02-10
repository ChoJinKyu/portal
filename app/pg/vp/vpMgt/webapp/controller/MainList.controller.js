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
    "./MainListPersoService",
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
    // "ext/lib/util/ValidatorUtil",
    "sap/f/library",
    "ext/lib/util/ControlUtil",
    "sap/ui/model/resource/ResourceModel",
    "ext/pg/util/control/ui/VendorPoolDialog",
    "ext/pg/util/control/ui/SupplierDialog",
    "ext/pg/util/control/ui/MaterialDialog",
    "ext/pg/util/control/ui/SupplierDialogPop",
    // "ext/pg/util/control/ui/MaterialDialogPop",
    "sap/ui/layout/GridData",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/ui/table/Column",
    "ext/cm/util/control/ui/EmployeeDialog",
    "ext/cm/util/control/ui/DepartmentDialog",
    "ext/pg/util/control/ui/MaterialDialogPop",

], function (BaseController,
    History,
    JSONModel,
    TreeListModel,
    TransactionManager,
    ManagedModel,
    ManagedListModel,
    DateFormatter,
    TablePersoController,
    MainListPersoService,
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
    // ValidatorUtil,
    library,
    ControlUtil,
    ResourceModel,
    VendorPoolDialog,
    SupplierDialog,
    MaterialDialog,
    SupplierDialogPop,
    // MaterialDialogPop,
    GridData,
    VBox,
    HBox,
    Column,
    EmployeeDialog,
    DepartmentDialog,
    MaterialDialogPop


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
    var pDrill_state= "";
    var pTemp_type = "";

    var btType = "";
    var reSearchVpNm;
    var reSearchOpCd;
    var reSearchOrgCd;
    var maxLv;

    var oTransactionManager;

    var that;

    return BaseController.extend("pg.vp.vpMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            if (sStautsCodeParam === "Complated") {
                sReturnValue = 7;
            }
            return sReturnValue;
        },

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
                bundleName: "pg.vp.vpMgt.i18n.i18n_en",
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
            // this.getView().setModel(new ManagedListModel(), "VpMst");            
            this.setModel(new ManagedListModel(), "VpMst");
            this.setModel(new ManagedListModel(), "orglist");

            // oTransactionManager = new TransactionManager();
            // oTransactionManager.addDataModel(this.getModel("VpMst"));

            this.byId("table_1lv").setVisible(true);
            this.byId("table_2lv").setVisible(true);
            this.byId("table_3lv").setVisible(true);
            this.byId("table_4lv").setVisible(false);
            this.byId("table_5lv").setVisible(false);   
            
            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);
            that = this;



            // this._doInitTablePerso();
        },

        /**
         * @private
         * @see 검색을 위한 컨트롤에 대하여 필요 초기화를 진행 합니다. 
         */
        _doInitSearch: function () {
            // var sSurffix = this.byId("page").getHeaderExpanded() ? "E": "S";

            // this.getView().setModel(this.getOwnerComponent().getModel());

            // /** Date */
            // var today = new Date();

            // this.getView().byId("searchDateS").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateS").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            // this.getView().byId("searchDateE").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()-90));
            // this.getView().byId("searchDateE").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        },

        /**
        * @public
        * @see 사용처 DialogCreate Fragment Open 이벤트
        */

        onDialogTreeCreate: function () {
            var oView = this.getView();

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            // var aSearchFilters = [];


            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();


                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0 && s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {

                    if (!this.treeDialog) {
                        this.treeDialog = Fragment.load({
                            id: oView.getId(),
                            name: "pg.vp.vpMgt.view.DialogCreateTree",
                            controller: this
                        }).then(function (tDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(tDialog);
                            return tDialog;
                        });
                    }
                    this.treeDialog.then(function (tDialog) {
                        tDialog.open();
                        this.onDialogTreeSearch();
                        // this.onAfterDialog();
                    }.bind(this));   
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }
            }
            else if (sSurffix === "E") {

                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();

                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0 && s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {

                    if (!this.treeDialog) {
                        this.treeDialog = Fragment.load({
                            id: oView.getId(),
                            name: "pg.vp.vpMgt.view.DialogCreateTree",
                            controller: this
                        }).then(function (tDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(tDialog);
                            return tDialog;
                        });
                    }
                    this.treeDialog.then(function (tDialog) {
                        tDialog.open();
                        this.onDialogTreeSearch();
                        // this.onAfterDialog();
                    }.bind(this));                    

                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }

            }

            // if (!this.treeDialog) {
            //     this.treeDialog = Fragment.load({
            //         id: oView.getId(),
            //         name: "pg.vp.vpMgt.view.DialogCreateTree",
            //         controller: this
            //     }).then(function (tDialog) {
            //         // connect dialog to the root view of this component (models, lifecycle)
            //         oView.addDependent(tDialog);
            //         return tDialog;
            //     });
            // }
            // this.treeDialog.then(function (tDialog) {
            //     tDialog.open();
            //     this.onDialogTreeSearch();
            //     // this.onAfterDialog();
            // }.bind(this));
        },

        createTreePopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("ceateVpCategorytree").close();
        },


        onDialogCreate: function () {

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            var oView = this.getView();

            if (sSurffix == "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();


                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0 && s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {

                    if (!this.pDialog) {
                        this.pDialog = Fragment.load({
                            id: oView.getId(),
                            name: "pg.vp.vpMgt.view.DialogCreate",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }
                    this.pDialog.then(function (oDialog) {
                        oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
                        oDialog.open();
                        this.onAfterDialog();
                    }.bind(this));



                    // this.byId("tpop_Operation_ORG").setSelectedKey(s_Operation_ORG_S);
                    // this.byId("tpop_operation_unit_code").setSelectedKey(s_Operation_UNIT_S);

                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }
            }
            else if (sSurffix == "E") {

                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();

                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0 && s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {

                    if (!this.pDialog) {
                        this.pDialog = Fragment.load({
                            id: oView.getId(),
                            name: "pg.vp.vpMgt.view.DialogCreate",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            return oDialog;
                        });
                    }
                    this.pDialog.then(function (oDialog) {
                        oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
                        oDialog.open();
                        this.onAfterDialog();
                    }.bind(this));

                    // this.byId("tpop_Operation_ORG").setSelectedKey(s_Operation_ORG_E);
                    // this.byId("tpop_operation_unit_code").setSelectedKey(s_Operation_UNIT_E);                    
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }

            }

            reSearchVpNm = "";
            if (!!this.byId("tpop_vendor_pool_local_name")) {
                this.byId("tpop_vendor_pool_local_name").setValue("");

            }

            // var oView = this.getView();

            // if (!this.pDialog) {
            // 	this.pDialog = Fragment.load({
            // 		id: oView.getId(),
            // 		name: "pg.vp.vpMgt.view.DialogCreate",
            // 		controller: this
            // 	}).then(function (oDialog) {
            // 		// connect dialog to the root view of this component (models, lifecycle)
            // 		oView.addDependent(oDialog);
            // 		return oDialog;
            // 	});
        },



        onAfterDialog: function () {

            //화면 LAYOUT
            this.byId("pop_save_bt").setVisible(false);
            this.byId("pop_vendor_pool_local_name").setEnabled(false);
            this.byId("pop_vendor_pool_english_name").setEnabled(false);
            this.byId("pop_vendor_pool_desc").setEnabled(false);
            this.byId("pop_repr_department_name").setEnabled(false);
            this.byId("pop_industry_class_code").setEnabled(false);
            this.byId("pop_inp_type_code").setEnabled(false);
            this.byId("pop_plan_base").setEnabled(false);
            this.byId("pop_regular_evaluation_flag").setEnabled(false);
            this.byId("pop_maker_material_code_mngt_flag").setEnabled(false);
            this.byId("pop_sd_exception_flag").setEnabled(false);
            // this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(false);
            this.byId("pop_equipment_grade_code").setEnabled(false);
            this.byId("pop_equipment_type_code").setEnabled(false);
            this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(false);
            this.byId("pop_domestic_net_price_diff_rate").setEnabled(false);

            this.resetValue();



            // var oView = this.getView();
            // var oModel = oView.getModel("VpMst");  
            // oModel.setTransactionModel(oView.getModel());
            // oModel.read("/VpMst", {
            //     success: function(oData){
            //         oView.setBusy(false);
            //     }
            // });   

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();
                this.byId("tpop_Operation_ORG").setSelectedKey(s_Operation_ORG_S);
                this.byId("tpop_operation_unit_code").setSelectedKey(s_Operation_UNIT_S);



            }
            else if (sSurffix === "E") {

                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                this.byId("tpop_Operation_ORG").setSelectedKey(s_Operation_ORG_E);
                this.byId("tpop_operation_unit_code").setSelectedKey(s_Operation_UNIT_E);

            }

            this.onDialogSearch();
            this.handleCreateInput();

        },
        onDialogCreatelower: function () {

            btType = "l";
            if (this.byId("tpop_Operation_ORG").getSelectedKey() &&
                this.byId("tpop_Operation_ORG").getSelectedKey().length > 0 &&
                this.byId("tpop_operation_unit_code").getSelectedKey() &&
                this.byId("tpop_operation_unit_code").getSelectedKey().length > 0 && this.byId("treeTable").getSelectedIndices().length > 0) {

                this.handleCreateInput();

                if (pop_h_lv == "0") {
                    pop_target_level = "1";
                } else if (pop_h_lv == "1") {
                    pop_target_level = "2";
                }

                if (pop_h_lv == "2") {
                    MessageToast.show("해당 Operation Unit에서 정의된 레벨 하위는 구성할 수 없습니다.");
                }
                else if (pop_h_lv == "1") {
                    pop_d_state = "leaf"
                    this.byId("pop_higher_level_path").setText(pop_lv);
                    this.byId("pop_operation_unit_name").setText(pop_org);
                    this.byId("pop_operation_unit_name1").setText(this.byId("tpop_operation_unit_code").getValue());

                    //화면 LAYOUT

                    this.byId("pop_detail_info").setText("Detail Info");
                    this.byId("v_pop_repr_department_code").setVisible(true);
                    this.byId("v_pop_industry_class_code").setVisible(true);
                    this.byId("v_pop_inp_type_code").setVisible(true);
                    this.byId("v_pop_regular_evaluation_flag").setVisible(true);
                    this.byId("v_pop_sd_exception_flag").setVisible(true);
                    this.byId("v_pop_maker_material_code_mngt_flag").setVisible(true);
                    // this.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(true);
                    this.byId("v_review_grade").setVisible(true);
                    this.byId("v_equipment_type").setVisible(true);
                    this.byId("v_internal_rate").setVisible(true);
                    this.byId("v_external_rate").setVisible(true);
                    // this.byId("equipment_box").setVisible(true);
                    // this.byId("rate_box").setVisible(true);

                    this.handleCreateInput();

                    this.byId("pop_save_bt").setVisible(true);
                    this.byId("pop_vendor_pool_local_name").setEnabled(true);
                    this.byId("pop_vendor_pool_english_name").setEnabled(true);
                    this.byId("pop_vendor_pool_desc").setEnabled(true);
                    this.byId("pop_repr_department_name").setEnabled(true);
                    this.byId("pop_industry_class_code").setEnabled(true);
                    this.byId("pop_inp_type_code").setEnabled(true);
                    this.byId("pop_plan_base").setEnabled(true);
                    this.byId("pop_regular_evaluation_flag").setEnabled(true);
                    this.byId("pop_sd_exception_flag").setEnabled(true);
                    this.byId("pop_maker_material_code_mngt_flag").setEnabled(true);
                    // this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(true);
                    this.byId("pop_equipment_grade_code").setEnabled(true);
                    this.byId("pop_equipment_type_code").setEnabled(true);
                    this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(true);
                    this.byId("pop_domestic_net_price_diff_rate").setEnabled(true);
                }
                else {
                    this.byId("pop_higher_level_path").setText(pop_lv);
                    this.byId("pop_operation_unit_name").setText(pop_org);
                    this.byId("pop_operation_unit_name1").setText(this.byId("tpop_operation_unit_code").getValue());
                    //화면 LAYOUT
                    this.byId("pop_detail_info").setText("");
                    this.byId("v_pop_repr_department_code").setVisible(false);
                    this.byId("v_pop_industry_class_code").setVisible(false);
                    this.byId("v_pop_inp_type_code").setVisible(false);
                    this.byId("v_pop_regular_evaluation_flag").setVisible(false);
                    this.byId("v_pop_sd_exception_flag").setVisible(false);
                    this.byId("v_pop_maker_material_code_mngt_flag").setVisible(false);
                    // this.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(false);
                    this.byId("v_review_grade").setVisible(false);
                    this.byId("v_equipment_type").setVisible(false);
                    this.byId("v_internal_rate").setVisible(false);
                    this.byId("v_external_rate").setVisible(false);
                    // this.byId("equipment_box").setVisible(false);
                    // this.byId("rate_box").setVisible(false);


                    this.byId("pop_save_bt").setVisible(true);
                    this.byId("pop_vendor_pool_local_name").setEnabled(true);
                    this.byId("pop_vendor_pool_english_name").setEnabled(true);
                    this.byId("pop_vendor_pool_desc").setEnabled(true);
                    this.byId("pop_repr_department_name").setEnabled(false);
                    this.byId("pop_industry_class_code").setEnabled(false);
                    this.byId("pop_inp_type_code").setEnabled(false);
                    this.byId("pop_plan_base").setEnabled(false);
                    this.byId("pop_regular_evaluation_flag").setEnabled(false);
                    this.byId("pop_sd_exception_flag").setEnabled(false);
                    this.byId("pop_maker_material_code_mngt_flag").setEnabled(false);
                    // this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(false);
                    this.byId("pop_equipment_grade_code").setEnabled(false);
                    this.byId("pop_equipment_type_code").setEnabled(false);
                    this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(false);
                    this.byId("pop_domestic_net_price_diff_rate").setEnabled(false);
                }
            } else {
                MessageToast.show("필수값과 Vendor Pool를 입력하세요 ");
            }
        },

        onDialogCreateSame: function () {

            btType = "s";

            pop_target_level = pop_h_lv;

            if (this.byId("tpop_Operation_ORG").getSelectedKey() &&
                this.byId("tpop_Operation_ORG").getSelectedKey().length > 0 &&
                this.byId("tpop_operation_unit_code").getSelectedKey() &&
                this.byId("tpop_operation_unit_code").getSelectedKey().length > 0 &&
                this.byId("treeTable").getSelectedIndices().length > 0) {


                this.handleCreateInput();
                // if(pop_h_lv == "0")
                // {
                //     // MessageBox.error("추후 ORG UNIT 입력가능 콤보로 변경  *임시*");
                //     this.byId("pop_higher_level_path").setText(pop_h_path);
                //     this.byId("pop_operation_unit_name").setText(pop_org);
                // }
                // else 
                if (pop_target_level == "2") {
                    this.byId("pop_higher_level_path").setText(pop_h_path);
                    this.byId("pop_operation_unit_name").setText(pop_org);
                    this.byId("pop_operation_unit_name1").setText(this.byId("tpop_operation_unit_code").getValue());
                    //화면 LAYOUT
                    this.byId("pop_detail_info").setText("Detail Info");
                    this.byId("v_pop_repr_department_code").setVisible(true);
                    this.byId("v_pop_industry_class_code").setVisible(true);
                    this.byId("v_pop_inp_type_code").setVisible(true);
                    this.byId("v_pop_regular_evaluation_flag").setVisible(true);
                    this.byId("v_pop_sd_exception_flag").setVisible(true);
                    this.byId("v_pop_maker_material_code_mngt_flag").setVisible(true);
                    // this.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(true);
                    this.byId("v_review_grade").setVisible(true);
                    this.byId("v_equipment_type").setVisible(true);
                    this.byId("v_internal_rate").setVisible(true);
                    this.byId("v_external_rate").setVisible(true);
                    // this.byId("equipment_box").setVisible(true);
                    // this.byId("rate_box").setVisible(true);

                    this.handleCreateInput();


                    this.byId("pop_save_bt").setVisible(true);
                    this.byId("pop_vendor_pool_local_name").setEnabled(true);
                    this.byId("pop_vendor_pool_english_name").setEnabled(true);
                    this.byId("pop_vendor_pool_desc").setEnabled(true);
                    this.byId("pop_repr_department_name").setEnabled(true);
                    this.byId("pop_industry_class_code").setEnabled(true);
                    this.byId("pop_inp_type_code").setEnabled(true);
                    this.byId("pop_plan_base").setEnabled(true);
                    this.byId("pop_regular_evaluation_flag").setEnabled(true);
                    this.byId("pop_sd_exception_flag").setEnabled(true);
                    // this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(true);
                    this.byId("pop_maker_material_code_mngt_flag").setEnabled(true);
                    this.byId("pop_equipment_grade_code").setEnabled(true);
                    this.byId("pop_equipment_type_code").setEnabled(true);
                    this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(true);
                    this.byId("pop_domestic_net_price_diff_rate").setEnabled(true);

                } else {
                    this.byId("pop_higher_level_path").setText(pop_h_path);
                    this.byId("pop_operation_unit_name").setText(pop_org);
                    this.byId("pop_operation_unit_name1").setText(this.byId("tpop_operation_unit_code").getValue());
                    //화면 LAYOUT
                    this.byId("pop_detail_info").setText("");
                    this.byId("v_pop_repr_department_code").setVisible(false);
                    this.byId("v_pop_industry_class_code").setVisible(false);
                    this.byId("v_pop_inp_type_code").setVisible(false);
                    this.byId("v_pop_regular_evaluation_flag").setVisible(false);
                    this.byId("v_pop_sd_exception_flag").setVisible(false);
                    this.byId("v_pop_maker_material_code_mngt_flag").setVisible(false);
                    // this.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(false);
                    this.byId("v_review_grade").setVisible(false);
                    this.byId("v_equipment_type").setVisible(false);
                    this.byId("v_internal_rate").setVisible(false);
                    this.byId("v_external_rate").setVisible(false);
                    // this.byId("equipment_box").setVisible(false);
                    // this.byId("rate_box").setVisible(false);                    




                    this.byId("pop_save_bt").setVisible(true);
                    this.byId("pop_vendor_pool_local_name").setEnabled(true);
                    this.byId("pop_vendor_pool_english_name").setEnabled(true);
                    this.byId("pop_vendor_pool_desc").setEnabled(true);
                    this.byId("pop_repr_department_name").setEnabled(false);
                    this.byId("pop_industry_class_code").setEnabled(false);
                    this.byId("pop_inp_type_code").setEnabled(false);
                    this.byId("pop_plan_base").setEnabled(false);
                    this.byId("pop_regular_evaluation_flag").setEnabled(false);
                    this.byId("pop_sd_exception_flag").setEnabled(false);
                    // this.byId("pop_vendor_pool_apply_exception_flag").setEnabled(false);
                    this.byId("pop_maker_material_code_mngt_flag").setEnabled(false);
                    this.byId("pop_equipment_grade_code").setEnabled(false);
                    this.byId("pop_equipment_type_code").setEnabled(false);
                    this.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(false);
                    this.byId("pop_domestic_net_price_diff_rate").setEnabled(false);
                }


                // this.getView().byId("pop_vendor_pool_local_name").setValue("");

            } else {
                MessageToast.show("필수값과 Vendor Pool를 입력하세요 ");
            }
        },

        onDialogDel: function () {

            if (this.byId("treeTable").getSelectedIndices().length > 0) {

                var oModel = this.getModel("vpMappingProc"),
                    oView = this.getView(),
                    oBundle = this.getView().getModel("i18n").getResourceBundle(),
                    sMsg,
                    v_returnModel,
                    urlInfo = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingChangeTestProc";

                var inputInfo = {},
                    vpMstList = []

                inputInfo = {
                    inputData: {
                        vpMst: [],
                        vpSupplier: [],
                        vpItem: [],
                        vpManager: [],
                        user_id: "testerId",
                        user_no: "testerNo"
                    }
                };


                // if(){

                // }    

                vpMstList.push({

                    tenant_id: pop_t_id //auto set
                    , company_code: pop_com_cd //auto set
                    , org_type_code: pop_orgtype  //auto set
                    , org_code: pop_org  //auto set
                    , vendor_pool_code: pop_vp_cd  //auto set
                    , crud_type_code: "D" // 삭제
                    , leaf_flag: (pop_d_state == "leaf") ? true : false

                });

                inputInfo.inputData.vpMst = vpMstList;

                $.ajax({
                    url: urlInfo,
                    type: "POST",
                    //datatype: "json",
                    //data: input,
                    data: JSON.stringify(inputInfo),
                    contentType: "application/json",
                    success: function (data) {
                        //MessageToast.show("Success 1st Proc!");
                        console.log('data:', data);
                        console.log('data:', data.value[0]);
                        v_returnModel = oView.getModel("returnModel").getData().data;
                        console.log('v_returnModel:', v_returnModel);
                        v_returnModel.return_code = data.value[0].return_code;
                        v_returnModel.return_msg = data.value[0].return_msg.substring(0, 8);
                        oView.getModel("returnModel").updateBindings(true);

                        //MessageToast.show(data.value[0].return_msg);
                        console.log(data.value[0].return_msg.substring(0, 8));
                        //sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                        sMsg = oBundle.getText(data.value[0].return_msg.substring(0, 8));
                        //MessageToast.show(sMsg);
                        console.log(data.value[0].return_msg);
                        // alert(sMsg);
                        MessageToast.show(sMsg);
                        that.onDialogSearch();
                    },
                    error: function (e) {
                        var eMessage = "callProcError",
                            errorType,
                            eMessageDetail;

                        v_returnModel = oView.getModel("returnModel").getData().data;
                        console.log('v_returnModel_e:', v_returnModel);
                        v_returnModel.return_code = 'error';
                        v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);


                        //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                        if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                            eMessage = "callProcError";
                            eMessageDetail = "callProcError";
                        } else {
                            eMessage = e.responseJSON.error.message.substring(0, 8);
                            eMessageDetail = e.responseJSON.error.message.substring(9);
                            errorType = e.responseJSON.error.message.substring(0, 1);
                            console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                            //MessageToast.show(eMessageDetail);
                        }

                        sMsg = oBundle.getText(eMessage);
                        if (errorType === 'E') {
                            // alert(sMsg);
                        } else {
                            MessageToast.show(eMessageDetail);
                        }


                        MessageToast.show(sMsg);
                    }
                });
            } else {
                MessageToast.show("삭제대상 Vendor Pool를 선택 하세요. ");
            }

        },

        onCheck: function (event) {
            // debugger;

            //선택된 Tree Table Index
            // var oTable = this.byId("treeTable");
            // var aIndices = oTable.getSelectedIndices();
            //선택된 Tree Table Value 
            // var p_vendor_pool_local_name = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[0].mProperties.text
            // var p_higher_level_path = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[1].mProperties.text            
            // var p_level_path = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[2].mProperties.text
            // var p_org_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[3].mProperties.text            
            // var p_hierarchy_level = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[4].mProperties.text            
            // var p_tenant_id = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[5].mProperties.text
            // var p_company_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[6].mProperties.text            
            // var p_org_type_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[7].mProperties.text            
            // var p_parent_vendor_pool_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[8].mProperties.text   
            // var p_operation_unit_code = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[9].mProperties.text   
            // var p_d_state = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[10].mProperties.text  
            // var p_vp_cd = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[11].mProperties.text  

            var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);

            // alert("p_vendor_pool_local_name : " + p_vendor_pool_local_name  + 
            // "   p_higher_level_path : " + p_higher_level_path + 
            // "   p_level_path : " + p_level_path + 
            // "   p_hierarchy_level : " + p_hierarchy_level + 
            // "   p_operation_unit_code : " + p_operation_unit_code);

            //Tree Table 선택된 값을 변수에 선언하여 후에 Create Action 활용
            pop_h_lv = row.hierarchy_level;
            pop_h_path = row.higher_level_path;
            pop_lv = row.level_path;
            pop_org = row.org_code;
            pop_t_id = row.tenant_id;
            pop_com_cd = row.company_code;
            pop_orgtype = row.org_type_code;
            pop_p_vp_cd = row.parent_vendor_pool_code;
            pop_o_unitcode = row.operation_unit_code;
            // pop_hierarchy_level= row.;
            
            pop_d_state = row.drill_state;
            pop_vp_cd = row.vendor_pool_code;
            console.log(this.getModel("util"));

        },

        createPopupClose: function (oEvent) {
            console.log(oEvent);
            this.byId("ceateVpCategory").close();
        },

        resetValue: function () {

            this.getView().byId("pop_higher_level_path").setText("");
            this.getView().byId("pop_operation_unit_name").setText("");
            this.getView().byId("pop_operation_unit_name1").setText("");
            this.getView().byId("pop_vendor_pool_local_name").setValue("");
            this.getView().byId("pop_vendor_pool_english_name").setValue("");
            this.getView().byId("pop_vendor_pool_desc").setValue("");
            this.getView().byId("pop_repr_department_name").setValue("");
            // this.getView().byId("pop_repr_department_code").setSelectedKey("");
            // this.getView().byId("general_industry_class_code").setSelectedKey("");
            this.getView().byId("pop_industry_class_code").setSelectedKey("");
            this.getView().byId("pop_inp_type_code").setSelectedKey("");
            this.getView().byId("pop_plan_base").setSelectedKey("");
            this.getView().byId("pop_regular_evaluation_flag").setSelectedKey("false");
            this.getView().byId("pop_sd_exception_flag").setSelectedKey("false");
            // this.getView().byId("pop_vendor_pool_apply_exception_flag").setState(false);
            this.getView().byId("pop_maker_material_code_mngt_flag").setSelectedKey("false");
            this.getView().byId("pop_equipment_grade_code").setSelectedKey("");
            this.getView().byId("pop_equipment_type_code").setSelectedKey("");
            this.getView().byId("pop_dom_oversea_netprice_diff_rate").setValue("");
            this.getView().byId("pop_domestic_net_price_diff_rate").setValue("");
            this.byId("v_pop_plan_base").setVisible(false);
        },

        handlemtlChang: function (event) {

            var mtl = this.getView().byId("pop_inp_type_code").getSelectedKey();
            if (mtl == "MBLMOB") {
                this.byId("v_pop_plan_base").setVisible(true);

            } else {
                this.byId("v_pop_plan_base").setVisible(false);
            }

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


            if (oper_unit == "EQUIPMENT") {
                this.byId("table_review_grade").setVisible(true);
                this.byId("table_equipment_type").setVisible(true);
            } else {
                this.byId("table_review_grade").setVisible(false);
                this.byId("table_equipment_type").setVisible(false);
            }

            if (maxLv =="3") {

                this.byId("table_1lv").setVisible(true);
                this.byId("table_2lv").setVisible(true);
                this.byId("table_3lv").setVisible(true);
                this.byId("table_4lv").setVisible(false);
                this.byId("table_5lv").setVisible(false);

            }else if (maxLv =="4") {

                this.byId("table_1lv").setVisible(true);
                this.byId("table_2lv").setVisible(true);
                this.byId("table_3lv").setVisible(true);
                this.byId("table_4lv").setVisible(true);
                this.byId("table_5lv").setVisible(false);

            }else if (maxLv =="5") {

                this.byId("table_1lv").setVisible(true);
                this.byId("table_2lv").setVisible(true);
                this.byId("table_3lv").setVisible(true);
                this.byId("table_4lv").setVisible(true);
                this.byId("table_5lv").setVisible(true);

            }else if (maxLv =="2") {

                this.byId("table_1lv").setVisible(true);
                this.byId("table_2lv").setVisible(true);
                this.byId("table_3lv").setVisible(false);
                this.byId("table_4lv").setVisible(false);
                this.byId("table_5lv").setVisible(false);                
            }

        },

        handleCreateInput: function () {
            var oper_unit = this.getView().byId("tpop_operation_unit_code").getSelectedKey();

            if (oper_unit == "EQUIPMENT") {
                this.byId("v_review_grade").setVisible(true);
                this.byId("v_equipment_type").setVisible(true);
                this.byId("v_internal_rate").setVisible(false);
                this.byId("v_external_rate").setVisible(false);
                // this.byId("equipment_box").setVisible(true);
                // this.byId("rate_box").setVisible(false);
            } else {
                this.byId("v_review_grade").setVisible(false);
                this.byId("v_equipment_type").setVisible(false);
                this.byId("v_internal_rate").setVisible(true);
                this.byId("v_external_rate").setVisible(true);
                // this.byId("equipment_box").setVisible(false);
                // this.byId("rate_box").setVisible(true);                
            }

        },


        handleSave: function (oEvent) {

            var stenant_id = pop_t_id;
            var scompany_code = pop_com_cd;
            var sorg_type_code = pop_orgtype;
            var sorg_code = pop_org;
            var soperation_unit_code = pop_o_unitcode;
            if (btType === "s") {
                var sparent_vendor_pool_code = pop_p_vp_cd;
            } else if (btType === "l") {
                var sparent_vendor_pool_code = pop_vp_cd;
            }
            // var sparent_vendor_pool_code = pop_p_vp_cd;
            // var svendor_pool_code = "VP202010280410";
            var svendor_pool_use_flag = true;
            var svendor_pool_local_name = this.getView().byId("pop_vendor_pool_local_name").getValue().trim();
            var svendor_pool_english_name = this.getView().byId("pop_vendor_pool_english_name").getValue().trim();
            var svendor_pool_desc = this.getView().byId("pop_vendor_pool_desc").getValue().trim();

            if (pop_d_state == "leaf") {

                var eval_flag = this.getView().byId("pop_regular_evaluation_flag").getSelectedKey();
                var mngt_flag = this.getView().byId("pop_maker_material_code_mngt_flag").getSelectedKey();
                var sd_flag = this.getView().byId("pop_sd_exception_flag").getSelectedKey();
                // var vp_flag = this.getView().byId("general_vendor_pool_apply_exception_flag").getSelectedKey();

                if(eval_flag == "true"){
                    eval_flag = true;
                }else{
                    eval_flag = false;
                }
                if(mngt_flag == "true"){
                    mngt_flag = true;
                }else{
                    mngt_flag = false;
                }
                if(sd_flag == "true"){
                    sd_flag = true;
                }else{
                    sd_flag = false;
                }
                
                var srepr_department_code = this.getView().byId("pop_repr_department_code").getValue().trim();
                var sindustry_class_code = this.getView().byId("pop_industry_class_code").getSelectedKey();
                var sinp_type_code = this.getView().byId("pop_inp_type_code").getSelectedKey();
                var splan_base = this.getView().byId("pop_plan_base").getSelectedKey();
                var sregular_evaluation_flag = eval_flag;
                var smaker_material_code_mngt_flag = mngt_flag;
                var ssd_exception_flag = sd_flag;
                // var svendor_pool_apply_exception_flag = this.getView().byId("pop_vendor_pool_apply_exception_flag").getState();
                var sequipment_grade_code = this.getView().byId("pop_equipment_grade_code").getSelectedKey();
                var sequipment_type_code = this.getView().byId("pop_equipment_type_code").getSelectedKey();
                var sdom_oversea_netprice_diff_rate = this.getView().byId("pop_dom_oversea_netprice_diff_rate").getValue().trim();
                var sdomestic_net_price_diff_rate = this.getView().byId("pop_domestic_net_price_diff_rate").getValue().trim();
            }

            var oModel = this.getModel("vpMappingProc"),
                oView = this.getView(),
                oBundle = this.getView().getModel("i18n").getResourceBundle(),
                sMsg,
                sLeaf,
                sVendorPoolCode,
                sCLeaf,
                sLevel,
                v_returnModel,
                urlInfo = "srv-api/odata/v4/pg.VpMappingV4Service/VpMappingChangeTestProc";

            var inputInfo = {},
                vpMstList = []

            inputInfo = {
                inputData: {
                    vpMst: [],
                    vpSupplier: [],
                    vpItem: [],
                    vpManager: [],
                    user_id: "testerId",
                    user_no: "testerNo"
                }
            };
            that = this;
            if (pop_h_lv === "0") {
                pop_h_lv = "1";
            } else if (pop_h_lv === "1") {
                pop_h_lv = "2";
            } else if (pop_h_lv === "2") {
                pop_h_lv = "3";
            }

            if (pop_d_state == "leaf")  {

                vpMstList.push({

                    tenant_id: pop_t_id //auto set
                    , company_code: pop_com_cd //auto set
                    , org_type_code: pop_orgtype  //auto set
                    , org_code: pop_org  //auto set
                    , level_number: Number(pop_h_lv) //auto set
                    // ,vendor_pool_code: pop_vp_cd  //auto set
                    , crud_type_code: "C" // 신규
                    , leaf_flag : (pop_d_state == "leaf") ? true : false
                    , operation_unit_code: soperation_unit_code
                    , parent_vendor_pool_code: sparent_vendor_pool_code
                    , vendor_pool_use_flag: svendor_pool_use_flag
                    , vendor_pool_local_name: svendor_pool_local_name
                    , vendor_pool_english_name: svendor_pool_english_name
                    , vendor_pool_desc: svendor_pool_desc
                    , repr_department_code: srepr_department_code
                    // , repr_department_code: "11010002"
                    , industry_class_code: sindustry_class_code
                    , inp_type_code: sinp_type_code
                    , mtlmob_base_code: splan_base
                    , maker_material_code_mngt_flag: smaker_material_code_mngt_flag
                    , regular_evaluation_flag: sregular_evaluation_flag
                    , sd_exception_flag: ssd_exception_flag
                    // , vendor_pool_apply_exception_flag: svendor_pool_apply_exception_flag
                    , equipment_grade_code: sequipment_grade_code
                    , equipment_type_code: sequipment_type_code
                    // "local_create_dtm": "2020-11-09T00:00:00Z",
                    // "local_update_dtm": "2020-11-09T00:00:00Z",
                    , dom_oversea_netprice_diff_rate: parseFloat(sdom_oversea_netprice_diff_rate)
                    , domestic_net_price_diff_rate: parseFloat(sdomestic_net_price_diff_rate)
                });

                inputInfo.inputData.vpMst = vpMstList;


            } else {

                vpMstList.push({

                    tenant_id: pop_t_id //auto set
                    , company_code: pop_com_cd //auto set
                    , org_type_code: pop_orgtype  //auto set
                    , org_code: pop_org  //auto set
                    , level_number: Number(pop_h_lv) //auto set
                    // ,vendor_pool_code: pop_vp_cd  //auto set
                    , crud_type_code: "C" // 신규
                    , leaf_flag : (pop_d_state == "leaf") ? true : false
                    , operation_unit_code: soperation_unit_code
                    , parent_vendor_pool_code: sparent_vendor_pool_code
                    , vendor_pool_use_flag: svendor_pool_use_flag
                    , vendor_pool_local_name: svendor_pool_local_name
                    , vendor_pool_english_name: svendor_pool_english_name
                    , vendor_pool_desc: svendor_pool_desc

                });

                inputInfo.inputData.vpMst = vpMstList;
            }
            $.ajax({
                url: urlInfo,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(inputInfo),
                contentType: "application/json",
                success: function (data) {
                    //MessageToast.show("Success 1st Proc!");
                    console.log('data:', data);
                    console.log('data:', data.value[0]);
                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel:', v_returnModel);
                    v_returnModel.return_code = data.value[0].return_code;
                    v_returnModel.return_msg = data.value[0].return_msg.substring(0, 8);
                    v_returnModel.return_vendor_pool_code =  data.value[0].return_msg.substring(9, 23);
                    v_returnModel.return_leaf_yn =  data.value[0].return_msg.substring(23, 24);
                    v_returnModel.return_child_leaf_yn =  data.value[0].return_msg.substring(24, 25);
                    v_returnModel.return_node_level =  data.value[0].return_msg.substring(25, 26);                    
                    oView.getModel("returnModel").updateBindings(true);

                    //MessageToast.show(data.value[0].return_msg);
                    console.log(data.value[0].return_msg.substring(0, 8));
                    //sMsg = oBundle.getText("returnMsg", [data.value[0].return_msg]);
                    sMsg = oBundle.getText(data.value[0].return_msg.substring(0, 8));
                    sVendorPoolCode = oBundle.getText(data.value[0].return_msg.substring(9, 23));
                    sLeaf = oBundle.getText(data.value[0].return_msg.substring(23, 24));
                    sCLeaf = oBundle.getText(data.value[0].return_msg.substring(24, 25));
                    sLevel = oBundle.getText(data.value[0].return_msg.substring(25, 26));                    
                    //MessageToast.show(sMsg);
                    console.log(data.value[0].return_msg);
                    // alert(sMsg);

                    var returnLeaf;                    
                    if(sLeaf == "T")
                    {
                        MessageToast.show(sMsg);
                        //생성시 사용된 Name를 이용하여 재조회
                        reSearchVpNm = svendor_pool_local_name;
                        reSearchOpCd = soperation_unit_code;
                        reSearchOrgCd = sorg_code;
                        that.onAfterDialog();
                    }else{
                        
                        // MessageBox.confirm(sMsg + "\n 하위레벨을 생성 할 수 있습니다.\n 생성하시겠습니까?");
                        MessageBox.confirm(sMsg + "\n 하위레벨을 생성 할 수 있습니다.\n 생성하시겠습니까?", {
                            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                if(sAction=="OK")
                                {
                                     btType = "l";
                                     pop_h_lv = sLevel;
                                    if (pop_h_lv === "0") {
                                        pop_h_lv = "1";
                                    } else if (pop_h_lv === "1") {
                                        pop_h_lv = "2";
                                    } else if (pop_h_lv === "2") {
                                        pop_h_lv = "3";
                                    }
                                    if(sLevel == "1")
                                    {
                                        pop_lv = svendor_pool_local_name;
                                    }else{
                                        pop_lv = pop_lv + " > " +  svendor_pool_local_name;
                                    }
                                    
                                    pop_vp_cd = sVendorPoolCode;

                                    reSearchVpNm = svendor_pool_local_name;
                                    reSearchOpCd = soperation_unit_code;
                                    reSearchOrgCd = sorg_code;
                                    that.onAfterDialog();
                                    //  sparent_vendor_pool_code = sVendorPoolCode;
                                     
                                    if (that.byId("tpop_Operation_ORG").getSelectedKey() &&
                                        that.byId("tpop_Operation_ORG").getSelectedKey().length > 0 &&
                                        that.byId("tpop_operation_unit_code").getSelectedKey() &&
                                        that.byId("tpop_operation_unit_code").getSelectedKey().length > 0) {

                                        that.handleCreateInput();
                                        
                                        if (sCLeaf == "T") {
                                            pop_d_state = "leaf";
                                            that.byId("pop_higher_level_path").setText(pop_lv);
                                            that.byId("pop_operation_unit_name").setText(pop_org);
                                            that.byId("pop_operation_unit_name1").setText(that.byId("tpop_operation_unit_code").getValue());

                                            //화면 LAYOUT

                                            that.byId("pop_detail_info").setText("Detail Info");
                                            that.byId("v_pop_repr_department_code").setVisible(true);
                                            that.byId("v_pop_industry_class_code").setVisible(true);
                                            that.byId("v_pop_inp_type_code").setVisible(true);
                                            that.byId("v_pop_regular_evaluation_flag").setVisible(true);
                                            that.byId("v_pop_sd_exception_flag").setVisible(true);
                                            that.byId("v_pop_maker_material_code_mngt_flag").setVisible(true);
                                            // that.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(true);
                                            that.byId("v_review_grade").setVisible(true);
                                            that.byId("v_equipment_type").setVisible(true);
                                            that.byId("v_internal_rate").setVisible(true);
                                            that.byId("v_external_rate").setVisible(true);
                                            // this.byId("equipment_box").setVisible(true);
                                            // this.byId("rate_box").setVisible(true);

                                            that.handleCreateInput();

                                            that.byId("pop_save_bt").setVisible(true);
                                            that.byId("pop_vendor_pool_local_name").setEnabled(true);
                                            that.byId("pop_vendor_pool_english_name").setEnabled(true);
                                            that.byId("pop_vendor_pool_desc").setEnabled(true);
                                            that.byId("pop_repr_department_name").setEnabled(true);
                                            that.byId("pop_industry_class_code").setEnabled(true);
                                            that.byId("pop_inp_type_code").setEnabled(true);
                                            that.byId("pop_plan_base").setEnabled(true);
                                            that.byId("pop_regular_evaluation_flag").setEnabled(true);
                                            that.byId("pop_sd_exception_flag").setEnabled(true);
                                            that.byId("pop_maker_material_code_mngt_flag").setEnabled(true);
                                            // that.byId("pop_vendor_pool_apply_exception_flag").setEnabled(true);
                                            that.byId("pop_equipment_grade_code").setEnabled(true);
                                            that.byId("pop_equipment_type_code").setEnabled(true);
                                            that.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(true);
                                            that.byId("pop_domestic_net_price_diff_rate").setEnabled(true);
                                        }
                                        else if(sCLeaf == "F") {
                                            that.byId("pop_higher_level_path").setText(pop_lv);
                                            that.byId("pop_operation_unit_name").setText(pop_org);
                                            that.byId("pop_operation_unit_name1").setText(that.byId("tpop_operation_unit_code").getValue());
                                            that  //화면 LAYOUT
                                            that.byId("pop_detail_info").setText("");
                                            that.byId("v_pop_repr_department_code").setVisible(false);
                                            that.byId("v_pop_industry_class_code").setVisible(false);
                                            that.byId("v_pop_inp_type_code").setVisible(false);
                                            that.byId("v_pop_regular_evaluation_flag").setVisible(false);
                                            that.byId("v_pop_sd_exception_flag").setVisible(false);
                                            that.byId("v_pop_maker_material_code_mngt_flag").setVisible(false);
                                            // that.byId("v_pop_vendor_pool_apply_exception_flag").setVisible(false);
                                            that.byId("v_review_grade").setVisible(false);
                                            that.byId("v_equipment_type").setVisible(false);
                                            that.byId("v_internal_rate").setVisible(false);
                                            that.byId("v_external_rate").setVisible(false);
                                            // this.byId("equipment_box").setVisible(false);
                                            // this.byId("rate_box").setVisible(false);


                                            that.byId("pop_save_bt").setVisible(true);
                                            that.byId("pop_vendor_pool_local_name").setEnabled(true);
                                            that.byId("pop_vendor_pool_english_name").setEnabled(true);
                                            that.byId("pop_vendor_pool_desc").setEnabled(true);
                                            that.byId("pop_repr_department_name").setEnabled(false);
                                            that.byId("pop_industry_class_code").setEnabled(false);
                                            that.byId("pop_inp_type_code").setEnabled(false);
                                            that.byId("pop_plan_base").setEnabled(false);
                                            that.byId("pop_regular_evaluation_flag").setEnabled(false);
                                            that.byId("pop_sd_exception_flag").setEnabled(false);
                                            that.byId("pop_maker_material_code_mngt_flag").setEnabled(false);
                                            // that.byId("pop_vendor_pool_apply_exception_flag").setEnabled(false);
                                            that.byId("pop_equipment_grade_code").setEnabled(false);
                                            that.byId("pop_equipment_type_code").setEnabled(false);
                                            that.byId("pop_dom_oversea_netprice_diff_rate").setEnabled(false);
                                            that.byId("pop_domestic_net_price_diff_rate").setEnabled(false);
                                        }
                                    }

                                }else{
                                    MessageToast.show(sMsg);
                                    //생성시 사용된 Name를 이용하여 재조회
                                    reSearchVpNm = svendor_pool_local_name;
                                    reSearchOpCd = soperation_unit_code;
                                    reSearchOrgCd = sorg_code;
                                    that.onAfterDialog();
                                }
                                
                            }
                        });
                    }

                    // MessageToast.show(sMsg);
                    // //생성시 사용된 Name를 이용하여 재조회
                    // reSearchVpNm = svendor_pool_local_name;
                    // reSearchOpCd = soperation_unit_code;
                    // reSearchOrgCd = sorg_code;
                    // that.onAfterDialog();

                    // that.onDialogSearch();
                    // that.resetValue();
                },
                error: function (e) {
                    var eMessage = "callProcError",
                        errorType,
                        eMessageDetail;

                    v_returnModel = oView.getModel("returnModel").getData().data;
                    console.log('v_returnModel_e:', v_returnModel);
                    v_returnModel.return_code = 'error';
                    v_returnModel.return_msg = e.responseJSON.error.message.substring(0, 8);


                    //sMsg = oBundle.getText("returnMsg", [v_returnModel.return_msg]);
                    if (e.responseJSON.error.message == undefined || e.responseJSON.error.message == null) {
                        eMessage = "callProcError";
                        eMessageDetail = "callProcError";
                    } else {
                        eMessage = e.responseJSON.error.message.substring(0, 8);
                        eMessageDetail = e.responseJSON.error.message.substring(9);
                        errorType = e.responseJSON.error.message.substring(0, 1);
                        console.log('errorMessage!:', e.responseJSON.error.message.substring(9));

                        //MessageToast.show(eMessageDetail);
                    }

                    sMsg = oBundle.getText(eMessage);
                    if (errorType === 'E') {
                        // MessageToast.show(eMessageDetail);
                        // alert(sMsg);
                    } else {
                        MessageToast.show(eMessageDetail);
                        // alert(eMessageDetail);
                    }


                    MessageToast.show(sMsg);
                }
            });


            // alert(" stenant_id  " + stenant_id +
            // "  scompany_code  " + scompany_code +
            // "  sorg_type_code  " + sorg_type_code +
            // "  sorg_code  " + sorg_code +
            // "  svendor_pool_code  " + svendor_pool_code +
            // "  svendor_pool_local_name  " + svendor_pool_local_name +
            // "  svendor_pool_english_name  " + svendor_pool_english_name +
            // "  svendor_pool_desc  " + svendor_pool_desc +
            // "  srepr_department_code  " + srepr_department_code +
            // "  sindustry_class_code  " + sindustry_class_code +
            // "  sinp_type_code  " + sinp_type_code +
            // "  splan_base  " + splan_base +
            // "  sregular_evaluation_flag  " + sregular_evaluation_flag +
            // "  ssd_exception_flag  " + ssd_exception_flag +
            // "  svendor_pool_apply_exception_flag  " + svendor_pool_apply_exception_flag +
            // "  sequipment_grade_code  " + sequipment_grade_code +
            // "  sequipment_type_code  " + sequipment_type_code +
            // "  sdom_oversea_netprice_diff_rate  " + sdom_oversea_netprice_diff_rate +
            // "  sdomestic_net_price_diff_rate  " + sdomestic_net_price_diff_rate
            // );
            // alert( "  soperation_unit_code :  " + soperation_unit_code  + 
            //        "  sparent_vendor_pool_code " + sparent_vendor_pool_code);


            // var oView = this.getView();
            // var oModel = this.getModel("VpMst");
            // // var oModel =  oView.getModel();
            // // console.log(oModel);
            // // oModel.setTransactionModel(this.getModel());
            // if(pop_target_level === "2")
            // {
            //     oModel.addRecord({
            //     "tenant_id" : stenant_id,
            //     "company_code" : scompany_code,
            //     "org_type_code" : sorg_type_code,
            //     "org_code" : sorg_code,
            //     "operation_unit_code" : soperation_unit_code,
            //     "parent_vendor_pool_code" : sparent_vendor_pool_code,
            //     "vendor_pool_use_flag" : svendor_pool_use_flag,
            //     // "vendor_pool_code" : svendor_pool_code,
            //     "vendor_pool_local_name" : svendor_pool_local_name,
            //     "vendor_pool_english_name" : svendor_pool_english_name,
            //     "vendor_pool_desc" : svendor_pool_desc,
            //     "repr_department_code" : srepr_department_code,
            //     "industry_class_code" : sindustry_class_code,
            //     "inp_type_code" : sinp_type_code,
            //     "mtlmob_base_code" : splan_base,
            //     "maker_material_code_mngt_flag " : smaker_material_code_mngt_flag,
            //     "regular_evaluation_flag" : sregular_evaluation_flag,
            //     "sd_exception_flag" : ssd_exception_flag,
            //     "vendor_pool_apply_exception_flag" : svendor_pool_apply_exception_flag,
            //     "equipment_grade_code" : sequipment_grade_code,
            //     "equipment_type_code" : sequipment_type_code,
            //     // "local_create_dtm": "2020-11-09T00:00:00Z",
            //     // "local_update_dtm": "2020-11-09T00:00:00Z",
            //     "dom_oversea_netprice_diff_rate" : sdom_oversea_netprice_diff_rate,
            //     "domestic_net_price_diff_rate" : sdomestic_net_price_diff_rate
            //                 }, 0);
            // }
            // else{


            // oModel.addRecord({
            //     "tenant_id" : stenant_id,
            //     "company_code" : scompany_code,
            //     "org_type_code" : sorg_type_code,
            //     "org_code" : sorg_code,
            //     "operation_unit_code" : soperation_unit_code,
            //     "parent_vendor_pool_code" : sparent_vendor_pool_code,
            //     "vendor_pool_use_flag" : svendor_pool_use_flag,
            //     // "vendor_pool_code" : svendor_pool_code,
            //     "vendor_pool_local_name" : svendor_pool_local_name,
            //     "vendor_pool_english_name" : svendor_pool_english_name,
            //     "vendor_pool_desc" : svendor_pool_desc,
            //         }, 0);
            // }
            // var sServiceUrl = "/VpMst";
            // var oParameters = {
            //     "tenant_id" : stenant_id,
            //     "company_code" : scompany_code,
            //     "org_type_code" : sorg_type_code,
            //     "org_code" : sorg_code,
            //     "vendor_pool_code" : svendor_pool_code,
            //     "vendor_pool_local_name" : svendor_pool_local_name,
            //     "vendor_pool_english_name" : svendor_pool_english_name,
            //     "vendor_pool_desc" : svendor_pool_desc,
            //     "repr_department_code" : srepr_department_code,
            //     "industry_class_code" : sindustry_class_code,
            //     "inp_type_code" : sinp_type_code,
            //     "plan_base" : splan_base,
            //     "regular_evaluation_flag" : sregular_evaluation_flag,
            //     "sd_exception_flag" : ssd_exception_flag,
            //     "vendor_pool_apply_exception_flag" : svendor_pool_apply_exception_flag,
            //     "equipment_grade_code" : sequipment_grade_code,
            //     "equipment_type_code" : sequipment_type_code,
            //     // "dom_oversea_netprice_diff_rate" : sdom_oversea_netprice_diff_rate,
            //     // "domestic_net_price_diff_rate" : sdomestic_net_price_diff_rate,
            //     "local_create_dtm": "2020-11-09T00:00:00Z",
            //     "local_update_dtm": "2020-11-09T00:00:00Z"
            // };


            //oTransactionManager.setServiceModel(this.getModel());
            // var test = this.getModel();
            //test.Create()
            // console.log(oModel);
            // MessageBox.confirm("저장 하시 겠습니까?", {
            //     title : "Comfirmation",
            //     initialFocus : sap.m.MessageBox.Action.CANCEL,
            //     onClose : function(sButton) {
            //         if (sButton === MessageBox.Action.OK) { 
            //             oView.setBusy(true);
            //             // oModel.submit({
            //             // oTransactionManager.submit({

            //             oModel.submitChanges({                                
            //                 success: function(oEvent){
            //                     oView.setBusy(false);
            //                     MessageToast.show("저장 되었습니다.");
            //                 },error: function (oError) {
            //                     oView.setBusy(false);
            //                     MessageBox.error(oError.message);
            //                 }
            //             });
            //             // oModel.create(sServiceUrl, oParameters,null, function(oEvent){

            //             //         MessageToast.show("저장 되었습니다.");

            //             //     },function(oError){

            //             //         MessageBox.error(oError.message);

            //             // });
            //             //  oModel.create(sServiceUrl, oParameters);
            //             //  oView.setBusy(false);

            //         } else if (sButton === MessageBox.Action.CANCEL) {

            //         };
            //     }
            // });


            // console.log(oEvent);
            // this.byId("ceateVpCategory").close();
        },


        onDialogTreeSearch: function (event) {

            var treeVendor = [];

            if (!!this.byId("treepop_vendor_pool_local_name").getValue()) {
                treeVendor.push(new Filter({
                    path: 'keyword',
                    filters: [
                        new Filter("vendor_pool_path_name", FilterOperator.Contains, this.byId("treepop_vendor_pool_local_name").getValue())
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


            this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
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

            // var oTable = this.byId("diatreeTable");
            // var aIndices = oTable.getSelectedIndices();
            // //선택된 Tree Table Value 
            // var tree_vpName = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[0].mProperties.text
            // var tree_vpCode = oEvent.getSource()._aRowClones[aIndices].mAggregations.cells[1].mProperties.text

            var row = this.getView().getModel("tree").getObject(event.getParameters().rowContext.sPath);

            // this.getView().byId("search_Vp_Name").setValue(tree_vpName);
            // this.getView().byId("search_Vp_Code").setValue(tree_vpCode);
            this.getView().byId("search_Vp_Name").setValue(row.vendor_pool_local_name);
            this.getView().byId("search_Vp_Code").setValue(row.vendor_pool_code);


            this.byId("treepop_vendor_pool_local_name").setValue("");

            this.createTreePopupClose();

        },

        onDialogSearch: function (event) {

            var predicates = [];

            if (this.byId("tpop_Operation_ORG").getSelectedKey() && this.byId("tpop_Operation_ORG").getSelectedKey().length > 0 && this.byId("tpop_operation_unit_code").getSelectedKey() && this.byId("tpop_operation_unit_code").getSelectedKey().length > 0) {

                if (!!reSearchOrgCd) {
                    predicates.push(new Filter("org_code", FilterOperator.Contains, reSearchOrgCd));
                    this.byId("tpop_Operation_ORG").setSelectedKey(reSearchOrgCd);
                    reSearchOrgCd = "";
                } else {
                    if (!!this.byId("tpop_Operation_ORG").getSelectedKey()) {
                        predicates.push(new Filter("org_code", FilterOperator.Contains, this.byId("tpop_Operation_ORG").getSelectedKey()));
                    }
                }
                if (!!reSearchOpCd) {
                    predicates.push(new Filter("operation_unit_code", FilterOperator.Contains, reSearchOpCd));
                    this.byId("tpop_operation_unit_code").setSelectedKey(reSearchOpCd)
                    reSearchOpCd = "";
                } else {
                    if (!!this.byId("tpop_operation_unit_code").getSelectedKey()) {
                        predicates.push(new Filter("operation_unit_code", FilterOperator.Contains, this.byId("tpop_operation_unit_code").getSelectedKey()));
                    }
                }
                if (!!reSearchVpNm) {
                    this.byId("tpop_vendor_pool_local_name").setValue(reSearchVpNm);
                    reSearchVpNm = "";
                }
                if (!!this.byId("tpop_vendor_pool_local_name").getValue()) {
                    predicates.push(new Filter({
                        path: 'keyword',
                        filters: [
                            new Filter("vendor_pool_path_name", FilterOperator.Contains, this.byId("tpop_vendor_pool_local_name").getValue())
                        ],
                        and: false
                    }));
                }

                this.treeListModel = this.treeListModel || new TreeListModel(this.getView().getModel());
                this.getView().setBusy(true);
                this.treeListModel
                    .read("/VpPopupView", {
                        filters: predicates
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
                var oTable = that.byId("diatreeTable");
                // oTable.setFirstVisibleRow();
            }
            else {
                MessageToast.show("필수값을 입력 하세요.");
            }



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
            // var sTitle,
            // 	oTable = oEvent.getSource(),
            // 	iTotalItems = oEvent.getParameter("total");
            // // only update the counter if the length is final and
            // // the table is not empty
            // if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            // 	sTitle = this.getResourceBundle().getText("mainListTableTitleCount", [iTotalItems]);
            // } else {
            // 	sTitle = this.getResourceBundle().getText("mainListTableTitle");
            // }
            // this.getModel("mainListView").setProperty("/mainListTableTitle", sTitle);
        },
        onCellClick: function (oEvent) {

            var rowData = oEvent.getParameter('rowBindingContext').getObject();
            var LayoutType = library.LayoutType;

            pVendorPool = rowData.vendor_pool_code;
            pTenantId = rowData.tenant_id;
            pOrg_code = rowData.org_code;
            pOperation_unit_code = rowData.operation_unit_code;
            pTemp_type = rowData.temp_type;
            if(rowData.leaf_yn == "Y"){
                pDrill_state = "leaf";
            }else{
                pDrill_state = "expanded";
            }
            

            // alert( "pVendorPool   : " + pVendorPool + 
            //        "pTenantId     : " + pTenantId);

            // var oNavParam = {
            //     layout: oNextUIState.layout,
            //     tenantId : rowData.tenant_id,
            //     vendorPool : rowData.vendor_pool_code
            // };
            // this.getRouter().navTo("midPage", oNavParam); 
            // if (this.currentRouteName === "MainList") { // last viewed route was master
            // 	var oMasterView = this.oRouter.getView("pg.vp.vpMgt.view.MainList");
            // 	this.getView().byId("fcl").removeBeginColumnPage(oMasterView);
            // }


            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("midPage", {
                // layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
                layout: sap.f.LayoutType.OneColumn,
                tenantId: pTenantId,
                vendorPool: pVendorPool,
                orgCode: pOrg_code,
                operationUnitCode: pOperation_unit_code,
                temptype: pTemp_type,
                drill: pDrill_state,
                target: "NEXT"
            });
            // this.oRouter.navTo("midPage", {layout: LayoutType.OneColumn, tenantId: pTenantId, vendorPool: pVendorPool});         



        },
        onMainTableEditButtonPress: function(){
            var oView = this.getView(),
                oTable = this.byId("mainTable"),         
                that = this;
            var items = oTable.getSelectedIndices();
            if(items.length>1){
                MessageToast.show("정보변경은 단건만 가능합니다.");
                return;
            }else if(items.length==0){
                MessageToast.show("선택된 정보가 없습니다.");
                return;
            }


            var nSelIdx = oTable.getSelectedIndex();
            var oContext = oTable.getContextByIndex(nSelIdx);
            var sPath = oContext.getPath();
            var oData = oTable.getBinding().getModel().getProperty(sPath);


            pVendorPool = oData.vendor_pool_code;
            pTenantId = oData.tenant_id;
            pOrg_code = oData.org_code;
            pOperation_unit_code = oData.operation_unit_code;
            pTemp_type = oData.temp_type;

            if(oData.leaf_yn == "Y"){
                pDrill_state = "leaf";
            }else{
                pDrill_state = "expanded";
            }

            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            this.getRouter().navTo("midPage", {
                // layout: sap.f.LayoutType.TwoColumnsMidExpanded, 
                layout: sap.f.LayoutType.OneColumn,
                tenantId: pTenantId,
                vendorPool: pVendorPool,
                orgCode: pOrg_code,
                operationUnitCode: pOperation_unit_code,
                temptype: pTemp_type,
                drill: pDrill_state,
                target: "NEXT"
            });


        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            // this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            // MainListPersoService.resetPersData();
            // this._oTPC.refresh();
        },

		/**
		 * Event handler when a table add button pressed
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableAddButtonPress: function () {
            // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
            // this.getRouter().navTo("midPage", {
            // 	layout: oNextUIState.layout, 
            // 	tenantId: "new",
            // 	moldId: "code"
            // });
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            // if (oEvent.getParameters().refreshButtonPressed) {
            // 	// Search field's 'refresh' button has been pressed.
            // 	// This is visible if you select any master list item.
            // 	// In this case no new search is triggered, we only
            // 	// refresh the list binding.
            // 	this.onRefresh();
            // } else {

            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            // var aSearchFilters = [];


            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();


                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0 && s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {

                    var aSearchFilters_S = this._getSearchStates();
                    this._applySearch(aSearchFilters_S);
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }
            }
            else if (sSurffix === "E") {

                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();

                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0 && s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {
                    var aSearchFilters_E = this._getSearchStates();
                    this._applySearch(aSearchFilters_E);
                }
                else {
                    MessageToast.show("필수값을 입력 하세요.");
                }

            }

            this.checkOrg();

            this.handleTable();


            // }

        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onMainTableItemPress: function (oEvent) {
            // var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
            // 	sPath = oEvent.getSource().getBindingContext("list").getPath(),
            // 	oRecord = this.getModel("list").getProperty(sPath);

            // this.getRouter().navTo("midPage", {
            // 	layout: oNextUIState.layout, 
            // 	tenantId: oRecord.tenant_id,
            // 	moldId: oRecord.mold_id
            // });

            // if(oNextUIState.layout === 'TwoColumnsMidExpanded'){
            //     this.getView().getModel('mainListView').setProperty("/headerExpandFlag", false);
            // }

            // var oItem = oEvent.getSource();
            // oItem.setNavigated(true);
            // var oParent = oItem.getParent();
            // // store index of the item clicked, which can be used later in the columnResize event
            // this.iIndex = oParent.indexOfItem(oItem);
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
            // this.getModel("mainListView").setProperty("/headerExpanded", true);

            // var self = this;
            // var oModel = this.getModel('orgMap');
            // oModel.setTransactionModel(this.getModel('purOrg'));
            // oModel.read("/Pur_Org_Type_Mapping", {
            //     filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //         new Filter("process_type_code", FilterOperator.EQ, 'DP05') //금형 DP05
            //     ],
            //     success: function(oData){

            //         var oModelDiv = self.getModel('division');
            //         oModelDiv.setTransactionModel(self.getModel('purOrg'));
            //         oModelDiv.read("/Pur_Operation_Org", {
            //             filters: [
            //                 new Filter("tenant_id", FilterOperator.EQ, 'L1100'),
            //                 new Filter("org_type_code", FilterOperator.EQ, oData.results[0].org_type_code)
            //             ],
            //             sorters: [
            //                 new Sorter("org_code", false)
            //             ],
            //             success: function(oData){

            //             }
            //         });
            //     }
            // });
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */

        _applySearch: function (aSearchFilters) {
            console.log("_applySearch!!!");
            that.mainTable = this.byId("mainTable");
            var iCount = that.mainTable._getTotalRowCount();
            //You can't use getRows(), cuz it only returns the current rows on screen

            //Now we need the data of every row

            // that.mainTable.removeSelections(true);
            // that.mainTable.selectAll(true);
            // that.mainTable.setSelectedIndex(-1);
            that.mainTable.clearSelection();
            // for (var i = 0; i < iCount; i++) {
            //     // var oEntity = that.mainTable.getModel().getData(that.mainTable.getContextByIndex(i).getPath());


            // }
            var oDataLen = 0;
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/vpSearchOrderView", {
                filters: aSearchFilters,
                success: function (oData) {
                    // oDataLen = oData.results.length;
                    // console.log("oData.results!!!" + oData.results.length);
                    // if (oData.results.length > 0) {
                    //     that.mainTable.setVisibleRowCount(oData.results.length);
                    // } else {
                    //     that.mainTable.setVisibleRowCount(0);
                    // }
                    // var oColumn = that.mainTable.getColumns()[0];
                    // that.mainTable.sort(oColumn);
                    // //console.log(oDataLen);

                    // that.mainTable.onAfterRendering = function() {
                    //     console.log("onAfterRendering");
                    //     oView.setBusy(true);
                    //     setTimeout(function demo() {
                    //         that.fnSetRowMerge(oView, oDataLen);
                    //     }, 200);
                    // };

                    // if (oDataLen === 0) {
                    // }
                    oView.setBusy(false);
                }, error: function (e) {
                    console.log("error occrupie!!!");
                }
            });
        },

        fnCalcRate: function (oEvent) {
            this.siteInternalRate = this.byId("pop_dom_oversea_netprice_diff_rate");
            this.siteExternalRate = this.byId("pop_domestic_net_price_diff_rate");

            console.log(oEvent);
            var eventId = oEvent.getSource().sId;
            if (eventId.indexOf("pop_dom_oversea_netprice_diff_rate") > -1) {
                if (Number(this.siteInternalRate.getValue()) <= 100) {
                    this.siteInternalRate.setValue(parseInt(this.siteInternalRate.getValue()));
                } else if (Number(this.siteInternalRate.getValue()) > 100) {
                    this.siteInternalRate.setValue(100);

                }
            }
            if (eventId.indexOf("pop_domestic_net_price_diff_rate") > -1) {
                if (Number(this.siteExternalRate.getValue()) <= 100) {
                    this.siteExternalRate.setValue(parseInt(this.siteExternalRate.getValue()));
                } else if (Number(this.siteExternalRate.getValue()) > 100) {
                    this.siteExternalRate.setValue(100);

                }
            }
        },


        fnSetRowMerge: function (oView, oDataLen) {
            // TimeStamp.start();
            var aRows = that.mainTable.getRows();
            if (aRows && aRows.length > 0) {
                var pRow = {};
                for (var i = 0; i < aRows.length; i++) {
                    if (i > 0) {
                        var pCell = pRow.getCells()[0],
                            cCell = aRows[i].getCells()[0];
                        if (cCell.getText() === pCell.getText()) {
                            $("#" + cCell.getId()).css("visibility", "hidden");
                            $("#" + pRow.getId() + "-col0").css("border-bottom-style", "hidden");
                        }

                        var pCell1 = pRow.getCells()[1],
                            cCell1 = aRows[i].getCells()[1];
                        if (cCell1.getText() === pCell1.getText()) {
                            $("#" + cCell1.getId()).css("visibility", "hidden");
                            $("#" + pRow.getId() + "-col1").css("border-bottom-style", "hidden");
                        }
                    }
                    pRow = aRows[i];
                }
            }
            // TimeStamp.finish();
            //console.log(oDataLen);
            that.mainTable.setVisibleRowCount(oDataLen);
            oView.setBusy(false);
        },

        _getSearchStates: function () {



            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            var aSearchFilters = [];

            aSearchFilters.push(new Filter("language_cd", FilterOperator.EQ, "EN"));

            if (sSurffix === "S") {
                var s_Operation_ORG_S = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                var s_Operation_UNIT_S = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();


                if (s_Operation_ORG_S && s_Operation_ORG_S.length > 0) {
                    aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, s_Operation_ORG_S));
                }
                if (s_Operation_UNIT_S && s_Operation_UNIT_S.length > 0) {
                    aSearchFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, s_Operation_UNIT_S));
                }
            }
            else if (sSurffix === "E") {

                var s_VPN = this.getView().byId("search_Vp_Name").getValue();


                var s_Operation_ORG_E = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                var s_Dept = this.getView().byId("search_Dept_Code").getValue();
                // debugger
                var s_Man = this.getView().byId("search_Man_Code").getValue();
                var s_VPC = this.getView().byId("search_Vp_Code").getValue();
                var s_Sup = this.getView().byId("search_Sup_Code").getValue();
                var s_SupT = this.getView().byId("search_Sup_Type").getSelectedKey();

                if (s_VPN == "") {
                    s_VPC = "";
                }
                // var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                // var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();
                // var s_Operation_UNIT_E = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();

                if (s_Operation_ORG_E && s_Operation_ORG_E.length > 0) {
                    aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, s_Operation_ORG_E));
                }
                if (s_Operation_UNIT_E && s_Operation_UNIT_E.length > 0) {
                    aSearchFilters.push(new Filter("operation_unit_code", FilterOperator.EQ, s_Operation_UNIT_E));
                }
                if (s_Dept && s_Dept.length > 0) {
                    aSearchFilters.push(new Filter("repr_department_code", FilterOperator.EQ, s_Dept));
                }
                if (s_Man && s_Man.length > 0) {
                    aSearchFilters.push(new Filter("managers_id", FilterOperator.Contains, s_Man));
                }
                if (s_VPC && s_VPC.length > 0) {
                    aSearchFilters.push(new Filter("vendor_pool_path_code", FilterOperator.Contains, s_VPC));
                }
                if (s_Sup && s_Sup.length > 0) {
                    aSearchFilters.push(new Filter("supplier_code", FilterOperator.EQ, s_Sup));
                }
                if (s_SupT && s_SupT.length > 0) {
                    aSearchFilters.push(new Filter("supplier_type_name", FilterOperator.EQ, s_SupT));
                }
            }
            return aSearchFilters;
        },

        _doInitTablePerso: function () {
            // // init and activate controller
            // this._oTPC = new TablePersoController({
            // 	table: this.byId("mainTable"),
            // 	componentName: "vpMgt",
            // 	persoService: MainListPersoService,
            // 	hasGrouping: true
            // }).activate();
        },

        handleSelectionFinishComp: function (oEvent) {

            // this.copyMultiSelected(oEvent);

            // var params = oEvent.getParameters();
            // var selectedKeys = [];
            // var divisionFilters = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            //     divisionFilters.push(new Filter("operation_org_code", FilterOperator.EQ, item.getKey() ));
            // });

            // var filter = new Filter({
            //                 filters: divisionFilters,
            //                 and: false
            //             });

            // this.getView().byId("searchDivisionE").getBinding("items").filter(filter, "Application");
            // this.getView().byId("searchDivisionS").getBinding("items").filter(filter, "Application");
        },

        handleSelectionFinishDiv: function (oEvent) {
            // this.copyMultiSelected(oEvent);
        },

        copyMultiSelected: function (oEvent) {
            // var source = oEvent.getSource();
            // var params = oEvent.getParameters();

            // var id = source.sId.split('--')[1];
            // var idPreFix = id.substr(0, id.length-1);
            // var selectedKeys = [];

            // params.selectedItems.forEach(function(item, idx, arr){
            //     selectedKeys.push(item.getKey());
            // });

            // this.getView().byId(idPreFix+'S').setSelectedKeys(selectedKeys);
            // this.getView().byId(idPreFix+'E').setSelectedKeys(selectedKeys);
        },
        fnSetFlagValue: function (flagValue) {
            // console.log("플래그:::::" + flagValue);
            var rtnStr = flagValue;
            if (rtnStr !== null) {
                rtnStr = rtnStr ? "Y" : "N"
            }
            return rtnStr;
        },
        resetCode: function () {
            // debugger;
            var s_vp_name = this.getView().byId("search_Vp_Name").getValue();
            var s_sup_name = this.getView().byId("search_Sup_Name").getValue();
            var s_man_name = this.getView().byId("search_Man_Name").getValue();
            var s_dept_name = this.getView().byId("search_Dept_Name").getValue();
            if(s_vp_name == ""){
                this.getView().byId("search_Vp_Code").setValue("");
            }

            if(s_sup_name == ""){
            this.getView().byId("search_Sup_Code").setValue("");
            }
            if(s_man_name == ""){
                this.getView().byId("search_Man_Code").setValue("");
            }

            if(s_dept_name == ""){
            this.getView().byId("search_Dept_Code").setValue("");
            }

        },
        resetPopCode: function () {
            // debugger;
            var s_dept_name = this.getView().byId("pop_repr_department_name").getValue();

            if(s_dept_name == ""){
            this.getView().byId("pop_repr_department_code").setValue("");
            }

        },
        //아래 정규식 둘중에 하나 골라서 쓰면 됩니다. 
        chkReplaceChange: function (oEvent) {
            console.log("livechange!!");
            //var regex = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;     // 특수문자 제거 (한글 영어 숫자만)
            // var regex = /[^a-zA-Z0-9\s ]/gi;                   // 특수문자 제거 (영어 숫자만)
            var regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;  //한글 제거 11/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g%^&*()_+|<

            var newValue = oEvent.getParameter("newValue");
            //$(this).val(v.replace(regexp,''));
            if (newValue !== "") {
                newValue = newValue.replace(regex, "");
                oEvent.oSource.setValue(null);
                oEvent.oSource.setValue(newValue);
            }
        },

        vhSupplierCode: function (oEvent) {
            that = this;
            this.oSupplierDialogPop = new SupplierDialogPop({
                multiSelection: false,
                keyField: "supplier_code",
                textField: "supplier_local_name",
                filters: [
                    new VBox({
                        items: [
                            new Label({ text: this.getModel("I18N").getText("/KEYWORD") }),
                            new Input({placeholder : this.getModel("I18N").getText("/SUPPLIER_CODE")})
                        ],
                        layoutData: new GridData({ span: "XL2 L3 M5 S10" })
                    })
                ],
                columns: [
                    new Column({
                        width: "75%",
                        label: new Label({ text: this.getModel("I18N").getText("/VALUE") }),
                        template: new Text({ text: "supplier_local_name" })
                    }),
                    new Column({
                        width: "25%",
                        hAlign: "Center",
                        label: new Label({ text: this.getModel("I18N").getText("/CODE") }),
                        template: new Text({ text: "supplier_code" })
                    })
                ]
            });

            // Pop 내부에 값을 올려주기 위해 구성
            this.oSupplierDialogPop.setContentWidth("300px");
            var sSearchObj = {};
            sSearchObj.tanentId = "L2100";
            sSearchObj.languageCd = "KO";
            sSearchObj.supplierCode = that.byId("search_Sup_Code").getValue();
            sSearchObj.orgCode = that.byId("search_Operation_ORG_E").getSelectedKey();
            sSearchObj.orgUnitCode = that.byId("search_Operation_UNIT_E").getSelectedKey();

            // Pop의 open에 sSearchObj를 인자로 호출 
            this.oSupplierDialogPop.open(sSearchObj);
            this.oSupplierDialogPop.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("search_Sup_Name").setValue(null);
                that.byId("search_Sup_Code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("search_Sup_Name").setValue(oEvent.mParameters.item.supplier_local_name);
                that.byId("search_Sup_Code").setValue(oEvent.mParameters.item.supplier_code);
            }.bind(this));
        },

        onInputWithEmployeeValuePress: function(){
             this.oEmployeeDialog = new EmployeeDialog({
                // id:"employeeDialog" ,
                title:"직원 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oEmployeeDialog.open();
            this.oEmployeeDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("search_Man_Name").setValue(null);
                that.byId("search_Man_Code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("search_Man_Name").setValue(oEvent.mParameters.item.user_local_name);
                that.byId("search_Man_Code").setValue(oEvent.mParameters.item.employee_number);
            }.bind(this));
        },
        onPopInputWithDeptValuePress: function(){
             this.oPopDeptDialog = new DepartmentDialog({
                // id:"employeeDialog" ,
                title:"부서 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oPopDeptDialog.open();
            this.oPopDeptDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("pop_repr_department_name").setValue(null);
                that.byId("pop_repr_department_code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("pop_repr_department_name").setValue(oEvent.mParameters.item.department_local_name);
                that.byId("pop_repr_department_code").setValue(oEvent.mParameters.item.department_id);
            }.bind(this));
        },

        onInputWithDeptValuePress: function(){
             this.oDeptDialog = new DepartmentDialog({
                // id:"employeeDialog" ,
                title:"부서 검색",
                closeWhenApplied:true,
                items:{
                    filters: [
                    ]
                }

            });
            this.oDeptDialog.open();
            this.oDeptDialog.attachEvent("apply", function (oEvent) {
                //console.log("oEvent 여기는 팝업에 팝업에서 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                that.byId("search_Dept_Name").setValue(null);
                that.byId("search_Dept_Code").setValue(null);
                // that.oSupplierCode.setValue(null);
                that.byId("search_Dept_Name").setValue(oEvent.mParameters.item.department_local_name);
                that.byId("search_Dept_Code").setValue(oEvent.mParameters.item.department_id);
            }.bind(this));
        },

        vhSupplier: function () {

            if (this.byId("search_Vp_Code").getValue()) {
                var vendor_pool_code = this.byId("search_Vp_Code").getValue();
            }
            if(!this.oCodeMultiSelectionValueHelp){
                this.oCodeMultiSelectionValueHelp = new CodeDialog({
                    title: "Choose Supplier",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                            new Filter("group_code", FilterOperator.EQ, vendor_pool_code)
                        ],
                        sorters: [
                            new Sorter("sort_no")
                        ],
                        serviceName: "cm.util.CommonService",
                        entityName: "Code"
                    }
                });
                this.oCodeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("multiInputWithCodeDialog").setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }
            this.oCodeMultiSelectionValueHelp.open();
            this.oCodeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithCodeDialog").getTokens());
        },

        onValueHelpRequested: function () {
            // console.group("onValueHelpRequested");

            // // var aCols = this.oColModel.getData().cols;

            // this._oValueHelpDialog = sap.ui.xmlfragment("pg.vp.vpMgt.view.ValueHelpDialogAffiliate", this);
            // this.getView().addDependent(this._oValueHelpDialog);

            // this._oValueHelpDialog.getTableAsync().then(function (oTable) {
            //     oTable.setModel(this.oAffiliateModel);
            //     oTable.setModel(this.oColModel, "columns");

            //     if (oTable.bindRows) {
            //         oTable.bindAggregation("rows", "/AffiliateCollection");
            //     }

            //     if (oTable.bindItems) {
            //         oTable.bindAggregation("items", "/AffiliateCollection", function () {
            //             return new ColumnListItem({
            //                 // cells: aCols.map(function (column) {
            //                 //     return new Label({ text: "{" + column.template + "}" });
            //                 // })
            //             });
            //         });
            //     }
            //     this._oValueHelpDialog.update();
            // }.bind(this));

            // this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            // this._oValueHelpDialog.open();

            //     console.groupEnd();
        },
        checkOrg: function () {

            // debugger
            var sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S"

            // var aSearchFilters = [];
            var aSelectedOrg = [];

            var pselectedOrg ;
            var pselectedUnit ;



            if (sSurffix === "S") {
                pselectedOrg = this.getView().byId("search_Operation_ORG_S").getSelectedKey();
                pselectedUnit = this.getView().byId("search_Operation_UNIT_S").getSelectedKey();


            }
            else if (sSurffix === "E") {

                pselectedOrg = this.getView().byId("search_Operation_ORG_E").getSelectedKey();
                pselectedUnit = this.getView().byId("search_Operation_UNIT_E").getSelectedKey();

            }    

            if (pselectedOrg && pselectedOrg.length > 0 && pselectedUnit && pselectedUnit.length > 0)
            {
                // aSelectedOrg.push(new Filter("tenant_id", FilterOperator.EQ, "L2100"));
                aSelectedOrg.push(new Filter("org_code", FilterOperator.EQ, pselectedOrg));
                aSelectedOrg.push(new Filter("operation_unit_code", FilterOperator.EQ, pselectedUnit));

                var oView = this.getView(),
                    oModel = this.getModel("orglist");
                oView.setBusy(true);
                oModel.setTransactionModel(this.getModel());
                oModel.read("/vpMaxLevelView", {
                    filters: aSelectedOrg,
                    success: function (oData) {

                        if (oData.results.length === 1) {
                            var results = oData.results[0];
                            maxLv = results.max_level

                            
                        } else {
                            //
                        }
                        oView.setBusy(false);
                    }, error: function (e) {
                        console.log("error occrupie!!!");
                    }
                });
            }
            


            // var row = this.getView().getModel("VpOperationOrg").getObject(event.getParameters().rowContext.sPath);

        }

    });
});