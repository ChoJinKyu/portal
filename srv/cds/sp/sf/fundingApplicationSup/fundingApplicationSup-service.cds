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

//서플라이어 마스터
using sp.Sm_Supplier_Mst from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';

// 공통코드 뷰
using { cm as CodeView } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';


namespace sp;

@path : '/sp.FundingApplicationSupService'
service FundingApplicationSupService {

    //************************************************
    // 조회관련 뷰
    //************************************************
    //----------------------거래사업부(조직코드) 콤보 쿼리----------------------
    /*
    * Param: 
    *   - tenant_id(세션값)
    *   - company_code(세션값)
    */
    view OrgCodeListView as
        select	distinct
             op.tenant_id       //tenant_id 컬럼에 저장될 값
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
        join cm_pur_org_type_mapping tm on op.tenant_id = tm.tenant_id
        and op.org_type_code = tm.org_type_code
        where map(tm.company_code, '*', op.company_code, tm.company_code) = op.company_code
        and tm.process_type_code = 'SP07'
        order by op.org_name
        ;


    //----------------------공통코드 조회----------------------
    /*
    * Param: 
    *   - tenant_id(세션값)
    *   - group_code
    *   - language_cd(세션값)
    */
    view ComCodeListView as 
        select 
              key tenant_id
             ,key group_code
             ,key code
             ,code_name
             ,language_cd
             ,sort_no
        from CodeView.Code_View
        order by sort_no
        ; 


    //----------------------신청서 마스터 데이터 조회----------------------
    /*
    * Param:
    *   - funding_appl_number
    */
    view FundingApplDataView as 
        select
             key fa.funding_appl_number         //자금지원 신청 번호
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
            ,(select 
                code_name
             from CodeView.Code_View
             where tenant_id = fa.tenant_id
             and group_code = 'SP_SF_REPAYMENT_METHOD'
             and code = fa.repayment_method_code
             and language_cd = 'KO')  as repayment_method_code_name : String    //상환방법코드명
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
        ;


    //----------------------투자계획 마스터 목록 조회----------------------
    /*
    * Param:
    *   - funding_appl_number
    */
    view InvestPlanMstListView as 
        select
             key pm.funding_appl_number         //자금지원신청번호
            ,key pm.investment_plan_sequence    //시퀀스
            ,    pm.investment_type_code        //투자유형코드
            ,    pm.investment_project_name     //과제명
            ,    pm.investment_yyyymm           //투자년월
            ,    pm.appl_amount                 //신청금액
            ,    pm.investment_purpose          //투자목적
            ,    pm.apply_model_name            //적용모델명
            ,    pm.annual_mtlmob_quantity      //연간물동수량
            ,    pm.investment_desc             //투자내역
            ,    pm.execution_yyyymm            //집행년월
            ,    pm.investment_effect           //투자효과
            ,    pm.investment_place            //투자장소
            ,    ifnull((select sum(investment_item_purchasing_amt) as sum_item_pur_amt
                        from sp.Sf_Funding_Invest_Plan_Dtl
                        where funding_appl_number = pm.funding_appl_number
                        and investment_plan_sequence = pm.investment_plan_sequence
                    ),0) as sum_item_pur_amt : Decimal   //총 구입금액
        from sp.Sf_Funding_Invest_Plan_Mst pm
        where 1=1
        ;


    //----------------------투자계획 마스터 데이터 단건 조회----------------------
    /*
    * Param:
    *   - funding_appl_number
    *   - investment_plan_sequence
    */
    view InvestPlanMstView as 
        select
             key pm.funding_appl_number         //자금지원신청번호
            ,key pm.investment_plan_sequence    //시퀀스
            ,    pm.investment_type_code        //투자유형코드
            ,    pm.investment_project_name     //과제명
            ,    pm.investment_yyyymm           //투자년월
            ,    pm.appl_amount                 //신청금액
            ,    pm.investment_purpose          //투자목적
            ,    pm.apply_model_name            //적용모델명
            ,    pm.annual_mtlmob_quantity      //연간물동수량
            ,    pm.investment_desc             //투자내역
            ,    pm.execution_yyyymm            //집행년월
            ,    pm.investment_effect           //투자효과
            ,    pm.investment_place            //투자장소
            ,    ifnull((select sum(investment_item_purchasing_amt) as sum_item_pur_amt
                        from sp.Sf_Funding_Invest_Plan_Dtl
                        where funding_appl_number = pm.funding_appl_number
                        and investment_plan_sequence = pm.investment_plan_sequence
                    ),0) as sum_item_pur_amt : Decimal   //총 구입금액
            ,	ap.supplier_code                //업체코드
            ,	sm.supplier_local_name          //업체명
            ,	ap.tenant_id                    //
            ,	ap.company_code                 //
            ,	ap.org_type_code                //
            ,	ap.org_code                     //
            ,	org.org_name                    //
        from sp.Sf_Funding_Invest_Plan_Mst pm
        join sp.Sf_Funding_Application ap on pm.funding_appl_number = ap.funding_appl_number
        join sp.Sm_Supplier_Mst sm on sm.tenant_id = ap.tenant_id
		and sm.supplier_code = ap.supplier_code
        left join cm_pur_operation_org org on ap.tenant_id = org.tenant_id
        and ap.company_code = org.company_code
        and ap.org_type_code = org.org_type_code
        and ap.org_code = org.org_code
        where 1=1
        ;


    //----------------------투자계획 상세 데이터 조회----------------------
    /*
    * Param:
    *   - funding_appl_number
    *   - investment_plan_sequence
    */
    view InvestPlanDtlView as 
        select
             key pd.funding_appl_number                 //자금지원신청번호
            ,key pd.investment_plan_sequence            //투자계획 순번
            ,key pd.investment_plan_item_sequence       //투자계획 품목 순번
            ,    pd.investment_item_name                //투자품목명
            ,    pd.investment_item_purchasing_price    //투자품목구매가격
            ,    pd.investment_item_purchasing_qty      //투자품목구매수량
            ,    pd.investment_item_purchasing_amt      //투자품목구매금액
        from sp.Sf_Funding_Invest_Plan_Dtl pd
        where 1=1
        ;  

}        