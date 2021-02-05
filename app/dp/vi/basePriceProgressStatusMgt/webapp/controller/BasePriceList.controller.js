sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "sap/ui/core/routing/HashChanger",
  "sap/ui/core/Component",
  "sap/ui/core/ComponentContainer",
  "ext/lib/formatter/DateFormatter",
  "ext/lib/formatter/NumberFormatter",
  "cm/util/control/ui/EmployeeDialog",
  "dp/util/control/ui/MaterialMasterDialog"
],
  function (BaseController, JSONModel, Filter, FilterOperator, Fragment, MessageBox, HashChanger, Component, ComponentContainer, 
        DateFormatter, NumberFormatter, EmployeeDialog, MaterialMasterDialog) {
    "use strict";

    var _sTenantId;

    return BaseController.extend("dp.vi.basePriceProgressStatusMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        numberFormatter: NumberFormatter,

        /**
         * status code에 따라 상태를 나타내는 색 세팅
         */
        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            // AR: Approval Request, IA: In progress Approval, AP: Approved, RJ: Rejected
            if( sStautsCodeParam === "AR" ) {
                sReturnValue = 8;
            }else if( sStautsCodeParam === "IA" ) {
                sReturnValue = 9;
            }else if( sStautsCodeParam === "AP" ) {
                sReturnValue = 6;
            }else if( sStautsCodeParam === "RJ" ) {
                sReturnValue = 2;
            }

            return sReturnValue;
        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            _sTenantId = oRootModel.getProperty("/tenantId");

            // 초기 filter값 세팅
            var oToday = new Date();
            var oFilter = {tenantId: _sTenantId,
                                materialCodes: [],
                                dateValue: new Date(this._changeDateString(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 30), "-")),
                                secondDateValue: new Date(this._changeDateString(oToday, "-")),
                                type_list:[]};
            // 기준단가 목록 테이블 모델 세팅  
            this.setModel(new JSONModel(), "listModel");
            // filter 모델 세팅
            this.setModel(new JSONModel(oFilter), "filterModel");

            // 품의 유형 조회 시작
            var aApprovalTypeCodeFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId")),
                                        new Filter("group_code", FilterOperator.EQ, "DP_VI_APPROVAL_TYPE")];
            this.getOwnerComponent().getModel("commonODataModel").read("/Code", {
                filters : aApprovalTypeCodeFilter,
                success : function(data){
                    if( data && data.results ) {
                        this.getModel("filterModel").setProperty("/type_list", data.results);
                    }
                }.bind(this),
                error : function(data){
                    console.log("error", data);
                }
            });
            // 품의 유형 조회 끝


            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this.onSearch, this);
        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function () {
            var oFilterModel = this.getModel("filterModel");
            var oFilterModelData = oFilterModel.getData();
            var aMasterFilters = [new Filter("tenant_id", FilterOperator.EQ, _sTenantId)];
            var aDetailFilters = [new Filter("tenant_id", FilterOperator.EQ, _sTenantId)];
            var aType = oFilterModelData.type || [];
            var sCompanyCode = oFilterModelData.company_code;
            var sOrgCode = oFilterModelData.org_code;
            var aStatus = oFilterModelData.status || [];
            var aMaterialCodes = oFilterModelData.materialCodes;
            var sApprovalNumber = oFilterModelData.approvalNumber;
            var oDateValue = oFilterModelData.dateValue;
            var oSecondDateValue = oFilterModelData.secondDateValue;
            var aRequestors = this.byId("multiInputWithEmployeeValueHelp").getTokens();

            // 품의유형이 있는 경우
            if( 0<aType.length ) {
                var aTypeFilter = [];
                
                aType.forEach(function (sType) {
                    aTypeFilter.push(new Filter("approval_type_code", FilterOperator.EQ, sType));
                });

                aMasterFilters.push(new Filter({
                    filters: aTypeFilter,
                    and: false
                }));
            }

            // Company Code가 있는 경우
            if( sCompanyCode ) {
                aDetailFilters.push(new Filter("company_code", FilterOperator.EQ, sCompanyCode));
            }

            // Org Code가 있는 경우
            if( sOrgCode ) {
                aDetailFilters.push(new Filter("org_code", FilterOperator.EQ, sOrgCode));
            }

            // Status가 있는 경우
            if( 0<aStatus.length ) {
                var aStatusFilter = [];
                
                aStatus.forEach(function (sStatus) {
                    aStatusFilter.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
                });

                aMasterFilters.push(new Filter({
                    filters: aStatusFilter,
                    and: false
                }));
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
                aMasterFilters.push(new Filter("request_date", FilterOperator.BT, this._changeDateString(oDateValue), this._changeDateString(oSecondDateValue)));
            }

            // 요청자가 있는 경우
            if( 0<aRequestors.length ) {
                var aRequestorsFilter = [];
                
                aRequestors.forEach(function (oRequestor) {
                    aRequestorsFilter.push(new Filter("requestor_empno", FilterOperator.EQ, oRequestor.getKey()));
                });

                aMasterFilters.push(new Filter({
                    filters: aRequestorsFilter,
                    and: false
                }));
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

                    // Master 데이터와 Detail 데이터를 비교해서 approval_number가 서로 일치하는 경우만 Filter값에 맞는 데이터(= aList)
                    for( var k=0; k<aMastersLen; k++ ) {
                        var oMaster = aMasters[k];

                        for( var i=0; i<aDetailsLen; i++ ) {
                            var oDetail = aDetails[i];

                            if( oMaster.approval_number === oDetail.approval_number ) {
                                oDetail.prices = [];
                                aList.push($.extend(true, {}, oMaster, oDetail));

                                let aTempFilters = [];
                                aTempFilters.push(new Filter("tenant_id", FilterOperator.EQ, _sTenantId));
                                aTempFilters.push(new Filter("approval_number", FilterOperator.EQ, oDetail.approval_number));
                                aTempFilters.push(new Filter("item_sequence", FilterOperator.EQ, oDetail.item_sequence));
                                aItemSequenceFilters.push(new Filter({
                                    filters: aTempFilters,
                                    and: true,
                                }));
                            }
                        }
                    }

                    // Master 데이터와 Detail 데이터를 비교해서 approval_number가 서로 일치하는 경우만 Price filter 세팅
                    aPriceFilters.push(new Filter({
                        filters: aItemSequenceFilters,
                        and: false,
                    }));

                    // Price 조회
                    this._readData("/Base_Price_Arl_Price", aPriceFilters, {"$orderby": "approval_number,item_sequence,market_code"}, function (pricesData) {
                        var aPrices = pricesData.results;
                        var aPricesLen = aPrices.length;
                        var aListLen = aList.length;

                        // Filter값에 맞는 데이터(= aList)에 Price값 세팅
                        for( var m=0; m<aListLen; m++ ) {
                            var oBasePrice = aList[m];

                            for( var p=0; p<aPricesLen; p++ ) {
                                if( oBasePrice.approval_number === aPrices[p].approval_number &&
                                    oBasePrice.item_sequence === aPrices[p].item_sequence ) {
                                    oBasePrice.prices = oBasePrice.prices ? oBasePrice.prices : [{}, {}, {}];
                                    oBasePrice.prices[aPrices[p].market_code] = aPrices[p];
                                }
                            }
                        }

                        // approval_number 로 desc 
                        aList.sort(function(a, b) {
                            if( a.approval_number < b.approval_number) {
                                return 1;
                            };
                            if( a.approval_number > b.approval_number) {
                                return -1;
                            };
                            return 0;
                        })

                        oListModel.setData(aList);
                        oView.setBusy(false);
                    });
                }.bind(this));
            }.bind(this));
        },
        
        /**
         * oData 호출
         */
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
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10(이 때 구분값은 "-")
         */
        _changeDateString: function (oDateParam, sGubun) {
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
         * 상세 페이지로 이동(basePriceArlMst에 있는 Detail화면으로 이동)
         */
        onGoDetail: function (oEvent) {
            // var oListModel = this.getModel("listModel");
            // var oBindingContext = oEvent.getParameter("rowBindingContext");

            // if( oBindingContext ) {
            //     var sPath = oBindingContext.getPath();
            //     var oRootModel = this.getModel("rootModel");
            //     var oSelectedData = oListModel.getProperty(sPath);

            //     //portal에 있는 toolPage 
            //     var oToolPage = this.getView().oParent.oParent.oParent.oContainer.oParent;
            //     //이동하려는 app의 component name,url
            //     var sComponent = "dp.vi.basePriceArlMgt",
            //         sUrl = "../dp/vi/basePriceArlMgt/webapp";

            //     var changeHash = "2/2";         //넘겨줄 hash 값
            //     changeHash += "/" + oSelectedData.tenant_id + "/" + oSelectedData.approval_number + "/" + oSelectedData.approval_type_code;
            //     HashChanger.getInstance().replaceHash("");

            //     Component.load({
            //         name: sComponent,
            //         url: sUrl
            //     }).then(function (oComponent) {
            //         var oContainer = new ComponentContainer({
            //             name: sComponent,
            //             async: true,
            //             url: sUrl
            //         });
            //         oToolPage.removeAllMainContents();
            //         oToolPage.addMainContent(oContainer);
            //         //hash setting
            //         HashChanger.getInstance().setHash(changeHash);
            //     }).catch(function (e) {
            //         MessageBox.show("error");
            //     })
            // }

            var oListModel = this.getModel("listModel");
            var oBindingContext = oEvent.getParameter("rowBindingContext");

            // 테이블 Row를 클릭했을 경우
            if( oBindingContext ) {
                var sPath = oBindingContext.getPath();
                var oRootModel = this.getModel("rootModel");
                var oSelectedData = oListModel.getProperty(sPath);
                oRootModel.setProperty("/selectedData", oSelectedData);

                this.getModel("rootModel").setProperty("/selectedApprovalType", oSelectedData.approval_type_code);
                this.getRouter().navTo("basePriceDetail");
            }
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
                            new Filter("tenant_id", FilterOperator.EQ, _sTenantId)
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
        },


        /**
         * 요청자 Dialog
         */
        onMultiInputWithEmployeeValuePress: function(){
            if(!this.oEmployeeMultiSelectionValueHelp){
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, _sTenantId)
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



    });
  }
);