sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/util/Validator",
    // "ext/lib/util/ValidatorUtil",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
], function (BaseController, Multilingual, Validator, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
    Sorter, Filter, FilterOperator, Fragment, MessageBox, MessageToast,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {

    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.po.projectMgt.controller.MidObject", {

        dateFormatter: DateFormatter,

        validator: new Validator(),

        formatter: (function () {
            return {
                toYesNo: function (oData) {
                    return oData === true ? "YES" : "NO"
                },
            }
        })(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            // Model used to manipulate controlstates. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.setModel(oViewModel, "midObjectView");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedModel(), "masterView");
            //this.setModel(new ManagedListModel(), "details");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("masterView"));

            //this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            //this._initTableTemplates();
            this.enableMessagePopover();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

		/**
		 * Event handler for Enter Full Screen Button pressed
		 * @public
		 */
        onPageEnterFullScreenButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            console.log("fcl=", this.getModel("fcl"));
            this.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenantId: this._sTenantId,
                companyCode: this._sCompanyCode,
                epProjectNumber: this._sEpProjectNumber
            });
        },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
        onPageExitFullScreenButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            console.log("fcl=", this.getModel("fcl"));
            this.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenantId: this._sTenantId,
                companyCode: this._sCompanyCode,
                epProjectNumber: this._sEpProjectNumber
            });
        },
		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", { layout: sNextLayout });
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
                oMasterModel = this.getModel("master"),
                that = this;
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                title: "Comfirmation",
                initialFocus: MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oMasterModel.removeData();
                        oMasterModel.setTransactionModel(that.getModel());
                        oMasterModel.submitChanges({
                            success: function (ok) {
                                oView.setBusy(false);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                that.onPageNavBackButtonPress.call(that);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
                            }
                        });
                    };
                }
            });
        },

        // onMidTableAddButtonPress: function(){
        // 	var oTable = this.byId("midTable"),
        // 		oDetailsModel = this.getModel("details");
        // 	oDetailsModel.addRecord({
        // 		"tenant_id": this._sTenantId,
        //         "company_code": this._sCompanyCode,
        //         "ep_project_number": this._sEpProjectNumber,
        // 		"project_name": "",
        // 		"ep_purchasing_type_code": "",
        //         "plant_code": "",
        //         "bizunit_code": "",
        //         "bizdivision_code": "",
        //         "remark": "",
        // 		"local_create_dtm": new Date(),
        // 		"local_update_dtm": new Date()
        // 	}, "/Project");
        // },

        // onMidTableDeleteButtonPress: function(){
        // 	var oTable = this.byId("midTable"),
        // 		oDetailsModel = this.getModel("details"),
        // 		aItems = oTable.getSelectedItems(),
        // 		aIndices = [];
        // 	aItems.forEach(function(oItem){
        // 		aIndices.push(oDetailsModel.getProperty("/Project").indexOf(oItem.getBindingContext("details").getObject()));
        // 	});
        // 	aIndices = aIndices.sort(function(a, b){return b-a;});
        // 	aIndices.forEach(function(nIndex){
        // 		//oDetailsModel.removeRecord(nIndex);
        // 		oDetailsModel.markRemoved(nIndex);
        // 	});
        // 	oTable.removeSelections(true);
        // },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function () {
            var oView = this.getView(),
                that = this;
            var oMasterModel = this.getModel("master");
            console.log("_sTenantId=", this._sTenantId);
            console.log("oMasterModel.getData()=", oMasterModel.getData());
            // this.validator.validate(this.byId("midObjectForm1Edit"))
            if (this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if (this.validator.validate(this.byId("midObjectForm2Edit")) !== true) return;
            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: "Comfirmation",
                initialFocus: MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oTransactionManager.submit({
                            success: function (ok) {
                                oView.setBusy(false);
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that._toShowMode();
                            }
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
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                this._toShowMode();
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        _onMasterDataChanged: function (oEvent) {
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                var oMasterModel = this.getModel("master");
                var oDetailsModel = this.getModel("details");
                var sTenantId = oMasterModel.getProperty("/tenant_id");
                var sCompanyCode = oMasterModel.getProperty("/company_code");
                var sEpProjectNumber = oMasterModel.getProperty("/ep_project_number");
                var oDetailsData = oDetailsModel.getData();
                oDetailsData.forEach(function (oItem, nIndex) {
                    oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
                    oDetailsModel.setProperty("/" + nIndex + "/company_code", sCompanyCode);
                    oDetailsModel.setProperty("/" + nIndex + "/ep_project_number", sEpProjectNumber);
                });
                oDetailsModel.setData(oDetailsData);
            }
        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();
            console.log("oArgs=", oArgs);
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sEpProjectNumber = oArgs.epProjectNumber;

            if (oArgs.tenantId == "L2100" && oArgs.companyCode == "LGCKR" && oArgs.epProjectNumber == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);
                //this.getModel("midObjectView").setProperty("/isAddedMode", true);

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "company_code": this._sCompanyCode,
                    "ep_project_number": "",
                    "ep_purchasing_type_code": "E",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                }, "/Project");

                // var oDetailsModel = this.getModel("details");
                // oDetailsModel.setTransactionModel(this.getModel());
                // oDetailsModel.addRecord({
                //     "tenant_id": this._sTenantId,
                //     "company_code": this._sCompanyCode,
                //     "ep_project_number": this._sEpProjectNumber,
                // 	"bizunit_code": "",
                // 	"bizdivision_code": "",
                // 	"project_name": "",
                //     "plant_code": "",
                //     "ep_purchasing_type_code": "",
                //     "create_user_id": "",
                //     "local_create_dtm": new Date(),
                // 	"system_create_dtm": new Date()
                // }, "/Project");
                this._toEditMode();
            } else {
                this.getModel("midObjectView").setProperty("/isAddedMode", true);

                //저장용
                var sObjectPath = "/Project(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',ep_project_number='" + this._sEpProjectNumber + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                //console.log("this.getModel()=",this.getModel());
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function (oData) {
                        console.log("oData=", oData);
                        oView.setBusy(false);
                    }
                });

                // // //조회용
                // var sViewObjectPath = "/ProjectView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',ep_project_number='" + this._sEpProjectNumber + "')";
                // var oMasterViewModel = this.getModel("masterView");
                // oView.setBusy(true);
                // oMasterViewModel.setTransactionModel(this.getModel());
                // oMasterViewModel.read(sViewObjectPath, {
                //     success: function (oData) {
                //         console.log("oData=", oData);
                //         oView.setBusy(false);
                //     }
                // });

                // oView.setBusy(true);
                // var oDetailsModel = this.getModel("details");
                // oDetailsModel.setTransactionModel(this.getModel());
                // oDetailsModel.read("/Project", {
                // 	filters: [
                //         new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                //         new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                // 		new Filter("ep_project_number", FilterOperator.EQ, this._sEpProjectNumber)
                // 	],
                // 	success: function(oData){
                // 		oView.setBusy(false);
                // 	}
                // });

                this._toShowMode();
            }
            oTransactionManager.setServiceModel(this.getModel());
        },

        _toEditMode: function () {
            console.log("#===Edit==", this.getModel("master").getData());
            this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setEnabled(true);
            this.byId("pageCancelButton").setEnabled(true);

            // this.byId("midTableAddButton").setEnabled(!FALSE);
            // this.byId("midTableDeleteButton").setEnabled(!FALSE);
            // this.byId("midTableSearchField").setEnabled(FALSE);
            // this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            // this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            //this._bindMidTable(this.oEditableTemplate, "Edit");
        },

        _toShowMode: function () {

            // var oMasterModel = this.getModel("master");
            // var tenantId = oMasterModel.getData().tenant_id;
            // var companyCode = oMasterModel.getData().company_code;
            // var epProjectNumber = oMasterModel.getData().ep_project_number;

            // console.log("tenantId", tenantId);
            // console.log("companyCode", companyCode);
            // console.log("epProjectNumber", epProjectNumber);

            // oView.setBusy(true);
            // var oDetailsModel = this.getModel("details");
            // oDetailsModel.setTransactionModel(this.getModel());
            // oDetailsModel.read("/Project", {
            // 	filters: [
            //         new Filter("tenant_id", FilterOperator.EQ, tenantId),
            //         new Filter("company_code", FilterOperator.EQ, companyCode)
            //     ],
            //     sorters: [
            //         new Sorter("ep_project_number", true)
            //     ],
            // 	success: function(oData){
            // 		oView.setBusy(false);
            // 	}
            // })

            // //조회용
            // var sViewObjectPath = "/ProjectView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',ep_project_number='" + this._sEpProjectNumber + "')";
            // var oMasterViewModel = this.getModel("masterView");
            // oView.setBusy(true);
            // oMasterViewModel.setTransactionModel(this.getModel());
            // oMasterViewModel.read(sViewObjectPath, {
            //     success: function (oData) {
            //         console.log("oData=", oData);
            //         oView.setBusy(false);
            //     }
            // });

            this._showFormFragment('MidObject_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(true);
            this.byId("pageDeleteButton").setVisible(true);
            this.byId("pageEditButton").setEnabled(true);
            this.byId("pageDeleteButton").setEnabled(true);
            this.byId("pageNavBackButton").setEnabled(true);
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageCancelButton").setEnabled(true);

            // this.byId("midTableAddButton").setEnabled(!TRUE);
            // this.byId("midTableDeleteButton").setEnabled(!TRUE);
            // this.byId("midTableSearchField").setEnabled(TRUE);
            // this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            // this.byId("midTable").setMode(sap.m.ListMode.None);
            //this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
        },

        _initTableTemplates: function () {
            this.oReadOnlyTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    // new ObjectIdentifier({
                    // 	text: "{details>company_code}"
                    // }), 
                    new Text({
                        text: "{details>project_name}"
                    })
                ],
                type: sap.m.ListType.Inactive
            });

            this.oEditableTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    // new Text({
                    // 	text: "{details>company_code}"
                    // }), 
                    new ComboBox({
                        selectedKey: "{details>bizunit_code}",
                        items: {
                            id: "testCombo1",
                            path: 'org>/Org_Unit',
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, 'L2100')
                            ],
                            template: new Item({
                                key: "{org>bizunit_code}",
                                text: "{org>bizunit_name}"
                            })
                        },
                        required: true
                    }),
                    new Input({
                        value: {
                            path: "details>project_name",
                            type: new sap.ui.model.type.String(null, {
                                maxLength: 100
                            }),
                        },
                        required: true
                    })
                ]
            });
        },

        _bindMidTable: function (oTemplate, sKeyboardMode) {
            this.byId("midTable").bindItems({
                path: "details>/Project",
                template: oTemplate
            }).setKeyboardMode(sKeyboardMode);
        },

        _oFragments: {},
        _showFormFragment: function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function (oFragment) {
                oPageSubSection.removeAllBlocks();
                oPageSubSection.addBlock(oFragment);
            })
        },
        _loadFragment: function (sFragmentName, oHandler) {
            if (!this._oFragments[sFragmentName]) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "ep.po.projectMgt.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        }


    });
});