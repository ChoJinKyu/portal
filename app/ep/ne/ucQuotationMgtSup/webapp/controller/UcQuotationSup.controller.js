sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/json/JSONModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
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
], function (BaseController, Multilingual, TransactionManager, ManagedModel, ManagedListModel, JSONModel, Validator, DateFormatter, NumberFormatter,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.ne.ucQuotationMgtSup.controller.UcQuotationSup", {

        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

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
            this.setModel(new JSONModel(), "master");
            this.setModel(new JSONModel(), "details");
            this.setModel(new JSONModel(), "midObjectViewModel");

            this.setModel(new JSONModel(), "ucQuotationSup");

            this.setModel(new JSONModel(), "popUcQuotationSup");

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

            var input = {};
            var inputData = {};
            var details = [];


            // return;

            // // '221010'	'BM등록요청'
            // // '221020'	'물량확정요청'
            // // '221030'	'물량수정요청'
            // // '221040'	'물량확정'
 
            // var statusCode = "221010";
            // var statusName = "BM등록요청";
            // // if (flag == "R") {
            // //     statusCode = "221020";
            // //     statusName = "물량확정요청";
            // // } else if (flag == "B") {
            // //     statusCode = "221030";
            // //     statusName = "물량수정요청";
            // // } else {
            // //     statusCode = "221040";
            // //     statusName = "물량확정";
            // // }

            // var input = {};
            // var inputData = {};
            // //var detailData = this._sLoiDtlArr;
            // var tenantId = oMasterModel.getData().tenant_id;
            // if (tenantId.indexOf(",") > -1) {
            //     tenantId = tenantId.split(",")[0];
            // }
            // var companyCode = oMasterModel.getData().company_code;
            // if (companyCode.indexOf(",") > -1) {
            //     companyCode = companyCode.split(",")[0];
            // }


            oDetailsModel.getData().map(r => {
                
                //console.log("net_price_contract_start_date ---> " , that.getFormatDate(r["net_price_contract_start_date"]));
                //console.log("net_price_contract_end_date ---> " , that.getFormatDate(r["net_price_contract_end_date"]));


                console.log("show.... ---> " , (r["const_quotation_number"] == undefined ? '' : r["const_quotation_number"]));

                console.log("tenant_id ---> " , r["tenant_id"]);
                console.log("company_code ---> " , r["company_code"]);

                

                console.log("const_quotation_number ---> " , r["const_quotation_number"] == "undefined" ? 0 : r["const_quotation_number"]);
                console.log("const_quotation_item_number ---> " , r["const_quotation_item_number"]);
                console.log("item_sequence ---> " , r["item_sequence"]);
                console.log("ep_item_code ---> " , r["ep_item_code"]);
                console.log("item_desc ---> " , r["item_desc"]);
                console.log("spec_desc ---> " , r["spec_desc"]);
                console.log("quotation_quantity ---> " , r["quotation_quantity"]);
                console.log("unit ---> " , r["unit"]);
                console.log("material_apply_flag ---> " , r["material_apply_flag"]);
                console.log("labor_apply_flag ---> " , r["labor_apply_flag"]);
                console.log("net_price_change_allow_flag ---> " , r["net_price_change_allow_flag"]);
                console.log("base_material_net_price ---> " , r["base_material_net_price"]);
                console.log("material_net_price ---> " , r["material_net_price"]);
                console.log("material_amount ---> " , r["material_amount"]);
                console.log("labor_net_price ---> " , r["labor_net_price"]);
                console.log("labor_amount ---> " , r["labor_amount"]);
                console.log("sum_amount ---> " , r["sum_amount"]);
                console.log("currency_code ---> " , r["currency_code"]);
                console.log("extra_rate ---> " , r["extra_rate"]);
                console.log("net_price_contract_document_no ---> " , r["net_price_contract_document_no"]);
                console.log("net_price_contract_degree ---> " , r["net_price_contract_degree"]);
                console.log("net_price_contract_item_number ---> " , r["net_price_contract_item_number"]);
                console.log("supplier_item_create_flag ---> " , r["supplier_item_create_flag"]);
                console.log("remark ---> " , r["remark"]);
                
                details.push({
                        tenant_id: r["tenant_id"],
                        company_code: r["company_code"],
                        const_quotation_number: '0000871814',//(r["const_quotation_number"] == undefined ? '' : r["const_quotation_number"]),
                        //const_quotation_item_number: (r["const_quotation_item_number"] == undefined ? '' : r["const_quotation_item_number"]),
                        item_sequence: (r["item_sequence"] == undefined ? 10 : r["item_sequence"]),
                        ep_item_code: r["ep_item_code"],
                        item_desc: r["item_desc"],
                        spec_desc: r["spec_desc"],
                        quotation_quantity: (r["quotation_quantity"] == undefined ? 0 : r["quotation_quantity"]),
                        unit: r["unit"],
                        material_apply_flag: r["material_apply_flag"],
                        labor_apply_flag: r["labor_apply_flag"],
                        net_price_change_allow_flag: (r["net_price_change_allow_flag"] == null ? false : r["net_price_change_allow_flag"]),
                        base_material_net_price: (r["base_material_net_price"] == undefined ? 0 : r["base_material_net_price"]),
                        base_labor_net_price: (r["base_labor_net_price"] == undefined ? 0 : r["base_labor_net_price"]),
                        material_net_price: (r["material_net_price"] == undefined ? 0 : Number(r["material_net_price"])),
                        material_amount: (r["material_amount"] == undefined ? 0 : r["material_amount"]),
                        labor_net_price: (r["labor_net_price"] == undefined ? 0 : Number(r["labor_net_price"])),
                        labor_amount: (r["labor_amount"] == undefined ? 0 : r["labor_amount"]),
                        sum_amount: (r["sum_amount"] == undefined ? 0: r["sum_amount"]),
                        currency_code: r["currency_code"],
                        extra_rate: (r["extra_rate"] == undefined ? 0 : r["extra_rate"]),
                        net_price_contract_document_no: r["net_price_contract_document_no"],
                        net_price_contract_degree: (r["net_price_contract_degree"] == undefined ? 0 : Number(r["net_price_contract_degree"])),
                        net_price_contract_item_number: r["net_price_contract_item_number"],
                        supplier_item_create_flag: (r["supplier_item_create_flag"] == undefined ? false : r["supplier_item_create_flag"]),
                        remark:  (r["remark"] == null ? '' : r["remark"])

                        //delivery_request_date: that.getFormatDate(r["delivery_request_date"]),

                        
                    });

                    console.log("details ---> " , details);
            });



            // inputData = {
            //     "tenant_id": tenantId,
            //     "company_code": companyCode,
            //     "const_quotation_number": oMasterModel.getData().const_quotation_number,
            //     "const_name": oMasterModel.getData().const_name,


            //     "ep_item_code": oMasterModel.getData().ep_item_code,
            //     "const_start_date": oMasterModel.getData().const_start_date,
            //     "const_end_date": oMasterModel.getData().const_end_date,
            //     "currency_code": oMasterModel.getData().currency_code,
                
            //     "const_person_empno": oMasterModel.getData().const_person_empno,

            //     "purchasing_department_code": oMasterModel.getData().purchasing_department_code,
            //     "buyer_empno": oMasterModel.getData().buyer_empno,

            //     "remark": oMasterModel.getData().remark,
            //     "attch_group_number": oMasterModel.getData().attch_group_number,
            //     "user_id": '9586',
            //     //"details": detailData
            // }

            console.log("input====", JSON.stringify(details));

            input.inputData = details;

            console.log("input====", JSON.stringify(input));

            // if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("midObjectForm")) !== true) return;

            var url = "ep/ne/ucQuotationMgtSup/webapp/srv-api/odata/v4/ep.UcQuotationMgtV4Service/SaveUcQuotationDtlProc";

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
          //                      that.validator.clearValueState(that.byId("midObjectForm"));


                                var sObjectPath = "/UcQuotationDtlView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',const_quotation_number='" + this._sConstQuotationNumber + "')";
                                var oMasterModel = that.getModel("details");
                                oView.setBusy(true);
                                oMasterModel.setTransactionModel(that.getModel());
                                oMasterModel.read(sObjectPath, {
                                    success: function (oData) {
                                        oView.setBusy(details);
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
            this._sConstQuotationNumber = oArgs.constQuotationNumber;
            // this._sLoiItemNumber = oArgs.loiItemNumber;
            // this._sLoiSelectionNumber = oArgs.loiSelectionNumber;
            // this._sLoiNumber = oArgs.loiNumber;
            // this._sQuotationNumber = oArgs.quotationNumber;
            // this._sQuotationItemNumber = oArgs.quotationItemNumber;
            this.getModel("midObjectViewModel").setProperty("/viewConstQuotationNumber", oArgs.constQuotationNumber);

            console.log("##getOwnerComponent==", this.getOwnerComponent().getRootControl().byId("fcl"));

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.constQuotationNumber==", oArgs.constQuotationNumber);

            console.log("####################22222");

            // var loiDtlArr = [];

            // var tenantIdArr = oArgs.tenantId.split(","),
            //     companyCodeArr = oArgs.companyCode.split(","),
            //     loiWriteNumberArr = oArgs.loiWriteNumber.split(","),
            //     loiItemNumberArr = oArgs.loiItemNumber.split(",");

            // loiItemNumberArr.forEach(function (item, index) {
            //     console.log("item==", item);
            //     console.log("index==", index);
            //     var arr = {
            //         "tenant_id": tenantIdArr[0],
            //         "company_code": companyCodeArr[0],
            //         "loi_write_number": loiWriteNumberArr[0],
            //         "loi_item_number": item,
            //     };
            //     loiDtlArr[index] = arr;

            // });

            // var quotationArr = [];

            // var quotationNumberArr = oArgs.quotationNumber.split(","),
            //     quotationItemNumberArr = oArgs.quotationItemNumber.split(",");

            // quotationNumberArr.forEach(function (item, index) {
            //     var arr = {
            //         "quotation_number": item,
            //         "quotation_item_number": ""
            //     };
            //     quotationArr[index] = arr;

            // });

            // quotationItemNumberArr.forEach(function (item, index) {
            //     quotationArr[index]["quotation_item_number"] = item;
            // });

            // // loiWriteNumberArr.forEach(function (item, index) {
            // //     loiDtlArr[index]["loi_write_number"] = item;
            // // });

            // // loiItemNumberArr.forEach(function (item, index) {
            // //     loiDtlArr[index]["loi_item_number"] = item;
            // // });

            // console.log("loiDtlArr==", loiDtlArr);
            // console.log("quotationArr==", quotationArr);

            // this._sLoiDtlArr = loiDtlArr;


            // var input = {
            //     inputData: {
            //         loiRfqType: [],
            //         loiDtlType: []
            //     }
            // };

            // input.inputData.loiRfqType = quotationArr;
            // input.inputData.loiDtlType = loiDtlArr;

            // console.log("input==", JSON.stringify(input));

            // var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SupplySelectionResult";

            // $.ajax({
            //     url: url,
            //     type: "POST",
            //     data: JSON.stringify(input),
            //     contentType: "application/json",
            //     success: function (data) {
            //         console.log("#########Success#####", data);
            //         oView.setBusy(false);
            //         oView.getModel("details").setData(data.value);
            //         console.log("details11=======", oView.getModel("details").getData());
            //         // oView.getModel("details").updateBindings(true);
            //         //console.log("details22=======", oView.getModel("details"));
            //     },
            //     error: function (e) {
            //         console.log("error====", e);
            //     }
            // });

            if (oArgs.constQuotationNumber == "new") {
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

                var oView = this.getView();
                var oMasterModel = this.getModel();
                oView.setBusy(true);

                // Master 조회
                oMasterModel.read("/UcQuotationListView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                        new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                    ],
                    success: function (oData) {
                        console.log(" UcQuotationListView ::: ", oData.results[0]);
                        oView.getModel("master").setData(oData.results[0]);
                        oView.setBusy(false);
                        loi_status = oData.quotation_status_code;
                        that._toShowMode();
                    }

                });

                // Detail 조회
                oMasterModel.read("/UcQuotationDtlView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                        new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                    ],
                    success: function (oData) {
                        console.log(" UcQuotationDtlView ::: ", oData.results);
                        oView.getModel("details").setData(oData.results);
                        oView.setBusy(false);
                        // loi_status = oData.quotation_status_code;
                        // that._toShowMode();
                    }

                });
            }
        },

        // '221010'	'BM등록요청'
        // '221020'	'물량확정요청'
        // '221030'	'물량수정요청'
        // '221040'	'물량확정'


        _toEditMode: function () {
            this.getModel("midObjectViewModel").setProperty("/isEditMode", true);
            var oMasterModel = this.getModel("master")
            var statusCode = oMasterModel.getData().quotation_status_code;
            this._showFormFragment('UcQuotationSup_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            //this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageByPassButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);
            if (statusCode === "221010") { //BM등록요청
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "221020" ) {
                this.byId("pageByPassButton").setEnabled(false);
            } else {
                this.byId("pageByPassButton").setEnabled(true);
            }
            if (statusCode === "221020") {
                this.byId("pageRequestButton").setEnabled(false);
            } else {
                this.byId("pageRequestButton").setEnabled(true);
            }
            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(true);
            this.byId("midTableDeleteButton").setEnabled(true);
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
            var statusCode = oMasterModel.getData().quotation_status_code;
            console.log("statusCode=", statusCode);
            this.getModel("midObjectViewModel").setProperty("/isEditMode", false);
            this._showFormFragment('UcQuotationSup_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            if (statusCode == "221040") {
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
            //this.byId("pageNavBackButton").setEnabled(true);

            this.byId("pageSaveButton").setVisible(false);
            this.byId("pageByPassButton").setVisible(false);
            this.byId("pageRequestButton").setVisible(false);

            this.byId("pageCancelButton").setEnabled(true);
            this.byId("midTableAddButton").setEnabled(false);
            this.byId("midTableDeleteButton").setEnabled(false);
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

        // _oFragments: {},
        // _showFormFragment: function (sFragmentName) {
        //     var oPageSubSection = this.byId("pageSubSection1");
        //     this._loadFragment(sFragmentName, function (oFragment) {
        //         oPageSubSection.removeAllBlocks();
        //         oPageSubSection.addBlock(oFragment);
        //     })
        // },
        // _loadFragment: function (sFragmentName, oHandler) {
        //     if (!this._oFragments[sFragmentName]) {
        //         Fragment.load({
        //             id: this.getView().getId(),
        //             name: "ep.po.loiPublishMgt.view." + sFragmentName,
        //             controller: this
        //         }).then(function (oFragment) {
        //             this._oFragments[sFragmentName] = oFragment;
        //             if (oHandler) oHandler(oFragment);
        //         }.bind(this));
        //     } else {
        //         if (oHandler) oHandler(this._oFragments[sFragmentName]);
        //     }
        // }

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
                    name: "ep.ne.ucQuotationMgtSup.view." + sFragmentName,
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
        },

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

        

        onMidTableAddButtonPress: function () {

            var [tId, mName] = arguments;
            var table = this.byId(tId);
            var model = this.getView().getModel(mName);



            console.log("onMidTableAddButtonPress  model----> " ,model.oData.tenant_id);
            console.log("onMidTableAddButtonPress  model----> " ,model.oData.ep_item_code);
            // var sPath = oEvent.getSource().getBindingContext("listModel").getPath(),
            //     oRecord = this.getModel("listModel").getProperty(sPath);

            // var saveLoiVos = {
            //     "tenant_id": oRecord.tenant_id,
            //     "company_code": oRecord.company_code,
            //     "loi_write_number": oRecord.loi_write_number,
            //     "loi_item_number": oRecord.loi_item_number,
            //     "supplier_opinion": ""
            // }
            // this.getModel("loiVos").setData(saveLoiVos);
            // console.log("####sloiVos====", this.getModel("loiVos"));
            var oView = this.getView(),
                oMasterModel = this.getModel("master");

                console.log("oMasterModel.getData() ---> ",oMasterModel.getData());



var tenantId = oMasterModel.getData().tenant_id;
            if (tenantId.indexOf(",") > -1) {
                tenantId = tenantId.split(",")[0];
            }
            var companyCode = oMasterModel.getData().company_code;
            if (companyCode.indexOf(",") > -1) {
                companyCode = companyCode.split(",")[0];
            }


            if (!this._vosDialog) {
                this._vosDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ep.ne.ucQuotationMgtSup.view.Vos",
                    controller: this
                }).then(function (vosDialog) {
                    oView.addDependent(vosDialog);
                    return vosDialog;
                }.bind(this));
            }

            //this._vosDialog.then(function (vosDialog) {
            this._vosDialog.then((function (vosDialog) {
                vosDialog.open();



                var oMasterModel = this.getModel();
                oView.setBusy(true);

                // Master 조회
                oMasterModel.read("/GetUcApprovalDtlView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, tenantId),
                        new Filter("company_code", FilterOperator.EQ, companyCode)//,
                        //new Filter("const_quotation_number", FilterOperator.EQ, this._sConstQuotationNumber)
                    ],
                    success: function (oData) {
                        console.log(" GetUcApprovalDtlView ::: ", oData.results);
                        oView.getModel("popUcQuotationSup").setData(oData.results);
                        oView.setBusy(false);

                    }

                });






                oView.byId("searchPopEpItemCode").setSelectedKey(model.oData.ep_item_code);
                oView.byId("searchTenantId").setText(model.oData.org_code);
                //console.log("#saveSupplierOpinion=", oView.byId("saveSupplierOpinion").getValue());
  //              this.getModel("contModel").setProperty('/ep_item_code', model.oData.ep_item_code);
                 //oMasterModel.setProperty("/master/"+index+"/material_net_price", this.numberFormatter.toNumberString(sum_val));

            }).bind(this));

        },

        onContractItemSelectionApply: function (oEvent) {
            var oView = this.getView();
            var oTable = this.byId("popTable"),
                oModel = this.getView().getModel("popUcQuotationSup"),
                oSelected = oTable.getSelectedIndices();
            var input = [];

            if (oSelected.length > 0) {
                
                console.log("oSelected.length ---> " , oSelected.length);
                oSelected.some(function (chkIdx, index) {
                    console.log("chkIdx========", oModel.getData()[chkIdx]);
                    input.push(oModel.getData()[chkIdx]);                    
                });
            }
            console.log("input========", input);
            oView.getModel("details").setData(input);

            this.byId("dialogVos").close();
        },

        onExitContractItem: function () {
            this.byId("dialogVos").close();
        },

        _checkNumber : function (oEvent) {
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
            val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);
        },


        onLiveChange: function(oEvent){

            console.log("onLiveChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);

            var sPath = oEvent.getSource().getBindingContext("details").getPath();
            var index = sPath.substr(sPath.length-1);
            console.log(" index obj ----------------->" , index); 
            var oDetailsModel = this.getView().getModel("details");

            console.log("details11=======", this.getView().getModel("details").getData()[index]);
            console.log("details11=======", this.getView().getModel("details").index);

            

            this.getView().getModel("details").getData().map(d => {
                // d["quotation_number"] = oView.byId("saveQuotationNumber").getValue();
                // d["quotation_item_number"] = oView.byId("saveQuotationItemNumber").getValue();
                // return d;
                console.log(" dddd ----------------->" , d ); 
                console.log(" material_net_price ----------------->" , d["material_net_price"] ); 
                //material_amount

                d["material_amount"] = d["material_net_price"] * val;
                return d;
            });


            // var oDetailsTable = this.byId("mainTable");
            // console.log("  oDetailsTable.getItems().length ----------------->" , oDetailsTable.getItems().length); 

            


            console.log(" 1111 3333 oDetailsModel ----------------->" , oDetailsModel.getProperty("/UcQuotationDtlView/")); 

            console.log(" 222 val ----------------->" , val); 

            var sum_val = 0;
            this.requestQuantity_ = [];
            this.requestNetPrice_ = []; 
            this.requestQuantity_[index] = oDetailsModel.getProperty("/UcQuotationDtlView/"+index+"/quotation_quantity");
            this.requestNetPrice_[index] = oDetailsModel.getProperty("/UcQuotationDtlView/"+index+"/material_net_price");

            //this.getView().getModel("productsl").getProperty("/ProductCollection/ProductId")
            //this.getView().getModel("productsl").getProperty("/ProductCollection");

            console.log(" this.requestQuantity_[index]  ----------------->" , this.requestQuantity_[index] ); 
            console.log(" this.requestNetPrice_[index] ----------------->" , this.requestNetPrice_[index]); 

            if(this.requestQuantity_[index] < 0 || this.requestNetPrice_[index] > 0){
                this.requestQuantity_[index] = 0;
            }


            if(this.requestQuantity_[index] > 0 && this.requestNetPrice_[index] > 0){
                sum_val = this.requestQuantity_[index] * this.requestNetPrice_[index];
            }

            oDetailsModel.setProperty("/UcQuotationDtlView/"+index+"/quotation_quantity", this.numberFormatter.toNumberString(val));
            oDetailsModel.setProperty("/UcQuotationDtlView/"+index+"/material_net_price", this.numberFormatter.toNumberString(sum_val));

        },



    });
});