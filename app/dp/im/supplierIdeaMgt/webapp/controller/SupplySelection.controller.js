sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History",
    "sap/m/ColumnListItem",
    "sap/m/ObjectIdentifier",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/odata/v2/ODataModel"
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("dp.im.supplierIdeaMgt.controller.SupplySelection", {

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

            console.log("SupplySelection start");

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");
            this.setModel(new JSONModel(), "midObjectViewModel");

            this.setModel(new JSONModel(), "loiSupplySelection");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);

            this.enableMessagePopover();

        },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            // var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            // this.getRouter().navTo("mainPage", {layout: sNextLayout});
            var sPreviousHash = History.getInstance().getPreviousHash();
            console.log("sPreviousHash==", sPreviousHash);
            // if (sPreviousHash !== undefined) {
            //     // eslint-disable-next-line sap-no-history-manipulation
            //     history.go(-1);
            // } else {
            this.getRouter().navTo("mainPage", {}, true);
            //}
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

            var input = {};
            var inputData = {};
            var detailData = this._sLoiDtlArrr;

            inputData = {
                "tenant_id": oMasterModel.getData().tenant_id,
                "company_code": oMasterModel.getData().company_code,
                "loi_selection_number": oMasterModel.getData().loi_selection_number,
                "user_id": '9586',
                "details": detailData
            }

            input.inputData = inputData;

            console.log("input====", JSON.stringify(input));
            var url = "dp/im/supplierIdeaMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiSupplySelectionProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
                title: "Comfirmation",
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);

                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (data) {
                                console.log("#########Success#####", data.value);
                                oView.setBusy(false);
                                that.onPageNavBackButtonPress.call(that);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01002"));
                            },
                            error: function (e) {
                                console.log("error====", e);
                            }
                        });

                    }
                }
            });
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onPageSaveButtonPress: function (flag) {
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                oDetailsModel = this.getModel("details"),
                that = this;

            // '122010'	'RFQ진행중'
            // '122020'	'RFQ완료'
            // '122030'	'작성중'
            // '122040'	'결재진행중'
            // '122050'	'결재반려'
            // '122060'	'업체선정완료' 
            var statusCode = "122030";
            var statusName = "작성중";
            if (flag == "R") {
                statusCode = "122040";
                statusName = "결재진행중";
            } else if (flag == "B") {
                statusCode = "122060";
                statusName = "업체선정완료";
            } else {
                statusCode = "122030";
                statusName = "작성중";
            }

            var input = {};
            var inputData = {};
            var detailData = this._sLoiDtlArrr;
            var tenantId = oMasterModel.getData().tenant_id;
            if (tenantId.indexOf(",") > -1) {
                tenantId = tenantId.split(",")[0];
            }
            var companyCode = oMasterModel.getData().company_code;
            if (companyCode.indexOf(",") > -1) {
                companyCode = companyCode.split(",")[0];
            }

            inputData = {
                "tenant_id": tenantId,
                "company_code": companyCode,
                "loi_selection_number": oMasterModel.getData().loi_selection_number,
                "loi_selection_title": oMasterModel.getData().loi_selection_title,
                "loi_selection_status_code": statusCode,
                "special_note": oMasterModel.getData().special_note,
                "attch_group_number": oMasterModel.getData().attch_group_number,
                "approval_number": oMasterModel.getData().approval_number,
                // "buyer_empno": oMasterModel.getData().buyer_empno,
                // "purchasing_department_code": oMasterModel.getData().purchasing_department_code,
                "buyer_empno": '9586',
                "purchasing_department_code": '50008948',
                "remark": oMasterModel.getData().remark,
                "org_type_code": oMasterModel.getData().org_type_code,
                "org_code": oMasterModel.getData().org_code,
                "user_id": '9586',
                "details": detailData
            }

            input.inputData = inputData;

            console.log("input====", JSON.stringify(input));

            // if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "dp/im/supplierIdeaMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiSupplySelectionProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (data) {

                                //console.log("#########Success#####", data.value[0].savedkey);
                                oView.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.validator.clearValueState(that.byId("midObjectForm"));

                                var sObjectPath = "/LOISupplySelectionView(tenant_id='" + tenantId + "',company_code='" + companyCode + "',loi_selection_number='" + data.value[0].savedkey + "')";
                                var oMasterModel = that.getModel("master");
                                oView.setBusy(true);
                                oMasterModel.setTransactionModel(that.getModel());
                                oMasterModel.read(sObjectPath, {
                                    success: function (oData) {
                                        oView.setBusy(false);
                                        oView.getModel("master").updateBindings(true);
                                        that._toShowMode();
                                    }
                                });
                                
                                //that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();

                                // if (flag == "D") {
                                //     that._toEditMode();
                                // } else {
                                //     that._toShowMode();
                                // }

                                console.log("master=======", oView.getModel("master"));

                            },
                            error: function (e) {
                                console.log("error====", e);
                            }
                        });

                    }
                }
            });

        },

		/**
		 * Event handler for cancel page editing
		 * @public
		 */
        onPageCancelEditButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm"));
            if (this.getModel("midObjectViewModel").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("midObjectViewModel").getProperty("/isEditMode") == true) {
                    this._toShowMode();
                } else {
                    this.onPageNavBackButtonPress.call(this);
                }
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
            console.log(oArgs);
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sIdeaNumber = oArgs.ideaNumber;
            this.getModel("midObjectViewModel").setProperty("/IdeaView", oArgs);


            console.log("##getOwnerComponent==", this.getOwnerComponent().getRootControl().byId("fcl"));

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.ideaNumber==", oArgs.ideaNumber);
            console.log("####################22222");


            //발행요청시 품목의 tenantId, companyCode 와 업체선정품의의 tenantId, companyCode가 다를 수 있다면 둘다 함께 체크
            if (oArgs.ideaNumber == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

                console.log("###신규저장");

                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var toDate = year + "-" + month + "-" + day;

                this.getView().byId("createDate").setText(toDate);

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "company_code": this._sCompanyCode,
                    "idea_number": this._sIdeaNumber
                }, "/IdeaView"); 

                this._toEditMode();
            } else {
                console.log("###수정");
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);

                var sObjectPath = "/IdeaView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',idea_number='" + this._sIdeaNumber + "')";
                var oMasterModel = this.getModel("master");

                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function (oData) {
                        console.log("oData====", oData);
                        oView.setBusy(false);
                    }
                });
                this._toShowMode();
            }

            //oTransactionManager.setServiceModel(this.getModel());
        },

        _toEditMode: function () {
            this.getModel("midObjectViewModel").setProperty("/isEditMode", true);
            var oMasterModel = this.getModel("master")
            var statusCode = oMasterModel.getData().loi_selection_status_code;
            // this._showFormFragment('MidObject_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageByPassButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);            
            if (statusCode === "122030" || statusCode === "122050") {
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "122060") {
                this.byId("pageByPassButton").setEnabled(false);
            } else {
                this.byId("pageByPassButton").setEnabled(true);
            }
            if (statusCode === "122040" || statusCode === "122060") {
                this.byId("pageRequestButton").setEnabled(false);
            } else {
                this.byId("pageRequestButton").setEnabled(true);
            }
            this.byId("pageCancelButton").setEnabled(true);
            // this.byId("midTableAddButton").setEnabled(!FALSE);
            // this.byId("midTableDeleteButton").setEnabled(!FALSE);
            // this.byId("midTableSearchField").setEnabled(FALSE);
            // this.byId("midTableApplyFilterButton").setEnabled(FALSE);
            // this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            //this._bindMidTable(this.oEditableTemplate, "Edit");
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));

        },

        _toShowMode: function () {
            var oMasterModel = this.getModel("master");
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
                this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(true);
            this.byId("pageDeleteButton").setVisible(true)
            this.byId("pageNavBackButton").setEnabled(true);
            
            this.byId("pageSaveButton").setVisible(false);
            this.byId("pageByPassButton").setVisible(false);
            this.byId("pageRequestButton").setVisible(false);

            this.byId("pageCancelButton").setEnabled(true);
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));
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
                    name: "dp.im.supplierIdeaMgt.view." + sFragmentName,
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