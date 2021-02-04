namespace op;

//using {op.Pu_Pr_Mst as prMst}                       from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST-model';
using {op.Pu_Pr_Mst_View as prMstView}              from '../../../../../db/cds/op/pu/pr/OP_PU_PR_MST_VIEW-model';
using {op.Pu_Pr_Dtl as prDtl}                       from '../../../../../db/cds/op/pu/pr/OP_PU_PR_DTL-model';
using {op.Pu_Pr_Account as prAccounts }             from '../../../../../db/cds/op/pu/pr/OP_PU_PR_ACCOUNT-model';
using {op.Pu_Pr_Service as prServices }             from '../../../../../db/cds/op/pu/pr/OP_PU_PR_SERVICE-model';
using {op.Pu_Pr_Template_Map as prTMap}             from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_MAP-model';
using {op.Pu_Pr_Template_Lng as prTLng}             from '../../../../../db/cds/op/pu/pr/OP_PU_PR_TEMPLATE_LNG-model';
using {cm.Code_Lng as cdLng}                        from '../../../../../db/cds/cm/CM_CODE_LNG-model';

using {op.Pu_Account_Mst as AccountMst}             from '../../../../../db/cds/op/pu/account/OP_PU_ACCOUNT_MST-model';
using {op.Pu_Asset_Mst as AssetMst}                 from '../../../../../db/cds/op/pu/asset/OP_PU_ASSET_MST-model';
using {op.Pu_Cctr_Mst as CctrMst}                   from '../../../../../db/cds/op/pu/cctr/OP_PU_CCTR_MST-model';
using {op.Pu_Order_Mst as OrderMst}                 from '../../../../../db/cds/op/pu/order/OP_PU_ORDER_MST-model';
using {op.Pu_Wbs_Mst as WbsMst}                     from '../../../../../db/cds/op/pu/wbs/OP_PU_WBS_MST-model';

using {cm.Org_Plant as Org_Plant}                   from '../../../../../db/cds/cm/CM_ORG_PLANT-model';
using {cm.Hr_Employee as employee}                  from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';
using {cm.User as user}                             from '../../../../../db/cds/cm/CM_USER-model';
using {cm.Hr_Department as Dept}                    from '../../../../../db/cds/cm/CM_HR_DEPARTMENT-model';
using {sp.Sm_Supplier_Wo_Org_Cal_View as spWoOrgCalView}    from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_WO_ORG_CAL_VIEW-model';

//  cm.util.OrgService/Plant
//  cm.util.HrService//Employee
//  sp.supplierViewService/supplierWithoutOrgView
//using {dp.Mm_Material_Desc_Lng as MaterialDesc }    from '../../../../../db/cds/dp/mm/DP_MM_MATERIAL_DESC_LNG-model';

