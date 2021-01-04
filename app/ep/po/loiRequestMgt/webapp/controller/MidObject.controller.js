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
    "sap/ui/richtexteditor/RichTextEditor",
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
            
            //this._setScreen(sNextLayout);
            //this._setModelEditCancelMode();
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

            var url = "ep/po/webapp/srv-api/odata/v4/ep.SampleMgrV4Service/DeleteLoiMulEntityProc"         

			MessageBox.confirm("Are you sure to delete this control option and details?", {
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
                                MessageToast.show("Success to delete.");
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
        onPageSaveButtonPress: function () {
            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details"),
                oModel = this.getModel("v4Proc"),
                that = this;


            console.log(">>> detail", detail.getData());

            // Validation
            if (!master.getData()["loi_request_title"]) {
                MessageBox.alert("요청명을 입력하세요");
                return;
            }
            if (!master.getData()["loi_publish_purpose_desc"]) {
                MessageBox.alert("목적을 입력하세요");
                return;
            }

            if (master.getData()["_state_"] != "U") {
                if (master.getData()["_state_"] != "C" && detail.getChanges() <= 0) {
                    MessageBox.alert("변경사항이 없습니다.");
                    return;
                }
            }


            var input = {
                inputData : {
                    savedHeaders : [],
                    savedDetails : []
                }
            };

            console.log(" _state_::: " + master.getData()["_state_"]);
            console.log(" master --- >  getData::: " , this.getModel("master").getData());
            
            var headers = [];
            if (master.getData()["_state_"] == "C" || master.getData()["_state_"] == "U") {
                headers.push({
                    tenant_id: '1000',
                    company_code: 'C100',
                    loi_write_number: this._sLoiWriteNumber,
                    loi_number: 'new',
                    loi_request_title: master.getData()["loi_request_title"],
                    loi_publish_purpose_desc: master.getData()["loi_publish_purpose_desc"],
                    special_note: master.getData()["special_note"]
                });

            }

            console.log(" headers::: " , headers);
            console.log("detail _state_::: " + detail.getChanges().length);

            input.inputData.savedHeaders = headers;

            
            var details = [];
            var suppliers = [];
            var supplierCodeArray = [];
            var loiItemNum_val = '';
            var delNum = 0;
            var detailLen = detail.getData()["LOIRequestDetailView"].length;

            if (detail.getChanges().length > 0) {
                detail.getData()["LOIRequestDetailView"].map(r => {
                    
                    console.log("detail _row_state_::: " + r["_row_state_"]);
                    if(r["_row_state_"] == "C"){
                        loiItemNum_val = "new";
                    }else{
                        loiItemNum_val = r["loi_item_number"]; 
                    }

                    if(r["_row_state_"] == "D"){
                        delNum = delNum + 1;
                    }

                    

                    details.push({
                        tenant_id: '1000',
                        company_code: 'C100',
                        loi_write_number: this._sLoiWriteNumber,
                        loi_item_number: loiItemNum_val,
                        item_sequence: r["item_sequence"],
                        ep_item_code: r["ep_item_code"],
                        item_desc: r["item_desc"],
                        unit: r["unit"],
                        request_quantity: r["request_quantity"],
                        currency_code: r["currency_code"],
                        request_amount: r["request_amount"],
                        supplier_code: r["supplier_code"],
                        buyer_empno: r["buyer_empno"],
                        remark: r["remark"],
                        row_state : r["_row_state_"]
                    });
                    //return r;

            //console.log("---------befor _row_state_-------" , r["_row_state_"]);
                console.log("---------befor suppliers-------" , r["supplier_code"]);

                if (r["_row_state_"] !== undefined) {
                if(r["_row_state_"] === "C" || r["_row_state_"] === "U"){
                    console.log("---------in _row_state_-------" , r["_row_state_"]);
                    if(r["supplier_code"] !== ''){
                        var supplierCode = r["supplier_code"];
                        supplierCodeArray = supplierCode.split(",");
        
                        //List<String> salesTeamList = new ArrayList<>();
                        for (var i = 0; i < supplierCodeArray.length; i++) {

                            suppliers.push({
                                tenant_id: '1000',
                                company_code: 'C100',
                                loi_write_number: this._sLoiWriteNumber,
                                loi_item_number: loiItemNum_val,
                                supplier_code: supplierCodeArray[i]
                            });
                        }

                    }
                }
            }


                })

                console.log("---------details-------" , details);
                console.log("---------delNum-------" , delNum);
                console.log("---------detailLen-------" , detailLen);
                console.log("---------del-------" , String(+detailLen - delNum));
                console.log("---------suppliers-------" , suppliers);

                input.inputData.savedDetails = details;
                input.inputData.savedSuppliers = suppliers;

            }

            if(this.validator.validate(this.byId("midObjectForm1Edit")) !== true) return;

            var url = "ep/po/webapp/srv-api/odata/v4/ep.SampleMgrV4Service/SaveLoiRequestMultiEntitylProc"

            //MessageBox.confirm(this.getModel("I18N").getText("/NCM0004"), {
            MessageBox.confirm("Are you sure ?", {
                title : this.getModel("I18N").getText("/SAVE"),
                initialFocus : MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {

                        view.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data : JSON.stringify(input),
                            contentType: "application/json",
                            success: function(data){
                                console.log("---------data ssss-------" ,JSON.stringify(data));

                                //that._setModelEditCancelMode();
                                that._setItemSequence(); //itemsequence 코딩중

                                view.setBusy(false);
								that._toShowMode();
                                that.getOwnerComponent().getRootControl().byId("fcl").getBeginColumnPages()[0].byId("pageSearchButton").firePress();
                                //MessageToast.show(that.getModel("I18N").getText("/NCM0005"));   
                                MessageToast.show("Success to save.");                           
                                that._toShowMode();
                            },
                            error: function(e){
                                
                            }
                        });
                    };
                }
            });

        },

        onPageCancelEditButtonPress: function () {
            
            console.log("this._sTenantId--------------->" + this._sTenantId);
            console.log("this._sCompanyCode--------------->" + this._sCompanyCode);
            console.log("this._sLoiWriteNumber--------------->" + this._sLoiWriteNumber);


            if (this.getModel("midObjectView").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                this._toShowMode();
                // ljh - 재조회
                this.getModel("details")
                .setTransactionModel(this.getModel())
                .read("/LOIRequestDetailView", {
                    filters: [
                    new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                    new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                    new Filter("loi_write_number", FilterOperator.EQ, this._sLoiWriteNumber)
                    ],
                    sorters: [
                        new Sorter("item_sequence", true)
                    ],
                    success: function (oData) {


                    }
                });
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

        
        //코딩중
        _setItemSequence: function() {
            var view = this.getView(),
                master = view.getModel("master"),
                detail = view.getModel("details"),
                oModel = this.getModel("v4Proc"),
                that = this;


            console.log(">>> detail", detail.getData());
            console.log("len ----> " , detail.getData()["LOIRequestDetailView"].length);


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
                    "loi_request_status_code": "",
                    "loi_publish_purpose_desc": "",
                    "investment_review_flag": false,
                    "special_note": "",
                    "attch_group_number": "",
                    "approval_number": "",
                    "requestor_empno": "",
                    "request_department_code": "",
                    "request_date": new Date(2999, 11, 31),
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

                var oDetailsModel = this.getModel('details');
                    oDetailsModel.setTransactionModel(this.getModel());
                    oDetailsModel.read("/LOIRequestDetailView", {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this._sTenantId),
                                new Filter("company_code", FilterOperator.EQ, this._sCompanyCode),
                                new Filter("loi_write_number", FilterOperator.EQ, this._sLoiWriteNumber)
                        ],
                        sorters: [
                            new Sorter("item_sequence", true)
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

        _toEditMode: function () {
            var FALSE = false;
            this._showFormFragment('MidObject_Edit');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageEditButton").setEnabled(FALSE);
            this.byId("pageDeleteButton").setEnabled(FALSE);
            this.byId("pageNavBackButton").setEnabled(FALSE);
            this.byId("pageSaveButton").setEnabled(!FALSE);

            this.byId("midTableAddButton").setEnabled(!FALSE);
            this.byId("midTableDeleteButton").setEnabled(!FALSE);
            //this.byId("midTable").setMode(sap.m.ListMode.SingleSelectLeft);
            //this._bindMidTable(this.oEditableTemplate, "Edit");
        },

        _toShowMode: function () {
            var TRUE = true;
            this._showFormFragment('MidObject_Show');
            this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("pageEditButton").setEnabled(TRUE);
            this.byId("pageDeleteButton").setEnabled(TRUE);
            this.byId("pageNavBackButton").setEnabled(TRUE);
            this.byId("pageSaveButton").setEnabled(!TRUE);

            this.byId("midTableAddButton").setEnabled(!TRUE);
            this.byId("midTableDeleteButton").setEnabled(!TRUE);
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
				sHtmlValue = '<p style="text-align: justify; background: white; font-size: 10pt; font-family: Calibri, sans-serif;"><strong><span style="font-size: 10.5pt; font-family: sans-serif; color: black;">Lorem ipsum dolor sit amet</span></strong>' +
				'<span style="font-size: 10.5pt; font-family: sans-serif; color: black;">, consectetur adipiscing elit. Suspendisse ornare, nibh nec gravida tincidunt, ipsum quam venenatis nisl, vitae venenatis urna sem eget ipsum. Ut cursus auctor leo et vulputate. ' +
				'Curabitur nec pretium odio, sed auctor felis. In vehicula, eros aliquam pharetra mattis, ante mi fermentum massa, nec pharetra arcu massa finibus augue. </span></p> ';
			sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
				function (RTE, EditorType) {
					var oRichTextEditor = new RTE("myRTE", {
						editorType: EditorType.TinyMCE4,
						width: "100%",
                        height: "300px",
                        editable: "{contModel>/editMode}",
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
        },

    });
});