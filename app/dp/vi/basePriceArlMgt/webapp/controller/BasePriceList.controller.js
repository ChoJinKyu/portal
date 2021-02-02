sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "cm/util/control/ui/EmployeeDialog",
  "ext/lib/util/ExcelUtil"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, EmployeeDialog, ExcelUtil) {
    "use strict";

    var sSelectedPath, sTenantId, oDialogInfo, toggleButtonId = "";

    return BaseController.extend("dp.vi.basePriceArlMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

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
            sTenantId = oRootModel.getProperty("/tenantId");

            // 초기 filter값 세팅
            var oToday = new Date();
            var oFilter = {tenantId: sTenantId,
                        dateValue: new Date(this._changeDateString(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 30), "-")),
                        secondDateValue: new Date(this._changeDateString(oToday, "-"))};
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

            // Dialog에서 사용할 Model 세팅
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this.onSearch, this);
        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function (oEvent) {
            var oFilterModel = this.getModel("filterModel");
            var oFilterModelData = oFilterModel.getData();
            var aFilters = [];
            var aType = oFilterModelData.type || [];
            var aStatus = oFilterModelData.status || [];
            var sApprovalNumber = oFilterModelData.approvalNumber;
            var sApprovalTitle = oFilterModelData.approvalTitle;
            var sRequestBy = oFilterModelData.requestBy;
            var oDateValue = oFilterModelData.dateValue;
            var oSecondDateValue = oFilterModelData.secondDateValue;
            var aRequestors = this.byId("multiInputWithEmployeeValueHelp").getTokens();

            // 품의유형이 있는 경우
            if( 0<aType.length ) {
                var aTypeFilter = [];
                
                aType.forEach(function (sType) {
                    aTypeFilter.push(new Filter("approval_type_code", FilterOperator.EQ, sType));
                });

                aFilters.push(new Filter({
                    filters: aTypeFilter,
                    and: false
                }));
            }

            // Status가 있는 경우
            if( 0<aStatus.length ) {
                var aStatusFilter = [];
                
                aStatus.forEach(function (sStatus) {
                    aStatusFilter.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
                });

                aFilters.push(new Filter({
                    filters: aStatusFilter,
                    and: false
                }));
            }

            // Approval Number가 있는 경우
            if( sApprovalNumber ) {
                aFilters.push(new Filter("approval_number", FilterOperator.Contains, sApprovalNumber));
            }

            // Approval Title이 있는 경우
            if( sApprovalTitle ) {
                aFilters.push(new Filter("approval_title", FilterOperator.Contains, sApprovalTitle));
            }
            
            // Request Date가 있는 경우
            if( oDateValue ) {
                aFilters.push(new Filter("request_date", FilterOperator.BT, this._changeDateString(oDateValue), this._changeDateString(oSecondDateValue)));
            }

            // Requestor가 있는 경우
            if( 0<aRequestors.length ) {
                var aRequestorsFilter = [];
                
                aRequestors.forEach(function (oRequestor) {
                    aRequestorsFilter.push(new Filter("requestor_empno", FilterOperator.EQ, oRequestor.getKey()));
                });

                aFilters.push(new Filter({
                    filters: aRequestorsFilter,
                    and: false
                }));
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
                    "$orderby": "approval_number desc, request_date desc"
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
         * 상세 페이지로 이동
         */
        onGoDetail: function (oEvent) {
            var oListModel = this.getModel("listModel");
            var oBindingContext = oEvent.getParameter("rowBindingContext");

            // 테이블 Row를 클릭했을 경우
            if( oBindingContext ) {
                var sPath = oBindingContext.getPath();
                var oRootModel = this.getModel("rootModel");
                var oSelectedData = oListModel.getProperty(sPath);
                oRootModel.setProperty("/selectedData", oSelectedData);

                this.getModel("rootModel").setProperty("/selectedApprovalType", oSelectedData.approval_type_code);
            }
            // 생성버튼 클릭했을 경우
            else {
                if( oEvent.getId() === "cellClick" ) {
                  return;
                }

                this.getModel("rootModel").setProperty("/selectedData", {});
            }

            toggleButtonId = "";
            this.getRouter().navTo("basePriceDetail");
        },

        /**
         * 
         * Excel Download 
         */
        
        onExcelExport: function (oEvent) {
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if ( !sTableId ) { 
                return; 
            }

            var oTable = this.byId(sTableId);
            var sFileName = "BACE PRICE APPROVAL LIST";
            var oList = oTable.getModel("listModel").getProperty("/results");

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oList
            });
        },

        /**
         * ==================== Dialog 시작 ==========================
         */

        /**
        * 생성 Dialog Open
        */
        onOpenCreateDialog: function () {
            var oView = this.getView();

            if ( !this._createDialog ) {
                this._createDialog = Fragment.load({
                    id: oView.getId(),
                    name: "dp.vi.basePriceArlMgt.view.CreateDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._createDialog.then(function (oDialog) {
                oDialog.open();
                
            });
            this.onToggleHandleInit();

        },

        /**
        * @public
        * @see 사용처 create 팝업 로딩시 입력값 초기화 작업
        */
        onToggleHandleInit: function () {
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");

            for (var i = 0; i < groupId.length; i++) {
                groupId[i].setPressed(false);
            }

        },

         /**
        *  create 팝업에서 나머지 버튼 비활성화 시키는 작업수행
        */
        onToggleHandleChange: function (oEvent) {
            var groupId = this.getView().getControlsByFieldGroupId("toggleButtons");
            var isPressedId = oEvent.getSource().getId();
            toggleButtonId = isPressedId;

            for (var i = 0; i < groupId.length; i++) {
                if (groupId[i].getId() != isPressedId) {
                    groupId[i].setPressed(false);
                }
            }
        },

        /**
        * @public
        * @see 사용처 create 팝업에서 select 버튼 press시 Object로 이동
        */
        handleConfirm: function (oEvent) {
            var approvalTarget = "";
            
            if( !toggleButtonId ){       
                MessageBox.error("품의서 유형을 선택해주세요");
                return;
            }
            else{
                if(toggleButtonId.indexOf("newVI") > -1){
                    approvalTarget = "VI10";
                }else if(toggleButtonId.indexOf("changeVI") > -1){
                    approvalTarget = "VI20";
                }
            }
            
            var oRootModel = this.getModel("rootModel");
            oRootModel.setProperty("/selectedApprovalType", approvalTarget);

            this.onGoDetail(oEvent);
        },

        createPopupClose: function (oEvent) {
             this._createDialog.then(function(oDialog) {
                toggleButtonId = "";
                oDialog.close();
            });
        },
        /**
         * ==================== Dialog 끝 ==========================
         */
    });
  }
);
