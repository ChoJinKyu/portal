sap.ui.define([
    "./App.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/core/Item",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "ext/lib/formatter/DateFormatter",
    "ext/lib/formatter/NumberFormatter",
    "cm/util/control/ui/EmployeeDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "ext/lib/model/ManagedModel",
    "ext/lib/model/ManagedListModel",
    "ext/pg/util/control/ui/SupplierDialog"
],
    function (
        BaseController, 
        JSONModel, 
        Filter, 
        FilterOperator, 
        Fragment, 
        MessageBox, 
        Item,
        HashChanger, 
        Component, 
        ComponentContainer,
        DateFormatter, 
        NumberFormatter, 
        EmployeeDialog, 
        MaterialMasterDialog, 
        ManagedModel, 
        ManagedListModel,
        SupplierDialog
    ) {
        "use strict";
        var that;
        return BaseController.extend("sp.np.netPriceMgt.controller.NetPriceMgtList", {
            DateFormatter: DateFormatter,
            numberFormatter: NumberFormatter,

            onInit: function () {
                that = this;
                this.setModel(new ManagedListModel(), "list");
                this.setModel(new JSONModel(), "detailModel");
                this.getRouter().getRoute("NetPriceMgtList").attachPatternMatched(this._onRoutedThisPage, this);
            },

            _onRoutedThisPage: function() {
                this.fnSearch();
            },

            /**
             * Search 버튼 클릭(Filter 추출)
             */
            fnSearch: function () {
                
                this.sSurffix = this.byId("page").getHeaderExpanded() ? "E" : "S";
                var oView = this.getView(),
                    oModel = this.getModel("list");
                    oView.setBusy(true);
                    
                var oFilter = [];
                var operationOrg;
                var status;
                var title;

                if (this.sSurffix === "E") {
                    operationOrg = that.byId("operation_org_e").getSelectedKey();
                    status = that.byId("status_e").getSelectedKey();
                }

                if (this.sSurffix === "S") {
                    operationOrg = that.byId("operation_org_s").getSelectedKey();
                    status = that.byId("status_s").getSelectedKey();
                }

                if (!!operationOrg) {
                    oFilter.push();
                    oFilter.push(new Filter("org_code", FilterOperator.EQ, operationOrg));
                }

                if (!!status) {
                    oFilter.push();
                    oFilter.push(new Filter("approve_status_code", FilterOperator.EQ, status));
                }
                
                title = that.byId("search_title");
                
                if (!!title) {
                    oFilter.push();
                    oFilter.push(new Filter("approve_status_code", FilterOperator.Contains, title));
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
                        "pMode" : "R"
                    });
                }
            },
            
            fnCreate: function() {
                this.getRouter().navTo("NetPriceMgtDetail", {
                    "pMode" : "C"
                });
            },

            vhEmployeeCode: function(){
                if(!this.oEmployeeMultiSelectionValueHelp){
                    this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                        title: "Choose Employees",
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", FilterOperator.EQ, "L2100")
                            ]
                        }
                    });
                    this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                        this.byId("multiInputWithEmployeeValueHelp").setTokens(oEvent.getSource().getTokens());
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
                        multiSelection: true,
                        items: {
                            filters: [
                                new Filter("tenant_id", "EQ", "L2100")
                            ]
                        }
                    });

                    this.oSearchSupplierDialog.attachEvent("apply", function (oEvent) {
                        //console.log("oEvent 여기는 팝업에 내려오는곳 : ", oEvent.mParameters.item.vendor_pool_code);
                        oSearch.setTokens(jQuery.map(oEvent.mParameters.items, function(oToken){
                            return new Token({
                                key: oToken.vendor_pool_code,
                                text: oToken.vendor_pool_local_name,
                            });
                        }));
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