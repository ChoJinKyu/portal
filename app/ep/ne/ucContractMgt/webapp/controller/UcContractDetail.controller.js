sap.ui.define([
    "ext/lib/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ext/lib/model/ManagedListModel",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/Sorter",
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
    "sap/ui/model/odata/v2/ODataModel",
    "cm/util/control/ui/CmDialogHelp"
], function (BaseController, JSONModel, ManagedListModel, Validator, Formatter, DateFormatter, Sorter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, CmDialogHelp) {
    "use strict";

    return BaseController.extend("ep.ne.ucContractMgt.controller.UcContractDetail", {

        dateFormatter: DateFormatter,
        validator: new Validator(),
        formatter: Formatter,
        // formatter: (function () {
        //     return {
        //         toYesNo: function (oData) {
        //             return oData === true ? "YES" : "NO"
        //         },
        //     }
        // })(),

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            //this.setModel(new JSONModel(), "viewModel");
            // this.setModel(new JSONModel(), "mst");
            //this.setModel(new ManagedListModel(), "dtlList");
            // this.setModel(new JSONModel(), "dtl");
            // this.setModel(new JSONModel(), "supplier");
            // this.setModel(new JSONModel(), "extra");
            //화면설정
            //this.setModel(new JSONModel(), "viewSet");

            this.getRouter().getRoute("detailPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.enableMessagePopover();

        },

		/**
		 * Event handler for Nav Back Button pressed
		 * @public
		 */
        onPageNavBackButtonPress: function () {
            this.validator.clearValueState(this.byId("editBox"));
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                history.go(-1);
            } else {
                this.getRouter().navTo("mainPage", {}, true);
            }
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
                oViewModel = this.getModel("viewModel"),
                that = this;

            var input = {};
            var inputData = {};
            var mstData = oViewModel.getProperty("/mst");

            inputData = {
                "mst": mstData
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
                oViewModel = this.getModel("viewModel"),
                that = this;

            // 711010	작성중		
            // 711020	결재진행중		
            // 711030	결재반려		
            // 711040	결재완료
            var statusCode = "711010";
            if (flag == "R") {
                statusCode = "711020";
            } else if (flag == "B") {
                statusCode = "711040";
            } else {
                statusCode = "711010";
            }

            var mstData = oViewModel.getProperty("/mst");
            var dtlData = oViewModel.getProperty("/dtl");
            var supplierData = oViewModel.getProperty("/supplier");
            var extraData = oViewModel.getProperty("/extra");

            mstData["ep_item_class_name"] = mstData["ep_item_class_code"].split(":")[1];
            mstData["ep_item_class_code"] = mstData["ep_item_class_code"].split(":")[0];
            mstData["contract_write_date"] = null;
            //mstData["net_price_contract_start_date"] = new Date(mstData["net_price_contract_start_date"]).toLocaleString();

            supplierData.map(d => {
                d["distrb_rate"] = (d["distrb_rate"] ? parseInt(d["distrb_rate"]) : null);
                return d;
            });  

            dtlData.map(d => {
                d["material_apply_flag"] = (d["material_apply_flag"] == "Y" ? true : false);
                d["labor_apply_flag"] = (d["labor_apply_flag"] == "Y" ? true : false);
                return d;
            });            

            extraData.map(d => {
                d["extra_class_name"] = d["extra_class_number"].split(":")[1];
                d["extra_class_number"] = d["extra_class_number"].split(":")[0];
                d["extra_name"] = d["extra_number"].split(":")[1];
                d["extra_number"] = d["extra_number"].split(":")[0];
                d["apply_extra_rate"] = (d["apply_extra_rate"] ? parseInt(d["apply_extra_rate"]) : null);
                d["base_extra_rate"] = (d["base_extra_rate"] ? parseInt(d["base_extra_rate"]) : null);
                return d;
            });

            var input = {
                inputData: {
                    approvalMstType: [],
                    approvalDtlType: [],
                    approvalSupplierType: [],
                    approvalExtraType: []
                }
            };   
            
            input.inputData.approvalMstType = [mstData];
            input.inputData.approvalDtlType = dtlData;
            input.inputData.approvalSupplierType = supplierData;
            input.inputData.approvalExtraType = extraData;

            // inputData = {
            //     "approvalMstType": mstData,
            //     "approvalDtlType": dtlData,
            //     "approvalSupplierType": supplierData,
            //     "approvalExtraType": extraData
            // }

            // input.inputData = inputData;

            console.log("input====", input.inputData);

            // if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("editBox")) !== true) return;

            var url = "ep/ne/ucContractMgt/webapp/srv-api/odata/v4/ep.UcContractMgtV4Service/UcApprovalMstCudProc";

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

                                console.log("#########Success#####", data.approvalMstType);
                                oView.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.validator.clearValueState(that.byId("editBox"));

                                oViewModel.setProperty("/mst", data.approvalMstType[0]);
                                oViewModel.setProperty("/dtl", data.approvalDtlType);
                                oViewModel.setProperty("/supplier", data.approvalSupplierType);
                                oViewModel.setProperty("/extra", data.approvalExtraType);  
                                that._toShowMode();                              

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
            this.validator.clearValueState(this.byId("editBox"));
            if (this.getModel("viewSet").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("viewSet").getProperty("/isEditMode") == true) {
                    this._toShowMode();
                } else {
                    this.onPageNavBackButtonPress.call(this);
                }
            }
        },

        // onDtlTableAddButtonPress_bak: function () {
        //     var oDtlModel = this.getModel("dtlList");
        //     console.log("dtlModel=", this.dtlModel);
        //     this.dtlModel["tenant_id"] = "L2100";
        //     this.dtlModel["item_sequence"] = 10;
        //     oDtlModel.addRecord(this.dtlModel, "/UcApprovalDtlDetailView", 0);
        //     // oDtlModel.addRecord({
        //     //     "tenant_id": "L2100",
        //     //     "company_code": 'LGCKR',
        //     // 	"net_price_contract_document_no": "",
        //     // 	"net_price_contract_degree": 0,
        //     // 	"net_price_contract_item_number": "",
        //     // 	"item_sequence": 10,
        //     //     "ep_item_code": "",
        //     //     "ep_item_name": "",
        //     //     "spec_desc": "",
        //     //     "contract_quantity": "",
        //     //     "unit": "",
        //     //     "material_apply_flag": "",
        //     //     "labor_apply_flag": "",
        //     //     "currency_code": "",
        //     //     "material_net_price": "",  
        //     //     "labor_net_price": "",  
        //     //     "remark": ""     
        //     // }, "/UcApprovalDtlDetailView", 0);
        //     //console.log("oDtlModel=", oDtlModel.getData().UcApprovalDtlDetailView.length);
        //     this.validator.clearValueState(this.byId("dtlTable"));
        //     this.byId("dtlTable").clearSelection();
        // },

        onSupplierTableAddButtonPress: function () {
            var oViewModel = this.getModel("viewModel");
            var oMstData = oViewModel.getProperty("/mst");
            var addSupplierData = this.getSchema("UcApprovalSupplierDetailView");
            addSupplierData["tenant_id"] = "L2100";
            addSupplierData["company_code"] = "LGCKR";
            addSupplierData["create_user_id"] = "100003";
            addSupplierData["update_user_id"] = "100003";
            addSupplierData["net_price_contract_document_no"] = oMstData["net_price_contract_document_no"];
            addSupplierData["net_price_contract_degree"] = oMstData["net_price_contract_degree"];
            addSupplierData["row_state"] = "C";
            // console.log("addSupplierData=", addSupplierData);
            // console.log("sup_before=", oViewModel.getProperty("/supplier"));
            var oSupplierData = oViewModel.getProperty("/supplier");
            oSupplierData.push(addSupplierData);
            // console.log("oSupplierData=", oSupplierData);
            oViewModel.setProperty("/supplier", oSupplierData);
            // console.log("sup_after=", oViewModel.getProperty("/supplier"));
            this.validator.clearValueState(this.byId("supplierTable"));
            this.byId("supplierTable").clearSelection();
        },

        onSupplierTableDeleteButtonPress: function () {
            var table = this.byId("supplierTable"),
                oViewModel = this.getModel("viewModel"),
                oDtlData = oViewModel.getProperty("/supplier");

            table.getSelectedIndices().reverse().forEach(function (idx) {
                // console.log("idx=", idx);
                if (oDtlData[idx]["row_state"] == "C") {
                    oDtlData.splice(idx, 1);
                } else {
                    oDtlData[idx]["row_state"] = "D";
                }
            });

            // console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/supplier", oDtlData);
            this.byId("supplierTable").clearSelection();
        },

        onDtlTableAddButtonPress: function () {
            var oViewModel = this.getModel("viewModel");
            var oMstData = oViewModel.getProperty("/mst");
            var len = oViewModel.getProperty("/dtl").length;
            var addDtlData = this.getSchema("UcApprovalDtlDetailView");
            addDtlData["tenant_id"] = "L2100";
            addDtlData["company_code"] = "LGCKR";
            addDtlData["create_user_id"] = "100003";
            addDtlData["update_user_id"] = "100003";
            addDtlData["net_price_contract_document_no"] = oMstData["net_price_contract_document_no"];
            addDtlData["net_price_contract_degree"] = oMstData["net_price_contract_degree"];
            addDtlData["org_type_code"] = "PU";
            addDtlData["org_code"] = "P100";
            addDtlData["item_sequence"] = 10 * (len + 1);
            addDtlData["row_state"] = "C";
            // console.log("dtl_before=", oViewModel.getProperty("/dtl"));
            var oDtlData = oViewModel.getProperty("/dtl");
            oDtlData.push(addDtlData);
            // console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/dtl", oDtlData);
            // console.log("dtl_after=", oViewModel.getProperty("/dtl"));
            this.validator.clearValueState(this.byId("dtlTable"));
            this.byId("dtlTable").clearSelection();
        },

        onDtlTableDeleteButtonPress: function () {
            var table = this.byId("dtlTable"),
                oViewModel = this.getModel("viewModel"),
                oDtlData = oViewModel.getProperty("/dtl");

            table.getSelectedIndices().reverse().forEach(function (idx) {
                // console.log("idx=", idx);
                if (oDtlData[idx]["row_state"] == "C") {
                    oDtlData.splice(idx, 1);
                } else {
                    oDtlData[idx]["row_state"] = "D";
                }
            });

            oDtlData.map(function (d, index) {
                console.log("index=", index);
                d["item_sequence"] = 10 * (index + 1);
                return d;
            });

            // console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/dtl", oDtlData);
            this.byId("dtlTable").clearSelection();
        },

        onExtraTableAddButtonPress: function () {
            var oViewModel = this.getModel("viewModel");
            var oMstData = oViewModel.getProperty("/mst");
            var addExtraData = this.getSchema("UcApprovalExtraDetailView");
            addExtraData["tenant_id"] = "L2100";
            addExtraData["company_code"] = "LGCKR";
            addExtraData["create_user_id"] = "100003";
            addExtraData["update_user_id"] = "100003";
            addExtraData["net_price_contract_document_no"] = oMstData["net_price_contract_document_no"];
            addExtraData["net_price_contract_degree"] = oMstData["net_price_contract_degree"];
            addExtraData["extra_class_number"] = "G003";
            addExtraData["row_state"] = "C";
            // console.log("addExtraData=", addExtraData);
            // console.log("extra_before=", oViewModel.getProperty("/extra"));
            var oExtraData = oViewModel.getProperty("/extra");
            oExtraData.push(addExtraData);
            // console.log("oExtraData=", oExtraData);
            oViewModel.setProperty("/extra", oExtraData);
            // console.log("extra_after=", oViewModel.getProperty("/extra"));
            this.validator.clearValueState(this.byId("extraTable"));
            this.byId("extraTable").removeSelections(true);
        },

        onExtraTableDeleteButtonPress: function () {
            var table = this.byId("extraTable"),
                oViewModel = this.getModel("viewModel"),
                oDtlData = oViewModel.getProperty("/extra");

            table.getSelectedItems()
                .map(item => oDtlData.indexOf(item.getBindingContext("viewModel").getObject()))
                .reverse().forEach(function (idx) {
                    console.log("idx=", idx);
                    if (oDtlData[idx]["row_state"] == "C") {
                        oDtlData.splice(idx, 1);
                    } else {
                        oDtlData[idx]["row_state"] = "D";
                    }
                });

            console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/extra", oDtlData);
            this.byId("extraTable").removeSelections(true);
        },

        setExtraItem: function (oEvent) {

            console.log("11111111=");

            var oViewModel = this.getModel("viewModel");
            var sPath = oEvent.getSource().getBindingInfo('selectedKey').binding.getContext().getPath();
            var index = sPath.substr(sPath.length - 1);

            console.log("index=", index);

            var params = oEvent.getParameters();
            var itemFilters = [];

            var selectedKey = oEvent.getParameters().selectedItem.mProperties.key;
            selectedKey = selectedKey.split(":")[0];

            if (selectedKey) {
                itemFilters.push(new Filter({
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, 'LGCKR'),
                        new Filter("extra_class_number", FilterOperator.EQ, selectedKey)
                    ],
                    and: true
                }));
            } else {
                itemFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                    new Filter("company_code", FilterOperator.EQ, 'LGCKR')
                );
            }

            var filter = new Filter({
                filters: itemFilters,
                and: false
            });

            var sorter = [new Sorter("system_create_dtm", true)];

            var bindInfo = {
                path: '/UcExtraItem',
                filters: filter,
                sorters: sorter,
                template: new Item({
                    key: "{extra_number}:{extra_name}", text: "{extra_name}"
                })
            };
            //this.getView().byId("saveExtraItem").bindItems(bindInfo);
            // var changedCombo = oEvent.getSource().getParent().getParent().getCells()[index];
            // changedCombo.bindItems(bindInfo);
            oEvent.getSource().getParent().getParent().getCells()[2].mAggregations.items[0].bindItems(bindInfo);
            //oViewModel.setProperty("/supplier/" + index + "/extra_number", selectedKey);

        },

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oRootModel = this.getModel(),
                oViewModel = this.getModel("viewModel"),
                that = this;
            this._tenantId = "L2100";
            this._companyCode = "LGCKR";
            this._netPriceContractDocumentNo = oArgs.netPriceContractDocumentNo;
            this._netPriceContractDegree = oArgs.netPriceContractDegree;

            console.log("##oArgs.tenantId==", oArgs.tenantId);
            console.log("##oArgs.companyCode==", oArgs.companyCode);
            console.log("##oArgs.netPriceContractDocumentNo==", oArgs.netPriceContractDocumentNo);
            console.log("##oArgs.netPriceContractDegree==", oArgs.netPriceContractDegree);

            //각 모델의 스키마 생성
            var mstModel = this.getSchema("UcApprovalMstDetailView");
            console.log("mstModel=", mstModel);

            if (oArgs.netPriceContractDocumentNo == "new") {
                this.getModel("viewSet").setProperty("/isAddedMode", true);

                console.log("###신규저장");

                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var toDate = year + "-" + month + "-" + day;

                mstModel["tenant_id"] = this._tenantId;
                mstModel["company_code"] = this._companyCode;
                mstModel["net_price_contract_degree"] = 0;
                mstModel["contract_write_date"] = date;
                mstModel["buyer_empno"] = "100003";
                mstModel["buyer_name"] = "윤구매2";
                mstModel["purchasing_department_code"] = "1000001";
                mstModel["purchasing_department_name"] = "LGCKR석유화학.구매.원재료구매1팀";
                mstModel["net_price_contract_status_code"] = "711010";
                mstModel["net_price_contract_status_name"] = "작성중";
                mstModel["create_user_id"] = "100003";
                mstModel["update_user_id"] = "100003";
                mstModel["row_state"] = "C";
                // mstModel["org_type_code"] = "PL";

                oViewModel.setProperty("/mst", mstModel);
                oViewModel.setProperty("/dtl", []);
                oViewModel.setProperty("/supplier", []);
                oViewModel.setProperty("/extra", []);

                console.log("mst=", oViewModel.getProperty("/mst"));
                console.log("dtl=", oViewModel.getProperty("/dtl"));

                this._toEditMode();
            } else {
                console.log("###수정");
                this.getModel("viewSet").setProperty("/isAddedMode", false);

                var sObjectPath = "/UcApprovalMstDetailView(tenant_id='" + this._tenantId + "',company_code='" + this._companyCode + "',net_price_contract_document_no='" + this._netPriceContractDocumentNo + "',net_price_contract_degree='" + this._netPriceContractDegree + "')";
                oView.setBusy(true);
                var mstDataLoading = new Promise(function (resolve, reject) {
                    oRootModel.read(sObjectPath, {
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (data) {
                            reject(data);
                        }
                    });
                });

                mstDataLoading.then(function (oData) {
                    console.log("oData====", oData);
                    oView.setBusy(false);
                    that._toShowMode();
                }, function (data) {
                    console.log("error====", data);
                });                

                // var sObjectPath = "/UcApprovalMstDetailView(tenant_id='" + this._tenantId + "',company_code='" + this._companyCode + "',net_price_contract_document_no='" + this._netPriceContractDocumentNo + "',net_price_contract_degree='" + this._netPriceContractDegree + "')";
                // oView.setBusy(true);
                // oRootModel.read(sObjectPath, {
                //     success: function (oData) {
                //         console.log("oData====", oData);
                //         oView.setBusy(false);
                //         that._toShowMode();
                //     }
                // });

            }
        },

        getSchema: function (entityName) {

            var mstModel = {};

            var oRootModel = this.getModel();
            var jsonMetadata = new JSONModel();
            jsonMetadata.setData(oRootModel.getServiceMetadata());

            var findMetadata = jsonMetadata.getData().dataServices.schema[0].entityType.filter(d => {
                return d["name"] == entityName;
            });

            for (var field of findMetadata[0].property) {
                var fieldName = field["name"];
                var fieldType = field["type"];
                var defaultValue = null;
                if (fieldType == "Edm.String") {
                    defaultValue = "";
                }
                // console.log("fieldName=", fieldName);
                // console.log("defaultValue=", defaultValue);
                mstModel[fieldName] = defaultValue;

            }

            return mstModel;
        },

        _toEditMode: function () {
            this.getModel("viewSet").setProperty("/isEditMode", true);
            var oViewModel = this.getModel("viewModel")
            var statusCode = oViewModel.getProperty("/mst").net_price_contract_status_code;
            this._showFormFragment('UcContractDetail_Edit');
            // this.byId("page").setSelectedSection("pageSectionMain");
            this.byId("page").setProperty("showFooter", true);
            this.byId("pageEditButton").setVisible(false);
            this.byId("pageDeleteButton").setVisible(false);
            this.byId("pageNavBackButton").setEnabled(false);
            this.byId("pageSaveButton").setVisible(true);
            this.byId("pageByPassButton").setVisible(true);
            this.byId("pageRequestButton").setVisible(true);
            if (statusCode === "711010" || statusCode === "711030") {
                this.byId("pageSaveButton").setEnabled(true);
            } else {
                this.byId("pageSaveButton").setEnabled(false);
            }
            if (statusCode === "711040") {
                this.byId("pageByPassButton").setEnabled(false);
            } else {
                this.byId("pageByPassButton").setEnabled(true);
            }
            if (statusCode === "711020" || statusCode === "711040") {
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
            console.log("####################isEditMode", this.getModel("viewSet").getProperty("/isEditMode"));

        },

        _toShowMode: function () {
            var oViewModel = this.getModel("viewModel")
            var statusCode = oViewModel.getProperty("/mst").net_price_contract_status_code;
            this.getModel("viewSet").setProperty("/isEditMode", false);
            this._showFormFragment('UcContractDetail_Show');
            // this.byId("page").setSelectedSection("pageSectionMain");
            if (statusCode == "711040") {
                this.byId("page").setProperty("showFooter", false);
            } else {
                this.byId("page").setProperty("showFooter", true);
            }

            this.byId("pageEditButton").setVisible(true);
            this.byId("pageDeleteButton").setVisible(true)

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
            console.log("####################isEditMode", this.getModel("viewSet").getProperty("/isEditMode"));
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
        },

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
                    this.byId("savePlantCode").setValue(oEvent.getParameter("item").bizdivision_code);
                    this.byId("savePlantName").setValue(oEvent.getParameter("item").bizdivision_name);
                }.bind(this));
            }
            this.oCmDialogHelp.open();
        },

        // onInputWithEmployeeValuePress: function () {
        //     this.byId("employeeDialog").open();
        // },

        // onEmployeeDialogApplyPress: function (oEvent) {
        //     // console.log("empl===", oEvent.getParameter("item"));
        //     this.byId("saveBuyerName").setValue(oEvent.getParameter("item").user_local_name);
        //     this.byId("saveBuyerEmpno").setValue(oEvent.getParameter("item").employee_number);
        // },

        openSupplierPopupInTable: function (oEvent) {

            // var oViewModel = this.getModel("viewModel");
            // console.log("sPath=", oEvent.getSource().oPropagatedProperties.getModel("viewModel"));
            // var sPath = oEvent.getSource().getBindingContextPath();
            var sPath = oEvent.getSource().getBindingInfo('value').binding.getContext().getPath();
            var index = sPath.substr(sPath.length - 1);

            console.log(" index obj ----------------->", index);
            this.openSupplierPopupInTable["row"] = index;

            this.byId("supplierWithOrgDialog").open();

        },

        onSupplierDialogApplyPress: function (oEvent) {

            var oViewModel = this.getModel("viewModel");

            console.log("onSupplierDialogApplyPress----------------->");

            // var oDetailsModel = this.getModel("details");
            var rowIndex = this.openSupplierPopupInTable["row"];
            console.log("row ::: ", this.openSupplierPopupInTable["row"]);

            console.log("supplier_code ::: ", oEvent.getParameter("item").supplier_code);
            console.log("supplier_local_name ::: ", oEvent.getParameter("item").supplier_local_name);

            oViewModel.setProperty("/supplier/" + rowIndex + "/supplier_name", oEvent.getParameter("item").supplier_local_name);
            oViewModel.setProperty("/supplier/" + rowIndex + "/supplier_code", oEvent.getParameter("item").supplier_code);
        },

    });
});