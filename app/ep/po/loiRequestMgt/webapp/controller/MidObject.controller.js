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
    "ext/lib/util/ValidatorUtil",
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
    "sap/m/ObjectStatus"
], function (BaseController, Multilingual, NumberFormatter, History, JSONModel, TransactionManager, ManagedModel, ManagedListModel, Sorter, DateFormatter,  ValidatorUtil, Formatter, Validator,
	Filter, FilterOperator, Fragment, MessageBox, MessageToast,
	ColumnListItem, ObjectIdentifier, RichTextEditor,Text, Input, ComboBox, Item, ObjectStatus) {

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

            oTransactionManager = new TransactionManager();
            oTransactionManager.addDataModel(this.getModel("master"));
            oTransactionManager.addDataModel(this.getModel("details"));

            this.getRouter().getRoute("midPage").attachPatternMatched(this._onRoutedThisPage, this);

            //this.getModel("master").attachPropertyChange(this._onMasterDataChanged.bind(this));

            //this._initTableTemplates();
            this.enableMessagePopover();
            //this.onAfterRendering();

            console.log("onIn");

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
			this.getRouter().navTo("midPage", {
				layout: sNextLayout, 
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
            var sNextLayout = this.getModel("fcl").getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.getRouter().navTo("mainPage", {layout: sNextLayout});
            // this._setScreen(sNextLayout);
            // this._setModelEditCancelMode();


        },

        _setScreen: function (screen){
            var oViewModel = this.getModel("midObjectView");
            oViewModel.setProperty("/screen", screen);
        },

        _setModelEditCancelMode: function() {
            var oEditModel = this.getModel("editMode");
            oEditModel.setProperty("/editMode", "");
        },

        _newCheck: function(sTenantId){
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
        onPageDeleteButtonPress: function(){
            //var oArgs = oEvent.getParameter("arguments")
            var oView = this.getView(),
                oMasterModel = this.getModel("master"),
                that = this;

            var input = {};
            var inputData = {};

            inputData = {
                "tenant_id": oMasterModel.getData().tenant_id,
                "company_code": oMasterModel.getData().company_code,
                "loi_write_number": oMasterModel.getData().loi_write_number
            }

            input.inputData = inputData;

            console.log("input====", JSON.stringify(input));
       
            var url = "ep/po/loiRequestMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/DeleteLoiMulEntityProc";   

			MessageBox.confirm(this.getModel("I18N").getText("/NCM00003"), {
				title : "Comfirmation",
				initialFocus : sap.m.MessageBox.Action.CANCEL,
				onClose : function(sButton) {
					if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);

                        $.ajax({
                            url: url,
                            type: "POST",
                            data : JSON.stringify(input),
                            contentType: "application/json",
                            success: function(data){
                                console.log("#########Success#####", data.value);
                                oView.setBusy(false);
                                that.onPageNavBackButtonPress.call(that);
                                MessageToast.show(this.getModel("I18N").getText("/NCM01002"));
                            },
                            error: function(e){
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

            // Validation
            // if (!master.getData()["loi_request_title"]) {
            //     MessageBox.alert("요청명을 입력하세요");
            //     return;
            // }
            // if (!master.getData()["loi_publish_purpose_desc"]) {
            //     MessageBox.alert("목적을 입력하세요");
            //     return;
            // }

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

            console.log(" _state_::: " + master.getData()["_state_"]);
            console.log(" master --- >  getData::: ", this.getModel("master").getData());

            var headers = [];
            var loiNumber_val = "";

            if (master.getData()["_state_"] == "C") {
                loiNumber_val = "new";
            } else {
                loiNumber_val = master.getData()["loi_number"];
            }

            //if (master.getData()["_state_"] == "C" || master.getData()["_state_"] == "U") {
            headers.push({
                tenant_id: 'L2100',
                company_code: 'C100',
                loi_write_number: this._sLoiWriteNumber,
                loi_number: loiNumber_val,
                loi_request_title: master.getData()["loi_request_title"],
                loi_publish_purpose_desc: master.getData()["loi_publish_purpose_desc"],
                special_note: master.getData()["special_note"],
                requestor_empno: '10655',
                request_department_code: '58366944',
                //request_date: new Date()
                loi_request_status_code: statusCode
            });
            //}

            console.log(" headers::: " , headers);
            input.inputData.savedHeaders = headers;

            var details = [];
            var suppliers = [];
            var supplierCodeArray = [];
            var loiItemNum_val = '';
            var loiWriteNum_val = '';
            var delNum = 0;
            var afterDelCnt = 0;
            var delfalg = "";

            console.log(" 111::: ");
            console.log("oMasterModel.getData()=", detail.getData());
            console.log(" detail.getChanges().length::: " , detail.getChanges().length);
            console.log(" LOIRequestDetailView::: " , detail.getData()["LOIRequestDetailView"]);

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
                    }else{
                        delfalg = r["_row_state_"];
                    }

                    console.log("1111 loiWriteNum_val :: ", loiWriteNum_val);

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
                        request_quantity: r["request_quantity"],
                        currency_code: r["currency_code"],
                        request_amount: r["request_amount"],
                        supplier_code: r["supplier_code"],
                        buyer_empno: r["buyer_empno"],
                        purchasing_department_code : "50008948",
                        remark: r["remark"],
                        row_state: delfalg
                    });
                    //return r;

                    if (r["_row_state_"] == "D") {
                        delNum = delNum + 1;
                        afterDelCnt++;
                    }

                    delfalg = "";

                    console.log("2222 loiWriteNum_val :: ", loiWriteNum_val);

                    if (detail.getChanges().length > 0) {
                        if (r["supplier_code"] !== '' && r["supplier_code"] != null && r["supplier_code"] !== undefined) {
                            var supplierCode = r["supplier_code"];
                            supplierCodeArray = supplierCode.split(",");
                            console.log("supplierCodeArray :: " , supplierCodeArray);

                            for (var i = 0; i < supplierCodeArray.length; i++) {
                                suppliers.push({
                                    tenant_id: 'L2100',
                                    company_code: 'C100',
                                    loi_write_number: loiWriteNum_val,
                                    loi_item_number: loiItemNum_val,
                                    supplier_code: supplierCodeArray[i]
                                });
                            }
                            console.log("suppliers :: " , suppliers);
                        }
                    }
                })

                console.log("details :: ", details);

                input.inputData.savedReqDetails = details;
                supInput.inputData = suppliers;
            }


            if (this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;

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

                                that._setItemSequence(supInput,data);
                                if (detail.getChanges().length > 0) {
                                    that.onReload(data);
                                }

                                view.setBusy(false);
                                that._toShowMode();
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                            },
                            error: function (e) {

                            }
                        });
                    };
                }
            });

        },

        onReload: function(data) {

            var oView = this.getView();
            this.getModel("midObjectView").setProperty("/isAddedMode", false);
                this._bindView("/LOIRequestListView(tenant_id='" + data.savedReqDetails[0].tenant_id + "',company_code='" + data.savedReqDetails[0].company_code + "',loi_write_number='" + data.savedReqDetails[0].loi_write_number + "')");
                oView.setBusy(true);

                var oDetailsModel = this.getModel('details');
                    oDetailsModel.setTransactionModel(this.getModel());
                    oDetailsModel.read("/LOIRequestDetailView", {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, data.savedReqDetails[0].tenant_id),
                                new Filter("company_code", FilterOperator.EQ, data.savedReqDetails[0].company_code),
                                new Filter("loi_write_number", FilterOperator.EQ, data.savedReqDetails[0].loi_write_number)
                        ],
                        sorters: [
                            new Sorter("item_sequence", false)
                        ],

                        success: function(oData){
                            console.log(" LOIRequestDetailView ::: " , oData);
                            oView.setBusy(false);
                        }

                    });

                this._toShowMode();
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
            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("midObjectView").getProperty("/isEditMode") == true) {
                    this.validator.clearValueState(this.byId("page"));
                    this._toShowMode();
                } else {
                    console.log("cancel.....");
                    this.onPageNavBackButtonPress.call(this);
                    this.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                }
            }
        },

        onMidTableAddButtonPress: function () {
            var oTable = this.byId("midTable"),
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
                itemSeq =  detail.getData()["LOIRequestDetailView"].length * 10
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

        
        _setItemSequence: function (supInput_,data) {
            var oModel = this.getModel("v4Proc");
            var oView = this.getView();
            var v_this = this;

            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details"),
                oModel = this.getModel("v4Proc"),
                that = this;

            var supInput = {};
            var inputData = {};
            
            var details = [];
            var suppliers = [];
            var supplierCodeArray = [];
            var loiItemNum_val = '';
            var loiWriteNum_val = '';
            var delNum = 0;
            var afterDelCnt = 0;
            var delfalg = "";

            console.log("---------before ssss-------", JSON.stringify(data));
            console.log("---------before ssss-------",data.savedReqDetails.length );

                    if (detail.getChanges().length > 0 && data.savedReqDetails.length > 0 && supInput_.inputData.length > 0) {
                        // if (r["supplier_code"] !== '' && r["supplier_code"] != null && r["supplier_code"] !== undefined) {
                        //     var supplierCode = r["supplier_code"];
                        //     supplierCodeArray = supplierCode.split(",");
                        //     console.log("supplierCodeArray :: " , supplierCodeArray);
                         var supplierCode_val = "";
                         var supplierCodeArray_val = [];
                         for(var k = 0; k < data.savedReqDetails.length; k++) {
                             supplierCode_val = data.savedReqDetails[k].supplier_code;
                             console.log("supplierCode_val :: " , supplierCode_val);
                             if(supplierCode_val != null){
                                supplierCodeArray_val = supplierCode_val.split(",");  

                                for (var i = 0; i < supplierCodeArray_val.length; i++) {
                                    suppliers.push({
                                        tenant_id: data.savedReqDetails[k].tenant_id,
                                        company_code: data.savedReqDetails[k].company_code,
                                        loi_write_number: data.savedReqDetails[k].loi_write_number,
                                        loi_item_number: data.savedReqDetails[k].loi_item_number,
                                        supplier_code: supplierCodeArray_val[i],
                                        row_state : data.savedReqDetails[k].row_state
                                    });

                                }
                            }

                            console.log("suppliers :: " , suppliers);
                        }
                    }

                    supInput.inputData = suppliers;


            console.log(">>> after supInput", supInput);

            var url = "ep/po/loiRequestMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SupplierMulEntityProc";


            $.ajax({
                url: url,
                type: "POST",
                //datatype: "json",
                //data: input,
                data: JSON.stringify(supInput),
                contentType: "application/json",
                success: function (data) {

                    //console.log(">>> _setItemSequence............. data", data);

                    console.log("---------_setItemSequence-------", JSON.stringify(data));
                    // var v_returnModel = oView.getModel("returnModel").getData();
                    // v_returnModel.headerList = data.savedHeaders;
                    // v_returnModel.detailList = data.savedDetails;
                    // oView.getModel("returnModel").updateBindings(true);
                    // v_this.onSearch();
                    // v_this.onSearchDetail();

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
                    "create_user_id":"ADMIN",
                    "update_user_id":"ADMIN"

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

                        success: function(oData){
                            console.log(" LOIRequestDetailView ::: " , oData);
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
                oMasterModel = this.getModel("master");
            oView.setBusy(true);
            oMasterModel.setTransactionModel(this.getModel());
            oMasterModel.read(sObjectPath, {
                success: function (oData) {
                    oView.setBusy(false);
                }

            });
        },

        _toCreateMode: function () {
            var FALSE = false;
            this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageDeleteButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);

            this.byId("midTableAddButton").setEnabled(!FALSE);
            this.byId("midTableDeleteButton").setEnabled(!FALSE);
            this._bindMidTable(this.oEditableTemplate, "Edit");
            this._setKeyMidTable("Create");
        },

        // '121010'	'작성중'
        // '121020'	'결재진행중'
        // '121030'	'결재반려'
        // '121040'	'요청완료'
           

        _toEditMode: function () {
            this.getModel("midObjectView").setProperty("/isEditMode", true);
            this._showFormFragment('MidObject_Edit');
            var oMasterModel = this.getModel("master");
           
            console.log("statusCode----->" ,oMasterModel.getData());
            var statusCode = oMasterModel.getData().loi_request_status_code;
            console.log("statusCode1111----->" ,statusCode);
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
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
            this._showFormFragment('MidObject_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(true);
            this.byId("pageDeleteButton").setVisible(true);
            this.byId("pageEditButton").setEnabled(true);
            this.byId("pageDeleteButton").setEnabled(true);
            this.byId("pageNavBackButton").setEnabled(true);
            this.byId("pageSaveButton").setEnabled(false);
            this.byId("pageByPassButton").setEnabled(false);
            this.byId("pageRequestButton").setEnabled(false);

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


            this.oEditableTemplate = new ColumnListItem({
				cells: [
                    new Text({
                        text: "{details>_row_state_}"
                    }),
                    // new Input({
                    //     value: {
                    //         path: 'details>language_code',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 100
                    //         }
                    //     },
                    //     editable: "{= ${details>_row_state_} === 'C' }",
                    //     required : true
                    // }),
					// new Input({
					// 	value: "{details>currency_code_name}"
                    // }),
                    // new Input({
                    //     value: {
                    //         path: 'details>currency_code_desc',
                    //         type: 'sap.ui.model.type.String',
                    //         constraints: {
                    //             maxLength: 100
                    //         }
                    //     },
                    //     required : true
                    // }),

                    new Text({
                          text: "{details>item_sequence}"
                    }),
                    // new Input({
                    //     value: {
                    //     path: "details>tenant_id",
                    //     type: new sap.ui.model.type.String(null, {
                    //         maxLength: 100
                    //     })
                    //     },
                    //     required: true
                    // }),
                    
                    new Input({
						value: "{details>tenant_id}"
                    }), 
                    new Input({
						value: "{details>ep_item_code}"
                    }), 
                    new Input({
						value: "{details>item_desc}"
                    }), 
                    new Input({
						value: "{details>unit}"
                    }), 
                    new Input({
						value: "{details>request_quantity}"
                    }), 
                    new Input({
						value: "{details>currency_code}"
                    }), 
                    new Input({
						value: "{details>request_amount}"
                    }), 
                    new Input({
					 	value: "{details>supplier_code}"
                    }), 
                    new Input({
						value: "{details>buyer_empno}"
                    }), 
                    new Input({
						value: "{details>remark}"
                    })
				]
            });

            //  this.oEditableTemplate = new ColumnListItem({
            //      cells: [
            //          new Text({
            //              text: "{details>_row_state_}"
            //          }),

            //          // 제어옵션레벨코드
            //          new ComboBox({
            //              selectedKey: "{details>control_option_level_code}",
            //              items: {
            //                  path: 'util>/CodeDetails',
            //                  filters: [
            //                      new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
            //                      new Filter("group_code", FilterOperator.EQ, 'CM_CTRL_OPTION_LEVEL_CODE')
            //                  ],
            //                  template: new Item({
            //                      key: "{util>code}",
            //                      text: "{= ${util>code} + ':' + ${util>code_description}}"
            //                  })
            //              },
            //              editable: "{= ${details>_row_state_} === 'C' }",
            //              required: true
            //          }),

            //          // // 조직유형
            //          // new ComboBox({
            //          //   selectedKey: "{details>org_type_code}",
            //          //   items: {
            //          //     path: 'util>/CodeDetails',
            //          //     filters: [
            //          //       new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
            //          //       new Filter("group_code", FilterOperator.EQ, 'CM_ORG_TYPE_CODE')
            //          //     ],
            //          //     template: new Item({
            //          //       key: "{util>code}",
            //          //       text: "{= ${util>code} + ':' + ${util>code_description}}"
            //          //     })
            //          //   },
            //          //   editable: "{= ${details>_row_state_} === 'C' }",
            //          //   display: "none",
            //          //   required: true
            //          // }),

            //          (function (level) {
            //              //console.log(">>>>> level", level);
            //              if (level == "T") {
            //                  // 조직유형
            //                  return new ComboBox({
            //                      selectedKey: "{details>org_type_code}",
            //                      items: {
            //                          path: 'util>/CodeDetails',
            //                          filters: [
            //                              new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
            //                              new Filter("group_code", FilterOperator.EQ, 'CM_ORG_TYPE_CODE')
            //                          ],
            //                          template: new Item({
            //                              key: "{util>code}",
            //                              text: "{= ${util>code} + ':' + ${util>code_description}}"
            //                          })
            //                      },
            //                      editable: "{= ${details>_row_state_} === 'C' }",
            //                      display: "none",
            //                      required: true
            //                  })
            //              }
            //              else {
            //                  new Input({
            //                      value: {
            //                          path: "details>control_option_level_val",
            //                          type: new sap.ui.model.type.String(null, {
            //                              maxLength: 100
            //                         }),
            //                      },
            //                      editable: "{= ${details>_row_state_} === 'C' }",
            //                      required: true
            //                  })
            //              }
            //          })("{= ${details>control_option_level_code}}"),f

            //          new Input({
            //              value: {
            //                  path: "details>control_option_level_val",
            //                  type: new sap.ui.model.type.String(null, {
            //                      maxLength: 100
            //                  }),
            //              },
            //              editable: "{= ${details>_row_state_} === 'C' }",
            //              required: true
            //          }),
            //          new Input({
            //              value: {
            //                  path: "details>control_option_val",
            //                  type: new sap.ui.model.type.String(null, {
            //                      maxLength: 100
            //                  })
            //              },
            //              required: true
            //          })
            //      ]
            //  });
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
                    name: "ep.po.loiRequestMgt.view." + sFragmentName,
                    controller: this
                }).then(function (oFragment) {
                    this._oFragments[sFragmentName] = oFragment;
                    if (oHandler) oHandler(oFragment);
                }.bind(this));
            } else {
                if (oHandler) oHandler(this._oFragments[sFragmentName]);
            }
        },

        formattericon: function(sState){
            switch(sState){
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

        onAfterRendering : function () {
            var that = this,
                sHtmlValue = "";
                // sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
				// '<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
				// 'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';                
			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("myRTE", {
						editorType: EditorType.TinyMCE4,
						width: "100%",
                        height: "200px",
                        //editable: "{contModel>/editMode}",
                        editable: true,
						customToolbar: true,
						showGroupFont: true,
						showGroupLink: true,
						showGroupInsert: true,
						value: sHtmlValue,
						ready: function () {
							this.addButtonGroup("styleselect").addButtonGroup("table");
						}
                    });
					that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
            });

            //this.onPageEnterFullScreenButtonPress();
        }

    });
});