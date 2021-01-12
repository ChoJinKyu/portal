sap.ui.define([
  "ext/lib/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox) {
    "use strict";

    var sSelectedPath, sTenantId, oDialogInfo;

    return BaseController.extend("dp.vi.basePriceProgressStatusMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            var oFilterData = {tenantId: sTenantId,
                                type: "1",
                                type_list:[{code:"1", text:"개발구매"}]};

            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel(oFilterData), "filterModel");

            // Plant 데이터 조회 시작
            var oPurOrgModel = this.getOwnerComponent().getModel("purOrg");
            var aPurOrgFilter = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            oPurOrgModel.read("/Pur_Operation_Org", {
                filters : aPurOrgFilter,
                success : function(data){
                    if( data && data.results ) {
                        var aResults = data.results;
                        var aCompoany = [];
                        var oPurOrg = {};

                        for( var i=0; i<aResults.length; i++ ) {
                            var oResult = aResults[i];
                            if( -1===aCompoany.indexOf(oResult.company_code) ) {
                                aCompoany.push(oResult.company_code);
                                oPurOrg[oResult.company_code] = [];
                            }

                            oPurOrg[oResult.company_code].push({org_code: oResult.org_code, org_name: oResult.org_name});
                        }

                        oFilterData.purOrg = oPurOrg;
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            // Plant 데이터 조회 끝

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
                aFilters = [],
                sCompanyCode = oFilterModelData.company_code,
                sOrgCode = oFilterModelData.org_code,
                sStatus = oFilterModelData.status,
                sMaterialCode = oFilterModelData.materialCode,
                sApprovalNumber = oFilterModelData.approvalNumber,
                sRequestBy = oFilterModelData.requestBy,
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // Company Code가 있는 경우
            if( sCompanyCode ) {
                aFilters.push(new Filter("company_code", FilterOperator.EQ, sCompanyCode));
            }

            // Org Code가 있는 경우
            if( sOrgCode ) {
                aFilters.push(new Filter("org_code", FilterOperator.EQ, sOrgCode));
            }

            // Status가 있는 경우
            if( sStatus ) {
                aFilters.push(new Filter("approval_number_fk/approval_status_code", FilterOperator.EQ, sStatus));
            }

            // Material Code가 있는 경우
            if( sMaterialCode ) {
                aFilters.push(new Filter("material_code", FilterOperator.EQ, sMaterialCode));
            }

            // Approval Number가 있는 경우
            if( sApprovalNumber ) {
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, sApprovalNumber));
            }

            // Request Date가 있는 경우
            if( oDateValue ) {
                aFilters.push(new Filter("local_create_dtm", FilterOperator.BT, oDateValue, oSecondDateValue));
            }


            // Request By가 있는 경우
            if( sRequestBy ) {
                if( -1<sRequestBy.indexOf(")") ) {
                    var iStart = sRequestBy.indexOf("(");
                    var iLast = sRequestBy.indexOf(")");
                    sRequestBy = sRequestBy.substring(iStart+1, iLast);
                }

                aFilters.push(new Filter("approval_number_fk/approval_requestor_empno", FilterOperator.EQ, sRequestBy));
            }

            this._getBasePriceList(aFilters);
        },
        
        /**
         * Base Price Progress List 조회
         */
        _getBasePriceList: function(filtersParam) {
            var oView = this.getView();
            var oModel = this.getModel();
            filtersParam =  Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/Base_Price_Arl_Detail", {
                filters : filtersParam,
                urlParameters: {
                    "$expand": "approval_number_fk,prices,material_code_fk,company_code_fk"
                },
                success : function(data){
                    oView.setBusy(false);

                    oView.getModel("listModel").setData(data);
                },
                error : function(data){
                    oView.setBusy(false);
                    console.log("error", data);
                }
            });
        },

        /**
         * Date 데이터를 String 타입으로 변경. 예) 2020-10-10T00:00:00
         */
        _getNowDayAndTimes: function (bTimesParam, oDateParam) {
            var oDate = oDateParam || new Date(),
                iYear = oDate.getFullYear(),
                iMonth = oDate.getMonth()+1,
                iDate = oDate.getDate(),
                iHours = oDate.getHours(),
                iMinutes = oDate.getMinutes(),
                iSeconds = oDate.getSeconds();

            var sReturnValue = "" + iYear + "-" + this._getPreZero(iMonth) + "-" + this._getPreZero(iDate) + "T";
            var sTimes = "" + this._getPreZero(iHours) + ":" + this._getPreZero(iMinutes) + ":" + this._getPreZero(iSeconds) + "Z";

            if( bTimesParam ) {
                sReturnValue += sTimes;
            }else {
                sReturnValue += "00:00:00";
            }

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
            var oCodeModel = this.getModel("codeModel");
            
            oFilterModel.setProperty("/selectedPurOrg", oFilterModel.getProperty("/purOrg/"+oFilterModel.getProperty("/company_code")));
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
         * ==================== Dialog 시작 ==========================
         */
        /**
         * Dialog.fragment open
         */
		onOpenDialog: function (sQueryParam) {
            var oView = this.getView();
            
            if ( !this._oMaterialDialog ) {
                this._oMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.vi.basePriceProgressStatusMgt.view.MaterialDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            
            var oTable = this.byId("materialCodeTable");
            // 테이블 SearchField 검색값 초기화
            if( oTable ) {
                oTable.getHeaderToolbar().getContent()[2].setValue(sQueryParam);
            }

            this._oMaterialDialog.then(function(oDialog) {
                oDialog.open();
            }.bind(this));
        },

        /**
         * Dialog data 조회
         */
        onGetDialogData: function (oEvent) {
            if( !oEvent.getParameter("clearButtonPressed") ) {
                var oModel = this.getModel();
                var oSearchField = oEvent.getSource();
                var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
                var sQuery = "";

                // SearchField에서 검색으로 데이터 조회하는 경우 Filter 추가
                if( oEvent ) {
                    sQuery = oEvent.getParameter("query");
                    aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
                }

                oModel.read("/Material_Mst", {
                    filters : aFilters,
                    success: function(data) {
                        if( data ) {
                            this.onOpenDialog(sQuery);
                            this.getModel("dialogModel").setProperty("/materialCode", data.results);
                        }
                    }.bind(this),
                    error: function(data){
                        console.log('error', data);
                        MessageBox.error(data.message);
                    }
                });
            }
        },

        /**
         * Dialog에서 Row 선택 시
         */
        onSelectDialogRow: function (oEvent) {
            var oDialogModel = this.getModel("dialogModel");
            var oParameters = oEvent.getParameters();

            oDialogModel.setProperty(oParameters.listItems[0].getBindingContext("dialogModel").getPath()+"/checked", oParameters.selected);
            this.onDailogRowDataApply(oEvent);
        },

        /**
         * Dialog Row Data 선택 후 apply
         */
        onDailogRowDataApply: function (oEvent) {
            var oFilterModel = this.getModel("filterModel");
            var aDialogData = this.getModel("dialogModel").getProperty("/materialCode");
            var bChecked = false;

            for( var i=0; i<aDialogData.length; i++ ) {
                var oDialogData = aDialogData[i];

                if( oDialogData.checked ) {
                    oFilterModel.setProperty("/materialCode", oDialogData.material_code);

                    delete oDialogData.checked;
                    bChecked = true;

                    break;
                }
            }

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                this.onClose(oEvent);
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },
          
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            this._oMaterialDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Dialog 끝 ==========================
         */
    });
  }
);
