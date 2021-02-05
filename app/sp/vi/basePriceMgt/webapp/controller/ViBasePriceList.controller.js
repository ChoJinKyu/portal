sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox", 
  "ext/lib/util/ExcelUtil",
  "cm/util/control/ui/EmployeeDialog"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, ExcelUtil,EmployeeDialog) {
    "use strict";

    var sSelectedPath, sTenantId, oDialogInfo, toggleButtonId = "";

    return BaseController.extend("sp.vi.basePriceMgt.controller.ViBasePriceList", {
        dateFormatter: DateFormatter,

        onStatusColor: function (sStautsCodeParam) {
            var sReturnValue = 1;

            if( sStautsCodeParam === "20" ) {
                sReturnValue = 5;
            }else if( sStautsCodeParam === "30" ) {
                sReturnValue = 7;
            }else if( sStautsCodeParam === "40" ) {
                sReturnValue = 3;
            }else if( sStautsCodeParam === "NPT01" ) {
                sReturnValue = 1;
            }else if( sStautsCodeParam === "NPT02" ) {
                sReturnValue = 2;
            }else if( sStautsCodeParam === "NPT03" ) {
                sReturnValue = 3;
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
                                        type_list:[{code:"1", text:"양산VI품의"}]}), "filterModel");

            this.getRouter().getRoute("basePriceList").attachPatternMatched(this.onSearch, this); 
        }

        /**
         * 사원 Dialog 공통 팝업 호출
         */
        , onMultiInputWithEmployeeValuePress: function(oEvent, sInputIdParam){
            var that = this;
            var bMultiSelection = true;
            var bCloseWhenApplied = true; //선택후 닫기

            if( sInputIdParam === "changeDeveloper" ) {
                bMultiSelection = false;
                bCloseWhenApplied = false; 
            }

            if(!this.oEmployeeMultiSelectionValueHelp || this.oEmployeeMultiSelectionValueHelp.getMultiSelection() !== bMultiSelection ){
                this.oEmployeeMultiSelectionValueHelp = new EmployeeDialog({
                    title: "Choose Employees",
                    multiSelection: bMultiSelection,
                    closeWhenApplied: bCloseWhenApplied,  
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, this.getModel("rootModel").getProperty("tenantId"))
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    if( sInputIdParam === "changeDeveloper" ) {
                        var oApplyEvent = oEvent;
                        var oSelectedItem = oEvent.getParameter("item");
                        MessageBox.confirm("선택한 사원으로 변경 하시겠습니까?", {
                            title : "Request",
                            initialFocus : sap.m.MessageBox.Action.CANCEL,
                            onClose : function(sButton) {
                                if (sButton === MessageBox.Action.OK) {
                                    that._changeDeveloper(oSelectedItem);
                                    oApplyEvent.getSource().close();
                                }
                            }.bind(this)
                        });
                    }else {
                        this.byId(sInputIdParam).setTokens(oEvent.getSource().getTokens());
                    }
                    
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();

            if( sInputIdParam !== "changeDeveloper" ) {
                this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId(sInputIdParam).getTokens());
            }
        }

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        , onSearch: function (oEvent) {
            var oFilterModel = this.getModel("filterModel"),
                oFilterModelData = oFilterModel.getData(),
                aFilters = [],
                sStatus = oFilterModelData.status,
                sApprovalNumber = oFilterModelData.approvalNumber,
                sApprovalTitle = oFilterModelData.approvalTitle,
                sRequestBy = oFilterModelData.requestBy,
                oDateValue = oFilterModelData.dateValue,
                oSecondDateValue = oFilterModelData.secondDateValue,
                oNetPriceTypeCodeNm = oFilterModelData.net_price_type_code;
            var aRequestors = this.byId("multiInputWithEmployeeValueHelp").getTokens();

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
                aFilters.push(new Filter("approval_title", FilterOperator.Contains,  sApprovalTitle.toUpperCase()));
                aFilters.push(new Filter("approval_title", FilterOperator.Contains,  sApprovalTitle.toLowerCase()));
            }
            
            // Request Date가 있는 경우
            if( oDateValue ) {
                aFilters.push(new Filter("request_date", FilterOperator.BT, this._changeDateFormat(oDateValue), this._changeDateFormat(oSecondDateValue)));
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

            // 품의유형이 있는경우
            if( oNetPriceTypeCodeNm ) {
                aFilters.push(new Filter("net_price_type_code", FilterOperator.EQ, oNetPriceTypeCodeNm));
            }       

            this._getBasePriceList(aFilters);
        },
        
        /**
         * Base Price Progress List 조회
         */
        _getBasePriceList: function(filtersParam) {
            var oView = this.getView();
            var oModel = this.getModel("basePriceArl");
            filtersParam =  Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            oModel.read("/Base_Price_Aprl_Master", {
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
        }

        /**
         * 
         * Excel Download 
         */
        
        , onExcelExport: function (oEvent) {
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

            if ( !this._spcreateDialog ) {
                this._spcreateDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.vi.basePriceMgt.view.SpViCreateDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._spcreateDialog.then(function (oDialog) {
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
            var id = toggleButtonId.split('--')[4];
            var approvalTarget = "";
            var oRootModel = this.getModel("rootModel");           

             if( !id ){       
                 MessageBox.error("품의서 유형을 선택해주세요");
                 return;
             }else{             
                if(id.indexOf("General") > -1){
                    this.getRouter().navTo("basePriceDetail");

                }else if(id.indexOf("InternalTrading") > -1){
                    this.getRouter().navTo("internalPriceDetail");

                }else if(id.indexOf("ProcessingCost") > -1){
                    MessageBox.show("가공비자재-SRS 준비중입니다.",{at: "Center Center"});
                    approvalTarget = "ChangeBasePriceTable";

                }else if(id.indexOf("Sulphate") > -1){
                    MessageBox.show("가공비자재-알박/동박/Sulphate 준비중입니다.",{at: "Center Center"});
                    approvalTarget = "ChangeBasePriceTable";

                }else if(id.indexOf("Anode") > -1){
                    MessageBox.show("가공비자재-양극체/전구체 준비중입니다.",{at: "Center Center"});
                    approvalTarget = "ChangeBasePriceTable";
                }
            }    
        }


        /**
         * 상세 페이지로 이동
         */
        , onGoDetail: function (oEvent) {
            MessageBox.show("준비중입니다. ", {at: "Center Center"});
            return;

            var oListModel = this.getModel("listModel");
            var oBindingContext = oEvent.getParameter("rowBindingContext");

            // 테이블 Row를 클릭했을 경우
            if( oBindingContext ) {
                var sPath = oBindingContext.getPath();
                var oRootModel = this.getModel("rootModel");
                var oSelectedData = oListModel.getProperty(sPath);
                oRootModel.setProperty("/selectedData", oSelectedData);

                if( oSelectedData.net_price_type_code === "NPT01"){
                    this.getRouter().navTo("basePriceDetail");
                }else if( oSelectedData.net_price_type_code === "NPT02") {
                    MessageBox.show("준비중입니다. ", {at: "Center Center"});
                    return;
                }else if( oSelectedData.net_price_type_code === "NPT03") {
                    MessageBox.show("준비중입니다. ", {at: "Center Center"});
                    return;
                }else if( oSelectedData.net_price_type_code === "NPT04") {
                    MessageBox.show("준비중입니다. ", {at: "Center Center"});
                    return;
                }else if( oSelectedData.net_price_type_code === "NPT05") {
                    this.getRouter().navTo("internalPriceDetail");
                }else if( oSelectedData.net_price_type_code === "NPT06") {
                    MessageBox.show("준비중입니다. ", {at: "Center Center"});
                }
            }

        }

        , createPopupClose: function (oEvent) {
             this._spcreateDialog.then(function(oDialog) {
                oDialog.close();
            });
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
