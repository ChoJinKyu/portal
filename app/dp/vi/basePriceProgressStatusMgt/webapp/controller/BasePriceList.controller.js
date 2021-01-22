sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "ext/lib/formatter/NumberFormatter",
  "dp/util/control/ui/MaterialMasterDialog"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, NumberFormatter, MaterialMasterDialog) {
    "use strict";

    var sSelectedDialogPath, sTenantId, oDialogInfo;

    return BaseController.extend("dp.vi.basePriceProgressStatusMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            if( sStautsCodeParam === "AR" ) {
                sReturnValue = 5;
            }else if( sStautsCodeParam === "AP" ) {
                sReturnValue = 7;
            }else if( sStautsCodeParam === "RJ" ) {
                sReturnValue = 3;
            }

            return sReturnValue;
        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            var oToday = new Date();
            var oFilterData = {tenantId: sTenantId,
                                materialCodes: [],
                                type: "1",
                                dateValue: new Date(this._changeDateFormat(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 30), "-")),
                                secondDateValue: new Date(this._changeDateFormat(oToday, "-")),
                                type_list:[{code:"1", text:"개발구매"}]};

            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel(oFilterData), "filterModel");

            switch (sTenantId) {
                case "L2100" :
                    oRootModel.setProperty("/switchColumnVisible", true);
                    break;
                default :
                    oRootModel.setProperty("/switchColumnVisible", false);
            }

            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this.onSearch, this);
        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function () {
            var oFilterModel = this.getModel("filterModel"),
                oFilterModelData = oFilterModel.getData(),
                aMasterFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)],
                aDetailFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)],
                sCompanyCode = oFilterModelData.company_code,
                sOrgCode = oFilterModelData.org_code,
                sStatus = oFilterModelData.status,
                aMaterialCodes = oFilterModelData.materialCodes,
                sApprovalNumber = oFilterModelData.approvalNumber,
                sRequestBy = oFilterModelData.requestBy,
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // Company Code가 있는 경우
            if( sCompanyCode ) {
                aDetailFilters.push(new Filter("company_code", FilterOperator.EQ, sCompanyCode));
            }

            // Org Code가 있는 경우
            if( sOrgCode ) {
                aDetailFilters.push(new Filter("org_code", FilterOperator.EQ, sOrgCode));
            }

            // Status가 있는 경우
            if( sStatus ) {
                aMasterFilters.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
            }

            // Material Code가 있는 경우
            if( aMaterialCodes && 0<aMaterialCodes.length ) {
                var aMaterialCodeFilter = [];
                
                aMaterialCodes.forEach(function (oMaterialCode) {
                    aMaterialCodeFilter.push(new Filter("material_code", FilterOperator.EQ, oMaterialCode.getKey()));
                });

                aDetailFilters.push(new Filter({
                    filters: aMaterialCodeFilter,
                    and: false,
                }));
            }

            // Approval Number가 있는 경우
            if( sApprovalNumber ) {
                aMasterFilters.push(new Filter("approval_number", FilterOperator.Contains, sApprovalNumber));
                aDetailFilters.push(new Filter("approval_number", FilterOperator.Contains, sApprovalNumber));
            }

            // Request Date가 있는 경우
            if( oDateValue ) {
                aMasterFilters.push(new Filter("request_date", FilterOperator.BT, this._changeDateFormat(oDateValue), this._changeDateFormat(oSecondDateValue)));
            }

            // Request By가 있는 경우
            if( sRequestBy ) {
                aMasterFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sRequestBy));
            }

            this._getBasePriceList(aMasterFilters, aDetailFilters);
        },
        
        /**
         * Base Price Progress List 조회
         */
        _getBasePriceList: function(aMasterFiltersParam, aDetailFiltersParam) {
            var oView = this.getView();
            var oListModel = this.getModel("listModel");
            oView.setBusy(true);

            // Master 조회
            this._readData("/Base_Price_Arl_Master", aMasterFiltersParam, {}, function (data) {
                var aMasters = data.results;

                // Detail 조회
                this._readData("/Base_Price_Arl_Detail", aDetailFiltersParam, {}, function (detailsData) {
                    var aMastersLen = aMasters.length;
                    var aDetails = detailsData.results;
                    var aDetailsLen = aDetails.length;
                    var aList = [];
                    var aPriceFilters = [];
                    var aItemSequenceFilters = [];

                    for( var k=0; k<aMastersLen; k++ ) {
                        var oMaster = aMasters[k];

                        for( var i=0; i<aDetailsLen; i++ ) {
                            var oDetail = aDetails[i];

                            if( oMaster.approval_number === oDetail.approval_number ) {
                                oDetail.prices = [];
                                aList.push($.extend(true, oMaster, oDetail));

                                let aTempFilters = [];
                                aTempFilters.push(new Filter("tenant_id", FilterOperator.EQ, sTenantId));
                                aTempFilters.push(new Filter("approval_number", FilterOperator.EQ, oDetail.approval_number));
                                aTempFilters.push(new Filter("item_sequence", FilterOperator.EQ, oDetail.item_sequence));
                                aItemSequenceFilters.push(new Filter({
                                    filters: aTempFilters,
                                    and: true,
                                }));
                            }
                        }
                    }

                    aPriceFilters.push(new Filter({
                        filters: aItemSequenceFilters,
                        and: false,
                    }));

                    // Price 조회
                    this._readData("/Base_Price_Arl_Price", aPriceFilters, {"$orderby": "approval_number,item_sequence"}, function (pricesData) {
                        var aPrices = pricesData.results;
                        var aPricesLen = aPrices.length;
                        var aListLen = aList.length;

                        for( var m=0; m<aListLen; m++ ) {
                            var oBasePrice = aList[m];

                            for( var p=0; p<aPricesLen; p++ ) {
                                if( oBasePrice.approval_number === aPrices[p].approval_number &&
                                    oBasePrice.item_sequence === aPrices[p].item_sequence ) {
                                    oBasePrice.prices.push(aPrices[p]);
                                }
                            }
                        }

                        oListModel.setData(aList);
                        oView.setBusy(false);
                    });
                }.bind(this));
            }.bind(this));
        },
        
        _readData: function (sCallUrlParam, aFiltersParam, oUrlParametersParam, fCallbackParam) {
            var oModel = this.getModel();
            var oView = this.getView();

            oModel.read(sCallUrlParam, {
                filters : aFiltersParam,
                urlParameters: oUrlParametersParam,
                success : fCallbackParam,
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10
         */
        _changeDateFormat: function (oDateParam, sGubun) {
            var oDate = oDateParam || new Date(),
                sGubun = sGubun || "",
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            var sReturnValue = "" + iYear + sGubun + this._getPreZero(iMonth) + sGubun + this._getPreZero(iDate);

            return sReturnValue;
        },

        /**
         * 넘겨진 Parameter가 10이하이면 숫자앞에 0을 붙여서 return
         */
        _getPreZero: function (iDataParam) {
            return (iDataParam<10 ? "0"+iDataParam : iDataParam);
        },
        
        /**
         * compnay 변경 시 플랜트 리스트 변경
         */
        onChangeCompany: function (oEvent) {
            var oFilterModel = this.getModel("filterModel");
            var aSelectedPurOrg = [];
            
            if( oFilterModel.getProperty("/company_code") !== "" ) {
                aSelectedPurOrg = this.getModel("rootModel").getProperty("/purOrg/"+oFilterModel.getProperty("/company_code"));
            }

            oFilterModel.setProperty("/selectedPurOrg", aSelectedPurOrg);
            oFilterModel.setProperty("/org_code", "");
        },

        /**
         * 상세 페이지로 이동
         */
        onGoDetail: function (oEvent) {
            var oListModel = this.getModel("listModel");
            var oBindingContext = oEvent.getSource().getBindingContext("listModel");

            if( oBindingContext ) {
                var sPath = oBindingContext.getPath();
                var oRootModel = this.getModel("rootModel");
                oRootModel.setProperty("/selectedData", oListModel.getProperty(sPath));
            }

            this.getRouter().navTo("basePriceDetail");
        },

        /**
         * 공통 Material Code Dialog 호출
         */
        onMaterialMasterMultiDialogPress: function (oEvent) {
            var oMultiInput = oEvent.getSource();

            if( !this.oSearchMultiMaterialMasterDialog ) {
                this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                    title: "Choose MaterialMaster",
                    multiSelection: true,
                    items: {
                        filters:[
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                })

                this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent) {
                oMultiInput.setTokens(oEvent.getSource().getTokens());
                }.bind(this));
            }

            this.oSearchMultiMaterialMasterDialog.open();

            var aTokens = oMultiInput.getTokens();
            this.oSearchMultiMaterialMasterDialog.setTokens(aTokens);
        },

        onChangeMaterialCode: function (oEvent) {
            var oFilterModel = this.getModel("filterModel"); 
            oFilterModel.setProperty("/materialCodes", oEvent.getSource().getTokens());
        }
    });
  }
);