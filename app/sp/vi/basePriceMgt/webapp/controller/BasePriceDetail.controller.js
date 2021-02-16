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
    "ext/lib/util/Multilingual",
    "ext/lib/util/UUID"
],
  function (BaseController, ManagedListModel, TransactionManager, Validator, Formatter, DateFormatter,
        JSONModel, ODataModel, RichTextEditor, MessageBox, Fragment, Filter, FilterOperator, MessageToast, MaterialOrgDialog, Token
        , SupplierDialog, MaterialMasterDialog, EmployeeDialog,EmployeeDeptDialog,ExcelUtil, Multilingual,UUID) {
    "use strict";

    var sSelectedDialogPath, sTenantId, sBizunitCode, oOpenDialog;
    let i = 0;
    let item_sequence = 1;
    let appr_sequence = 1;
    var _oFragmentUploadCollection;
    var _oFragmentController; 

    return BaseController.extend("sp.vi.basePriceMgt.controller.BasePriceDetail", {
        dateFormatter: DateFormatter,

        onInit: function () {
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            sTenantId = oUserModel.getProperty("/tenantId");
            sBizunitCode = oUserModel.getProperty("/bizunit_code");

            this.setModel(new Multilingual().getModel(), "I18N");

            // 해당 View(BasePriceDetail)에서 사용할 메인 Model 생성
            this.setModel(new JSONModel(), "detailModel");
            this.setModel(new JSONModel(), "metaldetailMdoel");
            this.setModel(new JSONModel(), "refererModel");
            this.setModel(new JSONModel(), "approverModel");
            this.setModel(new JSONModel(), "detailViewModel");
            this.setModel(new JSONModel(), "excelModel");
            
            this.getModel("metaldetailMdoel").setProperty("/results",[]);
            this.getModel("refererModel").setProperty("/results",[]);
    
            this.setModel(new JSONModel(), "currModel");
                        
            this.getCurrSearch();

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

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
                var oModel = this.getModel("basePriceArl");
                var aFilters = [];
                    aFilters.push(new Filter("tenant_id", FilterOperator.EQ, oSelectedData.tenant_id));
                    aFilters.push(new Filter("approval_number", FilterOperator.EQ, oSelectedData.approval_number));

                oView.setBusy(true);

                //Master 데이터 조회
                oModel.read("/Base_Price_Aprl_Master", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oDetailViewModel.setProperty("/viewMode", false);
                        oDetailModel.setData(data.results[0]);
                    }.bind(this),
                    error : function(data){
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });

                //Item 데이터 조회 
                oModel.read("/Base_Price_Aprl_Item_Dtl", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oDetailModel.setProperty("/results",[]); 
                        for (i = 0; i<data.results.length; i++){
                            oDetailModel.getProperty("/results").push(data.results[i]);
                        }
                        oDetailModel.refresh();                      
                    }.bind(this),
                    error : function(data){
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });

                //Approver 데이터 조회 
                oModel.read("/Base_Price_Aprl_Approver", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oApprModel.setData(data);
                        oApprModel.setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);
                    }.bind(this),
                    error : function(data){
                        oView.setBusy(false);
                        console.log("error", data);
                    }
                });

                //Referer 데이터 조회 
                oModel.read("/Base_Price_Aprl_Referer", {
                    filters : aFilters,
                    success : function(data){
                        oView.setBusy(false);
                        oRefererModel.setData(data);
                        // debugger;
                        // oRefererModel.getProperty("/results").push({ApprEmpNo : data.results[0].referer_empno});
                        // oRefererModel.refrsh();
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
                var oUserModel = this.getOwnerComponent().getModel("userModel");

                var oNewBasePriceData = {
                                    "tenant_id": oUserModel.getProperty("/tenantId"),
                                    "approval_title": "",
                                    "approval_status_code": "00",
                                    "create_user_id": oUserModel.getProperty("/user_empno"),
                                    "requestor_local_nm": oUserModel.getProperty("/user_empnm"),
                                    "company_code" : oUserModel.getProperty("/company_code"),
                                    "bizunit_code" : oUserModel.getProperty("/bizunit_code"),
                                    "bizunit_name" : oUserModel.getProperty("/bizunit_name"),
                                    "org_type_code" : "PL",
                                    "local_update_dtm" : oToday,
                                    "results": []};
                oDetailModel.setData(oNewBasePriceData);

                oDetailViewModel.setProperty("/viewMode", true);
                var oNewApproverData = {"results" : []};
                oApprModel.setData(oNewApproverData);
                this.getModel("approverModel").setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);

            }
        }

        , getCurrSearch : function (){
            var oView = this.getView();
            var oUserModel = this.getOwnerComponent().getModel("userModel");
            var oCurrModel =this.getModel("currModel");
            oCurrModel.setSizeLimit(1000);
            oView.setBusy(true);

            // 통화 조회
            var oCurryModel =  this.getOwnerComponent().getModel("currencyODataModel");
            var aOrgCompFilter = [new Filter("tenant_id", FilterOperator.EQ, oUserModel.getProperty("/tenantId"))];
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
            var aDetails = oModel.getProperty("/results");
            let today = new Date();
            let year = today.getFullYear();
            
            var sApply_start_yyyymm = "";
            var sApply_end_yyyymm = "";
            var sBizdivision_code = "";
            var sAffiliate_code = "";
            var sPlant_code = "";
            var sSupplier_code = "";
            var sSupplier_local_name = "";
            var sMaterial_code = "";
            var sMaterial_name = "";
            var sVendor_pool_code = "";
            var sVendor_pool_local_name = "";
            var sCurrency = "";
            var sBase_uom_code = "";
            var sBase_price = "";
            var sBuyer_empno = "";

            aDetails.push({
                        row_state : "edit", 
                        status : "추가",
                        item_sequence : item_sequence,
                        management_mprice_name : selected,
                        base_year : year,
                        apply_start_yyyymm : sApply_start_yyyymm,
                        apply_end_yyyymm : sApply_end_yyyymm,
                        bizdivision_code : sBizdivision_code,
                        affiliate_code : sAffiliate_code,
                        plant_code : sPlant_code,
                        supplier_code : sSupplier_code,
                        supplier_local_name : sSupplier_local_name,
                        material_code : sMaterial_code,
                        material_name : sMaterial_name,
                        vendor_pool_code : sVendor_pool_code,
                        vendor_pool_local_name : sVendor_pool_local_name,
                        currency : sCurrency,
                        base_uom_code : sBase_uom_code,
                        base_price : sBase_price,
                        buyer_empno : sBuyer_empno
                        });
            oModel.refresh();

            item_sequence = item_sequence +1;
        }

        /**
         * 체크된 detail 데이터 삭제
         */
        , onListRowDelete : function (oEvent) {
            var oDetailModel = this.getModel("detailModel"),
                aDetails = oDetailModel.getProperty("/results"),
                oDetailTable = oEvent.getSource().getParent().getParent();

            for( var i=aDetails.length-1; 0<=i; i-- ) {
                if( aDetails[i].checked ) {
                    aDetails.splice(i, 1);
                }
            }

            for( var i=0; i<=aDetails.length-1; i++ ) {
                aDetails[i].item_sequence = i+1;
            }
            item_sequence = aDetails.length + 1;

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
                var aDetails = oDetailModel.getProperty("/results");
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
            debugger;

            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetailData = oDetailModel.getProperty(sSelectedPath);

            var management_mprice_code = "";
            if(oDetailData.management_mprice_name == "관리"){
                 management_mprice_code = "MNGT"
            }else if(oDetailData.management_mprice_name == "시세"){
                management_mprice_code = "MPRICE"

                //oDetailData.apply_end_data = oDetailData.apply_start_date;
                oDetailModel.setProperty(sSelectedPath+"/apply_end_yyyymm", oDetailData.apply_start_yyyymm);
                oDetailModel.refresh();
            }
            debugger;         
            var nAfterBase_year = Number(oDetailData.base_year) + 1;
            var StartData = this.getFormatDateYYYYMM(oDetailData.apply_start_yyyymm);
            if( StartData < oDetailData.base_year+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_start_yyyymm = "";
                return;

            }else if( StartData >= String(nAfterBase_year)+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_start_yyyymm = "";
                return;
            }
            return StartData;
        }

        /**
         * 시세의 경우 적용시작월 선택시 적종종료월이 적용시작월로 픽스(수정불가)
         */
        , onChangeEndData : function(oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var sSelectedPath = oEvent.getSource().getBindingContext("detailModel").getPath();
            var oDetailData = oDetailModel.getProperty(sSelectedPath);

            var nAfterBase_year = Number(oDetailData.base_year) + 1;
            var EndData = this.getFormatDateYYYYMM(oDetailData.apply_end_yyyymm);
            if( EndData < oDetailData.base_year+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_end_yyyymm = "";
                return;

            }else if( EndData >= String(nAfterBase_year)+"01"){
                MessageBox.show("해당년에 월만 입력할수있습니다.", {at: "Center Center"});
                oDetailData.apply_end_yyyymm = "";
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

            //oDetailModel.setProperty(sSelectedPath+"/org_Plant",this.getModel("rootModel").getProperty("/org_Plant"));
            oDetailModel.setProperty(sSelectedPath+"/org_Plant", this.getModel("rootModel").getProperty("/org_Plant/"+oDetailModel.getProperty(sSelectedPath+"/company_code")));

        }      

        /**
         * 공급업체 Dialog 창
         */
        , onInputSupplierWithOrgValuePress : function(oEvent){
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
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                });
                
                this.oSupplierWithOrgValueHelp.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.supplier_code = oSelectedDialogItem.supplier_code;
                    this._oDetail.supplier_local_name = oSelectedDialogItem.supplier_local_name;
                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oSupplierWithOrgValueHelp.open();
        }

        /**
          * Material Code Dailog 호출
          */
        , onMaterialMasterMultiDialogPress: function (oEvent) {
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
                    this._oDetail.material_name  = oSelectedDialogItem.material_desc;
                    this._oDetail.vendor_pool_code = oSelectedDialogItem.vendor_pool_code;
                    this._oDetail.vendor_pool_local_name = oSelectedDialogItem.vendor_pool_local_name;
                    this._oDetail.base_uom_code = oSelectedDialogItem.base_uom_code;

                    oDetailModel.refresh();
                 }.bind(this));
             }

             this.oSearchMultiMaterialOrgDialog.open();

             var aTokens = [new Token({key: oDetail.material_code, text: oDetail.material_name})];
             this.oSearchMultiMaterialOrgDialog.setTokens(aTokens);
         }

        /**
         * 구매 담당자 Dialog 창
         */
        , onEmployeeDialogPress : function(oEvent){
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
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                });

                this.oEmployeeDialog.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.buyer_empno = oSelectedDialogItem.employee_number;

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
         * 수정 모드 
         */
        , onUpdate: function (oEvent) {
            var oDetailViewModel = this.getModel("detailViewModel");
            oDetailViewModel.setProperty("/viewMode", true);
            this.onChangeDataSetting();
        }

        , onChangeDataSetting : function(){
            var oDetailModel = this.getModel("detailModel");
            var rowCount = oDetailModel.getProperty("/results").length;

            if( rowCount !=0 ){
                for (i=0; i<rowCount; i++){
                var rowData = "/results/"+i;

                var apply_start_yyyymm = this.onChangeDateFormatYYYYMM(oDetailModel.getProperty(rowData+"/apply_start_yyyymm"));
                var apply_end_yyyymm = this.onChangeDateFormatYYYYMM(oDetailModel.getProperty(rowData+"/apply_end_yyyymm"));
                 debugger;   
                //apply_start/end_yyyymm 세팅
                oDetailModel.setProperty(rowData+"/apply_start_yyyymm",apply_start_yyyymm);   
                oDetailModel.setProperty(rowData+"/apply_end_yyyymm",apply_end_yyyymm);
                

                //플랜트 세팅 
                oDetailModel.setProperty(rowData+"/org_Plant", this.getModel("rootModel").getProperty("/org_Plant/"+oDetailModel.getProperty(rowData+"/company_code")));
                }
            }
        }

        /**
         * 수정 취소  
         */
        , onCancel: function (oEvent) {
            var oDetailViewModel = this.getModel("detailViewModel");
            oDetailViewModel.setProperty("/viewMode", false);
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
         * 결재 요청(AR)
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

        /**
         * 결재 AR -> IA -> AP
         */
        , onApprove: function (oEvent) {
            var oDetailModel = this.getModel("detailModel");
            var oData = oDetailModel.getData();
            if(oData.approve_status_code === "DR"){
                MessageBox.show("결재요청 상태가 아닙니다.", {at : "Center center"});
                return;
            } else if (oData.approve_status_code === "AP") {
                MessageBox.show("결재가 완료된 품의 입니다.", {at : "Center center"});
                return;
            }else {
                MessageBox.confirm("결재 승인 하시겠습니까?", {
                title : "결재",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        //this._SendDataModel();
                        MessageBox.show("결재 프로시저 호출 ");
                    }
                }.bind(this)
                });   
            }
        }
        

        /**
         * 삭제 
         */
        , onDelete: function (oEvent) {
            //MessageBox.show("삭제" ,{at : "Center center"});
            //return;

            MessageBox.confirm("삭제 하시겠습니까?", {
                title : "삭제",
                initialFocus : MessageBox.Action.CANCEL,
                onClose : function(sButton) {
                    if (sButton === MessageBox.Action.OK) {
                        this._DeleteSendDataModel();
                    }
                }.bind(this)
            });
        }

        /**
         * 프로시저 호출 데이터 모델
         */
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
                    tenant_id               : sTenantId,               //테넌트
                    approval_number         : oData.approval_number,         //품의번호   핸들러에서 부여
                    chain_code              : "SP",                          //체인코드(SP)
                    approval_type_code      : type_code,                     //타입코드(일반(NPT01), SRS(NPT02), 알박/동박(NPT03), 양극재/전구체(NPT04), 사내거래(NPT05), Pack(NPT06))
                    approval_title          : oData.approval_title,          //제목
                    approval_contents       : oData.approval_contents,       //설명
                    approve_status_code     : approval_status_code,          //프로세스상태코드(임시저장00, 초안(10), 승인요청(20), 결재완료(30))
                    requestor_empno         : oData.create_user_id,          //요청자( ) 세션정보 받아야함
                    request_date            : date,                          //요청일자(YYYYMMDD)
                    attch_group_number      : "",                            //??
                    local_create_dtm        : oData.local_create_dtm,        //핸들러에서 부여       
                    local_update_dtm        : oData.local_update_dtm,        //핸들러에서 부여       
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
            var aApproverList = oApproverData.results;

            if( approval_status_code != 'DR'){
                if(aApproverList.length === 0){
                    MessageBox.show("결재자가 없습니다. ");
                    return;
                }
            }
            
            aApproverList.forEach(function(oPrice, idx) {
                var oNewApproverObj = {};
                    oNewApproverObj['tenant_id'] = sTenantId;
                    oNewApproverObj['approval_number'] = oData.approval_number;     //핸들러에서 부여  
                    oNewApproverObj['approve_sequence'] = String(aApproverList[idx].approve_sequence);                 //핸들러에서 부여  
                    oNewApproverObj['approver_empno'] = aApproverList[idx].approver_empno;
                    oNewApproverObj['approver_type_code'] = type_code;
                    oNewApproverObj['approve_status_code'] = aApproverList[idx].statusCode;
                    //comment 추가 
                    //appr_type 추가 
                    oNewApproverObj['local_create_dtm'] = oData.local_create_dtm;
                    oNewApproverObj['local_update_dtm'] = oData.local_update_dtm;
                    oNewApproverObj['create_user_id'] = oData.create_user_id;
                    oNewApproverObj['update_user_id'] = oData.create_user_id;
                aViApproverType.push(oNewApproverObj);

                    for (var i=0; i<=aViApproverType.length-1; i++){
                        if( approval_status_code != 'DR'){
                            if (!aApproverList[idx].approver_empno){
                                MessageBox.show("결재자가 없습니다. ");
                                return;
                            }
                        } 
                    }
                    
                });

            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_REFERER_TYPE
             */
            var aViRefererType =[];
            var oRefererModel = this.getModel("refererModel");
            var oRefererData = oRefererModel.getData();
            var aRefererList = oRefererData.results;
            aRefererList.forEach(function(oPrice, idx) {
                var oNewRefererObj = {};
                    oNewRefererObj['tenant_id'] = sTenantId;
                    oNewRefererObj['approval_number'] = oData.approval_number;    //핸들러에서 부여  
                    oNewRefererObj['referer_empno'] = aRefererList[idx].ApprEmpNo;  
                    oNewRefererObj['local_create_dtm'] = oData.local_create_dtm;                    //핸들러에서 부여       
                    oNewRefererObj['local_update_dtm'] = oData.local_update_dtm;                    //핸들러에서 부여  
                    oNewRefererObj['create_user_id'] = oData.create_user_id;
                    oNewRefererObj['update_user_id'] = oData.create_user_id;
                aViRefererType.push(oNewRefererObj);
            });
            
            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_TYPE_TYPE
             */
            var oViType = {
                    tenant_id               : sTenantId,               //테넌트
                    approval_number         : oData.approval_number,         //품의번호(자동채번)
                    net_price_type_code      : type_code,                     //타입코드(일반(NPT01), SRS(NPT02), 알박/동박(NPT03), 양극재/전구체(NPT04), 사내거래(NPT05), Pack(NPT06))
                    local_create_dtm        : oData.local_create_dtm,                          
                    local_update_dtm        : oData.local_update_dtm,                          
                    create_user_id          : oData.create_user_id,
                    update_user_id          : oData.create_user_id
                };
            var aViType = [oViType];


            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_ITEM_TYPE
             */
            var aPriceResult = [];
            var aPriceData = oData.results;
            var oRootModel = this.getModel("rootModel");
            if(aPriceData.length === 0){
                MessageBox.show("기준단가 목록이 필요합니다. ");
                return;
            }
            
            aPriceData.forEach(function(oPrice, idx) {
                if( aPriceData[idx].apply_start_yyyymm.indexOf("-") == -1){
                    var strArray = aPriceData[idx].apply_start_yyyymm.replace(" ","");
                        strArray = strArray.split('.');
                        strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                    var apply_start_yyyymm ="20"+ strArray[0] + strArray[1];
                } else {
                    apply_start_yyyymm = aPriceData[idx].apply_start_yyyymm.replace("-","");
                }
                if( aPriceData[idx].apply_end_yyyymm.indexOf("-") == -1){
                    var strArray = aPriceData[idx].apply_end_yyyymm.replace(" ","");
                        strArray = strArray.split('.');
                        strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                    var apply_end_yyyymm = "20"+ strArray[0] + strArray[1];
                } else {
                    apply_end_yyyymm = aPriceData[idx].apply_end_yyyymm.replace("-","");
                }
                

                var management_mprice_code = "";
                if(aPriceData[idx].management_mprice_name == "관리"){
                    management_mprice_code = "MNGT"
                }else if(aPriceData[idx].management_mprice_name == "시세"){
                    management_mprice_code = "MPRICE"
                }
                
                var oNewPriceObj = {};
                    oNewPriceObj['tenant_id'] = sTenantId;
                    oNewPriceObj['approval_number'] = oData.approval_number;      
                    oNewPriceObj['item_sequence'] = Number(aPriceData[idx].item_sequence);
                    oNewPriceObj['company_code'] = aPriceData[idx].company_code;
                    oNewPriceObj['bizunit_code'] = sBizunitCode;             //세션 본부 코드 
                    oNewPriceObj['management_mprice_code'] = management_mprice_code;
                    oNewPriceObj['base_year'] = String(aPriceData[idx].base_year);
                    oNewPriceObj['apply_start_yyyymm'] = String(apply_start_yyyymm);
                    oNewPriceObj['apply_end_yyyymm'] = String(apply_end_yyyymm);
                    oNewPriceObj['bizdivision_code'] = aPriceData[idx].bizdivision_code;
                    oNewPriceObj['plant_code'] = aPriceData[idx].plant_code;
                    oNewPriceObj['supply_plant_code'] = null;
                    oNewPriceObj['supplier_code'] = aPriceData[idx].supplier_code;
                    oNewPriceObj['material_code'] = aPriceData[idx].material_code;
                    oNewPriceObj['material_name'] = aPriceData[idx].material_name;
                    oNewPriceObj['vendor_pool_code'] = aPriceData[idx].vendor_pool_code;
                    oNewPriceObj['currency_code'] = aPriceData[idx].currency_code;
                    oNewPriceObj['base_uom_code'] = aPriceData[idx].base_uom_code;
                    oNewPriceObj['buyer_empno'] = aPriceData[idx].buyer_empno;
                    oNewPriceObj['base_price'] = parseFloat(aPriceData[idx].base_price);
                    oNewPriceObj['pcst'] = null;
                    oNewPriceObj['metal_net_price'] = null;
                    oNewPriceObj['coating_mat_net_price'] = null;
                    oNewPriceObj['fabric_net_price'] = null;
                    oNewPriceObj['local_create_dtm'] = oData.local_create_dtm;               //핸들러에서 부여
                    oNewPriceObj['local_update_dtm'] = oData.local_update_dtm;               //핸들러에서 부여
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
            var aMetalDetailList = oMetalDetailData.results;
            aMetalDetailList.forEach(function(oPrice, idx) {
                var aMetalDetailList = {};
                    aMetalDetailList['tenant_id'] = sTenantId;
                    aMetalDetailList['approval_number'] = oData.approval_number;
                    aMetalDetailList['item_sequence'] = null;
                    aMetalDetailList['metal_type_code'] = null; 
                    aMetalDetailList['metal_net_price'] = null;
                    aMetalDetailList['local_create_dtm'] = oData.local_create_dtm;
                    aMetalDetailList['local_update_dtm'] = oData.local_update_dtm;
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
            debugger;
            console.log("SendData");
            console.log(oSendData);
            if (!oData.approval_number) {
                this._SendDataSave(oSendData, "insert");
            }else {
                this._SendDataSave(oSendData, "update");
            }
            
        }

        , _DeleteSendDataModel : function(){   

            debugger;
            
            var oDetailModel = this.getModel("detailModel");
            var oData = oDetailModel.getData();

            /**
             * SP_VI_BASE_PRICE_APRL_INSERT_PROC -> SP_VI_BASE_PRICE_APRL_MST_TYPE
             */
            var oViMst = {
                    tenant_id               : sTenantId,        //삭제시 키값
                    approval_number         : oData.approval_number,  //삭제시 키값
                    chain_code              : "",
                    approval_type_code      : "",
                    approval_title          : "",
                    approval_contents       : "",
                    approve_status_code     : "",
                    requestor_empno         : "",
                    request_date            : "",
                    attch_group_number      : "",
                    local_create_dtm        : null,                   //핸들러에서 부여       
                    local_update_dtm        : null,                   //핸들러에서 부여
                    create_user_id          : oData.create_user_id,   //테이블타입 필수값으로 실제 데이터에 영향X
                    update_user_id          : oData.create_user_id    //테이블타입 필수값으로 실제 데이터에 영향X
                };            
            var aViMst = [oViMst];
            
            var oSendData = {
                inputData : {
                    BasePriceAprlMstType : aViMst
                }
            };
            this._SendDataSave(oSendData, "delete");
        }
        
        /**
         * 프로시저 호출 
         */
        , _SendDataSave: function (oSendData, calltype) {
            var targetName

            if(calltype === "insert"){
                targetName = "SpViBasePriceAprlProc";
            }else if(calltype === "update"){
                targetName = "SpViBasePriceAprlUpdateProc";
            }else if(calltype === "delete"){
                targetName = "SpViBasePriceAprlDeleteProc";
            }else {
                MessageBox.show("적용가능한 프로시저가 없습니다.", {at : "Center center"});
                return;
            }

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

                            oListModel.addRecord(oRow, "/results", 0);
							that.validator.clearValueState(that.byId("BasePriceDetailTable"));

                        });
                    }
                }
            });
        }

        /**
          * Approval 라인 추가
          */
        , onApprRowdd: function () {
            var oView = this.getView();
            var oModel = this.getModel("approverModel");
            var aApprDetails = oModel.getProperty("/results");

            if(aApprDetails.length != 0 ){
                appr_sequence = aApprDetails.length + 1 ;
            }
                    
            aApprDetails.push({
                        approve_sequence : appr_sequence, 
                        appr_type : "",
                        employee_number : "",
                        approver_local_nm : "",
                        approver_dept_local_nm : "",
                        statusCode : "00",
                        status : "미결재",
                        commnet : ""
                        });
            oModel.refresh();

            appr_sequence = appr_sequence + 1;
        }

        /**
         * 체크된 Approval 데이터 삭제
         */
        , onApprtRowDelete : function (oEvent) {
            var oDetailModel = this.getModel("approverModel"),
                aDetails = oDetailModel.getProperty("/results"),
                oDetailTable = oEvent.getSource().getParent().getParent();

            for( var i=aDetails.length-1; 0<=i; i-- ) {
                if( aDetails[i].checked ) {
                    aDetails.splice(i, 1);
                }
            }

            for( var i=0; i<=aDetails.length-1; i++ ) {
                aDetails[i].approve_sequence = i+1;
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
                var aDetails = oDetailModel.getProperty("/results");
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
         * Appr Dialog 창
         */
        , onApprEmployeeDialogPress : function(oEvent){
            var oDetailModel = this.getModel("approverModel");
            var oDetailModelPath = oEvent.getSource().getBindingContext("approverModel").getPath();
            var oDetail = oDetailModel.getProperty(oDetailModelPath);
            this._oDetail = oDetail;

            if(!this.oApprEmployeeDialog){
                this.oApprEmployeeDialog = new EmployeeDialog({
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }, 
                    multiSelection: false
                });

                this.oApprEmployeeDialog.attachEvent("apply", function(oEvent){
                    var oSelectedDialogItem = oEvent.getParameter("item");
                    this._oDetail.approver_empno = oSelectedDialogItem.employee_number;
                    this._oDetail.approver_local_nm = oSelectedDialogItem.user_local_name;
                    this._oDetail.approver_dept_local_nm = oSelectedDialogItem.department_local_name

                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oApprEmployeeDialog.open();
        }

       , onMultiInputWithEmployeeValuePress: function(){ 
            var oDetailModel = this.getModel("refererModel");
          
            if(!this.oEmployeeMultiSelectionValueHelp){
               this.oEmployeeMultiSelectionValueHelp = new EmployeeDeptDialog({
                    title: "Choose Referer",
                    loadWhenOpen: false,
                    multiSelection: true,
                    items: {
                        filters: [
                            new Filter("tenant_id", FilterOperator.EQ, sTenantId)
                        ]
                    }
                });
                this.oEmployeeMultiSelectionValueHelp.attachEvent("apply", function(oEvent){
                    this.byId("referMulti").setTokens(oEvent.getSource().getTokens());
                    if(this.getModel("refererModel").getProperty("/results").length != 0){
                                this.getModel("refererModel").setData(null);
                                this.setModel(new JSONModel(), "refererModel");
                                this.getModel("refererModel").setProperty("/results",[]);                        
                    }
                    for(var i=0; i<=i; i++){
                        if(oEvent.getSource().getTokens()[i] == undefined){
                            break;
                        }else{
                            this.getModel("refererModel").getProperty("/results").push({ApprEmpNo : oEvent.getSource().getTokens()[i].mProperties.key})
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

            item_sequence = 1;
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

        /**
         * 타입변환
         * ex) 날짜타입 -> 21.1.1 
         */

         , dataTypeChange : function (val){
             debugger;
            var sYY = val.substring(0,4);
            var sMM = val.substring(4,6);

            var d = new Date(sYY, sMM);
            
             return d;
         }
  });
});
