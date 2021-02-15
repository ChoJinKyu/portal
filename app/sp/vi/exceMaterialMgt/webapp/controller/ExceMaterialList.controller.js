sap.ui.define([
  "./App.controller",
  "sap/ui/model/json/JSONModel",
  "ext/lib/formatter/DateFormatter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox", 
  "ext/lib/util/ExcelUtil",
  "cm/util/control/ui/EmployeeDialog",
  "sp/util/control/ui/SupplierDialog",
  "dp/util/control/ui/MaterialMasterDialog"
],
  function (BaseController, JSONModel, DateFormatter, Filter, FilterOperator, Fragment, MessageBox, ExcelUtil, EmployeeDialog, SupplierDialog,
        MaterialMasterDialog) {
    "use strict";

    var sSelectedPath, sTenantId, oDialogInfo, toggleButtonId = "";

    return BaseController.extend("sp.vi.exceMaterialMgt.controller.ExceMaterialList", {
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
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            debugger;
            sTenantId = oUserModel.getProperty("/tenantId");

            var oToday = new Date();
            this.setModel(new JSONModel(), "listModel");
            this.setModel(new JSONModel({tenantId: sTenantId,
                                        dateValue: new Date(this._changeDateFormat(new Date(oToday.getFullYear(), oToday.getMonth(), oToday.getDate() - 90), "-")),
                                        secondDateValue: new Date(this._changeDateFormat(oToday, "-"))}), "filterModel");

            this.getRouter().getRoute("ExceMaterialList").attachPatternMatched(this.onSearch, this); 
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
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
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
         * 공급업체(Supplier) Dialog 창
         */
        , onInputSupplierWithOrgValuePress : function(oEvent){
            var oFilterModel = this.getModel("filterModel");
        
            if(!this.oSupplierWithOrgValueHelp){
                this.oSupplierWithOrgValueHelp = new SupplierDialog({
                    multiSelection: false,
                    loadWhenOpen: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                });
                
                this.oSupplierWithOrgValueHelp.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    debugger;
                    oFilterModel.setProperty("/supplier_code", oSelectedDialogItem.supplier_code);
                    oFilterModel.setProperty("/supplier_local_name", oSelectedDialogItem.supplier_local_name);
                    
                    oFilterModel.refresh();
                }.bind(this));
            }
            this.oSupplierWithOrgValueHelp.open();
        }

        /**
         * 자재(Material) Dialog 창
         */
        , onInputMaterialMasterValuePress : function(oEvent){
            var oFilterModel = this.getModel("filterModel");
        
            if(!this.oMaterialMasterValueHelp){
                this.oMaterialMasterValueHelp = new MaterialMasterDialog({
                    multiSelection: false,
                    loadWhenOpen: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                });
                
                this.oMaterialMasterValueHelp.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    oFilterModel.setProperty("/material_code", oSelectedDialogItem.material_code);
                    oFilterModel.setProperty("/material_desc", oSelectedDialogItem.material_desc);

                    oFilterModel.refresh();
                }.bind(this));
            }
            this.oMaterialMasterValueHelp.open();
        }

        /**
         * Search 버튼 클릭(Filter 추출)
         */
        , onSearch: function (oEvent) {
            var oFilterModel = this.getModel("filterModel");
            var oFilterModelData = oFilterModel.getData();

            var aFilters = [];
            var sPlants = oFilterModelData.plant_code;
            var oDateValue = oFilterModelData.dateValue;
            var oSecondDateValue = oFilterModelData.secondDateValue;
            var aRequestors = this.byId("multiInputWithEmployeeValueHelp").getTokens();
            var sBizdivisionCode = oFilterModelData.bizdivision_code;
            var sSupplierCode = oFilterModelData.supplier_code;
            var sMaterialCode = oFilterModelData.material_code;
            var sEffectiveBase = oFilterModelData.effective_base;
            var sRegisterStatus = oFilterModelData.register_status;

            // 플랜트(Plant) 있는 경우
            if( sPlants ) {
                aFilters.push(new Filter("plant_code", FilterOperator.EQ, sPlants));
            }

            // 적용일자(Apply Data)가 있는 경우
            if( oDateValue ) {
                aFilters.push(new Filter("apply_date", FilterOperator.BT, this._changeDateFormat(oDateValue), this._changeDateFormat(oSecondDateValue)));
            }

            // 등록자(Register)가 있는 경우
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

            // 사업부(BUSINESS_DIVISION)가 있는 경우
            if( sBizdivisionCode ) {
                aFilters.push(new Filter("bizdivision_code", FilterOperator.Contains, sBizdivisionCode));
            }

            // 공급업체(SUPPLIER)이 있는 경우
            if( sSupplierCode ) {
                aFilters.push(new Filter("supplier_code", FilterOperator.Contains,  sSupplierCode.toUpperCase()));
            }

            // 자재(Material)이 있는경우
            if( sMaterialCode ) {
                aFilters.push(new Filter("material_code", FilterOperator.EQ, sMaterialCode));
            } 
            
            // Effective Base(마지막 승인자재)이 있는경우
            if( sEffectiveBase ) {
                aFilters.push(new Filter("effective_base", FilterOperator.EQ, sEffectiveBase));
            } 

            // 등록/해제이 있는경우
            if( sRegisterStatus ) {
                aFilters.push(new Filter("register_status", FilterOperator.EQ, sRegisterStatus));
            } 
            console.log(aFilters);
            //this._getExceMaterialList(aFilters);
        },
        
        /**
         * 예외자재 목록 조회
         */
        _getExceMaterialList: function(filtersParam) {
            var oView = this.getView();
            var oModel = this.getModel();
            filtersParam =  Array.isArray(filtersParam) ? filtersParam : [];
            oView.setBusy(true);

            //조회 부문 서비스 cds 없음 
            oModel.read("/Base_Price_Aprl_Master", {
                filters : filtersParam,
                // urlParameters: {
                //     "$orderby": "approval_number desc, request_date desc"
                // },
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
            debugger;
            var sTableId = oEvent.getSource().getParent().getParent().getId();
            if ( !sTableId ) { 
                return; 
            }

            var oTable = this.byId(sTableId);
            var sFileName = "에외자재";
            var oList = oTable.getModel("listModel").getProperty("/results");

            ExcelUtil.fnExportExcel({
                fileName: sFileName || "SpreadSheet",
                table: oTable,
                data: oList
            });
        }

        
    });
  }
);
