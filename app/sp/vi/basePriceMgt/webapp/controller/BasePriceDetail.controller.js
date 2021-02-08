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
    "./MaterialOrgDialog",
    "sap/m/Token",
    "sp/util/control/ui/SupplierDialog",
    "dp/util/control/ui/MaterialMasterDialog",
    "cm/util/control/ui/EmployeeDialog",
    "dpmd/util/controller/EmployeeDeptDialog",
    "ext/lib/util/ExcelUtil",
    "ext/lib/util/Multilingual"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialOrgDialog, Token
        , SupplierDialog, MaterialMasterDialog, EmployeeDialog,EmployeeDeptDialog,ExcelUtil, Multilingual) {
    "use strict";

    var sSelectedDialogPath, sTenantId, oOpenDialog;
    let i = 0;
    let line_no = 1;
    let appr_sequence = 1;

    return BaseController.extend("sp.vi.basePriceMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

            this.setModel(new Multilingual().getModel(), "I18N");

            // 해당 View(BasePriceDetail)에서 사용할 메인 Model 생성
            this.setModel(new JSONModel(), "detailModel");
            this.setModel(new JSONModel(), "metaldetailMdoel");
            this.setModel(new JSONModel(), "refererModel");
            this.setModel(new JSONModel(), "approverModel");
            this.setModel(new JSONModel(), "detailViewModel");
            this.setModel(new JSONModel(), "excelModel");

            //관리 시세 combobox 데이터 하드코딩
            oRootModel.setProperty("/management_mprice_code", [{code : "MINGT", text:"관리"}, {code : "MPRICE", text:"시세"}]);
            
            this.getModel("metaldetailMdoel").setProperty("/List",[]);
            this.getModel("refererModel").setProperty("/List",[]);

            this.getModel("approverModel").setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);
            this.getModel("approverModel").setProperty("/details",[]);
    
            this.setModel(new JSONModel(), "currModel");
                        
            this.getCurrSearch();

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

        }

        , getCurrSearch : function (){
            var oView = this.getView();
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            var oCurrModel =this.getModel("currModel");
            oCurrModel.setSizeLimit(1000);
            oView.setBusy(true);

            // 통화 조회
            var oCurryModel =  this.getOwnerComponent().getModel("currencyODataModel");
            var aOrgCompFilter = [new Filter("tenant_id", FilterOperator.EQ, oRootModel.getProperty("/tenantId"))];
            oCurryModel.read("/Currency", {
                filters : [aOrgCompFilter],
                success : function(data){
                    oView.setBusy(false);
                    if( data && data.results ) {
                        
                        oCurrModel.setProperty("/org_Currency", data.results);    
                    }
                },
                error : function(data){
                    console.log("error", data);
                }
            });

        }


        , onRowSelectadd : function (selected){
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
            
            var sApply_start_date = "";
            var sApply_end_date = "";
            var sBusiness_division = "";
            var sCorporation = "";
            var sPlant = "";
            var sSupplier_code = "";
            var sSupplier = "";
            var sMaterial_code = "";
            var sMaterial = "";
            var sVendor_pool_code = "";
            var sVendor_pool = "";
            var sCurrency = "";
            var sBase_uom_code = "";
            var sBase_price = "";
            var sBuyer = "";

            // if(!aDetails[0].apply_start_date){

            //     sApply_start_date = aDetails[0].apply_start_date;
            //     sApply_end_date = aDetails[0].apply_end_date;
            //     sBusiness_division = aDetails[0].business_division;
            //     sCorporation = aDetails[0].corporation;
            //     sPlant = aDetails[0].plant;
            //     sSupplier_code = aDetails[0].supplier_code;
            //     sSupplier = aDetails[0].supplier;
            //     sMaterial_code = aDetails[0].material_code;
            //     sMaterial = aDetails[0].material;
            //     sVendor_pool_code = aDetails[0].vendor_pool_code;
            //     sVendor_pool = aDetails[0].vendor_pool;
            //     sCurrency = aDetails[0].currency;
            //     sBase_uom_code = aDetails[0].base_uom_code;
            //     sBase_price = aDetails[0].base_price;
            //     sBuyer = aDetails[0].buyer;
            // }


            aDetails.push({
                        row_state : "edit", 
                        status : "추가",
                        line_no : line_no,
                        management : selected,
                        base_year : year,
                        apply_start_date : sApply_start_date,
                        apply_end_date : sApply_end_date,
                        business_division : sBusiness_division,
                        corporation : sCorporation,
                        plant : sPlant,
                        supplier_code : sSupplier_code,
                        supplier : sSupplier,
                        material_code : sMaterial_code,
                        material : sMaterial,
                        vendor_pool_code : sVendor_pool_code,
                        vendor_pool : sVendor_pool,
                        currency : sCurrency,
                        base_uom_code : sBase_uom_code,
                        base_price : sBase_price,
                        buyer : sBuyer
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

            for( var i=0; i<=aDetails.length-1; i++ ) {
                aDetails[i].line_no = i+1;
            }
            line_no = aDetails.length + 1;

            oDetailModel.refresh();
            oDetailTable.clearSelection();
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
         * 체크된 Approval 데이터 삭제
         */
        , onApprtRowDelete : function (oEvent) {
            var oDetailModel = this.getModel("approverModel"),
                aDetails = oDetailModel.getProperty("/details"),
                oDetailTable = oEvent.getSource().getParent().getParent();

            for( var i=aDetails.length-1; 0<=i; i-- ) {
                if( aDetails[i].checked ) {
                    aDetails.splice(i, 1);
                }
            }

            for( var i=0; i<=aDetails.length-1; i++ ) {
                aDetails[i].appr_sequence = i+1;
            }
            appr_sequence = aDetails.length + 1;

            oDetailModel.refresh();
            oDetailTable.clearSelection();
        }

        /**
         * Approval 선택 데이터 체크
         */
        , onApprRowSelectionChange : function (oEvent) {
            var oDetailModel = this.getModel("approverModel"),
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
         * 시세의 경우 적용시작월 선택시 적종종료월이 적용시작월로 픽스(수정불가)
         */
        , onChangeStartData : function(oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetailData = oDetailModel.getProperty(sSelectedPath);

            var management = "";
            if(oDetailData.management == "관리"){
                 management = "MNGT"
            }else if(oDetailData.management == "시세"){
                management = "MPRICE"

                //oDetailData.apply_end_data = oDetailData.apply_start_date;
                oDetailModel.setProperty(sSelectedPath+"/apply_end_date", oDetailData.apply_start_date);
                oDetailModel.refresh();
            }         
            var nAfterBase_year = Number(oDetailData.base_year) + 1;
            var StartData = this.getFormatDateYYYYMM(oDetailData.apply_start_date);
            if( StartData < oDetailData.base_year+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_start_date = "";
                return;

            }else if( StartData >= String(nAfterBase_year)+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_start_date = "";
                return;
            }

        }

        /**
         * 시세의 경우 적용시작월 선택시 적종종료월이 적용시작월로 픽스(수정불가)
         */
        , onChangeEndData : function(oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetailData = oDetailModel.getProperty(sSelectedPath);

            var nAfterBase_year = Number(oDetailData.base_year) + 1;
            var EndData = this.getFormatDateYYYYMM(oDetailData.apply_end_date);
            if( EndData < oDetailData.base_year+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_end_date = "";
                return;

            }else if( EndData >= String(nAfterBase_year)+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_end_date = "";
                return;
            }

        }

        /**
         * 법인 변경시 플랜트 데이터 변경 
         */
        , onChangeCorporation : function (oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var rootData = oDetailModel.getProperty(sSelectedPath);

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
                    multiSelection: false,
                    loadWhenOpen: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }
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
          * Material Code Dailog 호출
          */
        , onMaterialMasterMultiDialogPress: function (oEvent) {
             var oRootModel = this.getModel("rootModel");
             var oDetailModel = this.getModel("detailModel");
             var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
             var oDetail = oDetailModel.getProperty(sSelectedPath);
             this._oDetail = oDetail;

             if( !this.oSearchMultiMaterialOrgDialog) {
                 this.oSearchMultiMaterialOrgDialog = new MaterialOrgDialog({
                     title: "Choose MaterialMaster",
                     multiSelection: false,
                     closeWhenApplied: true,
                     loadWhenOpen: false,
                     tenantId: sTenantId,
                     items: {
                         filters:[
                             new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                         ]
                     }
                 })

                 this.oSearchMultiMaterialOrgDialog.attachEvent("apply", function(oEvent) {
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.material_code = oSelectedDialogItem.material_code;
                    this._oDetail.material  = oSelectedDialogItem.material_desc;
                    this._oDetail.vendor_pool_code = oSelectedDialogItem.vendor_pool_code;
                    this._oDetail.vendor_pool = oSelectedDialogItem.vendor_pool_local_name;
                    this._oDetail.base_uom_code = oSelectedDialogItem.base_uom_code;

                    oDetailModel.refresh();
                 }.bind(this));
             }

             this.oSearchMultiMaterialOrgDialog.open();

             var aTokens = [new Token({key: oDetail.material_code, text: oDetail.material_desc})];
             this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
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
                    multiSelection: false,
                    closeWhenApplied: true,
                    loadWhenOpen: false,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, RootTenantId)
                        ]
                    }
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
         * 임시 저장(DR)
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
         * 임시 저장(AR)
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

            if (!oViMst.approval_title){
                MessageBox.show("품의서 제목은 필수입니다.");
                return;
            }

            if (!oViMst.approval_contents){
                MessageBox.show("품의서 설명은 필수입니다.");
                return;
            }
            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_APPROVER_TYPE
             */
            var aViApproverType =[];
            var oApproverModel = this.getModel("approverModel");
            var oApproverData = oApproverModel.getData();
            var aApproverList = oApproverData.details;
            if(aApproverList.length === 0){
                 MessageBox.show("결재자가 없습니다. ");
                 return;
            }
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

                    for (var i=0; i<=aViApproverType.length-1; i++){
                        if (!aApproverList[idx].empNo){
                            MessageBox.show("결재자가 없습니다. ");
                            return;
                        }
                    }
                    
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
            var oRootModel = this.getModel("rootModel");
            if(aPriceData.length === 0){
                MessageBox.show("기준단가 목록이 필요합니다. ");
                return;
            }
            
            aPriceData.forEach(function(oPrice, idx) {
                var strArray = aPriceData[idx].apply_start_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_start_yyyymm ="20"+ strArray[0] + strArray[1];
                var strArray = aPriceData[idx].apply_end_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_end_yyyymm = "20"+ strArray[0] + strArray[1];
                var management = "";
                if(aPriceData[idx].management == "관리"){
                    management = "MNGT"
                }else if(aPriceData[idx].management == "시세"){
                    management = "MPRICE"
                }
                
                var oNewPriceObj = {};
                    oNewPriceObj['tenant_id'] = oData.tenant_id;
                    oNewPriceObj['approval_number'] = null;                       //핸들러에서 부여
                    oNewPriceObj['item_sequence'] = null;                         //임시  핸들러에서 부여
                    oNewPriceObj['company_code'] = aPriceData[idx].corporation;
                    oNewPriceObj['bizunit_code'] = oData.bizunit_code;          //세션 본부 코드 
                    oNewPriceObj['management_mprice_code'] = management;
                    oNewPriceObj['base_year'] = String(aPriceData[idx].base_year);
                    oNewPriceObj['apply_start_yyyymm'] = String(apply_start_yyyymm);
                    oNewPriceObj['apply_end_yyyymm'] = String(apply_end_yyyymm);
                    oNewPriceObj['bizdivision_code'] = aPriceData[idx].business_division;
                    oNewPriceObj['plant_code'] = aPriceData[idx].plant;
                    oNewPriceObj['supply_plant_code'] = null;
                    oNewPriceObj['supplier_code'] = aPriceData[idx].supplier_code;
                    oNewPriceObj['material_code'] = aPriceData[idx].material_code;
                    oNewPriceObj['material_name'] = aPriceData[idx].material;
                    oNewPriceObj['vendor_pool_code'] = aPriceData[idx].vendor_pool_code;
                    oNewPriceObj['currency_code'] = aPriceData[idx].currency_code;
                    oNewPriceObj['base_uom_code'] = aPriceData[idx].base_uom_code;
                    oNewPriceObj['buyer_empno'] = aPriceData[idx].buyer;
                    oNewPriceObj['base_price'] = parseFloat(aPriceData[idx].base_price);
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

            for (var i=0; i<=aPriceResult.length-1; i++){

                //적용시작월 체크
                var nAfterBase_year = Number(aPriceResult[i].base_year) + 1;
                if( aPriceResult[i].apply_start_yyyymm < aPriceResult[i].base_year+"01"){
                    MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                    return;
                //적용종료월 체크
                }else if( aPriceResult[i].apply_start_yyyymm > String(nAfterBase_year)+"01"){
                    MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                    return;
                }
                
                if (!aPriceResult[i].bizdivision_code){
                    MessageBox.show("사업부는 필수입니다.");
                    return;
                }

                if (!aPriceResult[i].company_code){
                    MessageBox.show("법인는 필수입니다");
                    return;
                }

                if (!aPriceResult[i].plant_code){
                    MessageBox.show("플랜트는 필수입니다. ");
                    return;
                }

                if (!aPriceResult[i].supplier_code){
                    MessageBox.show("공급업체코드는 필수입니다. ");
                    return;
                }

                if (!aPriceResult[i].material_code){
                    MessageBox.show("자재코드는 필수입니다.");
                    return;
                }

                if (!aPriceResult[i].currency_code){
                    MessageBox.show("통화는 필수입니다. ");
                    return;
                }    

                //기준단가 널처리 
                if (!aPriceData[i].base_price){
                    MessageBox.show("기준단가는 필수입니다. ");
                    return;
                } 
                //가준단가 숫자처리
                var OnlyNumber = this.onOnlyNumber(aPriceData[i].base_price);
                if(OnlyNumber){
                    MessageBox.show("숫자만 입력 가능합니다.");
                    return;
                }
                //기준단가 소수점 체크
                var t = String(aPriceResult[i].base_price);
                if(t.indexOf('.') != -1){
                    var t_length = t.substring(t.indexOf('.') + 1);
                    if(t_length.length > 4){
                        MessageBox.show('소수 네자리까지만 입력됩니다.');
                        return;
                    }
                } 
                
                if (!aPriceResult[i].buyer_empno){
                    MessageBox.show("구매담당자는 필수입니다. ");
                    return;
                }
                
            }

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
                        this.onBack();

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
            var oRootModel = this.getModel("rootModel");

            var oDetailModel = this.getModel("detailModel");
            var oApprModel = this.getModel("approverModel");
            var oRefererModel = this.getModel("refererModel");
            var oRefererModel = this.getModel("metaldetailMdoel");
           
            //Main 화면에서 가져온 데이터
            var oSelectedData = oRootModel.getProperty("/selectedData");

            // 리스트에서 선택해서 넘어오는 경우
            if(oSelectedData) {
                debugger;
                var oModel = this.getModel("basePriceArl");
                var aFilters = [];
                    aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                    aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));
                    aFilters.push(new Filter("net_price_type_code", FilterOperator.EQ, oSelectedData.net_price_type_code));
                    aFilters.push(new Filter("chain_code", FilterOperator.EQ, oSelectedData.chain_code));

                oView.setBusy(true);

                oModel.read("/Base_Price_Aprl_Master", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oDetailViewModel.setProperty("/viewMode", true);
                        oDetailModel.setData(data.results[0]);
                        console.log("oDetailModel");
                        console.log(oDetailModel);
                        console.log("oDetailViewModel");
                        console.log(oDetailViewModel);
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
                                    "create_user": "**영",
                                    "company_code" : "LGCKR",
                                    "bizunit_code" : "BIZ00100",
                                    "bizunit_name" : "석유화학",
                                    "org_type_code" : "PL",
                                    "local_update_dtm" : oToday,
                                    "details": []};
                oDetailModel.setData(oNewBasePriceData);
                
                var oNewApproverData = {"details" : []};
                oApprModel.setData(oNewApproverData);
                this.getModel("approverModel").setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);

            }
        }

        /**
         * 상태 Text 변환
         */
        , onSetStatusText: function (sStatusCodeParam) {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");;
            var sReturnValue = "";

            if( oRootModel ) {
                var aProcessList = oRootModel.getProperty("/processList");
                
                if( aProcessList ) {
                    sReturnValue = this.getModel("I18N").getProperty("/NEW");

                    if( sStatusCodeParam === "DR" ) {
                        sReturnValue = aProcessList[0].code_name;
                    }else if( sStatusCodeParam === "AR" ) {
                        sReturnValue = aProcessList[1].code_name;
                    }else if( sStatusCodeParam === "IA" ) {
                        sReturnValue = aProcessList[2].code_name;
                    }else if( sStatusCodeParam === "AP" ) {
                        sReturnValue = aProcessList[3].code_name;
                    }else if( sStatusCodeParam === "RJ" ) {
                        sReturnValue = aProcessList[4].code_name;
                    }
                }
            }

            return sReturnValue;
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
                    loadWhenOpen: false,
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

        }

        /**
         * List 화면으로 이동
         */
       , onBack: function () {
            var oRootModel = this.getModel("rootModel");
            //oRootModel.setProperty("/selectedData", null);
            //var oApprover = this.getModel("")

            line_no = 1;
            appr_sequence = 1;
            
            this.getRouter().navTo("basePriceList");
        }

        /**
         *  숫자만 입력 
         */
        , onOnlyNumber : function (val){
            var regex= /^[0-9]/g;
            if( !regex.test(val) ){
                //MessageBox.show("숫자만 입력 가능합니다.");
                return true;
            }
            return false;
        }
  });
});
