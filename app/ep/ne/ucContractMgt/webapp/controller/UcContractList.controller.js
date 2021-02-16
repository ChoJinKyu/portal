sap.ui.define([
    "ext/lib/controller/BaseController",
    "ext/lib/util/Validator",
    "sap/ui/model/json/JSONModel",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/table/TablePersoController",
    "./UcContractListPersoService",
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
    "sap/m/VBox",
    "cm/util/control/ui/CmDialogHelp",
    "sp/util/control/ui/SupplierDialog",
    "ep/util/controller/EpBaseController"
    // "ep/util/model/ViewModel"
], function (BaseController, Validator, JSONModel, DateFormatter, TablePersoController, UcContractListPersoService, Fragment, NumberFormatter, Sorter,
    Filter, FilterOperator, MessageBox, MessageToast, Dialog, DialogType, Button, ButtonType, Text, Label, Input, VBox,
    CmDialogHelp, SupplierDialog, EpBaseController) {
    "use strict";

    return BaseController.extend("ep.ne.ucContractMgt.controller.UcContractList", {

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

            // this.setModel(new ViewModel(), "viewModel");

            // JSONModel.prototype.setProperty =  function(sPath, oValue, oContext, bAsyncUpdate) {
            //     console.log("##ViewModel setProperty Call##");
            // }

            this.getRouter().getRoute("mainPage").attachPatternMatched(this._onRoutedThisPage, this);

            this._oTPC = new TablePersoController({
                customDataKey: "ucContractMgt",
                persoService: UcContractListPersoService
            }).setTable(this.byId("mainTable"));

            this.enableMessagePopover();

            //console.log("aaaaaaaaaaaa==", epBaseController.test1());

            var today = new Date();
            this.getView().byId("searchEndDate").setDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
            this.getView().byId("searchEndDate").setSecondDateValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365));

        },

        onStatusColor: function (statusColor) {
            if(!statusColor) return 1;
            return parseInt(statusColor);
        },

        // onRenderedFirst: function () {
        //     console.log("onRenderedFirst========");
        //     this.byId("pageSearchButton").firePress();
        // },

        onAfterRendering: function () {
            // var oSegmentedButton = this.getView().byId("searchStatusCode");
            // oSegmentedButton.addItem(new sap.m.SegmentedButtonItem({
            //     text: "All",
            //     key: "All",
            //     width: "4rem"
            // }));
            //console.log("oSegmentedButton==", oSegmentedButton.getItems());
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
            UcContractListPersoService.resetPersData();
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

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

		/**
		 * When it routed to this page from the other page.
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
        _onRoutedThisPage: function () {
            //this.getModel("mainListViewModel").setProperty("/headerExpanded", true);
            this.byId("pageSearchButton").firePress();
        },

        /**
     * Event handler when a table add button pressed
     * @param {sap.ui.base.Event} oEvent
     * @public
     */
        onAddButtonPress: function () {
            this.getRouter().navTo("detailPage", {
                netPriceContractDocumentNo: "new",
                netPriceContractDegree: "new"
            });
        },

        onTableItemPress: function (oEvent) {

            // console.log("oEvent.getSource=", oEvent.getSource());

            var oViewModel = this.getModel('viewModel');
            var sPath = "";

            var bindingContext = oEvent.getParameters().rowBindingContext;
            if (bindingContext) {
                sPath = oEvent.getParameters().rowBindingContext.getPath();
            } else {
                sPath = oEvent.getParameters()["row"].getBindingContext("viewModel").getPath()
            }
            // console.log("sPath=", sPath);
            var oRecord = oViewModel.getProperty(sPath);
            // console.log("oRecord=", oRecord);

            this.getRouter().navTo("detailPage", {
                netPriceContractDocumentNo: oRecord.net_price_contract_document_no,
                netPriceContractDegree: oRecord.net_price_contract_degree,
            }, true);
        },

		/**
		 * Event handler for saving page changes
		 * @public
		 */
        onSaveContractEnd: function () {

            var oView = this.getView(),
                that = this;

            var contractEndModel = this.getModel("viewModel").getProperty("/contractEnd");

            contractEndModel["inputData"].map(d => {
                d["delete_reason"] = oView.byId("saveDeleteReason").getValue();
                return d;
            });

            //JsonModel이 변경되었는지 체크로직 구현
            // if(loiRfqModel.getChanges().length === 0) {
            // 	MessageToast.show(this.getModel("I18N").getText("/NCM0002"));
            // 	return;
            // }

            if (this.validator.validate(this.byId("dialogContractEnd")) !== true) return;

            var url = "ep/ne/ucContractMgt/webapp/srv-api/odata/v4/ep.UcContractMgtV4Service/NetContractEndProc";

            MessageBox.confirm(this.getModel("I18N").getText("/NCM00001"), {
                title: this.getModel("I18N").getText("/SAVE"),
                initialFocus: sap.m.MessageBox.Action.CANCEL,
                onClose: function (sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        oView.setBusy(true);
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: JSON.stringify(contractEndModel),
                            contentType: "application/json",
                            success: function (data) {
                                console.log("#########Success#####", data.value);
                                MessageToast.show(that.getModel("I18N").getText("/NCM01001"));
                                that.validator.clearValueState(that.byId("dialogContractEnd"));
                                that.onExitContractEnd();
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

        onContractModifydButtonPress: function () {
            MessageToast.show("계약변경은 추후 개발예정입니다.");
        },

        /**
         * @description employee 팝업 닫기 
         */
        onExitContractEnd: function () {
            this.byId("dialogContractEnd").close();
        },

		/**
		 * Event handler when pressed the item of table
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
        onContractEndButtonPress: function () {

            var canSelect = true;

            var oTable = this.byId("mainTable"),
                oViewModel = this.getModel("viewModel"),
                oViewData = oViewModel.getProperty("/list"),
                oSelected = oTable.getSelectedIndices();

            // console.log("oViewData=", oViewData);

            var loiNumberArr = [];

            if (oSelected.length > 0) {
                oSelected.some(function (chkIdx, index) {

                    /*
                        향후 견적테이블이 생성되면 1번로직 주석 2번 로직 주석해제
                    */
                    console.log("net_price_contract_document_no========", oViewData[chkIdx].net_price_contract_document_no);
                    console.log("net_price_contract_degree========", oViewData[chkIdx].net_price_contract_degree);
                    console.log("net_price_contract_chg_type_cd========", oViewData[chkIdx].net_price_contract_chg_type_cd);

                    if (oViewData[chkIdx].net_price_contract_chg_type_cd == "D") {
                        MessageToast.show("계약종료건이 있습니다.");
                        canSelect = false;
                        return true;
                    }

                });
            } else {
                canSelect = false;
                MessageToast.show("한개이상 선택해주세요.");
            }

            // console.log("canSelect=", canSelect);
            if (canSelect) {

                var deleteReason = "";

                var input = {};
                var saveContractEnd = [];

                if (oSelected.length > 0) {
                    oSelected.forEach(function (chkIdx) {
                        var tenantId = oViewData[chkIdx].tenant_id;
                        var companyCode = oViewData[chkIdx].company_code;
                        var netPriceContractDocumentNo = oViewData[chkIdx].net_price_contract_document_no;
                        var netPriceContractDegree = oViewData[chkIdx].net_price_contract_degree;
                        deleteReason = oViewData[chkIdx].delete_reason;


                        // console.log("####tenant_id====", tenantId);
                        // console.log("####company_code====", companyCode);
                        // console.log("####netPriceContractDocumentNo====", netPriceContractDocumentNo);
                        // console.log("####netPriceContractDegree====", netPriceContractDegree);
                        // console.log("####deleteReason====", deleteReason);

                        var inputData = {
                            "tenant_id": tenantId,
                            "company_code": companyCode,
                            "net_price_contract_document_no": netPriceContractDocumentNo,
                            "net_price_contract_degree": parseInt(netPriceContractDegree),
                            "delete_reason": ""
                        }

                        saveContractEnd.push(inputData);

                    });
                }
                // console.log("####saveContractEnd====", saveContractEnd);

                input.inputData = saveContractEnd;
                oViewModel.setProperty("/contractEnd", input);
                // console.log("####contractEnd====", oViewModel.getProperty("/contractEnd"));

                var oView = this.getView();
                if (!this._contractEndDialog) {
                    this._contractEndDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ep.ne.ucContractMgt.view.ContractEnd",
                        controller: this
                    }).then(function (contractEndDialog) {
                        oView.addDependent(contractEndDialog);
                        return contractEndDialog;
                    }.bind(this));
                }

                this._contractEndDialog.then(function (contractEndDialog) {
                    contractEndDialog.open();
                    oView.byId("saveDeleteReason").setValue(deleteReason);
                    // console.log("#saveDeleteReason=", oView.byId("saveDeleteReason").getValue());
                });

            }
        },

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aSearchFilters An array of filters for the search
		 * @private
		 */
        _applySearch: function (aSearchFilters, aSorter) {
            var oView = this.getView(),
                oRootModel = this.getModel(),
                oViewModel = this.getModel("viewModel");
            // console.log("Search Start========");
            // console.log("aSearchFilters========", aSearchFilters);
            // console.log("aSorter========", aSorter);
            oView.setBusy(true);
            oRootModel.read("/UcApprovalMstView", {
                filters: aSearchFilters,
                sorters: aSorter,
                success: function (oData) {
                    console.log("oData111====", oData);
                    //oView.getModel("list").setData(oData.results);
                    oViewModel.setProperty("/list", oData.results);
                    // console.log("list====333", oViewModel.getProperty("/list"));
                    //oView.getModel("list").updateBindings(true);
                    oView.setBusy(false);
                }.bind(this),
                error: function (data) {
                    console.log("error", data);
                }
            });

        },

        _getSearchStates: function () {

            var searchOrgCode = this.byId("searchOrgCode").getValue();

            var found1 = searchOrgCode.match(/\((.*?)\)/);
            if (found1) {
                searchOrgCode = found1[1];
            }

            var searchTitle = this.byId("searchTitle").getValue();

            var endDateFromDate = this.byId("searchEndDate").getValue().substring(0, 10).replaceAll(" ", ""),
                endDateToDate = this.byId("searchEndDate").getValue().substring(13).replaceAll(" ", "");

            var documentNoTokens = this.getView().byId("searchDocumentNo").getTokens();
            var searchDocumentNo = documentNoTokens.map(function (oToken) {
                return oToken.getKey();
            });

            var searchStatusCode = this.getView().byId("searchStatusCode").getSelectedKey();
            var searchEffectiveStatus = this.getView().byId("searchEffectiveStatus").getSelectedKey();
            //Slider처리 추가
            var searchDayCount = this.getView().byId("searchDayCount").getValue();
            var searchSupplierName = this.byId("searchSupplierName").getValue();

            var found2 = searchSupplierName.match(/\((.*?)\)/);
            if (found2) {
                searchSupplierName = found2[1];
            }

            // console.log("searchOrgCode==", searchOrgCode);
            // console.log("searchTitle==", searchTitle);
            // console.log("endDateFromDate==", endDateFromDate);
            // console.log("endDateToDate==", endDateToDate);
            // console.log("searchDocumentNo==", searchDocumentNo);
            // console.log("searchStatusCode==", searchStatusCode);
            // console.log("searchEffectiveStatus==", searchEffectiveStatus);
            // console.log("searchDayCount==", searchDayCount);
            // console.log("searchSupplierName==", searchSupplierName);

            var aSearchFilters = [];
            if (searchOrgCode) {
                aSearchFilters.push(new Filter("org_code", FilterOperator.EQ, searchOrgCode));
            }
            if (searchTitle) {
                aSearchFilters.push(new Filter("net_price_contract_title", FilterOperator.Contains, searchTitle));
            }
            if (endDateFromDate && endDateToDate) {
                aSearchFilters.push(new Filter("net_price_contract_end_date", FilterOperator.BT, endDateFromDate, endDateToDate));
            }
            if (searchDocumentNo.length > 0) {
                var _tempFilters = [];

                searchDocumentNo.forEach(function (item, idx, arr) {
                    _tempFilters.push(new Filter("net_price_contract_document_no", FilterOperator.EQ, item));
                });

                aSearchFilters.push(
                    new Filter({
                        filters: _tempFilters,
                        and: false
                    })
                );
            }
            if (searchStatusCode && searchStatusCode != "all") {
                aSearchFilters.push(new Filter("net_price_contract_status_code", FilterOperator.EQ, searchStatusCode));
            }
            if (searchEffectiveStatus && searchEffectiveStatus != "all") {
                aSearchFilters.push(new Filter("effective_status_code", FilterOperator.EQ, searchEffectiveStatus));
            }
            if (searchDayCount > 0) {
                //aSearchFilters.push(new Filter("net_price_contract_day_count", FilterOperator.LE, searchDayCount));
                aSearchFilters.push(new Filter({
                    filters: [
                        new Filter("net_price_contract_day_count", FilterOperator.GT, 0),
                        new Filter("net_price_contract_day_count", FilterOperator.LE, searchDayCount)
                    ],
                    and: true
                }));
            }
            if (searchSupplierName) {
                aSearchFilters.push(new Filter("supplier_code", FilterOperator.Contains, searchSupplierName));
            }
            // console.log("aSearchFilters==", aSearchFilters);
            return aSearchFilters;
        },

        _getSorter: function () {
            var aSorter = [];
            aSorter.push(new Sorter("system_create_dtm", true));
            return aSorter;
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
                    // console.log("1111==", oEvent.getParameter("item"));
                    this.byId("searchOrgCode").setValue("(" + oEvent.getParameter("item").bizdivision_code + ")" + oEvent.getParameter("item").bizdivision_name);
                }.bind(this));
            }
            this.oCmDialogHelp.open();
        },

        openSupplierPopup: function () {

            if (!this.oCodeSelectionValueHelp) {
                this.oCodeSelectionValueHelp = new SupplierDialog({
                    multiSelection: false
                });

                this.oCodeSelectionValueHelp.attachEvent("apply", function (oEvent) {
                    this.byId("searchSupplierName").setValue("(" + oEvent.getParameter("item").supplier_code + ")" + oEvent.getParameter("item").supplier_local_name);
                }.bind(this));
            }
            this.oCodeSelectionValueHelp.open();
        }

    });
});