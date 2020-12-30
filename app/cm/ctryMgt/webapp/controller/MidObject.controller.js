sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/formatter/DateFormatter",
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
], function (BaseController, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item) {

    "use strict";

    var oTransactionManager;

    return BaseController.extend("cm.ctryMgt.controller.MidObject", {

        dateFormatter: DateFormatter,

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

            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));
            this._initTableTemplates();

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
            this.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenant_id: this._sTenantId,
                country_code: this._sCountry_code
            });
            this.getModel("midObjectView").setProperty("/screen", "Full");
        },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
        onPageExitFullScreenButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.getRouter().navTo("midPage", {
                layout: sNextLayout,
                tenant_id: this._sTenantId,
                country_code: this._sCountry_code
            });
            this.getModel("midObjectView").setProperty("/screen", "");
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
            MessageBox.confirm("Are you sure to delete this control option and details?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        oMasterModel.removeData();
                        oMasterModel.setTransactionModel(that.getModel());
                        oMasterModel.submitChanges({
                            success: function (ok) {
                                oView.setBusy(false);
                                that.onPageNavBackButtonPress.call(that);
                                MessageToast.show("Success to delete.");
                            }
                        });
                    };
                }
            });
        },

        onMidTableAddButtonPress: function () {
            var oTable = this.byId("midTable"),
                oModel = this.getModel("details");
            if (this.byId("searchLanguageE").getItems().length > oModel.oData.CountryLng.length) {
                oModel.addRecord({
                    "tenant_id": this._sTenantId,
                    "country_code": this._sCountry_code,
                    "language_code": "",
                    "country_name": "",
                    "description": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                });
            }
            else {
                MessageToast.show("No more....ㅠㅠ...");
            }
        },

        onMidTableDeleteButtonPress: function () {
            var oTable = this.byId("midTable"),
                oModel = this.getModel("details"),
                aItems = oTable.getSelectedItems(),
                aIndices = [];

            if (oTable.getItems().length <= 1) {
                MessageToast.show("최소 1개는 남겨 두셔야......");
                return;
            }

            aItems.forEach(function (oItem) {
                aIndices.push(oModel.getProperty("/CountryLng").indexOf(oItem.getBindingContext("details").getObject()));
            });
            aIndices = aIndices.sort(function (a, b) { return b - a; });
            aIndices.forEach(function (nIndex) {
                //oModel.removeRecord(nIndex);
                oModel.markRemoved(nIndex);
            });
            oTable.removeSelections(true);
            oTable.setSelectedItem(oTable.getItems()[0]);
            this.byId("searchLanguageE").setSelectedKey(oTable.getItems()[0].getCells()[1].getSelectedKey());
        },
        onMidTableSelectionChange: function () {

            var oTable = this.byId("midTable");
            //var //oKey = this.byId("searchLanguageS").getSelectedKey(),
            var aItems = oTable.getSelectedItems();

            this.byId("searchLanguageE").setSelectedKey(aItems[0].getCells()[1].getSelectedKey());
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */

        _onPageCheckData: function () {
            // check master
            var oMasterModel = this.getModel("master");
            var oDetailsModel = this.getModel("details");
            var oDetailsData = oDetailsModel.getData();
            var oDetailsTable = this.byId("midTable");

            var aCheckId = ["tenant_id", "country_code", "iso_code", "eu_code", "language_code", "date_format_code", "number_format_code", "currency_code"];
            for (var i = 0; i < aCheckId.length; i++) {
                if (oMasterModel.getProperty("/" + aCheckId[i]) === "") {
                    MessageToast.show(aCheckId[i] + " is null or empty");
                    return false;
                }
            }

            var aCheckLng = [];

            for (var i = 0; i < oDetailsTable.getItems().length; i++) {
                //if ( oDetailsTable.getItems()[i].getCells()[1].getSelectedKey() === "" )
                if ( oDetailsTable.getItems()[i].getCells()[1].getText() === "" )
                {
                    MessageToast.show("Language code is null or empty");
                    return false;
                }

                if ( oDetailsTable.getItems()[i].getCells()[0].getText() === "C" )
                {                    
                    aCheckLng.push(oDetailsTable.getItems()[i].getCells()[1].getSelectedKey() );
                }             
            }

            for (var i = 0; i < aCheckLng.length; i++) {
                for (var j = 0; j < oDetailsTable.getItems().length; j++) {
                    if ( oDetailsTable.getItems()[j].getCells()[0].getText() === "" )
                    {                    
                        if (aCheckLng[i] === oDetailsTable.getItems()[i].getCells()[1].getSelectedKey())
                        {
                            MessageToast.show("Language code 중복");
                            return false;
                        }
                    }             
                }
                
            }

            return true;

        },

        onPageSaveButtonPress: function () {
            var oView = this.getView(),
                that = this;
            MessageBox.confirm("Are you sure ?", {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        if (!that._onPageCheckData()) {
                            return;
                        }
                        oView.setBusy(true);
                        oTransactionManager.submit({
                            // oView.getModel("master").submitChanges({
                            success: function (ok) {
                                that._toShowMode();
                                oView.setBusy(false);
                                MessageToast.show("Success to save.");
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
            this._toShowMode();
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        _onMasterDataChanged: function (oEvent) {
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                var oMasterModel = this.getModel("master");
                var oDetailsModel = this.getModel("details");
                var sTenantId = oMasterModel.getProperty("/tenant_id");
                var sCountry_code = oMasterModel.getProperty("/country_code");
                var oDetailsData = oDetailsModel.getData();
                oDetailsData.forEach(function (oItem, nIndex) {
                    oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
                    oDetailsModel.setProperty("/" + nIndex + "/country_code", sCountry_code);
                });
                oDetailsModel.setData(oDetailsData);
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
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();
            this._sTenantId = oArgs.tenant_id;
            this._sCountry_code = oArgs.country_code;

            if (oArgs.tenant_id == "new" && oArgs.country_code == "code") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);

                this._sTenantId = "L2100";

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "country_code": "",
                    "iso_code": "",
                    "language_code": "KO",
                    "date_format_code": "####-##-##",
                    "number_format_code": "#,###",
                    "currency_code": "",
                    "end_date": new Date(9999, 11, 31),
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                }, "/Country");
                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());
                //oDetailsModel.setData([]);
                oDetailsModel.addRecord({
                    "tenant_id": this._sTenantId,
                    "country_code": "",
                    "language_code": "",
                    "country_name": "",
                    "description": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date()
                }, "/CountryLng");
                this._toCreateMode();
            } else {
                this.getModel("midObjectView").setProperty("/isAddedMode", false);
                this._bindView("/Country(tenant_id='" + this._sTenantId + "',country_code='" + this._sCountry_code + "')");
                oView.setBusy(true);
                var oDetailModel = this.getModel("details");
                oDetailModel.setTransactionModel(this.getModel());
                oDetailModel.read("/CountryLng", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("country_code", FilterOperator.EQ, this._sCountry_code),
                    ],
                    success: function (oData) {
                        oView.setBusy(false);
                    }
                });
                this._toShowMode();
            }
            oTransactionManager.setServiceModel(this.getModel());
        },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
        _bindView: function (sObjectPath) {
            var oView = this.getView(),
                oModel = this.getModel("master");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read(sObjectPath, {
                success: function (oData) {
                    oView.setBusy(false);
                }
            });
        },
        //midObjectCountry_code
        //searchLanguageE
        _toCreateMode: function () {
            var FALSE = false;
            this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageDeleteButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("midObjectCountry_code").setEnabled(!FALSE);
            this.byId("searchLanguageE").setEditable(FALSE);
            this.byId("midTableAddButton").setEnabled(!FALSE);
            this.byId("midTableDeleteButton").setEnabled(!FALSE);
            //this.byId("midTableSearchField").setEnabled(FALSE);
            //this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            this._bindMidTable(this.oEditableTemplate, "Edit");
            this._setKeyMidTable("Create");
        },

        _toEditMode: function () {
            var FALSE = false;
            this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", !FALSE);
            this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageDeleteButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("midObjectCountry_code").setEnabled(FALSE);
            this.byId("midTableAddButton").setEnabled(!FALSE);
            this.byId("midTableDeleteButton").setEnabled(!FALSE);
            //this.byId("midTableSearchField").setEnabled(FALSE);
            //this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            this._bindMidTable(this.oEditableTemplate, "Edit");
            this._setKeyMidTable("Edit");
        },

        _toShowMode: function () {
            var TRUE = true;
            this._showFormFragment('MidObject_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            //this.byId("page").setProperty("showFooter", !TRUE);
            this.byId("pageEditButton").setEnabled(TRUE);
            this.byId("pageDeleteButton").setEnabled(TRUE);
            this.byId("pageNavBackButton").setEnabled(TRUE);

            this.byId("midTableAddButton").setEnabled(!TRUE);
            this.byId("midTableDeleteButton").setEnabled(!TRUE);
            //this.byId("midTableSearchField").setEnabled(TRUE);
            //this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            this.byId("midTable").setMode(sap.m.ListMode.None);
            this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
        },

        _initTableTemplates: function () {
            this.oReadOnlyTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    new Text({
                        text: "{details>language_code}"
                    }),
                    new ObjectIdentifier({
                        text: "{details>country_name}"
                    }),
                    new Text({
                        text: "{details>description}"
                    })
                ],
                type: sap.m.ListType.Inactive
            });


            var oCountryCombo = new ComboBox({
                selectedKey: "{details>language_code}"
                , width: "100%"
                , editable: "{= ${details>_row_state_} === 'C' ? true : false}"
                , selectionChange: function (oEvent) {
                    this._CountryComboChange(oEvent);
                }.bind(this)
                //, editable: this._CountryComboEdit("{${details>_row_state_}}")
                //change: function(oEvent) {    
                //            oCountryComboChange();                           
                //alert(oEvent);
                //MessageToast.show("ChangeEvent.");
                //var newValue = oEvent.getParameter("newValue");
                //var bindingPath = this.getBindingPath("value");
                //this.getModel().setProperty(bindingPath, newValue);
                //         }
            });
            oCountryCombo.bindItems({
                path: 'util>/CodeDetails',
                filters: [
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                    new Filter("group_code", FilterOperator.EQ, 'CM_LANG_CODE')
                ],
                template: new Item({
                    key: "{util>code}",
                    text: "{util>code_description}"
                })
            });
            this.oEditableTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    oCountryCombo,
                    new Input({
                        value: "{details>country_name}"
                    }),
                    new Input({
                        value: "{details>description}"
                    })
                ]
            });
        },

        _CountryComboChange: function (oEvent) {

            // 차후 필요하면 table 의 선택된 값에만 적용하도록 변경.. 지금은 UI 영역에서 선택 자체가 차단 됨
            this.byId("searchLanguageE").setSelectedKey(this.getModel('details').getProperty(oEvent.getSource().getBindingInfo('selectedKey').binding.getContext().getPath() + "/language_code"));
            //MessageToast.show("ChangeEvent.");
        },
        _CountryComboEdit: function (items) {
            MessageToast.show(items);
            return false;
        },

        _bindMidTable: function (oTemplate, sKeyboardMode) {
            this.byId("midTable").bindItems({
                path: "details>/CountryLng",
                template: oTemplate,
                templateShareable: true,
                key: "language_code"
            }).setKeyboardMode(sKeyboardMode);
        },

        _setKeyMidTable: function (sKeyboardMode) {

            var oTable = this.byId("midTable");
            //var oKey = this.byId("searchLanguageE").getSelectedKey();
            //var oKey = this.getModel("master").oData.language_code ;
            var oKey = this.getModel("master").getProperty("/language_code");

            if (sKeyboardMode === "Create") {
                oTable.setSelectedItem(oTable.getItems()[0]);
            }
            else {
                for (var i = 0; i < oTable.getItems().length; i++) {
                    if (oTable.getItems()[i].getCells()[1].getSelectedKey() == oKey) {
                        oTable.setSelectedItem(oTable.getItems()[i]);
                    }
                }
            }
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
                    name: "cm.ctryMgt.view." + sFragmentName,
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