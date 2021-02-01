sap.ui.define([
    "./App.controller",
    "ext/lib/model/ManagedListModel",
    "ext/lib/model/TransactionManager",
    "ext/lib/util/Validator",
    "ext/lib/formatter/Formatter",
    "ext/lib/formatter/DateFormatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "dputil/control/ui/MaterialOrgDialog",
    "sap/m/Token",
    "sp/util/control/ui/SupplierDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "cm/util/control/ui/EmployeeDialog",
    "dpmd/util/controller/EmployeeDeptDialog",
    "ext/lib/util/ExcelUtil"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialOrgDialog, Token
        , SupplierDialog, MaterialMasterDialog, EmployeeDialog,EmployeeDeptDialog,ExcelUtil) {
    "use strict";

    var sSelectedDialogPath, sTenantId, oOpenDialog;
    let i = 0;
    let line_no = 1;
    let appr_sequence = 1;

    return BaseController.extend("sp.vi.basePriceMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onNumberComma: function (iPricaeParam) {
            if( iPricaeParam ) {
                return iPricaeParam.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
            }else {
                return iPricaeParam;
            }
        },

        onSetStatus: function (sStatusCodeParam) {
            var oRootModel = this.getModel("rootModel");

            if( oRootModel ) {
                var aProcessList = oRootModel.getProperty("/processList");
                var sReturnValue = aProcessList[0].code_name;
    
                if( sStatusCodeParam === "20" ) {
                    sReturnValue = aProcessList[1].code_name;
                }else if( sStatusCodeParam === "30" ) {
                    sReturnValue = aProcessList[2].code_name;
                }
            }

            return sReturnValue;
        },

        /**
         *  상태값에 따른 Icon 선택
         */
        onSetProcessIcon: function (sStatusParam) {

        },

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            /**
             *  추가 LSH
             */
            // 해당 View(BasePriceDetail)에서 사용할 메인 Model 생성
            this.setModel(new JSONModel(), "detailModel");
            this.setModel(new JSONModel(), "metaldetailMdoel");
            this.setModel(new JSONModel(), "refererModel");
            this.setModel(new JSONModel(), "approverModel");
            this.setModel(new JSONModel(), "excelModel");

            //관리 시세 combobox 데이터 하드코딩
            oRootModel.setProperty("/management_mprice_code", [{code : "MINGT", text:"관리"}, {code : "MPRICE", text:"시세"}]);
            
            this.getModel("metaldetailMdoel").setProperty("/List",[]);
            this.getModel("refererModel").setProperty("/List",[]);

            this.getModel("approverModel").setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);
            this.getModel("approverModel").setProperty("/details",[]);
    
            /**
             *  끝 LSH
             */

            this._oFragments = [];

            // 하드코딩 시작
            var oCodeData = {
                basis: [{code: "10", text: "Cost Analysis (Cost Table)"},
                         {code: "20", text: "Cost Analysis (RFQ)"},
                         {code: "30", text: "Family Part-No"},
                         {code: "40", text: "ETC"}],
                currency: [],
                viewMode: false
            };
            var oDetailViewModel = new JSONModel(oCodeData);
            oDetailViewModel.setSizeLimit(1000);
            this.setModel(oDetailViewModel, "detailViewModel");
            // 하드코딩 끝

            switch (sTenantId) {
                case "L2100" :
                    oCodeData.switchColumnVisible = true;
                    break;
                default :
                    oCodeData.switchColumnVisible = false;
            }

            // Currency 데이터 조회 시작
            var oCurrencyODataModel = this.getOwnerComponent().getModel("currencyODataModel");
            oCurrencyODataModel.read("/Currency", {
                filters : [],
                success : function(data){
                    if( data && data.results ) {
                        oDetailViewModel.setProperty("/currency", data.results);
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });
            // Currency 데이터 조회 끝

            

            // Dialog에서 사용할 Model 생성
            this.setModel(new JSONModel({materialCode: [], familyMaterialCode: [], supplier: []}), "dialogModel");

            // Dialog 생성 시 필요한 데이터 Model 생성
            this.setModel(new JSONModel("./json/dialogInfo.json"), "dialogInfoModel");

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

            //this.setRichEditor();
        }

        /**
         * 추가 LSH
         */
        , onRowSelectadd : function (selected){
            debugger;
            var management = null;
            if( selected === "MANAGEMENT"){
                management = this.getModel("I18N").getProperty("/MANAGEMENT");
            }else if( selected === "MARKET_PRICE"){
                management = this.getModel("I18N").getProperty("/MARKET_PRICE");
            }
            this.onListRowAdd(management);
        }

         /**
          * Base Price 라인 추가
          */
        , onListRowAdd: function (selected) {
            var oView = this.getView();
            var oModel = this.getModel("detailModel");
            var aDetails = oModel.getProperty("/details");
            let today = new Date();
            let year = today.getFullYear();
            

            aDetails.push({
                        row_state : "edit", 
                        status : "추가",
                        line_no : line_no,
                        management : selected,
                        base_year : year,
                        apply_start_date : "",
                        apply_end_date : "",
                        business_division : "",
                        corporation : "",
                        plant : "",
                        supplier_code : "",
                        supplier : "",
                        material_code : "",
                        material : "",
                        vendor_pool : "",
                        currency : "",
                        basePriceUnit : "",
                        base_price : "",
                        buyer : ""
                        });
            oModel.refresh();

            line_no = line_no +1;
        }

        /**
         * 체크된 detail 데이터 삭제
         */
        , onListRowDelete : function (oEvent) {
            var oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/details"),
                oDetailTable = oEvent.getSource().getParent().getParent();

            for( var i=aDetails.length-1; 0<=i; i-- ) {
                if( aDetails[i].checked ) {
                    aDetails.splice(i, 1);
                }
            }

            oDetailModel.refresh();
            oDetailTable.clearSelection();
        }
        
        /**
         * 법인 변경시 플랜트 데이터 변경 
         */
        , onChangeCorporation : function (oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            oDetailModel.setProperty(sSelectedPath+"/org_Plant",this.getModel("rootModel").getProperty("/org_Plant"));
            
            oDetailModel.setProperty(sSelectedPath+"/org_Plant", this.getModel("rootModel").getProperty("/org_Plant/"+oDetailModel.getProperty(sSelectedPath+"/corporation")));
        }

        /**
         * 공급업체 Dialog 창
         */
        , onInputSupplierWithOrgValuePress : function(oEvent){
            var oRootModel = this.getModel("rootModel");
            var RootTenantId = oRootModel.getProperty("/tenantId");
            var oDetailModel = this.getModel("detailModel");
            var oDetailModelPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetail = oDetailModel.getProperty(oDetailModelPath);
            this._oDetail = oDetail;
        
            if(!this.oSupplierWithOrgValueHelp){
                this.oSupplierWithOrgValueHelp = new SupplierDialog({
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }, 
                    multiSelection: false
                });
                
                this.oSupplierWithOrgValueHelp.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.supplier_code = oSelectedDialogItem.supplier_code;
                    this._oDetail.supplier = oSelectedDialogItem.supplier_local_name;
                     oDetailModel.refresh();
                }.bind(this));
            }
            this.oSupplierWithOrgValueHelp.open();
        }

        /**
         * 자재 마스터 Dialog 창
         */
        , onMaterialMasterMultiDialogPress : function(oEvent){          
            var oRootModel = this.getModel("rootModel");
            var RootTenantId = oRootModel.getProperty("/tenantId");
            var oDetailModel = this.getModel("detailModel");
            var oDetailModelPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetail = oDetailModel.getProperty(oDetailModelPath);
            this._oDetail = oDetail;
        
            if(!this.oSearchMultiMaterialMasterDialog){
                this.oSearchMultiMaterialMasterDialog = new MaterialMasterDialog({
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }, 
                    multiSelection: false
                });

                this.oSearchMultiMaterialMasterDialog.attachEvent("apply", function(oEvent){
                    //자매 코드 추가시 자재, 협력사,수량 자동세팅                    
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.material_code = oSelectedDialogItem.material_code;
                    this._oDetail.material = oSelectedDialogItem.material_desc;

                    var material = this.getModel("rootModel").getProperty("/material_code/"+this._oDetail.material_code);

                    if(!material) {
                        MessageBox.show(oEvent.getParameter("item").material_code+"없는 코드입니다.");
                        this._oDetail.vendor_pool = "";
                        this._oDetail.basePriceUnit = "";
                        oDetailModel.refresh();
                        return;
                    }
                    this._oDetail.vendor_pool = material[0].vendor_pool_local_name;
                    this._oDetail.basePriceUnit = material[0].material_price_unit;
                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oSearchMultiMaterialMasterDialog.open();

             

        }

        /**
         * 구매 담당자 Dialog 창
         */
        , onEmployeeDialogPress : function(oEvent){
            var oRootModel = this.getModel("rootModel");
            var RootTenantId = oRootModel.getProperty("/tenantId");
            var oDetailModel = this.getModel("detailModel");
            var oDetailModelPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetail = oDetailModel.getProperty(oDetailModelPath);
            this._oDetail = oDetail;

            if(!this.oEmployeeDialog){
                this.oEmployeeDialog = new EmployeeDialog({
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }, 
                    multiSelection: false
                });

                this.oEmployeeDialog.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.buyer = oSelectedDialogItem.employee_number;

                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oEmployeeDialog.open();
        }

        /**
         * detail 선택 데이터 체크
         */
        , onRowSelectionChange : function (oEvent) {
            var oDetailModel = this.getModel("detailModel"),
                oParameters = oEvent.getParameters(),
                bSelectAll = !!oParameters.selectAll;

            // 전체 선택일 경우
            if( bSelectAll || oParameters.rowIndex === -1 ) {
                var aDetails = oDetailModel.getProperty("/details");
                aDetails.forEach(function(oDetail) {
                    oDetail.checked = bSelectAll;
                });
            }
            // 단독 선택일 경우
            else {
                var oDetail = oDetailModel.getProperty(oParameters.rowContext.getPath());
                oDetail.checked = !oDetail.checked;
            }
        }

        /**
         * 날짜 포맷변경 (YYYYMMDD)
         */
        ,getFormatDate : function (date){
            var year = date.getFullYear();              //yyyy
            var month = (1 + date.getMonth());          //M
            month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
            var day = date.getDate();                   //d
            day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
            
            return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
        }

        /**
         * 날짜 포맷변경 (YYYYMM)
         */
        ,getFormatDateYYYYMM : function (stringdata){
            var strArray = stringdata.replace(" ","");
            strArray = strArray.split('.');
            strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
            var YYYYMM ="20"+ strArray[0] + strArray[1];
            return  YYYYMM;       
        }

        /**
         * 임시 저장
         */
        , onSave: function (oEvent) {
            var approval_status_code = "DR";
            MessageBox.confirm("저장 하시겠습니까?", {
                title : "저장",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._SendDataModel(approval_status_code);
                    }
                }.bind(this)
            });
            
        }

        /**
         * 임시 저장
         */
        , onDraft: function (oEvent) {
            var approval_status_code = "AR";
            MessageBox.confirm("저장 하시겠습니까?", {
                title : "저장",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._SendDataModel(approval_status_code);
                    }
                }.bind(this)
            });
            
        }

        , _SendDataModel : function(approval_status_code){       
            var oDetailModel = this.getModel("detailModel");
            var oData = oDetailModel.getData();
            var date = new Date();
            var today = new Date();
            date = this.getFormatDate(date);
            var type_code = "NPT01";

            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_MST_TYPE
             */
            var oViMst = {
                    tenant_id               : oData.tenant_id,               //테넌트
                    approval_number         : null,                          //품의번호   핸들러에서 부여
                    chain_code              : "SP",                          //체인코드(SP)
                    approval_type_code      : type_code,                     //타입코드(일반(NPT01), SRS(NPT02), 알박/동박(NPT03), 양극재/전구체(NPT04), 사내거래(NPT05), Pack(NPT06))
                    approval_title          : oData.approval_title,          //제목
                    approval_contents       : oData.approval_request_desc,   //설명
                    approve_status_code     : approval_status_code,    //프로세스상태코드(임시저장00, 초안(10), 승인요청(20), 결재완료(30))
                    requestor_empno         : oData.create_user_id,          //요청자( ) 세션정보 받아야함
                    request_date            : date,                          //요청일자(YYYYMMDD)
                    attch_group_number      : "",                            //??
                    local_create_dtm        : null,                          //핸들러에서 부여       
                    local_update_dtm        : null,                          //핸들러에서 부여
                    create_user_id          : oData.create_user_id,
                    update_user_id          : oData.create_user_id
                };            
            var aViMst = [oViMst];


            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_APPROVER_TYPE
             */
            var aViApproverType =[];
            var oApproverModel = this.getModel("approverModel");
            var oApproverData = oApproverModel.getData();
            var aApproverList = oApproverData.details;
            aApproverList.forEach(function(oPrice, idx) {
                var oNewApproverObj = {};
                    oNewApproverObj['tenant_id'] = oData.tenant_id;
                    oNewApproverObj['approval_number'] = null;                  //핸들러에서 부여  
                    oNewApproverObj['approve_sequence'] = String(aApproverList[idx].sequence);                 //핸들러에서 부여  
                    oNewApproverObj['approver_empno'] = aApproverList[idx].empNo;               //임시
                    oNewApproverObj['approver_type_code'] = type_code;
                    oNewApproverObj['approve_status_code'] = aApproverList[idx].statusCode;
                    //comment 추가 
                    //appr_type 추가 
                    oNewApproverObj['local_create_dtm'] = null;
                    oNewApproverObj['local_update_dtm'] = null;
                    oNewApproverObj['create_user_id'] = oData.create_user_id;
                    oNewApproverObj['update_user_id'] = oData.create_user_id;
                aViApproverType.push(oNewApproverObj);
            });

            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_REFERER_TYPE
             */
            var aViRefererType =[];
            var oRefererModel = this.getModel("refererModel");
            var oRefererData = oRefererModel.getData();
            var aRefererList = oRefererData.List;
            aRefererList.forEach(function(oPrice, idx) {
                var oNewRefererObj = {};
                    oNewRefererObj['tenant_id'] = oData.tenant_id;
                    oNewRefererObj['approval_number'] = null;    //핸들러에서 부여  
                    oNewRefererObj['referer_empno'] = aRefererList[idx].ApprEmpNo;  //임시
                    oNewRefererObj['local_create_dtm'] = null;  //핸들러에서 부여       
                    oNewRefererObj['local_update_dtm'] = null;  //핸들러에서 부여  
                    oNewRefererObj['create_user_id'] = oData.create_user_id;
                    oNewRefererObj['update_user_id'] = oData.create_user_id;
                aViRefererType.push(oNewRefererObj);
            });
            
            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_TYPE_TYPE
             */
            var oViType = {
                    tenant_id               : oData.tenant_id,               //테넌트
                    approval_number         : null,                          //품의번호(자동채번)
                    net_price_type_code      : type_code,                     //타입코드(일반(NPT01), SRS(NPT02), 알박/동박(NPT03), 양극재/전구체(NPT04), 사내거래(NPT05), Pack(NPT06))
                    local_create_dtm        : null,                          
                    local_update_dtm        : null,                          
                    create_user_id          : oData.create_user_id,
                    update_user_id          : oData.create_user_id
                };
            var aViType = [oViType];


            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_ITEM_TYPE
             */
            var aPriceResult = [];
            var aPriceData = oData.details;
            aPriceData.forEach(function(oPrice, idx) {
                var strArray = aPriceData[idx].apply_start_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_start_yyyymm ="20"+ strArray[0] + strArray[1];
                var strArray = aPriceData[idx].apply_end_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_end_yyyymm = "20"+ strArray[0] + strArray[1];

                var oNewPriceObj = {};
                    oNewPriceObj['tenant_id'] = oData.tenant_id;
                    oNewPriceObj['approval_number'] = null;                       //핸들러에서 부여
                    oNewPriceObj['item_sequence'] = null;                         //임시  핸들러에서 부여
                    oNewPriceObj['company_code'] = oData.company_code;
                    oNewPriceObj['bizunit_code'] = oData.bizunit_code;          //세션 본부 코드 
                    oNewPriceObj['management_mprice_code'] = aPriceData[idx].management;
                    oNewPriceObj['base_year'] = String(aPriceData[idx].base_year);
                    oNewPriceObj['apply_start_yyyymm'] = String(apply_start_yyyymm);
                    oNewPriceObj['apply_end_yyyymm'] = apply_end_yyyymm;
                    oNewPriceObj['bizdivision_code'] = aPriceData[idx].bizdivision_code;
                    oNewPriceObj['plant_code'] = aPriceData[idx].plant;
                    oNewPriceObj['supply_plant_code'] = null;
                    oNewPriceObj['supplier_code'] = aPriceData[idx].supplier_code;
                    oNewPriceObj['material_code'] = aPriceData[idx].material_code;
                    oNewPriceObj['material_name'] = aPriceData[idx].material;
                    oNewPriceObj['vendor_pool_code'] = aPriceData[idx].vendor_pool;
                    oNewPriceObj['currency_code'] = aPriceData[idx].currency;
                    oNewPriceObj['material_price_unit'] = Number(aPriceData[idx].basePriceUnit);
                    oNewPriceObj['buyer_empno'] = aPriceData[idx].buyer;
                    oNewPriceObj['base_price'] = Number(aPriceData[idx].base_price);
                    oNewPriceObj['pcst'] = null;
                    oNewPriceObj['metal_net_price'] = null;
                    oNewPriceObj['coating_mat_net_price'] = null;
                    oNewPriceObj['fabric_net_price'] = null;
                    oNewPriceObj['local_create_dtm'] = null;               //핸들러에서 부여
                    oNewPriceObj['local_update_dtm'] = null;               //핸들러에서 부여
                    oNewPriceObj['create_user_id'] = oData.create_user_id;
                    oNewPriceObj['update_user_id'] = oData.create_user_id;                    
                aPriceResult.push(oNewPriceObj);
            });

            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_DTL_TYPE
             */
            var aViMetalDetailType =[];
            var oMetalDetailModel = this.getModel("metaldetailMdoel");
            var oMetalDetailData = oMetalDetailModel.getData();
            var aMetalDetailList = oMetalDetailData.List;
            aMetalDetailList.forEach(function(oPrice, idx) {
                var aMetalDetailList = {};
                    aMetalDetailList['tenant_id'] = oData.tenant_id;
                    aMetalDetailList['approval_number'] = null;
                    aMetalDetailList['item_sequence'] = null;
                    aMetalDetailList['metal_type_code'] = null; //임시
                    aMetalDetailList['metal_net_price'] = null;
                    aMetalDetailList['local_create_dtm'] = null;
                    aMetalDetailList['local_update_dtm'] = null;
                    aMetalDetailList['create_user_id'] = oData.create_user_id;
                    aMetalDetailList['update_user_id'] = oData.create_user_id;
                aViMetalDetailType.push(aMetalDetailList);
            });

            var oSendData = {
                inputData : {
                    BasePriceAprlMstType      :  aViMst,
                    BasePriceAprlApproverType :  aViApproverType,
                    BasePriceAprlRefererType  :  aViRefererType,
                    BasePriceAprlTypeType     :  aViType,
                    BasePriceAprlItemType     :  aPriceResult,
                    BasePriceAprlDtlType      :  aViMetalDetailType,
                    type_code                 :  "NPT01"
                }
            };
            console.log("SendData");
            console.log(oSendData);
            this._SendDataSave(oSendData);
        }


        , _SendDataSave: function (oSendData) {

            var targetName = "SpViBasePriceAprlProc";
            var url = "/sp/vi/basePriceMgt/webapp/srv-api/odata/v4/sp.spviBasePriceArlV4Service/" + targetName;
            $.ajax({
                url: url,
                type: "POST",
                data : JSON.stringify(oSendData),
                contentType: "application/json",
                success: function(data){
                    console.log("_sendSaveData", data);
                    if(data) {
                        MessageBox.show("저장되었습니다.", {at: "Center Center"});
                    } else {
                        MessageBox.show("저장 실패 하였습니다.", {at: "Center Center"});
                    }
                }.bind(this),
                error: function(e){
                    console.log("error", e);
                    let eMessage = JSON.parse(e.responseText).error.message;
                    MessageBox.show("저장 실패 하였습니다.\n\n" + "["+eMessage+"]", {at: "Center Center"});
                }
            });
        }

        /**
         * Base Price Detail 데이터 조회
        */
        , _getBasePriceDetail: function () {
            var oView = this.getView();
            var oDetailViewModel = this.getModel("detailViewModel");
            var oDetailModel = this.getModel("detailModel");
            var oRootModel = this.getModel("rootModel");
            var oSelectedData = oRootModel.getProperty("/selectedData");

            sTenantId = oRootModel.getProperty("/tenantId");

            // 리스트에서 선택해서 넘어오는 경우
            if( oSelectedData && oSelectedData.tenant_id ) {
                var that = this;
                var oModel = this.getModel();
                var aFilters = [];
                aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                oModel.read("/Base_Price_Arl_Master", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oDetailViewModel.setProperty("/viewMode", false);

                        if( data && data.results && 0<data.results.length ) {
                            var oMaster = that._returnDataRearrange(data.results[0]);

                            oDetailModel.setData(oMaster);
                            oDetailViewModel.setProperty("/detailsLength", oMaster.details.length);
                        }else {
                            oDetailModel.setData(null);
                            oDetailViewModel.setProperty("/detailsLength", 0);
                        }
                    }.bind(this),
                    error : function(data){
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });
            }else
            // Create 버튼으로 넘어오는 경우
            {
                var oToday = new Date();
                var oNewBasePriceData = {
                                    "tenant_id": oRootModel.getProperty("/tenantId"),
                                    "approval_title": "",
                                    "approval_status_code": "00",
                                    "create_user_id": "5453", 
                                    "company_code" : "LGCKR",
                                    "bizunit_code" : "BIZ00100",
                                    "bizunit_name" : "석유화학",
                                    "org_type_code" : "PL",
                                    "local_update_dtm" : oToday,
                                    "details": []};
                oDetailModel.setData(oNewBasePriceData);
            
                oDetailViewModel.setProperty("/detailsLength", 0);
                oDetailViewModel.setProperty("/viewMode", true);

                this._setTableFragment(oRootModel.getProperty("/selectedApprovalType"));
            }

            //this.setRichEditor();
        }

        /**
         *  excel 업로드
         */
        , onImportChange: function (oEvent) {
            MessageBox.show("excel 업로드 준비중입니다.");
            return;

            var oTable = oEvent.getSource().getParent().getParent();
            var oExcelModel = this.getModel("excelModel"),
                oListModel = this.getModel("detailModel"), 
                that = this;
            
            oExcelModel.setData({});
            ExcelUtil.fnImportExcel({
                uploader: oEvent.getSource(),
                file: oEvent.getParameter("files") && oEvent.getParameter("files")[0],
                model: oExcelModel,
                success: function () {
                    var aCols = oTable.getAggregation("items")[1].getColumns(),
                        oExcelData = this.model.getData();
                        console.log(oExcelData);
                    if (oExcelData) {
                        var aData = oExcelData[Object.keys(oExcelData)[0]];

                        aData.forEach(function (oRow) {
                            var aKeys = Object.keys(oRow),
                                newObj = {};

                            oRow.mi_date = new Date( oRow.mi_date );

                            oListModel.addRecord(oRow, "/details", 0);
							that.validator.clearValueState(that.byId("BasePriceDetailTable"));

                        });
                    }
                }
            });
        }

        /**
          * Base Price 라인 추가
          */
        , onApprRowdd: function () {
            debugger;
            
            var oView = this.getView();
            var oModel = this.getModel("approverModel");
            var aApprDetails = oModel.getProperty("/details");
            
        
            aApprDetails.push({
                        sequence : appr_sequence, 
                        appr_type : "",
                        empNo : "",
                        empNM : "",
                        Department : "",
                        statusCode : "00",
                        status : "미결재",
                        commnet : ""
                        });
            oModel.refresh();

            appr_sequence = appr_sequence +1;
        }

        /**
         * Appr Dialog 창
         */
        , onApprEmployeeDialogPress : function(oEvent){
            var oRootModel = this.getModel("rootModel");
            var RootTenantId = oRootModel.getProperty("/tenantId");
            var oDetailModel = this.getModel("approverModel");
            var oDetailModelPath = oEvent.getSource().getBindingContext("approverModel").getPath();
            var oDetail = oDetailModel.getProperty(oDetailModelPath);
            this._oDetail = oDetail;

            if(!this.oApprEmployeeDialog){
                this.oApprEmployeeDialog = new EmployeeDialog({
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }, 
                    multiSelection: false
                });

                this.oApprEmployeeDialog.attachEvent("apply", function(oEvent){
                    debugger;
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.empNo = oSelectedDialogItem.employee_number;
                    this._oDetail.empNM = oSelectedDialogItem.user_local_name;
                    this._oDetail.Department = oSelectedDialogItem.department_local_name

                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oApprEmployeeDialog.open();
        }

       , onMultiInputWithEmployeeValuePress: function(){ 
            var oRootModel = this.getModel("rootModel");
            var RootTenantId = oRootModel.getProperty("/tenantId");
            var oDetailModel = this.getModel("refererModel");
          
            if(!this.oEmployeeMultiSelectionValueHelp){
               this.oEmployeeMultiSelectionValueHelp = new EmployeeDeptDialog({
                    title: "Choose Referer",
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("referMulti").setTokens(oEvent.getSource().getTokens());
                    if(this.getModel("refererModel").getProperty("/List").length != 0){
                                this.getModel("refererModel").setData(null);
                                this.setModel(new JSONModel(), "refererModel");
                                this.getModel("refererModel").setProperty("/List",[]);                        
                    }
                    for(var i=0; i<=i; i++){
                        if(oEvent.getSource().getTokens()[i] == undefined){
                            break;
                        }else{
                            this.getModel("refererModel").getProperty("/List").push({ApprEmpNo : oEvent.getSource().getTokens()[i].mProperties.key})
                        }
                    }
                }.bind(this));
            }
            this.oEmployeeMultiSelectionValueHelp.open();
            this.oEmployeeMultiSelectionValueHelp.setTokens(this.byId("referMulti").getTokens());

            debugger;
        }

        /**
         * 끝 LSH
         */

        

        /**
         * @description employee 이벤트 1
         */
        , onApproverSearch: function (event) {
            var oItem = event.getParameter("suggestionItem");
            this.handleEmployeeSelectDialogPress(event);
        },
        /**
          * @description employee 이벤트 2
          */
        onSuggest: function (event) {
            var sValue = event.getParameter("suggestValue"),
                aFilters = [];
            console.log("sValue>>> ", sValue, "this.oSF>>", this.oSF);
        },

        /**
         * @description employee 팝업 열기 (돋보기 버튼 클릭시)
         */
        handleEmployeeSelectDialogPress: function (oEvent) { 

            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
            var that = this;
     
            console.log(" row " , row);

            if (approver.getData().Approvers[row].approver_type_code == undefined
                || approver.getData().Approvers[row].approver_type_code == "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                var oView = this.getView();
                console.log("handleEmployeeSelectDialogPress >>> this._oDialog ", this._oDialog);
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "dp.md.moldApprovalList.view.Employee",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    }.bind(this));
                }

                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                    that.byId("btnEmployeeSrch").firePress();
                });
            }
        },
        /**
         * @description employee 팝업에서 search 버튼 누르기 
         */
        onEmployeeSearch: function () {

            var aSearchFilters = [];
            aSearchFilters.push(new Filter("tenant_id", FilterOperator.EQ, 'L2600'));
            var employee = this.byId('employSearch').getValue().trim();
            if (employee != undefined && employee != "" && employee != null) {
                var nFilters = [];

                nFilters.push(new Filter("approver_name", FilterOperator.Contains, String(employee)));
                nFilters.push(new Filter("employee_number", FilterOperator.Contains, String(employee)));

                var oInFilter = {
                    filters: nFilters,
                    and: false
                };
                aSearchFilters.push(new Filter(oInFilter));
            }

            this._bindView("/RefererSearch", "oEmployee", aSearchFilters, function (oData) {
                console.log("/RefererSearch ", oData);
            }.bind(this));

           // console.log(" oEmployee ", this.getModel('oEmployee'));

        },

        /**
         * @description employee 팝업에서 apply 버튼 누르기 
         */
        onEmploySelectionApply: function () {
            var oTable = this.byId("employeeSelectTable");
            var aItems = oTable.getSelectedItems();

            aItems.forEach(function (oItem) {
                var obj = new JSONModel({
                    approver_empno: oItem.getCells()[0].getText(),
                    approver_name: oItem.getCells()[1].getText()
                });
               this._setApprvalItemSetting( obj.oData ); 
            }.bind(this));
            this.onExitEmployee();
        },
        /**
         * @description employee 팝업 닫기 
         */
        onExitEmployee: function () {
            if (this._oDialog) {
                this._oDialog.then(function (oDialog) {
                    oDialog.close();
                    oDialog.destroy();
                });
                this._oDialog = undefined;
            }
        },
        _setApprvalItemSetting : function(obj){
      //  console.log("_setApprvalItemSetting  " , obj);
            var row = this.getApprovalSeletedRow();
            var approver = this.getModel("approver");
              for (var i = 0; i < approver.getData().Approvers.length; i++) { 
                  if(row == i){
                     approver.getData().Approvers[i].approver_empno = obj.approver_empno;
                     approver.getData().Approvers[i].approver_name = obj.approver_name;
                  }
            }
             this.getModel("approver").refresh(true);
        },
        /**
         * today
         * @private
         * @return yyyy-mm-dd
         */
        _getToday: function () {
            var date_ob = new Date();
            var date = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();

            console.log(year + "-" + month + "-" + date);
            return year + "" + month + "" + date;
        },

         onInputWithEmployeeValuePress: function(oEvent){
            var index = oEvent.getSource().getBindingContext("approver").getPath().split('/')[2];
     
            if (this.getModel("approver").getData().Approvers[index].approver_type_code === "") {
                MessageToast.show("Type 을 먼저 선택해주세요.");
            } else {
                this.onInputWithEmployeeValuePress["row"] = index;

                this.byId("employeeDialog").open();
            }
        },

        onEmployeeDialogApplyPress: function(oEvent){
            var employeeNumber = oEvent.getParameter("item").employee_number,
                userName = oEvent.getParameter("item").user_local_name,
                departmentLocalName = oEvent.getParameter("item").department_local_name,
                oModel = this.getModel("approver"),
                rowIndex = this.onInputWithEmployeeValuePress["row"];

            oModel.setProperty("/Approvers/"+rowIndex+"/approver_empno", employeeNumber);
            oModel.setProperty("/Approvers/"+rowIndex+"/approver_name", userName + " / " + departmentLocalName);
        }        

        ,_setTableFragment: function (sFragmentNamePAram) {
        //     var oSection = this.byId("bacePriceTableSection");
        //     oSection.removeAllBlocks();

        //     this._loadFragment(sFragmentNamePAram, function (oFragment) {
        //        oSection.addBlock(oFragment);
        //    }.bind(this));

        }

        ,_loadFragment: function (sFragmentName, oHandler) {
           if (!this._oFragments[sFragmentName]) {
               Fragment.load({
                   id: this.getView().getId(),
                   name: "sp.vi.basePriceMgt.view." + sFragmentName,
                   controller: this
               }).then(function (oFragment) {
                   this._oFragments[sFragmentName] = oFragment;
                   if (oHandler) oHandler(oFragment);
               }.bind(this));
           } else {
               if (oHandler) oHandler(this._oFragments[sFragmentName]);
           }
       },

        /**
         * 수정모드 변경
         */
        onEditToggle: function () {
            var oDetailViewModel = this.getModel("detailViewModel");
            oDetailViewModel.setProperty("/viewMode", !oDetailViewModel.getProperty("/viewMode"));
        },

        /**
         * Editor 상태 및 값 세팅
         */
        _setEditorStatusAndValue: function (sApprovalStatusCodeParam, sApprovalRequestDescParam) {
            var bEditor = true;
            var oEditor = sap.ui.getCore().byId(this.getView().getId()+"myRTE");
            sApprovalRequestDescParam = sApprovalRequestDescParam || "";
            
            // 상태가 Draft가 아닐 경우 Editor editable false
            if( sApprovalStatusCodeParam !== "10" ) {
                bEditor = false;
            }

            oEditor.setEditable(bEditor);
            oEditor.setValue(sApprovalRequestDescParam);
        },

        /**
         * 편집기(Editor) 창 세팅
         */
        setRichEditor: function (){
            var that = this,
            sHtmlValue = ''
            sap.ui.require(["sap/ui/richtexteditor/RichTextEditor", "sap/ui/richtexteditor/EditorType"],
                function (RTE, EditorType) {
                    var oRichTextEditor = new RTE(that.getView().getId()+"myRTE", {
                        editorType: EditorType.TinyMCE4,
                        width: "100%",
                        height: "200px",
                        customToolbar: true,
                        showGroupFont: true,
                        showGroupLink: true,
                        showGroupInsert: true,
                        value: sHtmlValue,
                        ready: function () {
                            this.addButtonGroup("styleselect").addButtonGroup("table");
                        }
                    });

                    that.getView().byId("idVerticalLayout").addContent(oRichTextEditor);
            });
        },

        /**
         * 리턴 데이터 화면에 맞게 변경
         */
        _returnDataRearrange: function (oDataParam) {
            var oMaster = oDataParam;
            var aDetails = oMaster.details.results;
            var iDetailsLen = aDetails.length;

            for( var i=0; i<iDetailsLen; i++ ) {
                var oDetail = aDetails[i];
                oDetail.prices = oDetail.prices.results;

                oDetail.purOrg = this.getModel("rootModel").getProperty("/purOrg/"+oDetail.company_code);
            }

            oMaster.details = aDetails;

            return oMaster;
        },

        /**
         * key값 추출
         */
        _getMasterKey: function (oDataParam, sTableNameParam) {
            var oKey = {};

            if( sTableNameParam === "Master" ) {
                oKey.tenant_id = oDataParam.tenant_id;
                oKey.approval_number = oDataParam.approval_number;
            }

            return oKey;
        },

        /**
         * 삭제
         */
        onDelete: function () {
            var oI18nModel = this.getModel("I18N");

            MessageBox.confirm(oI18nModel.getText("/NCM00003"), {
                title : "Delete",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        var oModel = this.getModel();
                        var sDeletePath = oModel.createKey("/Base_Price_Arl_Master", this._getMasterKey(this.getModel("detailModel").getData(), "Master"));
                        
                        oModel.remove(sDeletePath, {
                            success: function(data){
                                MessageToast.show(oI18nModel.getText("/NCM01002"));
                                this.onBack();
                            }.bind(this),
                            error: function(data){
                                console.log('remove error', data.message);
                                MessageBox.error(JSON.parse(data.responseText).error.message.value);
                            }
                        });
                    }
                }.bind(this)
            });
        },

        /**
         * 상신
         */
        onRequest : function () {
            var oI18nModel = this.getModel("I18N");

            MessageBox.confirm("요청 하시겠습니까?", {
                title : "Request",
                initialFocus : sap.m.MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this.onDraft("approval");
                    }
                }.bind(this)
            });
        },

        /**
         * List 화면으로 이동
         */
        onBack: function () {
            var oRootModel = this.getModel("rootModel");
            oRootModel.setProperty("/selectedData", null);

            this.getRouter().navTo("basePriceList");
        },

        onDeveloping: function () {
            MessageBox.information("준비중");
        },

        /**
         * ==================== Dialog 시작 ==========================
         */
        /**
         * Material Dialog.fragment open
         */
		_openMaterialCodeDialog: function (sQueryParam) {
            var oView = this.getView();

            if ( !this._oMaterialDialog ) {
                this._oMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.vi.basePriceMgt.view.MaterialDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            oOpenDialog = this._oMaterialDialog;
            
            this._oMaterialDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "materialCodeTable");
            }.bind(this));
        },

         /**
         * Material Code Dialog data 조회
         */
        onGetMaterialCodeDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Material_Mst", {
                filters : aFilters,
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openMaterialCodeDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/materialCode", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
                }
            });
        },

        /**
         * Supplier Dialog.fragment open
         */
		_openSupplierDialog: function (sQueryParam, sTableIdParam) {
            var oView = this.getView();

            if ( !this._oSupplierDialog ) {
                this._oSupplierDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.vi.basePriceMgt.view.SupplierDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            oOpenDialog = this._oSupplierDialog;
            
            this._oSupplierDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "supplierTable");
            }.bind(this));
        },
        
         /**
         * Supplier Dialog data 조회
         */
        onGetSupplierDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("supplier_local_name", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Supplier_Mst", {
                filters : aFilters,
                urlParameters: {"$top": 40},
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openSupplierDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/supplier", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
                }
            });
        },
        
        /**
         * Family Material Code Dialog.fragment open
         */
		_openFamilyMaterialCodeDialog: function (sQueryParam, sTableIdParam) {
            var oView = this.getView();

            if ( !this._oFamilyMaterialDialog ) {
                this._oFamilyMaterialDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sp.vi.basePriceMgt.view.FamilyMaterialDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            oOpenDialog = this._oFamilyMaterialDialog;
            
            this._oFamilyMaterialDialog.then(function(oDialog) {
                oDialog.open();
                this._setTableQueryText(sQueryParam, "familyMaterialCodeTable");
            }.bind(this));
        },
        
         /**
         * Family Material Code Dialog data 조회
         */
        onGetFamilyMaterialCodeDialogData: function (oEvent) {
            // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
            var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
            if( oBindingContext ) {
                sSelectedDialogPath = oBindingContext.getPath();
            }
            
            var oModel = this.getModel();
            var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
            var sQuery = oEvent.getSource().getValue();

            if( sQuery ) {
                aFilters.push(new Filter("material_code", FilterOperator.Contains, sQuery));
            }

            oModel.read("/Material_Mst", {
                filters : aFilters,
                success: function(data) {
                    if( oBindingContext ) { 
                        this._openFamilyMaterialCodeDialog(sQuery);
                    }

                    this.getModel("dialogModel").setProperty("/failyMaterialCode", data.results);
                }.bind(this),
                error: function(data){
                    console.log('error', data);
                    MessageBox.error(JSON.parse(data.responseText).error.message.value);
                }
            });
        },

        /**
         * Table SearchField에 검색에 세팅
         */
        _setTableQueryText: function (sQueryParam, sTableIdParam) {
            var oTable = this.byId(sTableIdParam);
            // 테이블 SearchField 검색값 초기화
            if( oTable ) {
                oTable.getHeaderToolbar().getContent()[2].setValue(sQueryParam);
            }
        },

        /**
         * Dialog data 조회
         */
        // onGetDialogData: function (oEvent) {
        //     // Table에서 클릭한 경우 oBindingcontext 객체가 있고 Dialog에서 조회한 경우 undefined
        //     var oBindingContext = oEvent.getSource().getBindingContext("detailModel");
        //     if( oBindingContext ) {
        //         sSelectedDialogPath = oBindingContext.getPath();
        //     }
            
        //     var sSelectedDialogInfo = oEvent.getSource().data("dialog");
        //     var oModel = this.getModel();
        //     var aFilters = [new Filter("tenant_id", FilterOperator.EQ, sTenantId)];
        //     var oDialogInfoModel = this.getModel("dialogInfoModel");
        //     var sQuery = oEvent.getSource().getValue();

            
        //     // open된 Dialog에 정보. json데이터에서 읽어드림
        //     // sTableId: 각 Dialog의 table id
        //     // oDdataUrl: OData Url
        //     // filterPropertyName: 추가할 Filter property
        //     // modelPath: dialogModel에 바인딩할  path
        //     var oSelectedDialogInfo = oDialogInfoModel.getProperty("/"+sSelectedDialogInfo);
            
        //     if( sQuery ) {
        //         aFilters.push(new Filter(oSelectedDialogInfo.filterPropertyName, FilterOperator.Contains, sQuery));
        //     }

        //     var sUrlParameter = {};
        //     if( sSelectedDialogInfo === "supplier" ) {
        //         sUrlParameter = {"$top": 40};
        //     }

        //     oModel.read(oSelectedDialogInfo.oDataUrl, {
        //         filters : aFilters,
        //         urlParameters: sUrlParameter,
        //         success: function(data) {
        //             // Table에서 클릭한 경우
        //             if( oBindingContext ) { 
        //                 // 검색데이터가 한개인 경우 Dialog Open하지 않고 데이터 세팅
        //                 if( 1 === data.results.length ) {
        //                     var oDetailModel = this.getModel("detailModel");
        //                     var oSelectedDetall = oDetailModel.getProperty(sSelectedDialogPath);
        //                     var oResultData = data.results[0];

        //                     this._setDialogData(data.results[0], sSelectedDialogInfo);
        //                 }
        //                 // 검샘데이터가 없거나 여러개인 경우 Dialog Open
        //                 else {
        //                     switch(sSelectedDialogInfo) {
        //                         case "materialCode":
        //                             this._openMaterialCodeDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                         case "supplier":
        //                             this._openSupplierDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                         case "familyMaterialCode":
        //                             this._openFamilyMaterialCodeDialog(sQuery, oSelectedDialogInfo.tableId);
        //                             break;
        //                     }
                            
        //                     this.getModel("dialogModel").setProperty("/"+sSelectedDialogInfo, data.results);
        //                 }
        //             }
        //             // Dialog에서 조회한 경우
        //             else {
        //                 this.getModel("dialogModel").setProperty("/"+sSelectedDialogInfo, data.results);
        //             }
        //         }.bind(this),
        //         error: function(data){
        //             console.log('error', data);
        //             MessageBox.error(JSON.parse(data.responseText).error.message.value);
        //         }
        //     });
        // },

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
            var sDialogSelectedPath = oEvent.getSource().getSelectedContextPaths()[0];
            var sSelectedDialog = sDialogSelectedPath.substring(sDialogSelectedPath.indexOf("/")+1, sDialogSelectedPath.lastIndexOf("/"));
            var aDialogData = this.getModel("dialogModel").getProperty("/"+sSelectedDialog);
            var bChecked = false;

            for( var i=0; i<aDialogData.length; i++ ) {
                var oDialogData = aDialogData[i];

                if( oDialogData.checked ) {
                    this._setDialogData(oDialogData, sSelectedDialog);

                    delete oDialogData.checked;
                    bChecked = true;
                    break;
                }
            }

            // 선택된 Material Code가 있는지 경우
            if( bChecked ) {
                oEvent.getSource().removeSelections();
                this.onClose(sSelectedDialog);
            }
            // 선택된 Material Code가 없는 경우
            else {
                MessageBox.error("추가할 데이터를 선택해 주십시오.");
            }
        },

        /**
         * 선택한 데이터 Detail Model에 세팅
         */
        _setDialogData: function (oGetDataParam, sSelectedDialogParam) {
            var oDetailModel = this.getModel("detailModel");
            var oSelectedDetail = oDetailModel.getProperty(sSelectedDialogPath);

            switch(sSelectedDialogParam) {
                case "materialCode":
                    if( !oSelectedDetail.material_code_fk ) {
                        oSelectedDetail.material_code_fk = {};
                    }
                    oSelectedDetail.material_code = oGetDataParam.material_code;
                    oSelectedDetail.material_code_fk.material_desc = oGetDataParam.material_desc;
                    oSelectedDetail.material_code_fk.material_spec = oGetDataParam.material_spec;
                    break;
                case "supplier":
                    oSelectedDetail.supplier_code = oGetDataParam.supplier_code;
                    oSelectedDetail.supplier_local_name = oGetDataParam.supplier_local_name;
                    break;
            }

            oDetailModel.refresh();
        },
          
        /**
         * Dialog Close
         */
        onClose: function (oEvent) {
            oOpenDialog.then(function(oDialog) {
                oDialog.close();
            });
        },

        /**
         * ==================== Dialog 끝 ==========================
         */
    });

  }
);
