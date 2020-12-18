sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/TransactionManager",
], function (BaseController, JSONModel, History, DateFormatter, Filter, FilterOperator, Fragment
    , MessageBox, MessageToast, ManagedListModel, ManagedModel, TransactionManager) {
    "use strict";

    /**
     * @description 예산집행품의 View 화면 
     * @author jinseon.lee
     * @date 2020.12.01
     */
    var mainViewName = "beaObjectView";
    var oTransactionManager;
    return BaseController.extend("dp.md.budgetExecutionApproval.controller.BeaObject", {

        dateFormatter: DateFormatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            console.log("BeaObject Controller 호출");
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.setModel(oViewModel, mainViewName);

            this.getView().setModel(new ManagedModel(), "appMaster");
            this.getView().setModel(new ManagedListModel(), "appDetail");
            this.getView().setModel(new ManagedModel(), "company");
            this.getView().setModel(new ManagedModel(), "plant");


            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("appMaster"));
            oTransactionManager.addDataModel(this.getModel("appDetail"));

            this.getRouter().getRoute("beaObject").attachPatternMatched(this._onObjectMatched, this);

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the miainList route.
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("approvalList", {}, true);
            }
        },
        onEditModeBea: function (oEvent) {
            var oModel = this.getModel("appMaster")
                , oData = oModel.oData;
            this.getRouter().navTo("beaEditObject", {
                approval_number: oData.approval_number
            }, true);

        },
		/**
		 * Event handler for page edit button press
		 * @public
		 */
        onPageEditButtonPress: function () {
            this._toEditMode();
        },

		/**
		 * Event handler for delete page entity
		 * @public
		 */
        onPageDeleteButtonPress: function () {
            var oView = this.getView(),
                me = this;

            MessageBox.confirm("Are you sure to delete?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        me.getView().getBindingContext().delete('$direct').then(function () {
                            me.onNavBack();
                        }, function (oError) {
                            MessageBox.error(oError.message);
                        });
                    };
                }
            });

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            var oView = this.getView(),
                me = this,
                oMessageContents = this.byId("inputMessageContents");

            if (!oMessageContents.getValue()) {
                oMessageContents.setValueState(sap.ui.core.ValueState.Error);
                return;
            }
            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oView.getModel().submitBatch("odataGroupIdForUpdate").then(function (ok) {
                            me._toShowMode();
                            oView.setBusy(false);
                            MessageToast.show("Success to save.");
                        }).catch(function (err) {
                            MessageBox.error("Error while saving.");
                        });
                    };
                }
            });
        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function () {
            this._toShowMode();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * Binds the view to the data path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onObjectMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                approval_number = oArgs.approval_number;
            this._onRoutedThisPage(oArgs);
        },
        _onRoutedThisPage: function (args) { 
            var that = this;
            this._bindView("/ApprovalMasters(tenant_id='L1100',approval_number='" + args.approval_number + "')", "appMaster", [], function (oData) {
                that._createViewBindData(oData);
            });
            var schFilter = [new Filter("approval_number", FilterOperator.EQ, args.approval_number)];
            this._bindView("/ItemBudgetExecution", "appDetail", schFilter, function (oData) {  
            });
            // mold_id 
            oTransactionManager.setServiceModel(this.getModel());
        },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
        _bindView: function (sObjectPath, sModel, aFilter, callback) {
            var oView = this.getView(),
                oModel = this.getModel(sModel);
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read(sObjectPath, {
                filters: aFilter,
                success: function (oData) {
                    oView.setBusy(false);
                    callback(oData);
                }
            });
        },

        /**
      * @description approval_number 로 조회 후 넘어옴 
      * @param {*} args : company , plant   
      */
        _createViewBindData: function (args) {
            console.log(" args ", args)
            /** 초기 데이터 조회 */
            var company_code = args.company_code, plant_code = args.org_code;
            var appModel = this.getModel(mainViewName);
            appModel.setData({
                company_code: company_code
                , company_name: ""
                , plant_code: plant_code
                , plant_name: ""
            });

           var oModel = this.getModel("company");

            oModel.setTransactionModel(this.getModel("org"));

            oModel.read("/Org_Company(tenant_id='L1100',company_code='" + company_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Company oData>>> ", oData);
                }
            });


            var oModel2 = this.getModel("plant");
            oModel2.setTransactionModel(this.getModel("org"));

            oModel2.read("/Org_Plant(tenant_id='L1100',company_code='" + company_code + "',plant_code='" + plant_code + "')", {
                filters: [],
                success: function (oData) {
                    console.log("Org_Plant oData>>> ", oData);
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel(mainViewName),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("mainObjectNotFound");
                return;
            }
            oViewModel.setProperty("/busy", false);

            console.log(" oViewModel >>> ", oViewModel);

        },

        _oFragments: {},
    });
});