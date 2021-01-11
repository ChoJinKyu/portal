sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Multilingual",
    "ext/lib/model/TransactionManager",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    // "sap/m/TablePersoController",
    "sap/ui/table/TablePersoController",
    "./MainListPersoService",
    "sap/ui/core/Fragment",
    "ext/lib/formatter/NumberFormatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/VBox"
], function (BaseController, Multilingual, TransactionManager, ManagedListModel, Validator, JSONModel, DateFormatter,
    TablePersoController, MainListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox) {
    "use strict";

    var oTransactionManager;

    return BaseController.extend("ep.po.loiPublishMgt.controller.MainList", {

        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

        validator: new Validator(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the mainList controller is instantiated.
		 * @public
		 */
        onInit: function () {
            var oMultilingual = new Multilingual();
            this.setModel(oMultilingual.getModel(), "I18N");
            this.setModel(new ManagedListModel(), "list");
            this.setModel(new JSONModel(), "mainListViewModel");

            // var oJsonData = {};
            // var oJsonModel = new JSONModel(oJsonData);
            this.setModel(new JSONModel(), "loiVos");
            this.setModel(new JSONModel(), "loiRfq");
            this.setModel(new JSONModel(), "loiRmk");

            oTransactionManager = new TransactionManager();
            // oTransactionManager.addDataModel(this.getModel("loiDtl"));    
            // oTransactionManager.setServiceModel(this.getOwnerComponent().getModel());        

            // oMultilingual.attachEvent("ready", function(oEvent){
            // 	var oi18nModel = oEvent.getParameter("model");
            // 	this.addHistoryEntry({
            // 		title: oi18nModel.getText("/CONTROL_OPTION_MANAGEMENT"),   //제어옵션관리
            // 		icon: "sap-icon://table-view",
            // 		intent: "#Template-display"
            // 	}, true);
            // }.bind(this));

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            //this._doInitTablePerso();

            //console.log("NCM0004=======", this.getModel("I18N").getText("/NCM0004"));

            this._oTPC = new TablePersoController({
                customDataKey: "loiPublishMgt",
                persoService: MainListPersoService
            }).setTable(this.byId("mainTable"));

            this.enableMessagePopover();

            var today = new Date();

            // this.getView().byId("searchRequestDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30));
            // this.getView().byId("searchRequestDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchBuyer").setValue("(9586) **민");
            this.getView().byId("searchPurchasingDepartment").setValue("(50008948) 첨단소재.구매2.공사구매팀(청주P)");
        },

        onRenderedFirst: function () {
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

		/**
		 * Event handler when a table personalization refresh
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
        onMainTablePersoRefresh: function () {
            MainListPersoService.resetPersData();
            this._oTPC.refresh();
        },

		/**
		 * Event handler when a search button pressed
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
        onPageSearchButtonPress: function (oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                // Search field's 'refresh' button has been pressed.
                // This is visible if you select any master list item.
                // In this case no new search is triggered, we only
                // refresh the list binding.
                this.onRefresh();
            } else {
                var aSearchFilters = this._getSearchStates();
                var aSorter = this._getSorter();
                this._applySearch(aSearchFilters, aSorter);
            }
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onSaveVos: function () {
            var oView = this.getView(),
                that = this;

            var loiVosModel = this.getModel("loiVos");
            console.log("saveSupplierOpinion=====", oView.byId("saveSupplierOpinion").getValue());
            console.log("loiVosModel.getData()1==" + JSON.stringify(loiVosModel.getData()));
            loiVosModel.getData().supplier_opinion = oView.byId("saveSupplierOpinion").getValue();
            console.log("loiVosModel.getData()2==" + JSON.stringify(loiVosModel.getData()));

            //JsonModel이 변경되었는지 체크로직 구현
            // if(loiRfqModel.getChanges().length === 0) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("dialogVos")) !== true) return;

            // console.log("####oTransactionManager====", oTransactionManager);
            // console.log("####oDataModel====", oMasterModel.getData());

            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiVosProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(loiVosModel.getData()),
                            contentType: "application/json",
                            success: function (data) {
                                oView.setBusy(false);
                                console.log("#########Success#####", data.value);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.onExitVos();
                                that.byId("pageSearchButton").firePress();
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    };
                }
            });

        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitVos: function () {
            this.byId("dialogVos").close();
            // this.byId("dialogRfq").destroy();
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onVosButtonPress: function (oEvent) {

            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            // console.log("####tenant_id====", oRecord.tenant_id);
            // console.log("####company_code====", oRecord.company_code);
            // console.log("####loi_write_number====", oRecord.loi_write_number);
            // console.log("####loi_item_number====", oRecord.loi_item_number);
            // console.log("####supplier_opinion====", oRecord.supplier_opinion);

            var saveLoiVos = {
                "tenant_id": oRecord.tenant_id,
                "company_code": oRecord.company_code,
                "loi_write_number": oRecord.loi_write_number,
                "loi_item_number": oRecord.loi_item_number,
                "supplier_opinion": ""
            }
            this.getModel("loiVos").setData(saveLoiVos);
            console.log("####sloiVos====", this.getModel("loiVos"));

            var oView = this.getView();
            if (!this._vosDialog) {
                this._vosDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ep.po.loiPublishMgt.view.Vos",
                    controller: this
                }).then(function (vosDialog) {
                    oView.addDependent(vosDialog);
                    return vosDialog;
                }.bind(this));
            }

            this._vosDialog.then(function (vosDialog) {
                vosDialog.open();
                oView.byId("saveSupplierOpinion").setValue(oRecord.supplier_opinion);
                console.log("#saveSupplierOpinion=", oView.byId("saveSupplierOpinion").getValue());
            });

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onSaveRmk: function () {
            var oView = this.getView(),
                that = this;

            var loiRmkModel = this.getModel("loiRmk");
            console.log("saveRemark=====", oView.byId("saveRemark").getValue());
            console.log("loiRmkModel.getData()1==" + JSON.stringify(loiRmkModel.getData()));
            loiRmkModel.getData().remark = oView.byId("saveRemark").getValue();
            console.log("loiRmkModel.getData()2==" + JSON.stringify(loiRmkModel.getData()));

            //JsonModel이 변경되었는지 체크로직 구현
            // if(loiRfqModel.getChanges().length === 0) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("dialogRmk")) !== true) return;

            // console.log("####oTransactionManager====", oTransactionManager);
            // console.log("####oDataModel====", oMasterModel.getData());

            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiRmkProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(loiRmkModel.getData()),
                            contentType: "application/json",
                            success: function (data) {
                                oView.setBusy(false);
                                console.log("#########Success#####", data.value);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.onExitRmk();
                                that.byId("pageSearchButton").firePress();
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    };
                }
            });

        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitRmk: function () {
            this.byId("dialogRmk").close();
            // this.byId("dialogRfq").destroy();
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onRmkButtonPress: function (oEvent) {

            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);
            console.log("####sPath====", sPath);
            // console.log("####tenant_id====", oRecord.tenant_id);
            // console.log("####company_code====", oRecord.company_code);
            // console.log("####loi_write_number====", oRecord.loi_write_number);
            // console.log("####loi_item_number====", oRecord.loi_item_number);
            console.log("####supplier_opinion====", oRecord.remark);

            var saveLoiRmk = {
                "tenant_id": oRecord.tenant_id,
                "company_code": oRecord.company_code,
                "loi_write_number": oRecord.loi_write_number,
                "loi_item_number": oRecord.loi_item_number,
                "remark": ""
            }
            this.getModel("loiRmk").setData(saveLoiRmk);
            console.log("####loiRmk====", this.getModel("loiRmk"));

            var oView = this.getView();
            if (!this._rmkDialog) {
                this._rmkDialog = Fragment.load({
                    id: oView.getId(),
                    name: "ep.po.loiPublishMgt.view.Rmk",
                    controller: this
                }).then(function (rmkDialog) {
                    oView.addDependent(rmkDialog);
                    return rmkDialog;
                }.bind(this));
            }

            this._rmkDialog.then(function (rmkDialog) {
                rmkDialog.open();
                oView.byId("saveRemark").setValue(oRecord.remark);
                console.log("#saveRemark=", oView.byId("saveRemark").getValue());
            });

        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onRfqSave: function () {

            var oView = this.getView(),
                that = this;

            var loiRfqModel = this.getModel("loiRfq");
            console.log("saveQuotationNumber=====", oView.byId("saveQuotationNumber").getValue());
            console.log("saveQuotationItemNumber=====", oView.byId("saveQuotationItemNumber").getValue());
            console.log("loiRfq.getData()1==" + JSON.stringify(loiRfqModel.getData()));

            loiRfqModel.getData()["inputData"].map(d => {
                d["quotation_number"] = oView.byId("saveQuotationNumber").getValue();
                d["quotation_item_number"] = oView.byId("saveQuotationItemNumber").getValue();
                return d;
            });

            console.log("loiRfq.getData()2==" + JSON.stringify(loiRfqModel.getData()));
            // loiVosModel.getData().supplier_opinion = oView.byId("saveSupplierOpinion").getValue();
            // console.log("loiVosModel.getData()2=="+JSON.stringify(loiRfqModel.getData())); 

            //JsonModel이 변경되었는지 체크로직 구현
            // if(loiRfqModel.getChanges().length === 0) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("dialogRfq")) !== true) return;

            // console.log("####oTransactionManager====", oTransactionManager);
            // console.log("####oDataModel====", oMasterModel.getData());

            var url = "ep/po/loiPublishMgt/webapp/srv-api/odata/v4/ep.LoiMgtV4Service/SaveLoiQuotationNumberProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(loiRfqModel.getData()),
                            contentType: "application/json",
                            success: function (data) {

                                console.log("#########Success#####", data.value);

                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));

                                // if(data.value.rsltCnt > 0) {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM0005"));
                                // }else {
                                //     MessageToast.show(that.getModel("I18N").getText("/NCM01005"));
                                // }
                                that.onExitRfq();
                                that.byId("pageSearchButton").firePress();
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    };
                }
            });

        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitRfq: function () {
            this.byId("dialogRfq").close();
            // this.byId("dialogRfq").destroy();
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onRfqButtonPress: function () {

            var canSelect = true;

            var oTable = this.byId("mainTable"),
                oModel = this.getView().getModel("list"),
                oSelected = oTable.getSelectedIndices();

            // var selectedEntries = [];
            // var tableData = oTable.getModel().getData();
            // for(var index= 0;index<oSelected.length;index++){
            //     var tableIndex = oSelected[index];
            //     console.log("tableIndex==", tableIndex);
            //     console.log("modelData==", oTable.getModel().oData);
            //     var tableRow = tableData.oData[tableIndex];
            //     console.log("tableRow==", tableRow.uid);
            //     selectedEntries.push( tableRow.uid );
            // }                


            var loiNumberArr = [];

            if (oSelected.length > 0) {
                oSelected.forEach(function (chkIdx, index) {

                    /*
                        향후 견적테이블이 생성되면 1번로직 주석 2번 로직 주석해제
                    */
                    console.log("loi_item_number========", oModel.getData().LOIPublishItemView[chkIdx].loi_item_number);
                    console.log("loi_number========", oModel.getData().LOIPublishItemView[chkIdx].loi_number);
                    console.log("loi_request_title========", oModel.getData().LOIPublishItemView[chkIdx].loi_request_title);
                    console.log("loi_request_title========", oModel.getData().LOIPublishItemView[chkIdx].item_sequence);
                    console.log("quotation_number=========", oModel.getData().LOIPublishItemView[chkIdx].quotation_number);
                    /*
                        1번 로직
                        견적번호가 있으면 링크불가
                    */
                    if (oModel.getData().LOIPublishItemView[chkIdx].quotation_number != 0) {
                        MessageToast.show("이미 견적이 완료된건이 있습니다.");
                        canSelect = false;
                        return false;
                    }

                    /*
                        2번 로직
                        RFQ 상태가 진행중/완료인 것이 있으면 링크불가 - 견적테이블 조회
                        (완료일 경우 견적을 다시 요청할 수 있으면 진행중인것만 링크불가)
                        업체선정코드를 사용할지는 향후 결정
                        (RFQ상태값은 없어지고 견적테이블 또는 다른 테이블에서 견적상태로 관리될수도 있음)

                    */

                    //LOI번호 동일체크
                    var loiNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_number;
                    // console.log("notSameloiNumber=", !loiNumberArr.includes(loiNumber))
                    if (index > 0 && !loiNumberArr.includes(loiNumber)) {
                        MessageToast.show("LOI번호가 동일하지 않습니다.");
                        canSelect = false;
                        return false;
                    }
                    loiNumberArr.push(oModel.getData().LOIPublishItemView[chkIdx].loi_number);


                });
            }else {
                canSelect = false;
                MessageToast.show("한개이상 선택해주세요.");
            }

            console.log("canSelect=", canSelect);
            if (canSelect) {

                var quotationNumber = "";
                var quotationItemNumber = "";

                var input = {};
                var saveLoiRfq = [];

                if (oSelected.length > 0) {
                    oSelected.forEach(function (chkIdx) {
                        var tenantId = oModel.getData().LOIPublishItemView[chkIdx].tenant_id;
                        var companyCode = oModel.getData().LOIPublishItemView[chkIdx].company_code;
                        var loiWriteNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_write_number;
                        var loiItemNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_item_number;
                        quotationNumber = oModel.getData().LOIPublishItemView[chkIdx].quotation_number;
                        quotationItemNumber = oModel.getData().LOIPublishItemView[chkIdx].quotation_item_number;
                        if (quotationNumber == 0) quotationNumber = "";
                        if (quotationItemNumber == 0) quotationItemNumber = "";

                        console.log("####tenant_id====", tenantId);
                        console.log("####company_code====", companyCode);
                        console.log("####loi_write_number====", loiWriteNumber);
                        console.log("####loi_item_number====", loiItemNumber);
                        console.log("####quotationNumber====", quotationNumber);
                        console.log("####quotationItemNumber====", loiItemNumber);

                        var inputData = {
                            "tenant_id": tenantId,
                            "company_code": companyCode,
                            "loi_write_number": loiWriteNumber,
                            "loi_item_number": loiItemNumber,
                            "quotation_number": "",
                            "quotation_item_number": ""
                        }

                        saveLoiRfq.push(inputData);

                    });
                }
                console.log("####loiRfq111====", saveLoiRfq);

                input.inputData = saveLoiRfq;
                this.getModel("loiRfq").setData(input);
                console.log("####loiRfq2222====", this.getModel("loiRfq").getData());

                var oView = this.getView();
                if (!this._rfqDialog) {
                    this._rfqDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ep.po.loiPublishMgt.view.Rfq",
                        controller: this
                    }).then(function (rfqDialog) {
                        oView.addDependent(rfqDialog);
                        return rfqDialog;
                    }.bind(this));
                }

                this._rfqDialog.then(function (rfqDialog) {
                    rfqDialog.open();
                    oView.byId("saveQuotationNumber").setValue(quotationNumber);
                    oView.byId("saveQuotationItemNumber").setValue(quotationItemNumber);
                    console.log("#saveQuotationNumber=", oView.byId("saveQuotationNumber").getValue());
                    console.log("#saveQuotationItemNumber=", oView.byId("saveQuotationItemNumber").getValue());
                });

            }
        },

        onTableSupplierSelectionPress: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("selectionPage", {
                //layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                companyCode: oRecord.company_code,
                loiWriteNumber: oRecord.loi_write_number,
                loiItemNumber: oRecord.loi_item_number,
                loiSelectionNumber: oRecord.loi_selection_number,
                loiNumber: oRecord.loi_number
            }, true);
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onSupplierSelectionButtonPress: function () {

            var oTable = this.byId("mainTable"),
                oModel = this.getView().getModel("list"),
                oSelected = oTable.getSelectedIndices();
            console.log("oSelected=", oSelected);
            console.log("oModel=", oModel.getData());

            var sTenantId = "",
                sCompanyCode = "",
                sLoiWriteNumber = "",
                sLoiItemNumber = "",
                sLoiSelectionNumber = "",
                sLoiNumber = "";
            // '122010'	'RFQ진행중'
            // '122020'	'RFQ완료'
            // '122030'	'작성중'
            // '122040'	'결재진행중'
            // '122050'	'결재반려'
            // '122060'	'업체선정완료'         

            //RFQ 번호,상태에 따라 이동가능 여부 체크  
            var canSelect = true;
            var quotationNumberrArr = [];

            if (oSelected.length > 0) {
                oSelected.forEach(function (chkIdx, index) {
                    console.log("aaaaaaaaaa=", oModel.getData().LOIPublishItemView[chkIdx].loi_number);
                    console.log("oSelected.length=", oSelected.length);
                    console.log("chkIdx=", chkIdx);
                    //oModel.getData().LOIPublishItemView[idx].loi_number
                    sTenantId += oModel.getData().LOIPublishItemView[chkIdx].tenant_id + (oSelected.length == index + 1 ? "" : ",");
                    sCompanyCode += oModel.getData().LOIPublishItemView[chkIdx].company_code + (oSelected.length == index + 1 ? "" : ",");
                    sLoiWriteNumber += oModel.getData().LOIPublishItemView[chkIdx].loi_write_number + (oSelected.length == index + 1 ? "" : ",");
                    sLoiItemNumber += oModel.getData().LOIPublishItemView[chkIdx].loi_item_number + (oSelected.length == index + 1 ? "" : ",");
                    sLoiSelectionNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_selection_number;
                    sLoiNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_number;

                    console.log("sLoiWriteNumber=", sLoiWriteNumber);
                    console.log("sLoiItemNumber=", sLoiItemNumber);
                    console.log("sLoiSelectionNumber=", sLoiSelectionNumber);
                    console.log("sLoiNumber=", sLoiNumber);

                    //업체선정번호가 있으면 링크불가
                    if (sLoiSelectionNumber) {
                        MessageToast.show("이미 등록된 건입니다. 조회 또는 수정하시려면 업체선정진행상태 항목을 클릭해 주세요.");
                        canSelect = false;
                        return false;
                    }

                    /*
                        향후 견적테이블이 생성되면 1번로직 주석 2번 로직 주석해제
                    */

                    /*
                        1번 로직
                        견적번호가 없으면 링크불가
                    */
                    if (oModel.getData().LOIPublishItemView[chkIdx].quotation_number == 0) {
                        MessageToast.show("견적번호가 없습니다.");
                        canSelect = false;
                        return false;
                    }

                    //견적번호 동일한지 체크
                    var quotationNumber = oModel.getData().LOIPublishItemView[chkIdx].quotation_number;
                    // console.log("notSameloiNumber=", !loiNumberArr.includes(loiNumber))
                    if (index > 0 && !quotationNumberrArr.includes(quotationNumber)) {
                        MessageToast.show("견적번호가 동일하지 않습니다.");
                        canSelect = false;
                        return false;
                    }
                    quotationNumberrArr.push(oModel.getData().LOIPublishItemView[chkIdx].quotation_number);

                    //업체선정번호 동일한지 체크로직 추가여부 확인

                    /*
                        2번 로직
                        RFQ 상태가 모두 완료이면 신규 등록화면 이동 - 견적테이블 조회
                    */

                    //업체선정상태코드에 따라 loiSelectionNumber 설정(신규/수정/조회)
                    // var loiSelectionStatusCode = oModel.getData().LOIPublishItemView[chkIdx].loi_selection_status_code;
                    // //업체선정상태가 진행중/결재반려 이면 수정화면 이동
                    // if(loiSelectionStatusCode === "122030" || loiSelectionStatusCode === "122050") {
                    //     linkType = "U";
                    // }
                    // //업체선정상태가 결재진행중/업체선정완료 이면 조회화면 이동
                    // else if(loiSelectionStatusCode === "122040" || loiSelectionStatusCode === "122060") {
                    //     linkType = "V";
                    // }
                    // else {
                    //     linkType = "C";
                    //     sLoiSelectionNumber = "new";
                    // }

                });
            }else {
                canSelect = false;
                MessageToast.show("한개이상 선택해주세요.");
            }

            //업체선정번호가 없으면 신규저장모드
            if (!sLoiSelectionNumber) {
                sLoiSelectionNumber = "new";
            }

            console.log("sLoiSelectionNumber=", sLoiSelectionNumber);
            console.log("canSelect=", canSelect);

            if (canSelect) {
                console.log("sTenantId=", sTenantId);
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                this.getRouter().navTo("selectionPage", {
                    //layout: oNextUIState.layout,
                    tenantId: sTenantId,
                    companyCode: sCompanyCode,
                    loiWriteNumber: sLoiWriteNumber,
                    loiItemNumber: sLoiItemNumber,
                    loiSelectionNumber: sLoiSelectionNumber,
                    loiNumber: sLoiNumber
                }, true);

                // if (oNextUIState.layout === "TwoColumnsMidExpanded") {
                //     this.getView().getModel("mainListViewModel").setProperty("/headerExpanded", false);
                // }
            }

        },

        onTablePublishPress: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext("list").getPath(),
                oRecord = this.getModel("list").getProperty(sPath);

            this.getRouter().navTo("publishPage", {
                //layout: oNextUIState.layout,
                tenantId: oRecord.tenant_id,
                companyCode: oRecord.company_code,
                loiWriteNumber: oRecord.loi_write_number,
                loiItemNumber: oRecord.loi_item_number,
                loiPublishNumber: oRecord.loi_publish_number,
                loiNumber: oRecord.loi_number
            }, true);
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onPublishButtonPress: function () {

            var oTable = this.byId("mainTable"),
                oModel = this.getView().getModel("list"),
                oSelected = oTable.getSelectedIndices();
            console.log("oSelected=", oSelected);
            console.log("oModel=", oModel.getData());

            var sTenantId = "",
                sCompanyCode = "",
                sLoiWriteNumber = "",
                sLoiItemNumber = "",
                sLoiSelectionNumber = "",
                sLoiSelectionStatusCode = "",
                sLoiPublishNumber = "",
                sLoiNumber = "";
                // 123010	작성중			
                // 123020	결재진행중			
                // 123030	결재반려			
                // 123040	결재완료			
                // 123050	발행완료			
                // 123060	서명완료         

            //RFQ 번호,상태에 따라 이동가능 여부 체크  
            var canSelect = true;
            var loiSelectionNumberrArr = [];

            if (oSelected.length > 0) {
                oSelected.forEach(function (chkIdx, index) {
                    console.log("aaaaaaaaaa=", oModel.getData().LOIPublishItemView[chkIdx].loi_number);
                    console.log("oSelected.length=", oSelected.length);
                    console.log("chkIdx=", chkIdx);
                    //oModel.getData().LOIPublishItemView[idx].loi_number
                    sTenantId += oModel.getData().LOIPublishItemView[chkIdx].tenant_id + (oSelected.length == index + 1 ? "" : ",");
                    sCompanyCode += oModel.getData().LOIPublishItemView[chkIdx].company_code + (oSelected.length == index + 1 ? "" : ",");
                    sLoiWriteNumber += oModel.getData().LOIPublishItemView[chkIdx].loi_write_number + (oSelected.length == index + 1 ? "" : ",");
                    sLoiItemNumber += oModel.getData().LOIPublishItemView[chkIdx].loi_item_number + (oSelected.length == index + 1 ? "" : ",");
                    sLoiSelectionNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_selection_number;
                    sLoiSelectionStatusCode = oModel.getData().LOIPublishItemView[chkIdx].loi_selection_status_code;
                    sLoiPublishNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_publish_number;
                    sLoiNumber = oModel.getData().LOIPublishItemView[chkIdx].loi_number;

                    console.log("sLoiWriteNumber=", sLoiWriteNumber);
                    console.log("sLoiItemNumber=", sLoiItemNumber);
                    console.log("sLoiSelectionNumber=", sLoiSelectionNumber);
                    console.log("sLoiPublishNumber=", sLoiPublishNumber);
                    console.log("sLoiNumber=", sLoiNumber);

                    //발행번호가 있으면 링크불가
                    if (sLoiPublishNumber) {
                        MessageToast.show("이미 등록된 건입니다. 조회 또는 수정하시려면 LOI발행상태 항목을 클릭해 주세요.");
                        canSelect = false;
                        return false;
                    }

                    /*
                         업체선정완료가 아니면 링크불가
                    */
                    if (sLoiSelectionStatusCode != "122060") {
                        MessageToast.show("업체선정완료된 항목만 선택해주세요.");
                        canSelect = false;
                        return false;
                    }

                    //업체선정번호가 동일한지 체크
                    if (index > 0 && !loiSelectionNumberrArr.includes(sLoiSelectionNumber)) {
                        MessageToast.show("업체선정번호가 동일하지 않습니다.");
                        canSelect = false;
                        return false;
                    }
                    loiSelectionNumberrArr.push(sLoiSelectionNumber);

                });
            }else {
                canSelect = false;
                MessageToast.show("한개이상 선택해주세요.");
            }

            //업체선정번호가 없으면 신규저장모드
            if (!sLoiPublishNumber) {
                sLoiPublishNumber = "new";
            }

            console.log("sLoiPublishNumber=", sLoiPublishNumber);
            console.log("canSelect=", canSelect);

            if (canSelect) {
                console.log("sTenantId=", sTenantId);
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                this.getRouter().navTo("publishPage", {
                    //layout: oNextUIState.layout,
                    tenantId: sTenantId,
                    companyCode: sCompanyCode,
                    loiWriteNumber: sLoiWriteNumber,
                    loiItemNumber: sLoiItemNumber,
                    loiPublishNumber: sLoiPublishNumber,
                    loiNumber: sLoiNumber
                }, true);

                // if (oNextUIState.layout === "TwoColumnsMidExpanded") {
                //     this.getView().getModel("mainListViewModel").setProperty("/headerExpanded", false);
                // }
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
        _onRoutedThisPage: function () {
            this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
            this.byId("pageSearchButton").firePress();
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oModel = this.getModel("list");
            oView.setBusy(true);
            oModel.setTransactionModel(this.getModel());
            oModel.read("/LOIPublishItemView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    console.log("oData====", oData);
                    oView.setBusy(false);
                }
            });
        },

        _getSearchStates: function () {

            var loiNumberTokens = this.getView().byId("searchLoiNumber").getTokens();
            var sLoiNumber = loiNumberTokens.map(function (oToken) {
                return oToken.getKey();
            });

            var requestFromDate = this.getView().byId("searchRequestDate").getDateValue(),
                requestToDate = this.getView().byId("searchRequestDate").getSecondDateValue();

            var sRequestDepartment = this.getView().byId("searchRequestDepartment").getValue(),
                sRequestor = this.getView().byId("searchRequestor").getValue(),
                sLoiPublishStatus = this.getView().byId("searchLoiPublishStatus").getSelectedKeys();

            var requestFromDate = this.getView().byId("searchRequestDate").getDateValue(),
                requestToDate = this.getView().byId("searchRequestDate").getSecondDateValue();

            // var requestDate = this.getView().byId("searchRequestDate").getValue();   

            // console.log(requestDate);
            // var a = requestDate.replaceAll(" ", "");
            // var requestFromDate = new Date(a.substring(0, 10));
            // var requestToDate = new Date(a.substring(11, 22)); 

            var createFromDate = this.getView().byId("searchSystemCreateDate").getDateValue(),
                createToDate = this.getView().byId("searchSystemCreateDate").getSecondDateValue();

            var publishFromDate = this.getView().byId("searchPublishDate").getDateValue(),
                publishToDate = this.getView().byId("searchPublishDate").getSecondDateValue();

            var sPurchasingDepartment = this.getView().byId("searchPurchasingDepartment").getValue(),
                sBuyer = this.getView().byId("searchBuyer").getValue(),
                sLoiPoStatus = this.getView().byId("searchPoStatus").getSelectedKeys();

            var found1 = sRequestDepartment.match(/\((.*?)\)/);
            if (found1) {
                sRequestDepartment = found1[1];
            }
            var found2 = sRequestor.match(/\((.*?)\)/);
            if (found2) {
                sRequestor = found2[1];
            }
            var found3 = sPurchasingDepartment.match(/\((.*?)\)/);
            if (found3) {
                sPurchasingDepartment = found3[1];
            }
            var found4 = sBuyer.match(/\((.*?)\)/);
            if (found4) {
                sBuyer = found4[1];
            }

            console.log("sLoiNumber==", sLoiNumber);
            console.log("requestFromDate==", requestFromDate);
            console.log("requestToDate==", requestToDate);
            console.log("sRequestDepartment==", sRequestDepartment);
            console.log("sRequestor==", sRequestor);
            console.log("sLoiPublishStatus==", sLoiPublishStatus);
            console.log("createFromDate==", createFromDate);
            console.log("createToDate==", createToDate);
            console.log("publishFromDate==", publishFromDate);
            console.log("publishToDate==", publishToDate);
            console.log("sPurchasingDepartment==", sPurchasingDepartment);
            console.log("sBuyer==", sBuyer);
            console.log("sLoiPoStatus==", sLoiPoStatus);

            var aSearchFilters = [];
            if (sLoiNumber.length > 0) {
                var _tempFilters = [];

                sLoiNumber.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("loi_number", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (requestFromDate && requestToDate) {
                aSearchFilters.push(new Filter("request_date", FilterOperator.BT, requestFromDate, requestToDate));
            }
            if (sRequestDepartment && sRequestDepartment.length > 0) {
                aSearchFilters.push(new Filter("request_department_code", FilterOperator.EQ, sLoiNumber));
            }
            if (sRequestor && sRequestor.length > 0) {
                aSearchFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sLoiNumber));
            }

            if (sLoiPublishStatus.length > 0) {
                var _tempFilters = [];

                sLoiPublishStatus.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("loi_publish_status_code", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            if (createFromDate && createToDate) {
                aSearchFilters.push(new Filter("system_create_dtm", FilterOperator.BT, createFromDate, createToDate));
            }
            if (publishFromDate && publishToDate) {
                aSearchFilters.push(new Filter("publish_date", FilterOperator.BT, publishFromDate, publishToDate));
            }
            if (sPurchasingDepartment && sPurchasingDepartment.length > 0) {
                aSearchFilters.push(new Filter("purchasing_department_code", FilterOperator.EQ, sPurchasingDepartment));
            }
            if (sBuyer && sBuyer.length > 0) {
                aSearchFilters.push(new Filter("buyer_empno", FilterOperator.EQ, sBuyer));
            }

            if (sLoiPublishStatus.length > 0) {
                var _tempFilters = [];

                sLoiPublishStatus.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("po_status_code", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }

            return aSearchFilters;
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("system_create_dtm", true));
            //var aSorter = new Sorter("system_create_dtm", true);    
            return aSorter;
        },

        // _doInitTablePerso: function(){
        // 	// init and activate controller
        // 	this._oTPC = new TablePersoController({
        // 		table: this.byId("mainTable"),
        // 		componentName: "loiPublishMgt",
        // 		persoService: MainListPersoService,
        // 		hasGrouping: true
        //     }).activate();

        //     // //this.getView().setModel(new ManagedListModel(), "list");
        //     // // 개인화 - UI 테이블의 경우만 해당
        //     // this._oTPC = new TablePersoController({
        //     // customDataKey: "loiPublishMgt",
        //     // persoService: MainListPersoService
        //     // }).setTable(this.byId("mainTable"));            

        // }


    });
});