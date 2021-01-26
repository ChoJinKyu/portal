sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "ext/lib/util/ExcelUtil"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, ExcelUtil) {
    "use strict";

    var sSelectedPath, sTenantId, oDialogInfo, toggleButtonId = "";

    return BaseController.extend("dp.vi.basePriceArlMgt.controller.BasePriceList", {
        dateFormatter: DateFormatter,

        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            if( sStautsCodeParam === "AR" ) {
                sReturnValue = 8;
            }else if( sStautsCodeParam === "AP" ) {
                sReturnValue = 9;
            }else if( sStautsCodeParam === "RJ" ) {
                sReturnValue = 2;
            }

            return sReturnValue;
        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            var oToday = new Date();
            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel({tenantId: sTenantId,
                                        type: "1",
                                        dateValue: new Date(this._changeDateFormat(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 30), "-")),
                                        secondDateValue: new Date(this._changeDateFormat(oToday, "-")),
                                        type_list:[{code:"VI10", text:"신규 품의"}, {code:"VI20", text:"변경 품의"}]}), "filterModel");

            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this.onSearch, this);
        },

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        onSearch: function (oEvent) {
            var oFilterModel = this.getModel("filterModel"),
                oFilterModelData = oFilterModel.getData(),
                aFilters = [],
                sStatus = oFilterModelData.status,
                sApprovalNumber = oFilterModelData.approvalNumber,
                sApprovalTitle = oFilterModelData.approvalTitle,
                sRequestBy = oFilterModelData.requestBy,
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue;

            // Status가 있는 경우
            if( sStatus ) {
                aFilters.push(new Filter("approve_status_code", FilterOperator.EQ, sStatus));
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
                aFilters.push(new Filter("request_date", FilterOperator.BT, this._changeDateFormat(oDateValue), this._changeDateFormat(oSecondDateValue)));
            }

            // Request By가 있는 경우
            if( sRequestBy ) {
                aFilters.push(new Filter("requestor_empno", FilterOperator.EQ, sRequestBy));
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
            var oBindingContext = oEvent.getSource().getBindingContext("listModel");

            if( oBindingContext ) {
                var approvalTarget = "";
                var sPath = oBindingContext.getPath();
                var oRootModel = this.getModel("rootModel");
                var oSelectedData = oListModel.getProperty(sPath);
                oRootModel.setProperty("/selectedData", oSelectedData);

                if( -1<oSelectedData.approval_number.indexOf("T") ) {
                    approvalTarget = "NewBasePriceTable";
                }else {
                    approvalTarget = "ChangeBasePriceTable";
                }

                this.getModel("rootModel").setProperty("/selectedApprovalType", approvalTarget);
            }else {
                this.getModel("rootModel").setProperty("/selectedData", {});
            }

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
            var id = toggleButtonId.split('--')[2];
            var approvalTarget = "";
            
            if( !id ){       
                MessageBox.error("품의서 유형을 선택해주세요");
                return;
            }
            else{
                if(id.indexOf("newVI") > -1){
                    approvalTarget = "NewBasePriceTable";
                }else if(id.indexOf("changeVI") > -1){
                    approvalTarget = "ChangeBasePriceTable";
                }
            }
            
            var oRootModel = this.getModel("rootModel");
            oRootModel.setProperty("/selectedApprovalType", approvalTarget);

            this.onGoDetail(oEvent);
        },

        createPopupClose: function (oEvent) {
             this._createDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Dialog 끝 ==========================
         */
    });
  }
);
