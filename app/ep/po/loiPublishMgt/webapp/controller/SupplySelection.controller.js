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

    return BaseController.extend("ep.po.loiPublishMgt.controller.SupplySelection", {

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
            this.setModel(new JSONModel(), "details");
            this.setModel(new JSONModel(), "midObjectViewModel");

            this.setModel(new JSONModel(), "loiSupplySelection");

            // oTransactionManager = new TransactionManager();
            // oTransactionManager.addDataModel(this.getModel("master"));
            // oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("selectionPage").attachPatternMatched(this._onRoutedThisPage, this);

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
            var detailData = this._sLoiDtlArr;

            console.log("detailData===", detailData[0]);
            console.log("detailData===", detailData);

            inputData = {
                "tenant_id": oMasterModel.getData().tenant_id,
                "company_code": oMasterModel.getData().company_code,
                "loi_selection_number": oMasterModel.getData().loi_selection_number,
                "user_id": '9586',
                "details": detailData
            }

            input.inputData = inputData;

            console.log("input====", JSON.stringify(input));
            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiSupplySelectionProc";

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

            console.log("details===", oDetailsModel.getData());    

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
            var detailData = this._sLoiDtlArr;
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
                "buyer_empno": oMasterModel.getData().buyer_empno,
                "purchasing_department_code": oMasterModel.getData().purchasing_department_code,
                // "buyer_empno": '9586',
                // "purchasing_department_code": '50008948',
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

            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiSupplySelectionProc";

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

            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sLoiWriteNumber = oArgs.loiWriteNumber;
            this._sLoiItemNumber = oArgs.loiItemNumber;
            this._sLoiSelectionNumber = oArgs.loiSelectionNumber;
            this._sLoiNumber = oArgs.loiNumber;
            this._sQuotationNumber = oArgs.quotationNumber;
            this._sQuotationItemNumber = oArgs.quotationItemNumber;
            this.getModel("midObjectViewModel").setProperty("/viewLoiNumber", oArgs.loiNumber);

            console.log("##getOwnerComponent==", this.getOwnerComponent().getRootControl().byId("fcl"));

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.loiWriteNumber==", oArgs.loiWriteNumber);
            console.log("##oArgs.loiItemNumber==", oArgs.loiItemNumber);
            console.log("##oArgs.loiSelectionNumber==", oArgs.loiSelectionNumber);
            console.log("##oArgs.loiNumber==", oArgs.loiNumber);
            console.log("####################22222");

            var loiDtlArr = [];

            var tenantIdArr = oArgs.tenantId.split(","),
                companyCodeArr = oArgs.companyCode.split(","),
                loiWriteNumberArr = oArgs.loiWriteNumber.split(","),
                loiItemNumberArr = oArgs.loiItemNumber.split(",");

            loiItemNumberArr.forEach(function (item, index) {
                console.log("item==", item);
                console.log("index==", index);
                var arr = {
                    "tenant_id": tenantIdArr[0],
                    "company_code": companyCodeArr[0],
                    "loi_write_number": loiWriteNumberArr[0],
                    "loi_item_number": item,
                };
                loiDtlArr[index] = arr;

            });

            var quotationArr = [];

            var quotationNumberArr = oArgs.quotationNumber.split(","),
                quotationItemNumberArr = oArgs.quotationItemNumber.split(",");

            quotationNumberArr.forEach(function (item, index) {
                
                var arr = {
                    "quotation_number": item,
                    "quotation_item_number": ""
                };
                if(item != "new")
                    quotationArr[index] = arr;

            });

            quotationItemNumberArr.forEach(function (item, index) {
                if(item != "new")
                    quotationArr[index]["quotation_item_number"] = item;
            });

            // loiWriteNumberArr.forEach(function (item, index) {
            //     loiDtlArr[index]["loi_write_number"] = item;
            // });

            // loiItemNumberArr.forEach(function (item, index) {
            //     loiDtlArr[index]["loi_item_number"] = item;
            // });

            console.log("loiDtlArr==", loiDtlArr);
            console.log("quotationArr==", quotationArr);

            this._sLoiDtlArr = loiDtlArr;

            var input = {
                inputData: {
                    loiRfqType: [],
                    loiDtlType: []
                }
            };

            input.inputData.loiRfqType = quotationArr;
            input.inputData.loiDtlType = loiDtlArr;

            console.log("input==", JSON.stringify(input));

            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SupplySelectionResult";

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(input),
                contentType: "application/json",
                success: function (data) {
                    console.log("#########Success#####", data);
                    oView.setBusy(false);
                    oView.getModel("details").setData(data.value);
                    console.log("details11=======", oView.getModel("details").getData());
                    // oView.getModel("details").updateBindings(true);
                    //console.log("details22=======", oView.getModel("details"));
                },
                error: function (e) {
                    console.log("error====", e);
                }
            });

            if (oArgs.loiSelectionNumber == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", true);

                console.log("###신규저장");

                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var toDate = year + "-" + month + "-" + day;

                //this.getView().byId("createDate").setText(toDate);

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": this._sTenantId,
                    "company_code": this._sCompanyCode,
                    "loi_selection_number": "",
                    "loi_selection_status_code": "122030",
                    "loi_selection_status_name": "작성중",
                    "special_note": "",
                    "attch_group_number": "",
                    "approval_number": "",
                    "buyer_empno": "9586",
                    "buyer_name": "**민",
                    "purchasing_department_code": "50008948",
                    "purchasing_department_name": "첨단소재.구매2.공사구매팀(청주P)",
                    "supplier_selection_date": date,
                    "remark": "",
                    "org_type_code": "",
                    "org_code": "",
                    "user_id": "9586"
                }, "/LoiVendorSelection");

                this._toEditMode();
            } else {
                console.log("###수정");
                var that = this;
                this.getModel("midObjectViewModel").setProperty("/isAddedMode", false);
                var loi_status = "";
                //뷰생성해서 변경예정
                var sObjectPath = "/LOISupplySelectionView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',loi_selection_number='" + this._sLoiSelectionNumber + "')";
                var oMasterModel = this.getModel("master");
                oView.setBusy(true);
                oMasterModel.setTransactionModel(this.getModel());
                oMasterModel.read(sObjectPath, {
                    success: function (oData) {
                        console.log("oData====", oData.loi_selection_status_code);
                        oView.setBusy(false);
                        loi_status = oData.loi_selection_status_code;
                        that._toShowMode();

                    }
                });
            }
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
            var statusCode = oMasterModel.getData().loi_selection_status_code;
            console.log("statusCode=", statusCode);
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
            // this._showFormFragment('MidObject_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            if (statusCode == "122060") {
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
            // this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
            console.log("####################isEditMode", this.getModel("midObjectViewModel").getProperty("/isEditMode"));
        },

        // _bindMidTable: function(oTemplate, sKeyboardMode){
        // 	this.byId("midTable").bindItems({
        // 		path: "details>/ControlOptionDetails",
        // 		template: oTemplate
        // 	}).setKeyboardMode(sKeyboardMode);
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
            if (!this._oFragments[sFragmentName]) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "ep.po.loiPublishMgt.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        }

        // onAfterRendering : function () {
        //     var that = this,
        //         sHtmlValue = "";
        //         // sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
        // 		// '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
        // 		// 'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';                
        // 	sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
        // 		function (RTE, EditorType) {
        // 			var oRichTextEditor = new RTE("myRTE", {
        // 				editorType: EditorType.TinyMCE4,
        // 				width: "100%",
        //                 height: "200px",
        //                 //editable: "{contModel>/editMode}",
        //                 editable: true,
        // 				customToolbar: true,
        // 				showGroupFont: true,
        // 				showGroupLink: true,
        // 				showGroupInsert: true,
        // 				value: sHtmlValue,
        // 				ready: function () {
        // 					this.addButtonGroup("styleselect").addButtonGroup("table");
        // 				}
        //             });
        // 			that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
        //     });

        //     //this.onPageEnterFullScreenButtonPress();
        // }

    });
});