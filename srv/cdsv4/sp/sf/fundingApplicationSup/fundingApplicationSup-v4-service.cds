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

}
