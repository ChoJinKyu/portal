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
    "cm/util/control/ui/PlantDialog",
    "ep/util/control/ui/UcItemDialog"
], function (BaseController, JSONModel, ManagedListModel, Validator, Formatter, DateFormatter, Sorter, Filter, FilterOperator, Fragment, MessageBox, MessageToast, History,
    ColumnListItem, ObjectIdentifier, Text, Input, ComboBox, Item, RichTextEditor, ODataModel, PlantDialog, UcItemDialog) {
    "use strict";

    return BaseController.extend("ep.ne.ucContractMgt.controller.UcContractDetail", {

        dateFormatter: DateFormatter,
        validator: new Validator(),
        formatter: Formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

		/**
		 * Called when the midObject controller is instantiated.
		 * @public
		 */
        onInit: function () {
            this.setModel(new JSONModel(), "viewModelOrg");

            //화면설정
            //this.setModel(new JSONModel(), "viewSet");
            var viewModel = this.getModel("viewModel");

            this.getRouter().getRoute("detailPage").attachPatternMatched(this._onRoutedThisPage, this);
            this.enableMessagePopover();

            JSONModel.prototype.setProperty = function (sPath, oValue, oContext, bAsyncUpdate) {

                if (!!oContext) {
                    var _oRecord = this.getObject(oContext.getPath());
                    // console.log("###################_oRecord=##", _oRecord);
                    if (typeof _oRecord == "object" && _oRecord["row_state"] == "") _oRecord["row_state"] = "U";
                }

                var sResolvedPath = this.resolve(sPath, oContext),
                    iLastSlash, sObjectPath, sProperty;

                // return if path / context is invalid
                if (!sResolvedPath) {
                    return false;
                }

                // If data is set on root, call setData instead
                if (sResolvedPath == "/") {
                    this.setData(oValue);
                    return true;
                }

                iLastSlash = sResolvedPath.lastIndexOf("/");
                // In case there is only one slash at the beginning, sObjectPath must contain this slash
                sObjectPath = sResolvedPath.substring(0, iLastSlash || 1);
                sProperty = sResolvedPath.substr(iLastSlash + 1);

                var oObject = this._getObject(sObjectPath);
                if (oObject) {
                    oObject[sProperty] = oValue;
                    this.checkUpdate(false, bAsyncUpdate);
                    return true;
                }
                return false;
            }

        },

        onAfterRendering: function () {

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

            var mstData = oViewModel.getProperty("/mst");
            var dtlData = oViewModel.getProperty("/dtl");
            var supplierData = oViewModel.getProperty("/supplier");
            var extraData = oViewModel.getProperty("/extra");

            mstData["row_state"] = "D";
            mstData["contract_write_date"] = null;
            mstData["net_price_contract_degree"] = (mstData["net_price_contract_degree"] || !isNaN(mstData["net_price_contract_degree"]) ? parseInt(mstData["net_price_contract_degree"]) : null);
            delete mstData["__metadata"];

            var input = {
                inputData: {
                    approvalMstType: [],
                    approvalDtlType: [],
                    approvalSupplierType: [],
                    approvalExtraType: []
                }
            };

            input.inputData.approvalMstType = [mstData];
            // input.inputData.approvalDtlType = dtlData;
            // input.inputData.approvalSupplierType = supplierData;
            // input.inputData.approvalExtraType = extraData;

            console.log("input====", input.inputData);
            var url = "ep/ne/ucContractMgt/webapp/srv-api/odata/v4/ep.UcContractMgtV4Service/UcApprovalMstCudProc";

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

            if (supplierData.length == 0) {
                MessageToast.show(this.getModel("I18N").getText("/NCM02003", this.getModel("I18N").getText("/SUPPLIER")));
                return;
            }

            if (dtlData.length == 0) {
                MessageToast.show(this.getModel("I18N").getText("/EEP00001"));
                return;
            }

            mstData["contract_write_date"] = null;
            mstData["net_price_contract_degree"] = (mstData["net_price_contract_degree"] || !isNaN(mstData["net_price_contract_degree"]) ? parseInt(mstData["net_price_contract_degree"]) : null);
            mstData["net_price_contract_status_code"] = statusCode;
            delete mstData["__metadata"];

            var distrbRateTotal = 0;

            supplierData.map(d => {
                if (d["distrb_rate"]) distrbRateTotal += parseInt(d["distrb_rate"]);
                d["distrb_rate"] = (d["distrb_rate"] ? parseInt(d["distrb_rate"]) : null);
                d["net_price_contract_degree"] = (d["net_price_contract_degree"] || !isNaN(d["net_price_contract_degree"]) ? parseInt(d["net_price_contract_degree"]) : null);
                delete d["__metadata"];
                return d;
            });

            console.log("distrbRateTotal==", distrbRateTotal);
            if (distrbRateTotal != 100) {
                MessageToast.show(this.getModel("I18N").getText("/NEP00005"));
                return;
            }

            var afterDelCnt = 0;

            dtlData.map(d => {
                d["material_apply_flag"] = (d["material_apply_flag"] == "Y" ? true : false);
                d["labor_apply_flag"] = (d["labor_apply_flag"] == "Y" ? true : false);
                d["material_net_price"] = (d["material_net_price"] ? parseInt(d["material_net_price"]) : null);
                d["contract_quantity"] = (d["contract_quantity"] ? parseInt(d["contract_quantity"]) : null);
                d["labor_net_price"] = (d["labor_net_price"] ? parseInt(d["labor_net_price"]) : null);
                d["net_price_contract_degree"] = (d["net_price_contract_degree"] || !isNaN(d["net_price_contract_degree"]) ? parseInt(d["net_price_contract_degree"]) : null);
                delete d["__metadata"];

                d["item_sequence"] = (d["item_sequence"] || !isNaN(d["item_sequence"]) ? parseInt(d["item_sequence"]) - (afterDelCnt * 10) : null);

                if (d["row_state"] == "D") {
                    afterDelCnt++;
                }

                return d;
            });

            extraData.map(d => {
                // d["extra_class_name"] = d["extra_class_number"].split(":")[1];
                // d["extra_class_number"] = d["extra_class_number"].split(":")[0];
                // d["extra_name"] = d["extra_number"].split(":")[1];
                // d["extra_number"] = d["extra_number"].split(":")[0];
                d["apply_extra_rate"] = (d["apply_extra_rate"] ? parseFloat(d["apply_extra_rate"]) : null);
                d["base_extra_rate"] = (d["base_extra_rate"] ? parseInt(d["base_extra_rate"]) : null);
                d["net_price_contract_degree"] = (d["net_price_contract_degree"] || !isNaN(d["net_price_contract_degree"]) ? parseInt(d["net_price_contract_degree"]) : null);
                d["net_price_contract_extra_seq"] = (d["net_price_contract_extra_seq"] || !isNaN(d["net_price_contract_extra_seq"]) ? parseInt(d["net_price_contract_extra_seq"]) : null);
                delete d["__metadata"];
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

            console.log("input====", input.inputData);

            // if(!oMasterModel.isChanged() && !oDetailsModel.isChanged()) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("editBox")) !== true) return;
            // if (this.validator.validate(this.byId("supplierTable")) !== true) return;
            // if (this.validator.validate(this.byId("dtlTable")) !== true) return;
            if (this.validator.validate(this.byId("extraTable")) !== true) return;

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

                                console.log("#########Success#####", data);
                                oView.setBusy(false);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.validator.clearValueState(that.byId("editBox"));

                                oViewModel.setProperty("/mst", data.approvalMstType[0]);

                                data.approvalDtlType.map(d => {
                                    d["material_apply_flag"] = (d["material_apply_flag"] == true ? "Y" : "N");
                                    d["labor_apply_flag"] = (d["labor_apply_flag"] == true ? "Y" : "N");
                                    return d;
                                });
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

            var oViewModel = this.getModel("viewModel"),
                oViewModelOrg = this.getModel("viewModelOrg");

            // var dtlData = oViewModel.getProperty("/dtl");
            // var supplierData = oViewModel.getProperty("/supplier");
            // var extraData = oViewModel.getProperty("/extra");

            // supplierData.map(d => {
            //     d["distrb_rate"] = (d["distrb_rate"] ? parseInt(d["distrb_rate"]) : null);
            //     d["net_price_contract_degree"] = (d["net_price_contract_degree"] || !isNaN(d["net_price_contract_degree"]) ? parseInt(d["net_price_contract_degree"]) : null);
            //     delete d["__metadata"];
            //     return d;
            // });

            this.validator.clearValueState(this.byId("editBox"));
            if (this.getModel("viewSet").getProperty("/isAddedMode") == true) {
                this.onPageNavBackButtonPress.call(this);
            } else {
                if (this.getModel("viewSet").getProperty("/isEditMode") == true) {
                    var mstOrgData = oViewModelOrg.getProperty("/mstOrg");
                    console.log("mstOrgData=", mstOrgData);
                    var dtlOrgData = oViewModelOrg.getProperty("/dtlOrg");
                    console.log("dtlOrgData=", dtlOrgData);
                    var supplierOrgData = oViewModelOrg.getProperty("/supplierOrg");
                    console.log("supplierOrgData=", supplierOrgData);
                    var extraOrgData = oViewModelOrg.getProperty("/extraOrg");
                    console.log("extraOrgData=", extraOrgData);
                    // oViewModel.setProperty("/mst", mstOrgData);
                    // oViewModel.setProperty("/dtl", dtlOrgData);
                    // oViewModel.setProperty("/supplier", supplierOrgData);
                    // oViewModel.setProperty("/extra", extraOrgData);                    
                    this._toShowMode();
                } else {
                    this.onPageNavBackButtonPress.call(this);
                }
            }
        },

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
            addDtlData["currency_code"] = "KRW";
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
                // console.log("index=", index);
                d["item_sequence"] = 10 * (index + 1);
                return d;
            });

            // console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/dtl", oDtlData);
            // console.log("oDtlData=", oViewModel.getProperty("/dtl"));
            this.byId("dtlTable").clearSelection();
        },

        // /**
        //  * @description employee 팝업 닫기 
        //  */
        // onExitItemAdd: function () {
        //     this.byId("dialogContractEnd").close();
        // },

        // onDtlItemAddButtonPress: function () {

        //     var oView = this.getView();
        //     if (!this._itemAddDialog) {
        //         this._itemAddDialog = Fragment.load({
        //             id: oView.getId(),
        //             name: "ep.ne.ucContractMgt.view.ItemAdd",
        //             controller: this
        //         }).then(function (itemAddDialog) {
        //             oView.addDependent(itemAddDialog);
        //             return itemAddDialog;
        //         }.bind(this));
        //     }

        //     this._itemAddDialog.then(function (itemAddDialog) {
        //         itemAddDialog.open();

        //     });

        // },

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
            addExtraData["extra_class_number"] = "";
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

            // oViewModel.getProperty("/extra").forEach(function (d, idx) {

            //     console.log("idx=", idx);

            //     var bindInfo = {
            //         path: '/UcExtraItem',
            //         filters: [
            //             new Filter("tenant_id", FilterOperator.EQ, "L2100"),
            //             new Filter("company_code", FilterOperator.EQ, "LGCKR"),
            //             new Filter("extra_class_number", FilterOperator.EQ, d["extra_class_number"])
            //         ],
            //         sorters: [new Sorter("extra_number", false)],
            //         template: new Item({
            //             key: "{extra_number}", text: "{extra_name}"
            //         })
            //     };
            //     this.byId("extraTable").getItems()[idx].getCells()[2].getItems()[0].bindItems(bindInfo);

            // });

        },

        onExtraTableDeleteButtonPress: function () {
            var table = this.byId("extraTable"),
                oViewModel = this.getModel("viewModel"),
                oDtlData = oViewModel.getProperty("/extra");

            table.getSelectedItems()
                .map(item => oDtlData.indexOf(item.getBindingContext("viewModel").getObject()))
                .reverse().forEach(function (idx) {
                    // console.log("idx=", idx);
                    if (oDtlData[idx]["row_state"] == "C") {
                        oDtlData.splice(idx, 1);
                    } else {
                        oDtlData[idx]["row_state"] = "D";
                    }
                });

            // console.log("oDtlData=", oDtlData);
            oViewModel.setProperty("/extra", oDtlData);
            this.byId("extraTable").removeSelections(true);
        },

        // setProperty: function (sPath, oValue, oContext, bAsyncUpdate) {

        //     console.log("setProperty call");
        //     // if (!!oContext) {
        //     //     var _oRecord = this.getObject(oContext.getPath());
        //     //     if (typeof _oRecord == "object" && !_oRecord[STATE_COL]) _oRecord[STATE_COL] = "U";
        //     // }
        //     JSONModel.prototype.setProperty.call(sPath, oValue, oContext, bAsyncUpdate);
        // },

        setExtraClass: function (oEvent) {

            // console.log("11111111=");

            var oViewModel = this.getModel("viewModel");
            var sPath = oEvent.getSource().getBindingInfo('selectedKey').binding.getContext().getPath();
            var index = sPath.substr(sPath.length - 1);

            // console.log("index=", index);

            var params = oEvent.getParameters();
            var itemFilters = [];

            var selectedKey = oEvent.getParameters().selectedItem.mProperties.key;
            var selectedValue = oEvent.getParameters().selectedItem.mProperties.text;
            // console.log("selectedValue=", selectedValue);
            // selectedKey = selectedKey.split(":")[0];

            if (selectedKey) {
                itemFilters.push(new Filter({
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                        new Filter("company_code", FilterOperator.EQ, 'LGCKR'),
                        new Filter("extra_class_number", FilterOperator.EQ, selectedKey),
                        new Filter("use_flag", FilterOperator.EQ, true)
                    ],
                    and: true
                }));
            } else {
                itemFilters.push(
                    new Filter("tenant_id", FilterOperator.EQ, 'L2100'),
                    new Filter("company_code", FilterOperator.EQ, 'LGCKR'),
                    new Filter("use_flag", FilterOperator.EQ, true)
                );
            }

            var filter = new Filter({
                filters: itemFilters,
                and: false
            });

            var sorter = [new Sorter("extra_name", false)];

            var bindInfo = {
                path: '/UcExtraItem',
                filters: filter,
                sorters: sorter,
                template: new Item({
                    key: "{extra_number}", text: "{extra_name}"
                })
            };

            oEvent.getSource().getParent().getParent().getCells()[2].mAggregations.items[0].bindItems(bindInfo);

            //extra_class_name 값 할당
            oEvent.getSource().getParent().getParent().getCells()[1].mAggregations.items[1].setText(selectedValue);
            //extra_name 초기화
            oEvent.getSource().getParent().getParent().getCells()[2].mAggregations.items[0].setSelectedKey("");

        },

        setExtra: function (oEvent) {

            var oView = this.getView(),
                oRootModel = this.getModel();

            var selectedClassKey = oEvent.getSource().getParent().getParent().getCells()[1].mAggregations.items[0].getSelectedKey();
            var selectedKey = oEvent.getParameters().selectedItem.mProperties.key;

            //할증마스터에서 검색
            var filter = [];
            filter.push(new Filter("tenant_id", FilterOperator.EQ, this._tenantId));
            filter.push(new Filter("company_code", FilterOperator.EQ, this._companyCode));
            filter.push(new Filter("extra_class_number", FilterOperator.EQ, selectedClassKey));
            filter.push(new Filter("extra_number", FilterOperator.EQ, selectedKey));

            var extraRateItem = oEvent.getSource().getParent().getParent().getCells()[3].mAggregations.items[0];
            var extraDescItem = oEvent.getSource().getParent().getParent().getCells()[4].mAggregations.items[0];

            oView.setBusy(true);
            oRootModel.read("/UcExtraItem", {
                filters: filter,
                success: function (extraData) {
                    oView.setBusy(false);
                    // console.log("extra_rate====", extraData.results[0].extra_rate);
                    // console.log("extra_desc====", extraData.results[0].extra_desc);
                    // console.log("oEvent.getSource()====", oEvent.getSource());

                    // oEvent.getSource().getParent().getParent().getCells()[3].mAggregations.items[0].setValue(extraData.results[0].extra_rate);
                    // oEvent.getSource().getParent().getParent().getCells()[4].mAggregations.items[0].setValue(extraData.results[0].extra_desc);
                    extraRateItem.setValue(extraData.results[0].extra_rate);
                    extraDescItem.setValue(extraData.results[0].extra_desc)

                    var updateEnableFlag = (extraData.results[0].update_enable_flag ? true : false);
                    // console.log("updateEnableFlag====", updateEnableFlag);
                    // oEvent.getSource().getParent().getParent().getCells()[3].mAggregations.items[0].setEnabled(updateEnableFlag);
                    // oEvent.getSource().getParent().getParent().getCells()[4].mAggregations.items[0].setEnabled(updateEnableFlag);
                    extraRateItem.setEnabled(updateEnableFlag);
                    extraDescItem.setEnabled(updateEnableFlag)

                },
                error: function (data) {
                    console.log("error", data);
                }
            });

            //할증명 담기(콤보선택시 키값만 할당되고 할증명은 할당안되서~~~)
            var selectedValue = oEvent.getParameters().selectedItem.mProperties.text;
            // console.log("selectedValue=", selectedValue);
            oEvent.getSource().getParent().getParent().getCells()[2].mAggregations.items[1].setText(selectedValue);
        },

        setItemClass: function (oEvent) {
            var selectedValue = oEvent.getParameters().selectedItem.mProperties.text;
            // console.log("selectedValue=", selectedValue);
            this.byId("saveMstItemClassName").setValue(selectedValue);
        },

        onSupplierCellClick: function (oEvent) {

            // console.log("!111111");

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
                oViewModelOrg = this.getModel("viewModelOrg"),
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
                mstModel["contract_write_date"] = toDate;
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

                var filter = [];
                filter.push(new Filter("tenant_id", FilterOperator.EQ, this._tenantId));
                filter.push(new Filter("company_code", FilterOperator.EQ, this._companyCode));
                filter.push(new Filter("net_price_contract_document_no", FilterOperator.EQ, this._netPriceContractDocumentNo));
                filter.push(new Filter("net_price_contract_degree", FilterOperator.EQ, this._netPriceContractDegree));

                oView.setBusy(false);

                var mstDataLoading = new Promise(function (resolve, reject) {
                    oRootModel.read("/UcApprovalMstDetailView", {
                        filters: filter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (data) {
                            reject(data);
                        }
                    });
                });

                var supplierDataLoading = new Promise(function (resolve, reject) {
                    oRootModel.read("/UcApprovalSupplierDetailView", {
                        filters: filter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (data) {
                            reject(data);
                        }
                    });
                });

                var dtlDataLoading = new Promise(function (resolve, reject) {
                    oRootModel.read("/UcApprovalDtlDetailView", {
                        filters: filter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (data) {
                            reject(data);
                        }
                    });
                });

                var extraDataLoading = new Promise(function (resolve, reject) {
                    oRootModel.read("/UcApprovalExtraDetailView", {
                        filters: filter,
                        success: function (oData) {
                            resolve(oData);
                        },
                        error: function (data) {
                            reject(data);
                        }
                    });
                });

                //Promise실행
                mstDataLoading.then(function (mstData) {

                    var contractStartDate = mstData.results[0]["net_price_contract_start_date"];
                    var contractEndDate = mstData.results[0]["net_price_contract_end_date"];
                    var contractWriteDate = mstData.results[0]["contract_write_date"];
                    // console.log("contractStartDate====", contractStartDate);
                    // console.log("contractEndDate====", contractEndDate);
                    var convertContractStartDate = that.convertDateToString(contractStartDate);
                    var convertContractEndDate = that.convertDateToString(contractEndDate);
                    var convertContractWriteDate = that.convertDateToString(contractWriteDate);

                    mstData.results[0]["net_price_contract_start_date"] = convertContractStartDate;
                    mstData.results[0]["net_price_contract_end_date"] = convertContractEndDate;
                    mstData.results[0]["contract_write_date"] = convertContractWriteDate;
                    mstData.results[0]["row_state"] = "U";

                    console.log("mstData====", mstData.results[0]);
                    oViewModel.setProperty("/mst", mstData.results[0]);
                    oViewModelOrg.setProperty("/mstOrg", mstData.results[0]);

                    supplierDataLoading.then(function (supplierData) {

                        console.log("supplierData====", supplierData);
                        supplierData.results.map(d => {
                            d["row_state"] = "";
                            return d;
                        });
                        oViewModel.setProperty("/supplier", supplierData.results);
                        oViewModelOrg.setProperty("/supplierOrg", supplierData.results);

                        dtlDataLoading.then(function (dtlData) {

                            console.log("dtlData====", dtlData);
                            dtlData.results.map(d => {
                                d["material_apply_flag"] = (d["material_apply_flag"] ? 'Y' : 'N');
                                d["labor_apply_flag"] = (d["labor_apply_flag"] ? 'Y' : 'N');
                                d["row_state"] = "";
                                return d;
                            });
                            oViewModel.setProperty("/dtl", dtlData.results);
                            oViewModelOrg.setProperty("/dtlOrg", dtlData.results);

                            extraDataLoading.then(function (extraData) {

                                // console.log("extraData====", extraData);
                                extraData.results.map(d => {
                                    d["row_state"] = "";
                                    return d;
                                });
                                oViewModel.setProperty("/extra", extraData.results);
                                oViewModelOrg.setProperty("/extraOrg", extraData.results);

                                oViewModel.getProperty("/extra").forEach(function (d, idx) {

                                    // console.log("idx=", idx);

                                    var bindInfo = {
                                        path: '/UcExtraItem',
                                        filters: [
                                            new Filter("tenant_id", FilterOperator.EQ, that._tenantId),
                                            new Filter("company_code", FilterOperator.EQ, that._companyCode),
                                            new Filter("extra_class_number", FilterOperator.EQ, d["extra_class_number"]),
                                            new Filter("use_flag", FilterOperator.EQ, true)
                                        ],
                                        sorters: [new Sorter("extra_number", false)],
                                        template: new Item({
                                            key: "{extra_number}", text: "{extra_name}"
                                        })
                                    };
                                    that.byId("extraTable").getItems()[idx].getCells()[2].getItems()[0].bindItems(bindInfo);

                                });

                                console.log("extraData====", oViewModel.getProperty("/extra"));
                                oView.setBusy(false);
                                that._toShowMode();

                            }, function (data) {
                                console.log("extraError====", data);
                            });

                        }, function (data) {
                            console.log("dtlError====", data);
                        });

                    }, function (data) {
                        console.log("supplierError====", data);
                    });

                }, function (data) {
                    console.log("mstError====", data);
                });

            }
        },

        convertDateToString: function (pDate) {

            if (!pDate) return null;

            var date = new Date(pDate);
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            var dateString = year + "-" + month + "-" + day;

            var dateString = year + "-" + month + "-" + day;
            return dateString;

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

            this.byId("supplierTableAddButton").setVisible(true);
            this.byId("supplierTableDeleteButton").setVisible(true);
            this.byId("dtlTableAddButton").setVisible(true);
            this.byId("dtlTableDeleteButton").setVisible(true);
            this.byId("extraTableAddButton").setVisible(true);
            this.byId("extraTableDeleteButton").setVisible(true);

            // console.log("####################isEditMode", this.getModel("viewSet").getProperty("/isEditMode"));

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

            this.byId("supplierTableAddButton").setVisible(false);
            this.byId("supplierTableDeleteButton").setVisible(false);
            this.byId("dtlTableAddButton").setVisible(false);
            this.byId("dtlTableDeleteButton").setVisible(false);
            this.byId("extraTableAddButton").setVisible(false);
            this.byId("extraTableDeleteButton").setVisible(false);

            // console.log("####################isEditMode", this.getModel("viewSet").getProperty("/isEditMode"));
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
            if (!this._oFragments[sFragmentName] || !this._oFragments[sFragmentName].getParent()) {
                if (this._oFragments[sFragmentName]) this._oFragments[sFragmentName].destroy();
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

        // openPlantPopup: function () {
        //     if (!this.oCmDialogHelp) {
        //         this.oCmDialogHelp = new CmDialogHelp({
        //             title: "{I18N>/PLANT_NAME}",
        //             keyFieldLabel: "{I18N>/PLANT_CODE}",
        //             textFieldLabel: "{I18N>/PLANT_NAME}",
        //             keyField: "plant_code",
        //             textField: "plant_name",
        //             items: {
        //                 sorters: [
        //                     new Sorter("plant_name", false)
        //                 ],
        //                 serviceName: "cm.util.OrgService",
        //                 entityName: "Plant"
        //             }
        //         });
        //         this.oCmDialogHelp.attachEvent("apply", function (oEvent) {
        //             this.byId("savePlantCode").setValue(oEvent.getParameter("item").plant_code);
        //             this.byId("savePlantName").setValue(oEvent.getParameter("item").plant_name);
        //         }.bind(this));
        //     }
        //     this.oCmDialogHelp.open();
        // },

        openPlantPopup: function (oEvent) {

            // var oViewModel = this.getModel("viewModel");
            var that = this;

            this.oPlantDialog = new PlantDialog({
                items: {
                    filters: [
                        new Filter("tenant_id", FilterOperator.EQ, that._tenantId),
                        new Filter("company_code", FilterOperator.EQ, that._companyCode)
                    ],
                    sorters: [
                        new Sorter("plant_name")
                    ]
                }
            });

            this.oPlantDialog.open();

            this.oPlantDialog.attachEvent("apply", function (oEvent) {

                console.log("plant_code ::: ", oEvent.getParameter("item").plant_code);
                console.log("plant_name ::: ", oEvent.getParameter("item").plant_name);
                that.byId("savePlantCode").setValue(oEvent.getParameter("item").plant_code);
                that.byId("savePlantName").setValue(oEvent.getParameter("item").plant_name);

            }.bind(this));

        },

        openSupplierPopupInTable: function (oEvent) {

            // var oViewModel = this.getModel("viewModel");
            // console.log("sPath=", oEvent.getSource().oPropagatedProperties.getModel("viewModel"));
            // var sPath = oEvent.getSource().getBindingContextPath();
            var sPath = oEvent.getSource().getBindingInfo('value').binding.getContext().getPath();
            var index = sPath.substr(sPath.length - 1);

            // console.log(" index obj ----------------->", index);
            this.openSupplierPopupInTable["row"] = index;

            this.byId("supplierWithOrgDialog").open();

        },

        onSupplierDialogApplyPress: function (oEvent) {

            var oViewModel = this.getModel("viewModel");

            // console.log("onSupplierDialogApplyPress----------------->");

            // var oDetailsModel = this.getModel("details");
            var rowIndex = this.openSupplierPopupInTable["row"];
            // console.log("row ::: ", this.openSupplierPopupInTable["row"]);

            // console.log("supplier_code ::: ", oEvent.getParameter("item").supplier_code);
            // console.log("supplier_local_name ::: ", oEvent.getParameter("item").supplier_local_name);

            oViewModel.setProperty("/supplier/" + rowIndex + "/supplier_name", oEvent.getParameter("item").supplier_local_name);
            oViewModel.setProperty("/supplier/" + rowIndex + "/supplier_code", oEvent.getParameter("item").supplier_code);

            if (!oViewModel.getProperty("/supplier/" + rowIndex + "/row_state")) {
                oViewModel.setProperty("/supplier/" + rowIndex + "/row_state", "U");
            }

        },

        openItemPopupInTable: function (oEvent) {

            var oViewModel = this.getModel("viewModel");

            this.oItemDialog = new UcItemDialog({
                multiSelection: false,
                loadWhenOpen: false,
                largeEpItem: oViewModel.getProperty("/mst/ep_item_class_code")
            });

            this.oItemDialog.open();

            var sPath = oEvent.getSource().getBindingInfo('value').binding.getContext().getPath();
            var index = sPath.substr(sPath.length - 1);

            var materialNetPriceInput = oEvent.getSource().getParent().getParent().getCells()[9].mAggregations.items[0];
            var laborNetPriceInput = oEvent.getSource().getParent().getParent().getCells()[10].mAggregations.items[0];

            // console.log("sPath=", sPath);
            // console.log("index=", index);

            this.oItemDialog.attachEvent("apply", function (oEvent) {
                // this.byId("savePlantCode").setValue(oEvent.getParameter("item").bizdivision_code);
                // this.byId("savePlantName").setValue(oEvent.getParameter("item").bizdivision_name);

                // console.log("ep_item_code ::: ", oEvent.getParameter("item").ep_item_code);
                // console.log("ep_item_name ::: ", oEvent.getParameter("item").ep_item_name);
                // console.log("ep_item_name ::: ", oEvent.getParameter("item").ep_item_name);
                // console.log("ep_item_name ::: ", oEvent.getParameter("item").ep_item_name);

                oViewModel.setProperty("/dtl/" + index + "/ep_item_code", oEvent.getParameter("item").ep_item_code);
                oViewModel.setProperty("/dtl/" + index + "/ep_item_name", oEvent.getParameter("item").ep_item_name);
                oViewModel.setProperty("/dtl/" + index + "/spec_desc", oEvent.getParameter("item").spec_desc);
                oViewModel.setProperty("/dtl/" + index + "/unit", oEvent.getParameter("item").unit);
                oViewModel.setProperty("/dtl/" + index + "/material_apply_flag", oEvent.getParameter("item").material_apply_yn);
                oViewModel.setProperty("/dtl/" + index + "/labor_apply_flag", oEvent.getParameter("item").labor_apply_yn);
                oViewModel.setProperty("/dtl/" + index + "/net_price_change_allow_flag", oEvent.getParameter("item").net_price_change_allow_flag);
                // var changeAllowFlag = (oEvent.getParameter("item").net_price_change_allow_flag ? true : false);

                // materialNetPriceInput.setEnabled(changeAllowFlag);
                // laborNetPriceInput.setEnabled(changeAllowFlag);

                console.log("material_apply_yn==", oEvent.getParameter("item").material_apply_yn);
                console.log("labor_apply_yn==", oEvent.getParameter("item").labor_apply_yn);
                console.log("openItemPopupInTable Model==", oViewModel.getProperty("/dtl/" + index));
                // console.log("changeAllowFlag==", changeAllowFlag);

                if (!oViewModel.getProperty("/dtl/" + index + "/row_state")) {
                    oViewModel.setProperty("/dtl/" + index + "/row_state", "U");
                }

            }.bind(this));

        }

    });
});