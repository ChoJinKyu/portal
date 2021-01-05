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

    return BaseController.extend("dp.vi.basePriceArlMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onInit: function () {
            var oBasePriceListRootModel = this.getOwnerComponent().getModel("basePriceArlRootModel");
            sTenantId = oBasePriceListRootModel.getProperty("/tenantId");

            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel({tenantId: sTenantId}), "filterModel");

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
                sStatus = oFilterModelData.status,
                sApprovalNumber = oFilterModelData.approvalNumber,
                oRequestBy = oFilterModelData.requestBy,
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // Status가 있는 경우
            if( sStatus ) {
                aFilters.push(new Filter("approval_status_code", FilterOperator.EQ, sStatus));
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
            if( oRequestBy ) {
                aFilters.push(new Filter("create_user_id", FilterOperator.EQ, oRequestBy));
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

            oModel.read("/Base_Price_Arl_Master", {
                filters : filtersParam,
                urlParameters: {
                    "$expand": "approval_status_code_fk,approval_requestor_empno_fk,approval_type_code_fk,tenant_id_fk"
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
         * 상세 페이지로 이동
         */
        onGoDetail: function (oEvent) {
            var oListModel = this.getModel("listModel");
            var oBindingContext = oEvent.getSource().getBindingContext("listModel");

            if( oBindingContext ) {
                var sPath = oBindingContext.getPath();
                var oBasePriceListRootModel = this.getModel("basePriceArlRootModel");
                oBasePriceListRootModel.setProperty("/selectedData", oListModel.getProperty(sPath));
            }

            this.getRouter().navTo("basePriceDetail");
        },

                /**
         * ==================== Dialog 시작 ==========================
         */
        /**
         * Dialog.fragment open
         */
		onOpenDialog: function (oEvent) {
            var oView = this.getView();

            if( !oEvent.getParameter("clearButtonPressed") ) {
                if ( !this._oMaterialDialog ) {
                    this._oMaterialDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.vi.basePriceArlMgt.view.MaterialDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._oMaterialDialog.then(function(oDialog) {
                    oDialog.open();

                    this.onGetDialogData();
                }.bind(this));
            }
        },

        /**
         * Dialog data 조회
         */
        onGetDialogData: function (oEvent) {
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var oTable = this.byId("materialCodeTable");
            // 테이블 SearchField 검색값 초기화
            oTable.getHeaderToolbar().getContent()[2].setValue("");

            // SearchField에서 검색으로 데이터 조회하는 경우 Filter 추가
            if( oEvent ) {
                var sQuery = oEvent.getSource().getValue();
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            }

            oTable.setBusy(true);

            oModel.read("/Material_Mst", {
                filters : aFilters,
                success: function(data) {
                    oTable.setBusy(false);
                    
                    if( data ) {
                        this.getModel("dialogModel").setProperty("/materialCode", data.results);
                    }
                }.bind(this),
                error: function(data){
                    oTable.setBusy(false);
                    console.log('error', data);
                    MessageBox.error(data.message);
                }
            });
        },

        /**
         * Dialog에서 Row 선택 시
         */
        onSelectDialogRow: function (oEvent) {
            var oDialogModel = this.getModel("dialogModel");
            var oParameters = oEvent.getParameters();

            oDialogModel.setProperty(oParameters.listItems[0].getBindingContext("dialogModel").getPath()+"/checked", oParameters.selected);
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
