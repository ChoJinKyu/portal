/************************************************ 
  1. description : 자금지원신청 신청서 작성
  2. history
  -. 2021.01.15 : 위성찬 최초작성
*************************************************/

//업무테이블 관련
using sp.Sf_Funding_Application from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_APPLICATION-model';
using sp.Sf_Funding_Invest_Plan_Mst from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_MST-model';
using sp.Sf_Funding_Invest_Plan_Dtl from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_DTL-model';

//조직코드 프로세스 매핑
using { cm.Pur_Operation_Org as cm_pur_operation_org } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';          //조직정보
using { cm.Pur_Org_Type_Mapping as cm_pur_org_type_mapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model'; //프로세스타입 정보

// 공통코드 뷰
using { cm as CodeView } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';




namespace sp;

@path : '/sp.fundingApplicationSupV4Service'
service FundingApplicationSupV4Service {

    //----------------------테이블정보 entity
    entity SfFundingApplication as projection on sp.Sf_Funding_Application;         //자금지원신청 마스터 
    entity SfFundingInvestPlanMst as projection on sp.Sf_Funding_Invest_Plan_Mst;   //투자계획서 헤더테이블
    entity SfFundingInvestPlanDtl as projection on sp.Sf_Funding_Invest_Plan_Dtl;   //투자계획서 상세테이블
    

    //----------------------거래사업부(조직코드) 콤보 쿼리
    view OrgCodeListView (tenant_id: String, company_code: String) as
        select 
            op.tenant_id        //tenant_id 컬럼에 저장될 값
            ,op.company_code    //company_code 컬럼에 저장될 값
            ,op.org_type_code   //org_type_code 컬럼에 저장될 값
            ,op.org_code	    //콤보에 매핑될 value
            ,op.org_name	    //콤보에 매핑될 text
            ,op.purchase_org_code
            ,op.plant_code
            ,op.affiliate_code
            ,op.bizdivision_code
            ,op.bizunit_code
            ,op.au_code
            ,op.hq_au_code
            ,op.use_flag
        from cm_pur_operation_org op
        where op.tenant_id = :tenant_id
        and op.company_code = :company_code
        and op.org_type_code = (
            select distinct org_type_code
            from cm_pur_org_type_mapping
            where tenant_id = :tenant_id
            and process_type_code = 'SP07'
            and company_code in ('*', :company_code)	
        )
        ;


    //----------------------공통코드
    view ComCodeListView (tenant_id: String
                        , group_code: String
                        , chain_code: String
                        , language_cd: String) as 
        select 
              tenant_id
             ,group_code
             ,code
             ,code_name
        from CodeView.Code_View
        where tenant_id = :tenant_id
        and group_code = :group_code
        and language_cd = :language_cd
        ; 


    //----------------------신청서 마스터 데이터 조회
    //sp.Sf_Funding_Application
    view fundingApplDataView(funding_appl_number: String) as 
        select
             fa.funding_appl_number             //자금지원 신청 번호
            ,fa.funding_notify_number           //자금지원 공고 번호
            ,fa.supplier_code                   //공급업체 코드
            ,fa.tenant_id                       //
            ,fa.company_code                    //
            ,fa.org_type_code                   //
            ,fa.org_code                        //
            ,fa.funding_appl_date               //자금지원 신청 일자
            ,fa.purchasing_department_name      //구매부서명(LG구매팀)
            ,fa.pyear_sales_amount              //전년매출금액
            ,fa.main_bank_name                  //주거래은행
            ,fa.funding_appl_amount             //자금지원 신청 금액
            ,fa.funding_hope_yyyymm             //자금지원 희망 년월
            ,fa.repayment_method_code           //상환방법 코드
            ,fa.appl_user_name                  //신청자 명 
            ,fa.appl_user_tel_number            //신청자 전화번호
            ,fa.appl_user_email_address         //신청자 email
            ,fa.funding_reason_code             //지원 사유 코드
            ,fa.collateral_type_code            //담보구분 코드
            ,fa.collateral_amount               //담보 금액
            ,fa.collateral_start_date           //담보 시작일자
            ,fa.collateral_end_date             //담보 종료일자
            ,fa.collateral_attch_group_number   //담보 약식확인서 첨부파일 그룹번호
            ,fa.funding_step_code               //자금지원 단계 코드
            ,fa.funding_status_code             //자금지원 상태 코드
        from sp.Sf_Funding_Application fa
        where 1=1
        and fa.funding_appl_number = :funding_appl_number
        ;


    //----------------------투자계획 마스터 데이터 조회
    //sp.Sf_Funding_Application
    /*
    view investPlanMstView(funding_appl_number: String) as 
        select
             *
        from sp.Sf_Funding_Invest_Plan_Mst pm
        where 1=1
        and pm.funding_appl_number = :funding_appl_number
        ;  
    */ 
         
}
