sap.ui.define([
    "./App.controller",
    //"ext/lib/util/SppUserSessionUtil",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/Item",
    "sap/m/Token",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "ext/cm/util/control/ui/EmployeeDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/pg/util/control/ui/SupplierDialog",
    "ext/lib/util/Validator"
],
    function (
        BaseController, 
        //SppUserSessionUtil,
        JSONModel, 
        Filter, 
        FilterOperator, 
        Fragment, 
        MessageBox, 
        Item,
        Token,
        HashChanger, 
        Component, 
        ComponentContainer,
        DateFormatter, 
        NumberFormatter, 
        EmployeeDialog, 
        MaterialMasterDialog, 
        ManagedModel, 
        ManagedListModel,
        SupplierDialog,
        Validator
    ) {
        "use strict";
        var that;
        return BaseController.extend("sp.np.netPriceMgt.controller.NetPriceMgtList", {
            DateFormatter: DateFormatter,
            numberFormatter: NumberFormatter,
            validator: new Validator(),

            onInit: function () {
                that = this;
                this.setModel(new ManagedListModel(), "list");
                this.setModel(new JSONModel(), "detailModel");
                //this.getRouter().getRoute("NetPriceMgtList").attachPatternMatched(this._onRoutedThisPage, this);
            },

            _onRoutedThisPage: function() {
                this.fnSearch();
            },

            /**
             * Search 버튼 클릭(Filter 추출)
             */
            fnSearch: function () {

                this.validator.validate(this.byId('pageSearchFormE'));
                if (this.validator.validate(this.byId('pageSearchFormS')) !== true) return;
                
                this.sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";
                var oView = this.getView(),
                    oModel = this.getModel("list");
                    oView.setBusy(true);
                    
                var oFilter = [];
                var aFilter = [];
                var operationOrg = [];
                var status;

                if (this.sSurffix === "E") {
                    operationOrg = that.byId("search_operation_org_e").getSelectedKeys();
                    status = that.byId("status_e").getSelectedKey();
                }

                if (this.sSurffix === "S") {
                    operationOrg = that.byId("search_operation_org_s").getSelectedKeys();
                    status = that.byId("status_s").getSelectedKey();
                }

                if (operationOrg.length > 0) {
                    // for (var i = 0; i < operationOrg.length; i++) {
                    //     aFilter.push(new Filter("org_codes", FilterOperator.Contains, operationOrg[0]));
                    // }
                    aFilter.push(new Filter("org_codes", FilterOperator.Contains, operationOrg[0]));
                    oFilter.push(new Filter(aFilter, false));
                }

                if (!!status) {
                    oFilter.push(new Filter("approve_status_code", FilterOperator.EQ, status));
                }

                var approvalNo = that.byId("search_approval_no").getValue();
                if (!!approvalNo) {
                    oFilter.push(new Filter("approval_number", FilterOperator.EQ, approvalNo));
                }
                
                var title = that.byId("search_title").getValue();
                if (!!title) {
                    oFilter.push(new Filter("approval_title", FilterOperator.Contains, title));
                }

                oModel.setTransactionModel(this.getModel());
                oModel.read("/NpApprovalListView", {
                    filters: oFilter,
                    success: function (oData) {
                        oView.setBusy(false);
                    }
                });
            },

            operationOrgChg: function(oEvent) {
                var params = oEvent.getParameters();
                //console.log("getSelectedKey: " + params.getSelectedKey());
                this.byId("operation_org_s").setSelectedKey(params.selectedItem.getKey());
                this.byId("operation_org_e").setSelectedKey(params.selectedItem.getKey());
            },

            statusChg: function(oEvent) {
                var params = oEvent.getParameters();
                //console.log("getSelectedKey: " + params.getSelectedKey());
                this.byId("status_s").setSelectedKey(params.selectedItem.getKey());
                this.byId("status_e").setSelectedKey(params.selectedItem.getKey());
            },

            /**
             * status code에 따라 상태를 나타내는 색 세팅
             */
            onStatusColor: function (sStautsCodeParam) {
                var sReturnValue;
                
                // AP:결재완료, AR:결재요청, DR:임시저장, IA:결재중, RJ:반려
                if (sStautsCodeParam === "AP") {
                    sReturnValue = 8;
                } else if (sStautsCodeParam === "AR") {
                    sReturnValue = 3;
                } else if (sStautsCodeParam === "DR") {
                    sReturnValue = 5;
                } else if (sStautsCodeParam === "IA") {
                    sReturnValue = 9;
                } else if (sStautsCodeParam === "RJ") {
                    sReturnValue = 1;
                }
                
                //console.log("sStautsCodeParam:" + sStautsCodeParam + "    sStautsCodeParam:"+ sReturnValue);
                return sReturnValue;
            },

            copyMultiSelected: function (oEvent, flag) {
                var source = oEvent.getSource();
                var params = oEvent.getParameters();
            
                var selectedKeys = [];
                params.selectedItems.forEach(function (item, idx, arr) {
                    selectedKeys.push(item.getKey());
                });

                if (flag === "company") {
                    this.getView().byId("search_company_e").setSelectedKeys(selectedKeys);
                    this.getView().byId("search_company_s").setSelectedKeys(selectedKeys);
                }
                if (flag === "org") {
                    this.getView().byId("search_operation_org_e").setSelectedKeys(selectedKeys);
                    this.getView().byId("search_operation_org_s").setSelectedKeys(selectedKeys);
                }
            },

            handleSelectionFinishOrg: function(oEvent) {
                this.copyMultiSelected(oEvent, "org");
            },

            handleSelectionFinishComp: function (oEvent) {

                this.copyMultiSelected(oEvent, "company");

                var params = oEvent.getParameters();
                var plantFilters = [];

                if (params.selectedItems.length > 0) {
                    params.selectedItems.forEach(function (item, idx, arr) {
                        //console.log(item.getKey());
                        plantFilters.push(new Filter({
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100"),
                                new Filter("company_code", FilterOperator.EQ, item.getKey())
                            ],
                            and: true
                        }));
                    });
                } else {
                    plantFilters.push(
                        new Filter("tenant_id", FilterOperator.EQ, "L2100")
                    );
                }

                var filter = new Filter({
                    filters: plantFilters,
                    and: false
                });

                var bindInfo = {
                    path: 'purOrg>/Pur_Operation_Org',
                    filters: filter,
                    template: new Item({
                        key: "{purOrg>org_code}", text: "[{purOrg>org_code}] {purOrg>org_name}"
                    })
                };

                this.getView().byId("search_operation_org_s").bindItems(bindInfo);
                this.getView().byId("search_operation_org_e").bindItems(bindInfo);
            },

            /**
             * 상세 페이지로 이동(basePriceArlMst에 있는 Detail화면으로 이동)
             */
            fnDetail: function (oEvent) {
                var oList = this.getModel("list");
                var oBindingContext = oEvent.getParameter("rowBindingContext");
                var sPath = oBindingContext.getPath();
                var oSelectedData = oList.getProperty(sPath);
                var oRootModel = this.getModel("rootModel");
                oRootModel.setProperty("/selectedData", oSelectedData);

                if (oBindingContext) {
                    this.getRouter().navTo("NetPriceMgtDetail", {
                        "pMode" : "R",
                        "pAppNum":  oSelectedData.approval_number
                    });
                }
            },

            /**
             * 생성페이지로 이동
             */
            fnCreate: function (oEvent) {
                this.getRouter().navTo("NetPriceMgtDetail", {
                    "pMode" : "C",
                    "pAppNum":  "0"
                });
            },
           
            vhEmployeeCode: function(oEvent){
                var oSearch = this.byId(oEvent.getSource().sId);

                if(!this.oEmployeeMultiSelectionValueHelp){
                    this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                        title: "Choose Employees",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item);
                        oSearch.setValue(oEvent.mParameters.item.employee_number);
                        //this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
                    }.bind(this));
                }
                this.oEmployeeMultiSelectionValueHelp.open();
                this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("multiInputWithEmployeeValueHelp").getTokens());
            },

            vhSupplierCode: function(oEvent) {
                var vendorPoolCode;
                var oSearch = this.byId(oEvent.getSource().sId);

                if (!this.oSearchSupplierDialog) {
                    this.oSearchSupplierDialog = new SupplierDialog({
                        title: "Choose Supplier",
                        multiSelection: false,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.oSearchSupplierDialog.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        //oSearch.setTokens(oEvent.getSource().getTokens());
                        oSearch.setValue(oEvent.mParameters.item.supplier_code);
                    }.bind(this));
                }

                //searObject : 태넌트아이디, 검색 인풋아이디
                var sSearchObj = {};
                sSearchObj.tanentId = "L2100";
                //sSearchObj.vendorPoolCode = oSearch.getValue();
                sSearchObj.supplierCode = oSearch.getValue();
                this.oSearchSupplierDialog.open(sSearchObj);
            },

        });
    }
);