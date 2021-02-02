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

        onInit: function () {
            var oRootModel = this.getOwnerComponent().getModel("rootModel");
            sTenantId = oRootModel.getProperty("/tenantId");

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
    
 

            // Router설정. Detail 화면이 호출될 때마다 _getBasePriceDetail 함수 호출
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("basePriceDetail").attachPatternMatched(this._getBasePriceDetail, this);

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
            debugger;
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
                    
                    //material Code 기준으로 조회하여 추가데이터 제공 
                    //this.getMaterialSearch(this._oDetail.material_code);

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
                    this._oDetail.vendor_pool_code = material[0].vendor_pool_code;
                    oDetailModel.refresh();
                }.bind(this));
            }
            this.oSearchMultiMaterialMasterDialog.open();
        }

        //자재 조회
        // , getMaterialSearch : function(material_code){
        //     debugger;
        //     var oBasePriceArlModel = this.getModel("basePriceArl");
        //     var aOrgMetalFilter = [];
        //         aOrgMetalFilter.push(new Filter("material_code", FilterOperator.EQ, material_code));

        //     this._getListSearch(aOrgMetalFilter);
        // }

        // , _getListSearch : function(aOrgMetalFilter){
        //     debugger;
        //     var oView = this.getView();
        //     var oModel = this.getModel("basePriceArl");
            
        //     oModel.read("/Base_Price_Aprl_Material", {
        //         filters : aOrgMetalFilter,
        //         success : function(data){
        //             debugger;
        //             console.log(data);
        //             if( data && data.results ) {
        //                 var aResults = data.results;
        //                 var aCompoany = [];
        //                 var oPurOrg = {};

        //                 for( var i=0; i<aResults.length; i++ ) {
        //                     var oResult = aResults[i];
        //                     if( -1===aCompoany.indexOf(oResult.material_code) ) {
        //                         aCompoany.push(oResult.material_code);
        //                         oPurOrg[oResult.material_code] = [];
        //                     }

        //                     oPurOrg[oResult.material_code].push({material_code: oResult.material_code
        //                                                         ,material_desc: oResult.material_desc
        //                                                         ,material_price_unit : oResult.material_price_unit
        //                                                         ,vendor_pool_code : oResult.vendor_pool_code
        //                                                         ,vendor_pool_local_name : oResult.vendor_pool_local_name
        //                                                         });
        //                 }

        //                 this.getModel("rootModel").setProperty("/material_code", oPurOrg);
        //                 debugger;
        //                 // this._oDetail.vendor_pool = material[0].vendor_pool_local_name;
        //             // this._oDetail.basePriceUnit = material[0].material_price_unit;
        //             // this._oDetail.vendor_pool_code = material[0].vendor_pool_code;

        //             }
        //         },
        //         error : function(data){
        //             console.log("error", data);
        //         }
        //     });
        //}

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
            var oRootModel = this.getModel("rootModel");
            aPriceData.forEach(function(oPrice, idx) {
                var strArray = aPriceData[idx].apply_start_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_start_yyyymm ="20"+ strArray[0] + strArray[1];
                var strArray = aPriceData[idx].apply_end_date.replace(" ","");
                    strArray = strArray.split('.');
                    strArray[1] = strArray[1] >= 10 ? strArray[1] : '0' + strArray[1];
                var apply_end_yyyymm = "20"+ strArray[0] + strArray[1];
                var management = null;
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
                    oNewPriceObj['material_price_unit'] = Number(aPriceData[idx].basePriceUnit);
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
            debugger;

             for (var i=0; i<=aPriceResult.length-1; i++){
                if (!aPriceResult[i].bizdivision_code){
                    MessageBox.show("사업부코드는 필수입니다.");
                    return;
                }

                if (!aPriceResult[i].material_code){
                    MessageBox.show("자재코드는 필수입니다.");
                    return;
                }

                if (!aPriceResult[i].company_code){
                    MessageBox.show("컴퍼니코드는 필수입니다");
                    return;
                }

                if (!aPriceResult[i].currency_code){
                    MessageBox.show("통화코드는 필수입니다. ");
                    return;
                }

                if (!aPriceResult[i].plant_code){
                    MessageBox.show("플랜트코드는 필수입니다. ");
                    return;
                }

                if (!aPriceResult[i].supplier_code){
                    MessageBox.show("공급업체코드는 필수입니다. ");
                    return;
                }
            
                if (aPriceResult[i].apply_start_yyyymm < String(date).substring(0,6) ){
                    MessageBox.show("적용시작일자가 현재월보다 이전월입니다.");
                    return;
                }

                if (aPriceResult[i].apply_end_yyyymm < aPriceResult[i].apply_start_yyyymm ){
                    MessageBox.show("적용종료일자가가 적용시작일자보다 적습니다.");
                    return;
                }

                var t = String(aPriceResult[i].base_price);
                if(t.indexOf('.') != -1){
                    var t_length = t.substring(t.indexOf('.') + 1);
                    if(t_length.length > 4){
                        MessageBox.show('소수 네자리까지만 입력됩니다.');
                        return;
                    }
                }

                // if (!aPriceResult[i].vendor_pool_code){
                //     MessageBox.show("협력사풀은 필수입니다. ");
                //     return;
                // }

                // if (!aPriceResult[i].base_price){
                //     MessageBox.show("base_price 필수 ");
                //     return;
                // }

                // if (!aPriceResult[i].bizunit_code){
                //     MessageBox.show("bizunit_code 필수 ");
                //     return;
                // }
                    
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
            var oDetailModel = this.getModel("detailModel");
            var oRootModel = this.getModel("rootModel");
            var oApprModel = this.getModel("approverModel");
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
                
                var oNewApproverData = {"details" : []};
                oApprModel.setData(oNewApproverData);
                this.getModel("approverModel").setProperty("/appr_type",[{code : "10", text:"승인자"},{code : "20", text:"합의자"}]);

            
                //oDetailViewModel.setProperty("/detailsLength", 0);
                //oDetailViewModel.setProperty("/viewMode", true);

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

        , fPointCheck : function (val){  //f 는 객체, val은 변수값, point는 소수점 자리수
            debugger;
            var t = val;
            var point = 4;
            if(t.indexOf('.') != -1){
                var t_length = t.substring(t.indexOf('.') + 1);
                if(t_length.length > 5){
                    alert('소수 첫째자리까지만 입력됩니다.');
                    return false;
                }
                return true;
            }
        }

  });
});
