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

    return BaseController.extend("ep.ne.ucContractMgt.controller.UcContractDetail", {

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
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");
            this.setModel(new JSONModel(), "midObjectViewModel");

            //this.setModel(new JSONModel(), "loiSupplySelection");

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("publishPage").attachPatternMatched(this._onRoutedThisPage, this);

            // this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            //this._initTableTemplates();
            this.enableMessagePopover();

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        // /**
        //  * Event handler for Enter Full Screen Button pressed
        //  * @public
        //  */
        // onPageEnterFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/fullScreen");
        //     this.getRouter().navTo("midPage", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         companyCode: this._sCompanyCode,
        //         loiWriteNumber: this._sLoiWriteNumber,
        //         loiItemNumber: this._sLoiItemNumber,
        //         loiSelectionNumber: this._sLoiSelectionNumber,
        //         loiNumber: this._sLoiNumber
        //     });
        // },
        // /**
        //  * Event handler for Exit Full Screen Button pressed
        //  * @public
        //  */
        // onPageExitFullScreenButtonPress: function () {
        //     var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
        //     this.getRouter().navTo("midPage", {
        //         layout: sNextLayout,
        //         tenantId: this._sTenantId,
        //         companyCode: this._sCompanyCode,
        //         loiWriteNumber: this._sLoiWriteNumber,
        //         loiItemNumber: this._sLoiItemNumber,
        //         loiSelectionNumber: this._sLoiSelectionNumber,
        //         loiNumber: this._sLoiNumber
        //     });
        // },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("publishEditBox"));
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
                "loi_publish_number": oMasterModel.getData().loi_publish_number,
                "user_id": '9586',
                "details": detailData
            }

            input.inputData = inputData;

            console.log("input====", JSON.stringify(input));
            var url = "ep/ne/ucContractMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiPublishProc";

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

            // 123010	작성중			
            // 123020	결재진행중			
            // 123030	결재반려			
            // 123040	결재완료			
            // 123050	발행완료			
            // 123060	서명완료 
            var statusCode = "123010";
            var statusName = "작성중";
            if (flag == "R") {
                statusCode = "123020";
                statusName = "결재진행중";
            } else if (flag == "B") {
                statusCode = "123040";
                statusName = "발행완료";
            } else {
                statusCode = "123010";
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
                "loi_publish_number": oMasterModel.getData().loi_publish_number,
                "loi_publish_title": oMasterModel.getData().loi_publish_title,
                "loi_publish_status_code": statusCode,
                "supplier_code": oMasterModel.getData().supplier_code,
                "contract_format_id": oMasterModel.getData().contract_format_id,
                "offline_flag": (oMasterModel.getData().offline_flag == "false" ? false : true),
                "contract_date": oMasterModel.getData().contract_date,
                "additional_condition_desc": oMasterModel.getData().additional_condition_desc,
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

            if (this.validator.validate(this.byId("publishEditBox")) !== true) return;

            var url = "ep/ne/ucContractMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiPublishProc";

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
                                that.validator.clearValueState(that.byId("publishEditBox"));

                                var sObjectPath = "/LOIPublishView(tenant_id='" + tenantId + "',company_code='" + companyCode + "',loi_publish_number='" + data.value[0].savedkey + "')";
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
                                // that.getModel("master").getData().loi_publish_status_code = statusCode;
                                // that.getModel("master").getData().loi_publish_status_name = statusName;
                                // console.log("loi_publish_status_name===", that.getModel("master").getData().loi_publish_status_name);
                                // oView.getModel("master").updateBindings(true);
                                // if(data.value.rsltCnt > 0) {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                // }else {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM01005"));
                                // }

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
            this.validator.clearValueState(this.byId("publishEditBox"));
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
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sLoiWriteNumber = oArgs.loiWriteNumber;
            this._sLoiItemNumber = oArgs.loiItemNumber;
            this._sLoiPublishNumber = oArgs.loiPublishNumber;
            this._sLoiNumber = oArgs.loiNumber;
            this.getModel("midObjectViewModel").setProperty("/viewLoiNumber", oArgs.loiNumber);

            console.log("##getOwnerComponent==", this.getOwnerComponent().getRootControl().byId("fcl"));

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.loiWriteNumber==", oArgs.loiWriteNumber);
            console.log("##oArgs.loiItemNumber==", oArgs.loiItemNumber);
            console.log("##oArgs.loiPublishNumber==", oArgs.loiPublishNumber);
            console.log("##oArgs.loiNumber==", oArgs.loiNumber);
            console.log("####################22222");

            var loiDtlArr = [];

            var tenantIdArr = oArgs.tenantId.split(","),
                companyCodeArr = oArgs.companyCode.split(","),
                loiWriteNumberArr = oArgs.loiWriteNumber.split(","),
                loiItemNumberArr = oArgs.loiItemNumber.split(",");

            tenantIdArr.forEach(function (item, index) {
                var arr = {
                    "tenant_id": item,
                    "company_code": "",
                    "loi_write_number": "",
                    "loi_item_number": "",
                };
                loiDtlArr[index] = arr;
            });

            companyCodeArr.forEach(function (item, index) {
                loiDtlArr[index]["company_code"] = item;
            });

            loiWriteNumberArr.forEach(function (item, index) {
                loiDtlArr[index]["loi_write_number"] = item;
            });

            loiItemNumberArr.forEach(function (item, index) {
                loiDtlArr[index]["loi_item_number"] = item;
            });

            console.log("loiDtlArr==", loiDtlArr);

            this._sLoiDtlArrr = loiDtlArr;

            //뷰생성해서 변경예정
            var orFilter = [];
            var andFilter = [];

            loiDtlArr.forEach(function (item) {
                andFilter = [];
                andFilter.push(new Filter("tenant_id", FilterOperator.EQ, item.tenant_id));
                andFilter.push(new Filter("company_code", FilterOperator.EQ, item.company_code));
                andFilter.push(new Filter("loi_write_number", FilterOperator.EQ, item.loi_write_number));
                andFilter.push(new Filter("loi_item_number", FilterOperator.EQ, item.loi_item_number));
                orFilter.push(new Filter(andFilter, true));
                //orFilter.push()
                console.log("andFilter==", andFilter);
            });
            console.log("orFilter==", orFilter);
            //orFilter = new Filter(orFilter, false);

            var oDetailsModel = this.getModel("details");
            oDetailsModel.setTransactionModel(this.getModel());
            oDetailsModel.read("/LOIPublishItemView", {
                filters: [
                    new Filter(orFilter, false)
                ],
                success: function (oData) {
                    oView.setBusy(false);
                    console.log("details=====", oData);
                    //oView.getModel("details").updateBindings(true);
                }
            });

            //발행요청시 품목의 tenantId, companyCode 와 업체선정품의의 tenantId, companyCode가 다를 수 있다면 둘다 함께 체크
            if (oArgs.loiPublishNumber == "new") {
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
                    "loi_publish_number": "",
                    "loi_publish_status_code": "123010",
                    "loi_publish_status_name": "작성중",
                    "supplier_code": "",
                    "contract_format_id": "K",
                    "offline_flag": "false",
                    "contract_date": "",
                    "additional_condition_desc": "",
                    "special_note": "",
                    "attch_group_number": "",
                    "approval_number": "",
                    "buyer_empno": "9586",
                    "purchasing_department_code": "50008948",
                    "remark": "",
                    "org_type_code": "",
                    "org_code": "",
                    "user_id": "9586"
                }, "/LoiPublish");

                this._toEditMode();
            } else {
                console.log("###수정");
                var that = this;
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
                var loi_status = "";
                //뷰생성해서 변경예정
                var sObjectPath = "/LOIPublishView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',loi_publish_number='" + this._sLoiPublishNumber + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function (oData) {
                        console.log("oData====", oData.loi_publish_status_code);
                        oView.setBusy(false);
                        that._toShowMode();
                    }
                });

            }
        },

        _toEditMode: function () {
            this.getModel("midObjectViewModel").setProperty("/isEditMode", true);
            var oMasterModel = this.getModel("master")
            var statusCode = oMasterModel.getData().loi_publish_status_code;
            this._showFormFragment('Publish_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageByPassButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);
            if (statusCode === "123010" || statusCode === "123030") {
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "123040") {
                this.byId("pageByPassButton").setEnabled(false);
            } else {
                this.byId("pageByPassButton").setEnabled(true);
            }
            if (statusCode === "123020" || statusCode === "123040") {
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
            var statusCode = oMasterModel.getData().loi_publish_status_code;
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
            this._showFormFragment('Publish_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            if (statusCode == "123040") {
                this.byId("page").setProperty("showFooter", false);
            } else {
                this.byId("page").setProperty("showFooter", true);
            }

            //this.byId("pageEditButton").setVisible(true);
            // if (statusCode === "122040" || statusCode === "122060") {
            //     this.byId("pageEditButton").setVisible(false);
            //     this.byId("pageDeleteButton").setVisible(false);
            // } else {
            this.byId("pageEditButton").setVisible(true);
            this.byId("pageDeleteButton").setVisible(true)
            //}
            //this.byId("pageDeleteButton").setEnabled(true);
            this.byId("pageNavBackButton").setEnabled(true);

            this.byId("pageSaveButton").setVisible(false);
            this.byId("pageByPassButton").setVisible(false);
            this.byId("pageRequestButton").setVisible(false);

            this.byId("pageCancelButton").setEnabled(true);
            // this.byId("midTableAddButton").setEnabled(!TRUE);
            // this.byId("midTableDeleteButton").setEnabled(!TRUE);
            // this.byId("midTableSearchField").setEnabled(TRUE);
            // this.byId("midTableApplyFilterButton").setEnabled(TRUE);
            // this.byId("midTable").setMode(sap.m.ListMode.None);
            //this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));
        },

        // _initTableTemplates: function () {
        //     this.oReadOnlyTemplate = new ColumnListItem({
        //         cells: [
        //             new Text({
        //                 text: "{details>plant_name}"
        //             }),
        //             new Text({
        //                 text: "{details>item_desc}"
        //             }),
        //             new Text({
        //                 text: "{details>unit}"
        //             }),
        //             new Text({
        //                 text: "{details>request_quantity}"
        //             }),
        //             new Text({
        //                 text: "{details>delivery_request_date}"
        //             })

        //         ],
        //         type: sap.m.ListType.Inactive
        //     });
        // },        

        // _bindMidTable: function (oTemplate, sKeyboardMode) {
        //     this.byId("midTable").bindItems({
        //         path: "details>/LOIRequestDetailView",
        //         template: oTemplate,
        //         templateShareable: true,
        //         key: ""
        //     }).setKeyboardMode(sKeyboardMode);
        // },

        _oFragments: {},
        _showFormFragment: function (sFragmentName) {
            var oPageSubSection = this.byId("pageSubSection1");
            this._loadFragment(sFragmentName, function (oFragment) {
                oPageSubSection.removeAllBlocks();
                oPageSubSection.addBlock(oFragment);
            })
        },
        _loadFragment: function (sFragmentName, oHandler) {
            var that = this;
            if (!this._oFragments[sFragmentName]) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "ep.ne.ucContractMgt.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                    this.byId("page").setSelectedSection("pageSectionMain");
                    this.byId("pageSectionMain").setSelectedSubSection("pageSubSection1");
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
                this.byId("page").setSelectedSection("pageSectionMain");
                this.byId("pageSectionMain").setSelectedSubSection("pageSubSection1");
            }
        }

    });
});