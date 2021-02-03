sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "sap/ui/model/Sorter",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/Formatter",
    "ext/lib/util/Validator",
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
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/model/odata/v2/ODataModel",
    "cm/util/control/ui/EmployeeDialog",
    "cm/util/control/ui/PlantDialog",
    "cm/util/control/ui/CmDialogHelp",
    //"ext/pg/util/control/ui/SupplierDialog",
    "sp/util/control/ui/SupplierWithOrgDialog",
    "sp/util/control/ui/SupplierDialog",
    "sap/m/ObjectStatus"
], function (BaseController, Multilingual, NumberFormatter, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, Sorter, DateFormatter, Formatter, Validator,
    Filter, FilterOperator, Fragment, MessageBox, MessageToast,
    ColumnListItem, ObjectIdentifier, RichTextEditor, Text, Input, ComboBox, Item, EmployeeDialog, PlantDialog, CmDialogHelp, SupplierDialog, SupplierWithOrgDialog, ObjectStatus) {

    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.po.loiRequestMgt.controller.MidObject", {

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

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {

            var oViewModel = new JSONModel({
                busy: true,
                delay: 0,
                screen: "",
                editMode: ""
            });

            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");

            //this.setModel(oViewModel, "midObjectView");
            this.setModel(new JSONModel(), "midObjectView");
            this.setModel(new ManagedModel(), "master");
            this.setModel(new ManagedListModel(), "details");


            //console.log("onInit ()----------------->" , this.getModel("master").getModel());

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("requestPage").attachPatternMatched(this._onRoutedThisPage, this);

            //this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            //this._initTableTemplates();
            this.enableMessagePopover();
            //this.onAfterRendering();

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
            this.getRouter().navTo("requestPage", {
                //layout: sNextLayout,
                tenantId: this._sTenantId,
                companyCode: this._sCompanyCode,
                loiWriteNumber: this._sLoiWriteNumber
            });
            this._setScreen(sNextLayout);
            this._newCheck(this._sTenantId);

        },
		/**
		 * Event handler for Exit Full Screen Button pressed
		 * @public
		 */
        onPageExitFullScreenButtonPress: function () {
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
            this.getRouter().navTo("requestPage", {
                //layout: sNextLayout,
                tenantId: this._sTenantId,
                companyCode: this._sCompanyCode,
                loiWriteNumber: this._sLoiWriteNumber
            });
            this._setScreen(sNextLayout);
            this._newCheck(this._sTenantId);
        },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", { layout: sNextLayout });

            // this._setScreen(sNextLayout);
            // this._setModelEditCancelMode();
        },

        _setScreen: function (screen) {
            var oViewModel = this.getModel("midObjectView");
            oViewModel.setProperty("/screen", screen);
        },

        _setModelEditCancelMode: function () {
            var oEditModel = this.getModel("editMode");
            oEditModel.setProperty("/editMode", "");
        },

        _newCheck: function (sTenantId) {
            var oViewModel = this.getModel("editMode");
            oViewModel.setProperty("/newcheck", sTenantId);
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
                that = this;
            var oMasterModel = this.getModel("master");

            var input = {};
            var inputData = {};



            inputData = {
                "tenant_id": oMasterModel.getData().tenant_id,
                "company_code": oMasterModel.getData().company_code,
                "loi_write_number": oMasterModel.getData().loi_write_number
            }

            input = inputData;
            console.log("input====", JSON.stringify(input));

            var url = "ep/po/loiRequestMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiMulEntityProc";

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
                                MessageToast.show(this.getModel("I18N").getText("/NCM01002"));
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
            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details"),
                oModel = this.getModel("v4Proc"),
                that = this;

            // '121010'	'작성중'
            // '121020'	'결재진행중'
            // '121030'	'결재반려'
            // '121040'	'요청완료'
            var statusCode = "121010";
            if (flag == "R") {
                statusCode = "121020";
            } else if (flag == "B") {
                statusCode = "121040";
            } else {
                statusCode = "121010";
            }

            console.log(">>> detail", detail.getData());

            if (flag != "R" && flag != "B" && master.getData()["_state_"] != "U") {
                if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
                    MessageBox.alert("변경사항이 없습니다.");
                    return;
                }
            }

            var input = {
                inputData: {
                    savedHeaders: [],
                    savedReqDetails: []
                }
            };

            var supInput = {};
            var inputData = {};

            console.log(" master:_state_::: " + master.getData()["_state_"]);
            console.log(" master:getData::: ", this.getModel("master").getData());

            var headers = [];
            var loiWriteNumber_mst = "";
            var loiNumber_mst = "";

            if (master.getData()["_state_"] == "C") {
                loiWriteNumber_mst = "new";
                loiNumber_mst = "new";
            } else {
                loiWriteNumber_mst = master.getData()["loi_write_number"];
                loiNumber_mst = master.getData()["loi_number"];
            }

            //if (master.getData()["_state_"] == "C" || master.getData()["_state_"] == "U") {
            headers.push({
                tenant_id: 'L2100',
                company_code: 'C100',
                loi_write_number: loiWriteNumber_mst,
                loi_number: loiNumber_mst,
                loi_request_title: master.getData()["loi_request_title"],
                loi_publish_purpose_desc: master.getData()["loi_publish_purpose_desc"],
                special_note: master.getData()["special_note"],
                requestor_empno: '10655',
                request_department_code: '58366944',
                //request_date: new Date()
                loi_request_status_code: statusCode
            });
            //}

            console.log(" headers::: ", headers);
            input.inputData.savedHeaders = headers;

            var details = [];
            var suppliers = [];
            var supplierCodeArray = [];
            var loiItemNum_val = '';
            var loiWriteNum_val = '';
            var delNum = 0;
            var afterDelCnt = 0;
            var delfalg = "";

            console.log("detail.getData()=", detail.getData());


            if (detail.getChanges().length > 0) {

                detail.getData()["LOIRequestDetailView"].map(r => {

                    console.log("detail _row_state_::: " + r["_row_state_"]);
                    if (r["_row_state_"] == "C") {
                        loiItemNum_val = "new";
                        loiWriteNum_val = "new";
                    } else {
                        loiItemNum_val = r["loi_item_number"];

                        loiWriteNum_val = r["loi_write_number"];
                    }

                    if (r["_row_state_"] == "D") {
                        delfalg = "D";
                    } else {
                        delfalg = r["_row_state_"];
                    }


                    var request_net_price_ = "0";
                    var request_quantity_ = "0";
                    var request_amount_ = "0";

                    //console.log("detail request_net_price::: " , r["request_net_price"].length);
                    
                    if(r["request_net_price"] != "" && r["request_net_price"] != null){
                        request_net_price_ = String( r["request_net_price"].replaceAll(",",""));
                    }
                    if(r["request_quantity"] != "" && r["request_quantity"] != null){
                        request_quantity_ = String( r["request_quantity"].replaceAll(",",""));
                    }
                    if(r["request_amount"] != "" && r["request_amount"] != null){
                        request_amount_ = String( r["request_amount"].replaceAll(",",""));
                    }


                    details.push({
                        tenant_id: 'L2100',
                        company_code: 'C100',
                        loi_write_number: loiWriteNum_val,//this._sLoiWriteNumber,
                        loi_item_number: loiItemNum_val,
                        item_sequence: String(r["item_sequence"] - (afterDelCnt * 10)),
                        plant_code: r["plant_code"],
                        ep_item_code: r["ep_item_code"],
                        item_desc: r["item_desc"],
                        unit: r["unit"],
                        request_net_price: request_net_price_,
                        request_quantity: request_quantity_,
                        currency_code: r["currency_code"],
                        spec_desc: r["spec_desc"],
                        delivery_request_date: that.getFormatDate(r["delivery_request_date"]),
                        request_amount: request_amount_,
                        supplier_code: r["supplier_code"],
                        buyer_empno: r["buyer_empno"],
                        purchasing_department_code: "50008948",
                        remark: r["remark"],
                        row_state: delfalg
                    });
                    //return r;

                    if (r["_row_state_"] == "D") {
                        delNum = delNum + 1;
                        afterDelCnt++;
                    }

                    delfalg = "";

                    console.log("loiWriteNum_val(2) :: ", loiWriteNum_val);

                    if (detail.getChanges().length > 0) {
                        if (r["supplier_code"] !== '' && r["supplier_code"] != null && r["supplier_code"] !== undefined) {
                            var supplierCode = r["supplier_code"];
                            supplierCodeArray = supplierCode.split(",");
                            console.log("supplierCodeArray :: ", supplierCodeArray);

                            for (var i = 0; i < supplierCodeArray.length; i++) {
                                suppliers.push({
                                    tenant_id: 'L2100',
                                    company_code: 'C100',
                                    loi_write_number: loiWriteNum_val,
                                    loi_item_number: loiItemNum_val,
                                    supplier_code: supplierCodeArray[i]
                                });
                            }
                            console.log("suppliers :: ", suppliers);
                        }
                    }
                })

                console.log("details :: ", details);

                input.inputData.savedReqDetails = details;
                supInput.inputData = suppliers;

            }


            if (this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;
            if (this.validator.validate(this.byId("midTable")) !== true) return;

            var url = "ep/po/loiRequestMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiRequestMultiEntitylProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {

                        view.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(input),
                            contentType: "application/json",
                            success: function (data) {
                                console.log("---------data ssss-------", JSON.stringify(data));
                                console.log("---------data ssss-------", JSON.stringify(data.savedHeaders));
                                console.log("---------data ssss-------", JSON.stringify(data.savedReqDetails));

                                that.validator.clearValueState(that.byId("midObjectForm1Edit"));

                                that._setItemSequence(supInput, data);
                                //if (detail.getChanges().length > 0) {
                                that.onReload(data);
                                //}
                               //this._toShowMode();
                                view.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));



                            },
                            error: function (e) {

                            }
                        });
                    };
                }
            });

        },

        onReload: function (data) {

            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details");

            var that = this;

            console.log("---------onReload ssss-------", JSON.stringify(data));
            console.log("---------this._sTenantId ssss-------", this._sTenantId);
            console.log("---------this.company_code ssss-------", this._sCompanyCode);
            console.log("---------this.loi_write_number ssss-------", this._sLoiWriteNumber);

            console.log("---------tenant_id-------",  data.savedHeaders[0].tenant_id);
            console.log("---------company_code-------",  data.savedHeaders[0].company_code);
            console.log("---------loi_write_number-------",  data.savedHeaders[0].loi_write_number);

            var oView = this.getView();
            this.getModel("midObjectView").setProperty("/isAddedMode", false);
            this._bindView("/LOIRequestListView(tenant_id='" + data.savedHeaders[0].tenant_id + "',company_code='" + data.savedHeaders[0].company_code + "',loi_write_number='" + data.savedHeaders[0].loi_write_number + "')").then((function () {
                    oView.setBusy(true);

                    var oDetailsModel = this.getModel('details');
                    oDetailsModel.setTransactionModel(this.getModel());
                    oDetailsModel.read("/LOIRequestDetailView", {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, data.savedHeaders[0].tenant_id),
                            new Filter("company_code", FilterOperator.EQ, data.savedHeaders[0].company_code),
                            new Filter("loi_write_number", FilterOperator.EQ, data.savedHeaders[0].loi_write_number)
                        ],
                        sorters: [
                            new Sorter("item_sequence", false)
                        ],

                        success: function (oData) {
                            console.log(" LOIRequestDetailView ::: ", oData);
                            oView.setBusy(false);
                            oView.getModel("details").updateBindings(true);
                        }

                    });


                    this._toShowMode();
            }).bind(this));

            //  this._bindView("/LOIRequestListView(tenant_id='" + data.savedHeaders[0].tenant_id + "',company_code='" + data.savedHeaders[0].company_code + "',loi_write_number='" + data.savedHeaders[0].loi_write_number + "')");
            //  oView.setBusy(true);

            //if (data.savedReqDetails.length > 0 && detail.getChanges().length > 0) {
            //if (detail.getChanges().length > 0) {
                //1.24 var oDetailsModel = this.getModel('details');
                // oDetailsModel.setTransactionModel(this.getModel());
                // oDetailsModel.read("/LOIRequestDetailView", {
                //     filters: [
                //         new Filter("tenant_id", FilterOperator.EQ, data.savedHeaders[0].tenant_id),
                //         new Filter("company_code", FilterOperator.EQ, data.savedHeaders[0].company_code),
                //         new Filter("loi_write_number", FilterOperator.EQ, data.savedHeaders[0].loi_write_number)
                //     ],
                //     sorters: [
                //         new Sorter("item_sequence", false)
                //     ],

                //     success: function (oData) {
                //         console.log(" LOIRequestDetailView ::: ", oData);
                //         oView.setBusy(false);
                //         oView.getModel("details").updateBindings(true);
                //     }

                //1.24 });
            //}

           // this._toShowMode();
        },

        // onPageCancelEditButtonPress: function () {

        //     console.log("this._sTenantId--------------->" + this._sTenantId);
        //     console.log("this._sCompanyCode--------------->" + this._sCompanyCode);
        //     console.log("this._sLoiWriteNumber--------------->" + this._sLoiWriteNumber);


        //     if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
        //         this.onPageNavBackButtonPress.call(this);
        //     } else {
        //         this._toShowMode();
        //         // ljh - 재조회
        //         this.getModel("details")
        //         .setTransactionModel(this.getModel())
        //         .read("/LOIRequestDetailView", {
        //             filters: [
        //             new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
        //             new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
        //             new Filter("loi_write_number", FilterOperator.EQ, this._sLoiWriteNumber)
        //             ],
        //             sorters: [
        //                 new Sorter("item_sequence", false)
        //             ],
        //             success: function (oData) {


        //             }
        //         });
        //     }
        // },

        onPageCancelEditButtonPress: function () {
            this.validator.clearValueState(this.byId("midObjectForm1Edit"));
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("midObjectView").getProperty("/isEditMode") == true) {
                    this._toShowMode();
                } else {
                    console.log("cancel.....");
                    this.onPageNavBackButtonPress.call(this);
                    //this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                }
            }
        },

        onMidTableAddButtonPress: function () {
            var oTable = this.byId("midObjectView"),
                oDetailsModel = this.getModel("details");

            var transition = function (f) {
                return function (v) {
                    return f(v);
                };
            };

            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details"),
                that = this;

            var itemSeq = "";
            detail.getData()["LOIRequestDetailView"].map(r => {
                itemSeq = detail.getData()["LOIRequestDetailView"].length * 10
            })


            oDetailsModel.addRecord({
                "item_sequence": String(+itemSeq + 10),
                "tenant_id": this._sTenantId || "",
                "ep_item_code": null,
                "item_desc": null,
                "unit": null,
                "request_quantity": null,
                "currency_code": null,
                "request_amount": null,
                "supplier_code": null,
                "buyer_empno": null,
                "remark": null
            }, "/LOIRequestDetailView");

        },

        onMidTableDeleteButtonPress: function () {
            // var oTable = this.byId("midTable"),
            //   oModel = this.getModel("details"),
            //   aItems = oTable.getSelectedItems(),
            //   aIndices = [];
            // aItems.forEach(function (oItem) {
            //   console.log(
            //     ">>>>> getData", oModel.getData()["ControlOptionDetails"],
            //     ">>>>> getData - details", oItem.getBindingContext("details"),
            //     ">>>>> getData - item", oItem.getBindingContext(),
            //     oItem.getBindingContext("details").getObject());
            //   aIndices.push(oModel.getData()["ControlOptionDetails"].indexOf(oItem.getBindingContext("details").getObject()));
            // });
            // aIndices = aIndices.sort(function (a, b) { return b - a; });
            // aIndices.forEach(function (nIndex) {
            //   oModel.markRemoved(nIndex);
            // });
            // oTable.removeSelections(true);

            var [tId, mName, sEntity] = arguments;
            var table = this.byId(tId);
            var model = this.getView().getModel(mName);
            //debugger;
            table
                .getSelectedItems()
                .map(item => model.getData()[sEntity].indexOf(item.getBindingContext("details").getObject()))
                //.getSelectedIndices()
                .reverse()
                // 삭제
                .forEach(function (idx) {
                    model.markRemoved(idx);
                });
            table
                //.clearSelection()
                .removeSelections(true);
        },


        _setItemSequence: function (supInput_, data) {
            var oView = this.getView(),
                detail = oView.getModel("details");

            var supInput = {};
            var suppliers = [];

            console.log("---------data-------", JSON.stringify(data));
            console.log("---------data.savedReqDetails.lengt-------", data.savedReqDetails.length);

            if (detail.getChanges().length > 0 && data.savedReqDetails.length > 0 && supInput_.inputData.length > 0) {
                var supplierCode_val = "";
                var supplierCodeArray_val = [];
                for (var k = 0; k < data.savedReqDetails.length; k++) {
                    supplierCode_val = data.savedReqDetails[k].supplier_code;
                    console.log("supplierCode_val :: ", supplierCode_val);
                    if (supplierCode_val != null) {
                        supplierCodeArray_val = supplierCode_val.split(",");

                        for (var i = 0; i < supplierCodeArray_val.length; i++) {
                            suppliers.push({
                                tenant_id: data.savedReqDetails[k].tenant_id,
                                company_code: data.savedReqDetails[k].company_code,
                                loi_write_number: data.savedReqDetails[k].loi_write_number,
                                loi_item_number: data.savedReqDetails[k].loi_item_number,
                                supplier_code: supplierCodeArray_val[i],
                                row_state: data.savedReqDetails[k].row_state
                            });

                        }
                    }

                    console.log("suppliers :: ", suppliers);
                }
            }

            supInput.inputData = suppliers;


            console.log(">>> after supInput", supInput);

            var url = "ep/po/loiRequestMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SupplierMulEntityProc";

            oView.setBusy(true);
            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(supInput),
                contentType: "application/json",
                success: function (data) {
                    console.log("---------_setItemSequence-------", JSON.stringify(data));
                    oView.setBusy(false);

                },
                error: function (e) {

                }
            });


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
                var sLoiWriteNumber = oMasterModel.getProperty("/loi_write_number");

                var oDetailsData = oDetailsModel.getData();
                oDetailsData.forEach(function (oItem, nIndex) {
                    oDetailsModel.setProperty("/" + nIndex + "/tenant_id", sTenantId);
                    oDetailsModel.setProperty("/" + nIndex + "/company_code", sCompanyCode);
                    oDetailsModel.setProperty("/" + nIndex + "/loi_write_number", sLoiWriteNumber);
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
            this._sTenantId = oArgs.tenantId;
            this._sCompanyCode = oArgs.companyCode;
            this._sLoiWriteNumber = oArgs.loiWriteNumber;


            console.log("oArgs.tenantId" + oArgs.tenantId);
            console.log("oArgs.companyCode" + oArgs.companyCode);


            if (oArgs.tenantId == "new" && oArgs.companyCode == "new") {
                //It comes Add button pressed from the before page.
                this.getModel("midObjectView").setProperty("/isAddedMode", true);

                var oMasterModel = this.getModel("master");
                oMasterModel.setData({
                    "tenant_id": "",
                    "company_code": "",
                    "loi_write_number": "",
                    "loi_number": "",
                    "loi_request_title": "",
                    "loi_request_status_code": "121010",
                    "loi_request_status_name": "작성중",
                    "loi_publish_purpose_desc": "",
                    "investment_review_flag": false,
                    "special_note": "",
                    "attch_group_number": "",
                    "approval_number": "",
                    "requestor_empno": "5450",
                    "requestor_name": "**운",
                    "request_department_code": "58665481",
                    "request_department_name": "IT소재.품질1.양산품질2팀(1P)",
                    "request_date": new Date(),
                    "org_type_code": "",
                    "org_code": "",
                    "local_create_dtm": new Date(),
                    "local_update_dtm": new Date(),
                    "system_create_dtm": new Date(),
                    "system_update_dtm": new Date(),
                    "create_user_id": "ADMIN",
                    "update_user_id": "ADMIN"

                }, "/LOIRequestListView", 0);

                var oDetailsModel = this.getModel("details");
                oDetailsModel.setTransactionModel(this.getModel());
                //oDetailsModel.setData([]);
                oDetailsModel.setData([], "/LOIRequestDetailView");
                // oDetailsModel.addRecord({
                //     "tenant_id": "",
                //     "country_code": "",
                //     "loi_write_number": "",
                //     "loi_item_number": "",
                //     "item_sequence": "",
                //     "ep_item_code": "",
                //     "item_desc": "",
                //     "request_quantity": "",
                //     "unit": "",
                //     "request_amount": "",
                //     "currency_code": "",
                //     "spec_desc": "",
                //     "plant_code": "",
                //     "delivery_request_date": "",
                //     "buyer_empno": "",
                //     "purchasing_department_code": "",
                //     "loi_selection_number": "",
                //     "loi_publish_number": "",
                //     "quotation_number": "",
                //     "quotation_item_number": "",
                //     "supplier_opinion": "",
                //     "remark": "",
                //     "local_create_dtm": new Date(),
                //     "local_update_dtm": new Date(),
                //     "system_create_dtm": new Date(),
                //     "system_update_dtm": new Date(),
                //     "create_user_id":"ADMIN",
                //     "update_user_id":"ADMIN"
                // }, "/LOIRequestDetailView");
                //this._toCreateMode();

                this._toEditMode();
            }
            else {
                this.getModel("midObjectView").setProperty("/isAddedMode", false);
                //this.getModel("midObjectView").setProperty("/isShowMode", true);
                var that = this;

                // this._bindView("/LOIRequestListView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',loi_write_number='" + this._sLoiWriteNumber + "')").then(function(){
                //     oView.setBusy(true);
                //     that._toShowMode();               
                // });

                this._bindView("/LOIRequestListView(tenant_id='" + this._sTenantId + "',company_code='" + this._sCompanyCode + "',loi_write_number='" + this._sLoiWriteNumber + "')");
                oView.setBusy(true);

                console.log("this._sTenantId" + this._sTenantId);
                console.log("this._sCompanyCode" + this._sCompanyCode);
                console.log("this._sLoiWriteNumber" + this._sLoiWriteNumber);

                var oDetailsModel = this.getModel('details');
                oDetailsModel.setTransactionModel(this.getModel());
                oDetailsModel.read("/LOIRequestDetailView", {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                        new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                        new Filter("loi_write_number", FilterOperator.EQ, this._sLoiWriteNumber)
                    ],
                    sorters: [
                        new Sorter("item_sequence", false)
                    ],

                    success: function (oData) {
                        //console.log(" LOIRequestDetailView ::: ", oData);
                        oView.setBusy(false);
                        that._toShowMode();
                    }

                });
                //this._toShowMode();

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
            var promise = jQuery.Deferred();

            var oView = this.getView(),
                oMasterModel = this.getModel("master");
            oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    oView.setBusy(false);

                    console.log("master ----> " ,oData);
                    oView.getModel("master").updateBindings(true);
                     promise.resolve(oData);
                }.bind(this),						
                error: function(oData){						
                    promise.reject(oData);	
                }	

            });

            return promise;
        },


        // _bindView: function (sObjectPath) {
        //     var oView = this.getView(),
        //         oMasterModel = this.getModel("master");
        //     oView.setBusy(true);
        //     oMasterModel.setTransactionModel(this.getModel());
        //     oMasterModel.read(sObjectPath, {
        //         success: function (oData) {
        //             oView.setBusy(false);
        //             console.log("master ----> ", oData);
        //             oView.getModel("master").updateBindings(true);
        //             //console.log("master ----> ", oData);
        //         }

        //     });
        // },

        // '121010'	'작성중'
        // '121020'	'결재진행중'
        // '121030'	'결재반려'
        // '121040'	'요청완료'

        _toEditMode: function () {
            this.getModel("midObjectView").setProperty("/isEditMode", true);
            this.getModel("midObjectView").setProperty("/isShowMode", false);

            this._showFormFragment('MidObject_Edit');
            var oView = this.getView(),
                oMasterModel = this.getModel("master");

            console.log("oMasterModel----->", oMasterModel);
            var statusCode = oMasterModel.getData().loi_request_status_code;
            console.log("statusCode----->", statusCode);
            //this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);

            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageByPassButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);

            if (statusCode === "121010" || statusCode === "121030") {
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "121040") {
                this.byId("pageByPassButton").setEnabled(false);
            } else {
                this.byId("pageByPassButton").setEnabled(true);
            }
            if (statusCode === "121020" || statusCode === "121040") {
                this.byId("pageRequestButton").setEnabled(false);
            } else {
                this.byId("pageRequestButton").setEnabled(true);
            }
            this.byId("pageCancelButton").setEnabled(true);

            this.byId("midTableAddButton").setEnabled(true);
            this.byId("midTableDeleteButton").setEnabled(true);
            //this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            //this._bindMidTable(this.oEditableTemplate, "Edit");
            
        },

        _toShowMode: function () {
            this.getModel("midObjectView").setProperty("/isEditMode", false);
            this.getModel("midObjectView").setProperty("/isShowMode", true);
            this._showFormFragment('MidObject_Show');
            //this._showFormFragment2('MidObject_Detail_Show');

            var oView = this.getView(),
                oMasterModel = this.getModel("master");

            console.log("statusCode----->", oMasterModel.getData().loi_request_status_name);
            var statusCode = oMasterModel.getData().loi_request_status_code;
            //this.byId("page").setSelectedSection("pageSectionMain");

            if (statusCode == "121040") {
                this.byId("page").setProperty("showFooter", false);
            } else {
                this.byId("page").setProperty("showFooter", true);
            }
            //this.byId("pageEditButton").setVisible(true);
            if (statusCode === "121020") {
                 this.byId("pageEditButton").setVisible(false);
                 this.byId("pageDeleteButton").setVisible(false);


                this.byId("pageSaveButton").setVisible(false);
                this.byId("pageByPassButton").setVisible(true);
                this.byId("pageRequestButton").setVisible(false);
             } else {
                this.byId("pageEditButton").setVisible(true);
                this.byId("pageDeleteButton").setVisible(true)

                this.byId("pageSaveButton").setVisible(false);
                this.byId("pageByPassButton").setVisible(false);
                this.byId("pageRequestButton").setVisible(false);
            }
            //this.byId("pageDeleteButton").setEnabled(true);
            this.byId("pageNavBackButton").setEnabled(true);

            // this.byId("pageSaveButton").setVisible(false);
            // this.byId("pageByPassButton").setVisible(false);
            // this.byId("pageRequestButton").setVisible(false);

            this.byId("pageCancelButton").setEnabled(true);

            this.byId("midTableAddButton").setEnabled(false);
            this.byId("midTableDeleteButton").setEnabled(false);
            //this.byId("midTable").setMode(sap.m.ListMode.None);
            //this._bindMidTable(this.oReadOnlyTemplate, "Navigation");
        },

        _initTableTemplates: function () {
            this.oReadOnlyTemplate = new ColumnListItem({
                cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    new Text({
                        text: "{details>item_sequence}"
                    }),
                    new Text({
                        text: "{details>tenant_id}"
                    }),
                    new Text({
                        text: "{details>ep_item_code}"
                    }),
                    new Text({
                        text: "{details>item_desc}"
                    }),
                    new Text({
                        text: "{details>unit}"
                    }),
                    new Text({
                        text: "{details>request_quantity}"
                    }),
                    new Text({
                        text: "{details>currency_code}"
                    }),
                    new Text({
                        text: "{details>request_amount}"
                    }),
                    new Text({
                        text: "{details>supplier_code}"
                    }),
                    new Text({
                        text: "{details>buyer_empno}"
                    }),
                    new Text({
                        text: "{details>remark}"//,
                    })

                    // new Text({"visible" : "{= ${status} === 'critical' && ${amount} > 10000 }"})


                ],
                type: sap.m.ListType.Inactive
            });
        },

        _bindMidTable: function (oTemplate, sKeyboardMode) {
            this.byId("midTable").bindItems({
                path: "details>/LOIRequestDetailView",
                template: oTemplate,
                templateShareable: true,
                key: ""
            }).setKeyboardMode(sKeyboardMode);
        },

        _setKeyMidTable: function (sKeyboardMode) {

            var oTable = this.byId("midTable");
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
                    name: "ep.po.loiRequestMgt.view." + sFragmentName,
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

         onLiveChange: function(oEvent){

            console.log("onLiveChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);

            var sPath = oEvent.getSource().getBindingContext("details").getPath();
            var index = sPath.substr(sPath.length-1);
            console.log(" index obj ----------------->" , index); 
            var oDetailsModel = this.getModel("details");

           

            var sum_val = 0;
            this.requestQuantity_ = [];
            this.requestNetPrice_ = [];
            this.requestQuantity_[index] = oDetailsModel.getProperty("/LOIRequestDetailView/"+index+"/request_quantity");
            this.requestNetPrice_[index] = oDetailsModel.getProperty("/LOIRequestDetailView/"+index+"/request_net_price");

            console.log(" this.requestQuantity_[index]  ----------------->" , this.requestQuantity_[index] ); 
            console.log(" this.requestNetPrice_[index] ----------------->" , this.requestNetPrice_[index]); 

            if(this.requestQuantity_[index] > 0 && this.requestNetPrice_[index] === undefined){
                oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_net_price", 0);
            }

            if(this.requestQuantity_[index] > 0 && this.requestNetPrice_[index] > 0){
                sum_val = this.requestQuantity_[index] * this.requestNetPrice_[index];
            }

            console.log(" sum_val----------------->" , sum_val); 

            oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_quantity", this.numberFormatter.toNumberString(val));
            oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_amount", this.numberFormatter.toNumberString(sum_val));

        },

        _onLiveChange: function(oEvent){
            
            console.log("_onLiveChange -->" , oEvent);
            var _oInput = oEvent.getSource();
            var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
            _oInput.setValue(val);

            var sPath = oEvent.getSource().getBindingContext("details").getPath();
            var index = sPath.substr(sPath.length-1);
            var oDetailsModel = this.getModel("details");
            console.log(" index obj ----------------->" , index); 

            var sum_val = 0;
            this.requestQuantity_ = [];
            this.requestNetPrice_ = [];
            this.requestQuantity_[index] = oDetailsModel.getProperty("/LOIRequestDetailView/"+index+"/request_quantity");
            this.requestNetPrice_[index] = oDetailsModel.getProperty("/LOIRequestDetailView/"+index+"/request_net_price");

            console.log(" this.requestQuantity_[index]  ----------------->" , this.requestQuantity_[index] ); 
            console.log(" this.requestNetPrice_[index] ----------------->" , this.requestNetPrice_[index]); 

            if(this.requestQuantity_[index] === undefined && this.requestNetPrice_[index] > 0){
                oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_quantity", 0);
            }

            if(this.requestQuantity_[index] > 0 && this.requestNetPrice_[index] > 0){
                sum_val = this.requestQuantity_[index] * this.requestNetPrice_[index];
            }

            oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_net_price", this.numberFormatter.toNumberString(val));
            oDetailsModel.setProperty("/LOIRequestDetailView/"+index+"/request_amount", this.numberFormatter.toNumberString(sum_val));

        },

        onInputChange: function(oEvent){
            console.log("onInputChange --> " , oEvent);
            // if(this.isValNull(oEvent.mParameters.newValue))
                
        },

        formattericon: function (sState) {
            switch (sState) {
                case "D":
                    return "sap-icon://decline";
                    break;
                case "U":
                    return "sap-icon://accept";
                    break;
                case "C":
                    return "sap-icon://add";
                    break;
            }
            return "";
        },
         

        onInputWithEmployeeValuePress: function(oEvent){
            console.log(" empl abc----------------->", oEvent); 

            var sPath = oEvent.getSource().getBindingContext("details").getPath();
            //oRecord = this.getModel("details").getProperty(sPath);
            var index = sPath.substr(sPath.length-1);

            console.log(" index obj ----------------->" , index); 
            this.onInputWithEmployeeValuePress["row"] = index;

            this.byId("employeeDialog").open();
        },

 

        onEmployeeDialogApplyPress: function(oEvent){

            //this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
            //var sDepNo = oEvent.getParameter("item").employee_number;
            var oDetailsModel = this.getModel("details");
            var rowIndex = this.onInputWithEmployeeValuePress["row"];
            console.log("row ::: " ,this.onInputWithEmployeeValuePress["row"]);

            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/buyer_name", oEvent.getParameter("item").user_local_name);
            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/buyer_empno", oEvent.getParameter("item").employee_number);
               
        },


        

        onCmInputWithCodeValuePress: function(oEvent){
            console.log(" empl abc----------------->", oEvent); 

            var sPath = oEvent.getSource().getBindingContext("details").getPath(),
            oRecord = this.getModel("details").getProperty(sPath);
            var index = sPath.substr(sPath.length-1);

            console.log(" index obj ----------------->" , index); 
            this.onCmInputWithCodeValuePress["row"] = index;

            this.byId("plantDialog").open();
        },

        

        onPlantDialogApplyPress: function(oEvent){

            //this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
            //var sDepNo = oEvent.getParameter("item").plant_code;
            var oDetailsModel = this.getModel("details");
            var rowIndex = this.onCmInputWithCodeValuePress["row"];
            console.log("row ::: " ,this.onCmInputWithCodeValuePress["row"]);

            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/plant_name", oEvent.getParameter("item").plant_name);
            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/plant_code", oEvent.getParameter("item").plant_code);
               
        },

        onMultiInputSupplierWithOrgValuePress: function(oEvent){
            var sPath = oEvent.getSource().getBindingContext("details").getPath();
            var index = sPath.substr(sPath.length-1);

            console.log(" index obj ----------------->" , index); 
            this.onMultiInputSupplierWithOrgValuePress["row"] = index;

            this.byId("supplierWithOrgDialog").open();

        },

        onSupplierDialogApplyPress: function(oEvent){

            console.log("onSupplierDialogApplyPress----------------->");

            var oDetailsModel = this.getModel("details");
            var rowIndex = this.onMultiInputSupplierWithOrgValuePress["row"];
            console.log("row ::: " ,this.onMultiInputSupplierWithOrgValuePress["row"]);

            console.log("supplier_code ::: " ,oEvent.getParameter("item").supplier_code);
            console.log("supplier_local_name ::: " ,oEvent.getParameter("item").supplier_local_name);

            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/supplier_name", oEvent.getParameter("item").supplier_local_name);
            oDetailsModel.setProperty("/LOIRequestDetailView/"+rowIndex+"/supplier_code", oEvent.getParameter("item").supplier_code);
        },



        // onCmInputWithCodeValuePress: function(){
        //     if(!this.oCmDialogHelp){
        //         this.oCmDialogHelp = new CmDialogHelp({
        //             title: "{I18N>/PLANT_NAME}",
        //             keyFieldLabel : "{I18N>/PLANT_CODE}",
        //             textFieldLabel : "{I18N>/PLANT_NAME}",
        //             keyField : "bizdivision_code",
        //             textField : "bizdivision_name",
        //             items: {
        //                 sorters: [
        //                     new Sorter("bizdivision_name", false)
        //                 ],
        //                 serviceName: "cm.util.OrgService",
        //                 entityName: "Division"
        //             }
        //         });
        //         this.oCmDialogHelp.attachEvent("apply", function(oEvent){
        //             this.byId("cmInputWithCodeDialog").setValue(oEvent.getParameter("item").bizdivision_code);
        //         }.bind(this));
        //     }
        //     this.oCmDialogHelp.open();
        // },

        // vhSupplierCode: function (oEvent) {
        //     var supplierCode;
        //     var oSearchValue = this.byId(oEvent.getSource().sId).getValue();

        //     if (!this.oSearchSupplierDialog) {
        //         this.oSearchSupplierDialog = new SupplierDialog({
        //             title: "Choose Supplier",
        //             MultiSelection: true
        //         });

        //         //여기에 다가 받을 아이디를 셋팅한다. searchField면 아이디를 그리드 아이탬이면 sPath의 경로의 셀 번호를 지정해주면됨다.
        //         /*
        //             그리드의 경우
        //             function에서 받은 oEvent를 활용하여 셋팅
        //             var sPath = oEvent.getSource().getParent().getRowBindingContext().sPath;
        //             sModel.setProperty(sPath + "/supplier_code", oEvent.mParameters.item);
        //         */
        //         // this.oSearchVendorPollDialog.attachEvent("apply", function (oEvent) {
        //         //     vendorPoolCode = oEvent.mParameters.item;
        //         //     //console.log("materialItem : ", materialItem);
        //         //     that.byId("search_material_code").setValue(vendorPoolCode.material_code);

        //         // }.bind(this));
        //     }

        //     //searObject : 태넌트아이디, 검색 인풋아이디
        //     var sSearchObj = {};
        //     sSearchObj.tanent_id = "L2100";
        //     sSearchObj.supplier_code = oSearchValue;
        //     // if (this.byId("search_Vp_Code").getValue()) {
        //     //     sSearchObj.vendor_pool_code = this.byId("search_Vp_Code").getValue();
        //     // }
        //     this.oSearchSupplierDialog.open(sSearchObj);
        // },

        getFormatDate: function (date) {

            if (!date) {
                return '';
            }

            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            return year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        },

        _findFragmentControlId : function (fragmentID, controlID) {
            return sap.ui.core.Fragment.byId(fragmentID, controlID);
        },
        //  onEmployeeDialogApplyPress: function(oEvent){
        //     this.byId("inputWithEmployeeValueHelp").setValue(oEvent.getParameter("item").user_local_name);
        // },

        // onAfterRendering: function () {
        //     var that = this,
        //         sHtmlValue = "";
        //     // sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
        //     // '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
        //     // 'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';                
        //     sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
        //         function (RTE, EditorType) {
        //             var oRichTextEditor = new RTE("myRTE", {
        //                 editorType: EditorType.TinyMCE4,
        //                 width: "100%",
        //                 height: "200px",
        //                 //editable: "{contModel>/editMode}",
        //                 editable: true,
        //                 customToolbar: true,
        //                 showGroupFont: true,
        //                 showGroupLink: true,
        //                 showGroupInsert: true,
        //                 value: sHtmlValue,
        //                 ready: function () {
        //                     this.addButtonGroup("styleselect").addButtonGroup("table");
        //                 }
        //             });
        //             that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
        //         });

        //     //this.onPageEnterFullScreenButtonPress();
        // }


        openPlantPopup: function () {
            if (!this.oCmDialogHelp) {
                this.oCmDialogHelp = new CmDialogHelp({
                    title: "{I18N>/PLANT_NAME}",
                    keyFieldLabel: "{I18N>/PLANT_CODE}",
                    textFieldLabel: "{I18N>/PLANT_NAME}",
                    keyField: "bizdivision_code",
                    textField: "bizdivision_name",
                    items: {
                        sorters: [
                            new Sorter("bizdivision_name", false)
                        ],
                        serviceName: "cm.util.OrgService",
                        entityName: "Division"
                    }
                });
                this.oCmDialogHelp.attachEvent("apply", function (oEvent) {
                    console.log("1111==", oEvent.getParameter("item"));
                    this.byId("searchOrgCode").setValue("(" + oEvent.getParameter("item").bizdivision_code + ")" + oEvent.getParameter("item").bizdivision_name);
                }.bind(this));
            }
            this.oCmDialogHelp.open();
        },

    });
});