@path : '/op.pu.prMgtService'
service PrMgtService {
    entity Pr_Mst     as projection on op.Pu_Pr_Mst;
    entity Pr_Dtl     as projection on op.Pu_Pr_Dtl;
    entity Pr_Account as projection on op.Pu_Pr_Account;
    entity Pr_Service as projection on op.Pu_Pr_Service;
   

    view Pr_MstView as
        select
            key tenant_id, //: String(5)      not null	 @title: '테넌트id';
            key company_code, //: String(10)     not null	 @title: '회사코드';
            key pr_number, //: String(50)     not null	 @title: '구매요청번호';
                pr_type_code, //: String(30)    not null    @title: '구매요청유형코드' ;
                pr_type_code_2, //: String(30)    not null    @title: '구매요청품목그룹코드 ' ;
                pr_type_code_3, //: String(30)    not null    @title: '구매요청품목코드 ' ;
                pr_template_number, //: String(10)    not null    @title: '구매요청템플릿번호' ;
                pr_create_system_code // : String(30)    not null    @title: '구매요청생성시스템코드' ;
                requestor_empno, //: String(30)                @title: '요청자사번' ;
                requestor_name, //: String(50)                @title: '요청자명' ;
                requestor_department_code, //: String(50)              @title: '요청자부서코드' ;
                requestor_department_name, //: String(240)             @title: '요청자부서명' ;
                request_date, //: Date                      @title: '요청일자' ;
                request_dateT,
                pr_create_status_code, //: String(30)                @title: '구매요청생성상태코드' ;
                pr_desc, //: String(100)               @title: '구매요청내역' ;
                pr_header_text, //: String(200)               @title: '구매요청헤더텍스트' ;
                approval_flag,
                approval_number,
                erp_interface_flag,
                erp_pr_type_code,
                erp_pr_number,
                approval_contents,
                pr_dtl_cnt,
                pr_progress_status_cnt,
                CONCAT(
                    pr_progress_status_cnt, CONCAT(
                        ' / ', pr_dtl_cnt
                    )
                ) as pr_progress_status_cnt_txt : String(30),


                (
                    select code_name from cdLng
                    where
                            mst.tenant_id     = cdLng.tenant_id
                        and cdLng.group_code  = 'OP_PR_TYPE_CODE'
                        and cdLng.language_cd = 'KO'
                        and mst.pr_type_code  = cdLng.code
                ) as pr_type_name               : String(30), // 구매요청 유형

                (
                    select code_name from cdLng
                    where
                            mst.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_2'
                        and cdLng.language_cd  = 'KO'
                        and mst.pr_type_code_2 = cdLng.code
                ) as pr_type_name_2             : String(30), // 품목그룹

                (
                    select code_name from cdLng
                    where
                            mst.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_3'
                        and cdLng.language_cd  = 'KO'
                        and mst.pr_type_code_3 = cdLng.code
                ) as pr_type_name_3             : String(30), // 카테고리

                (
                    select pr_template_name from prTLng
                    where
                            mst.tenant_id          = prTLng.tenant_id
                        and prTLng.language_code   = 'KO'
                        and mst.pr_template_number = prTLng.pr_template_number
                ) as pr_template_name           : String(30), //구매요청 템플릿

                (
                    select code_name from cdLng
                    where
                            mst.tenant_id             = cdLng.tenant_id
                        and cdLng.group_code          = 'OP_PR_CREATE_STATUS_CODE'
                        and cdLng.language_cd         = 'KO'
                        and mst.pr_create_status_code = cdLng.code
                ) as pr_create_status_name      : String(30), // 구매요청생성상태코드 'DR'
                (
                    select code_name from cdLng
                    where
                            mst.tenant_id             = cdLng.tenant_id
                        and cdLng.group_code          = 'OP_PR_CREATE_SYSTEM_CODE'
                        and cdLng.language_cd         = 'KO'
                        and mst.pr_create_system_code = cdLng.code
                ) as pr_create_system_name      : String(30) // 구매요청생성시스템    ''
        from prMstView mst;
    
    //  Organization Code,  Employee, Choose Supplier Code
    // Service, Account => WBS 코드 유무,...


    view Pr_DtlView as
        select
            key tenant_id       , //: String(5)     not null	@title: '테넌트id';
            key company_code    , //: String(10)    not null	@title: '회사코드';
            key pr_number		, //: String(50)    not null	@title: '구매요청번호';
            key pr_item_number  , //: Integer64     not null    @title: '구매요청품목번호' ;               
                org_type_code  , /// : String(2)         @title: '조직유형코드' ;	
                IFNULL( org_code, '') as  org_code :String(10)       ,   ///: String(10)        @title: '조직코드' ;	
                IFNULL( ( Select plant_name 
                    From Org_Plant
                    Where  tenant_id = prDtl.tenant_id 
                       And company_code = prDtl.company_code
                       And plant_code = IFNULL( prDtl.org_code, '') ), '' ) as plant_name : String(240),
                material_code  , // : String(40)        @title: '자재코드' ;	
                material_group_code , //: String(10)    @title: '자재그룹코드' ;	
                pr_desc         , //: String(100)       @title: '구매요청내역' ;	
                pr_quantity    , // : Decimal           @title: '구매요청수량' ;	
                pr_unit         , //: String(3)         @title: '구매요청단위' ;	
                requestor_empno , //: String(30)        @title: '요청자사번' ;	
                requestor_name  , //: String(50)        @title: '요청자명' ;	
                request_date    , //: Date              @title: '요청일자' ;	
                delivery_request_date , //: Date        @title: '납품요청일자' ;	
                approval_date           , //: Date      @title: '결재일자' ;
                IFNULL(buyer_empno, '') as buyer_empno :String(30)     , //: String(30)        @title: '구매담당자사번' ;	
                IFNULL( ( Select user_local_name
                    From employee
                    Where  tenant_id = prDtl.tenant_id                       
                       And employee_number = IFNULL( prDtl.buyer_empno, '')  ), '' ) as user_local_name : String(240),
                buyer_department_code , //: String(30)  @title: '구매부서코드' ;
                purchasing_group_code , //: String(3)   @title: '구매그룹코드' ;	
                estimated_price , //: Decimal           @title: '예상가격' ;	
                currency_code   , //: String(3)         @title: '통화코드' ;	
                price_unit     , // : Decimal(5,0)        @title: '가격단위' ;	
                IFNULL(pr_progress_status_code, '') as pr_progress_status_code : String(30),   //     @title: '구매요청진행상태코드' ;
                IFNULL( (
                    select code_name from cdLng
                    where   cdLng.tenant_id   = prDtl.tenant_id  
                        and cdLng.group_code  = 'OP_PR_PROGRESS_STATUS_CODE'
                        and cdLng.language_cd = 'KO'
                        and cdLng.code        = prDtl.pr_progress_status_code) , '' ) as pr_progress_status_name : String(240),	
                remark          , //: String(3000)      @title: '비고' ;	
                attch_group_number , //: String(100)    @title: '첨부파일그룹번호' ;	
                delete_flag     , //: Boolean   not null   @cds.on.insert: false   @title: '삭제여부' ;	
                closing_flag    , //: Boolean   not null   @cds.on.insert: false   @title: '마감여부' ;	
                item_category_code , //: String(2)               @title: '품목범주코드' ;	
                account_assignment_category_code , //: String(2) @title: '계정지정범주코드' ;	
                sloc_code       , //: String(4)                  @title: '저장위치코드' ;	
                IFNULL( supplier_code, '') as supplier_code :String(10) ,   //: String(10)                 @title: '공급업체코드' ;	
                IFNULL( ( Select supplier_local_name
                    From spWoOrgCalView
                    Where  tenant_id = prDtl.tenant_id                       
                       And supplier_code = IFNULL( prDtl.supplier_code, '')  ), '' ) as supplier_local_name :String(240)            
        from prDtl;



    view Pr_AccountView as
        select
            key tenant_id	,			//: String(5)     not null	 @title: '테넌트id';
            key company_code,			//: String(10)    not null	 @title: '회사코드';
            key pr_number	,			//: String(50)    not null	 @title: '구매요청번호';
            key pr_item_number ,         //: Integer64     not null     @title: '구매요청품목번호' ;
            key account_sequence,		//: Integer64		not null	 @title: '계정순번';
                service_sequence ,       //: Integer64           @title: '서비스순번' ;	
                IFNULL(account_code, '') as account_code :String(40)     ,  //   : String(40)  not null  @title: '계정코드' ;	
                IFNULL( ( Select account_name
                    From AccountMst
                    Where  tenant_id = prAccounts.tenant_id                       
                        And company_code = prAccounts.company_code
                        And language_code = 'KO'
                        And account_code = IFNULL(prAccounts.account_code, '')  ), '' ) as account_name : String(100),

                IFNULL(cctr_code, '') as cctr_code: String(10),            //@title: '비용부서코드' ;	
                IFNULL( ( Select cctr_name
                    From CctrMst
                    Where  tenant_id = prAccounts.tenant_id                       
                        And company_code = prAccounts.company_code
                        And language_code = 'KO'
                        And cctr_code = IFNULL(prAccounts.cctr_code, '')  ), '' ) as cctr_name : String(100),
                
                IFNULL(asset_number, '') as asset_number: String(30)  , //          @title: '자산번호' ;	
                IFNULL( ( Select asset_name
                    From AssetMst
                    Where  tenant_id = prAccounts.tenant_id                       
                        And company_code = prAccounts.company_code
                        And asset_number = IFNULL(prAccounts.asset_number, '')  ), '' ) as asset_name : String(100),
            
                IFNULL(wbs_code, '') as wbs_code : String(30)    ,   //        @title: 'WBS코드' ;	
                IFNULL( ( Select wbs_name
                    From WbsMst
                    Where  tenant_id = prAccounts.tenant_id                       
                        And company_code = prAccounts.company_code
                        And wbs_code = IFNULL(prAccounts.wbs_code, '')  ), '' ) as wbs_name : String(100),

                IFNULL(order_number, '') as order_number : String(30)  ,   //          @title: '오더번호' ;	
                IFNULL( ( Select order_name
                    From OrderMst
                    Where  tenant_id = prAccounts.tenant_id                       
                        And company_code = prAccounts.company_code
                        And order_number = IFNULL(prAccounts.order_number, '')  ), '' ) as order_name : String(100),

                pr_quantity ,            //: Decimal(30,10)        @title: '구매요청수량' ;	
                distrb_rate             //: Decimal(30,10)        @title: '배분율' ;	
                    
            from prAccounts;






    entity Pr_TDtl    as projection on op.Pu_Pr_Template_Dtl;
    entity Pr_TLng    as projection on op.Pu_Pr_Template_Lng;

    // 간단한 View 생성
    view Pr_TMapView as
        select
            key map.tenant_id,
            key map.pr_type_code,
            key map.pr_type_code_2,
            key map.pr_type_code_3,
            key map.pr_template_number,
                (
                    select code_name from cdLng
                    where
                            map.tenant_id     = cdLng.tenant_id
                        and cdLng.group_code  = 'OP_PR_TYPE_CODE'
                        and cdLng.language_cd = 'KO'
                        and map.pr_type_code  = cdLng.code
                ) as pr_type_name     : String(30),

                (
                    select code_name from cdLng
                    where
                            map.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_2'
                        and cdLng.language_cd  = 'KO'
                        and map.pr_type_code_2 = cdLng.code
                ) as pr_type_name_2   : String(30),

                (
                    select code_name from cdLng
                    where
                            map.tenant_id      = cdLng.tenant_id
                        and cdLng.group_code   = 'OP_PR_TYPE_CODE_3'
                        and cdLng.language_cd  = 'KO'
                        and map.pr_type_code_3 = cdLng.code
                ) as pr_type_name_3   : String(30),

                (
                    select pr_template_name from prTLng
                    where
                            map.tenant_id          = prTLng.tenant_id
                        and prTLng.language_code   = 'KO'
                        and map.pr_template_number = prTLng.pr_template_number
                ) as pr_template_name : String(30)
                 ,

                OP_PU_PR_TEMPLATE_NUMBERS_FUNC( map.tenant_id, map.pr_template_number ) as  pr_template_numbers1: String(1000)


        from prTMap as map;

     
}
