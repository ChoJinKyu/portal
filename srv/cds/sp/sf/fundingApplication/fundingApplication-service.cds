//업무테이블 관련
using sp.Sf_Funding_Notify from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_NOTIFY-model';
using sp.Sf_Funding_Application from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_APPLICATION-model';
using sp.Sf_Funding_Invest_Plan_Mst from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_MST-model';
using sp.Sf_Funding_Invest_Plan_Dtl from '../../../../../db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_DTL-model';

//조직코드 프로세스 매핑
using { cm.Pur_Operation_Org as cm_pur_operation_org } from '../../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';          //조직정보
using { cm.Pur_Org_Type_Mapping as cm_pur_org_type_mapping } from '../../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model'; //프로세스타입 정보
using { cm.Org_Unit as cm_org_unit } from '../../../../../db/cds/cm/CM_ORG_UNIT-model'; //본부코드 마스터


//서플라이어 마스터
using sp.Sm_Supplier_Mst from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_MST-model';
using sp.Sm_Supplier_Org from '../../../../../db/cds/sp/sm/SP_SM_SUPPLIER_ORG-model';

// 공통코드 뷰
using { cm.Code_View as codeView } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
//using { cm.util as cmUtil } from '../../../../../srv/cds/cm/util/common-service';



namespace sp;

@path : '/sp.FundingApplicationService'
service FundingApplicationService {
    entity SfFundingApplication as projection on sp.Sf_Funding_Application;
    entity SfFundingInvestPlanMst as projection on sp.Sf_Funding_Invest_Plan_Mst;
    entity SfFundingInvestPlanDtl as projection on sp.Sf_Funding_Invest_Plan_Dtl;



    //************************************************
    // 조회관련 뷰
    //************************************************
    //----------------------본부코드 조회 콤보 쿼리----------------------
    view BizUnitCodeListView as
        select	
            distinct 
              key op.bizunit_code
            , ou.bizunit_name as bizunit_name : String
        from cm_pur_operation_org as op
        inner join cm_pur_org_type_mapping as tm 
        on op.tenant_id = tm.tenant_id
        and op.org_type_code = tm.org_type_code
        left outer join cm_org_unit as ou
        on op.bizunit_code = ou.bizunit_code
        where map(tm.company_code, '*', op.company_code, tm.company_code) = op.company_code
        and tm.process_type_code = 'SP07'
        and op.use_flag = true
        and op.bizunit_code is not null
        ;

    //----------------------거래사업부(조직코드) 콤보 쿼리----------------------
    /*
    * Param: 
    *   - tenant_id(세션값)
    *   - company_code(세션값)
    */
    view OrgCodeListView as
        select	
             key op.tenant_id           //tenant_id 컬럼에 저장될 값
            ,key op.company_code        //company_code 컬럼에 저장될 값
            ,key op.org_type_code       //org_type_code 컬럼에 저장될 값
            ,key op.org_code	        //콤보에 매핑될 value
            ,key supOrg.supplier_code   //업체코드
            ,op.org_name as org_name : String	            //콤보에 매핑될 text
            ,op.purchase_org_code
            ,op.plant_code
            ,op.affiliate_code
            ,op.bizdivision_code
            ,op.bizunit_code            //본부코드
            ,ou.bizunit_name as bizunit_name : String            //본부명
            ,op.au_code
            ,op.hq_au_code
            ,op.use_flag
        from cm_pur_operation_org as op
        inner join cm_pur_org_type_mapping as tm 
        on op.tenant_id = tm.tenant_id
        and op.org_type_code = tm.org_type_code
        inner join sp.Sm_Supplier_Org as supOrg 
        on op.tenant_id = supOrg.tenant_id
        and op.company_code = supOrg.company_code
        and op.org_type_code = supOrg.org_type_code
        and op.org_code = supOrg.org_code
        and supOrg.supplier_type_code = 'RAW_MATERIAL'
        left outer join cm_org_unit as ou
        on op.bizunit_code = ou.bizunit_code
        where map(tm.company_code, '*', op.company_code, tm.company_code) = op.company_code
        and tm.process_type_code = 'SP07'
        and op.use_flag = true
        //and supOrg.tenant_id = 'L1100'
        //and supOrg.company_code = 'LGEKR'
        //and supOrg.supplier_code = 'KR01811302'
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
             ,code_name as code_name : String
             ,language_cd
             ,sort_no
        from codeView
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
            //------------조직정보------------
            ,fa.tenant_id                       //테넌트ID
            ,fa.company_code                    //법인코드
            ,fa.org_type_code                   //조직유형코드
            ,fa.org_code                        //조직코드
            ,org.org_name as org_name : String	//조직명
            ,org.plant_code                     //플랜트코드
            ,org.bizdivision_code               //사업부코드
            ,org.bizunit_code                   //본부코드
            ,ou.bizunit_name as bizunit_name : String                    //본부명
            ,fa.funding_appl_date               //자금지원 신청 일자
            ,fa.purchasing_department_name      //구매부서명(LG구매팀)
            ,fa.pyear_sales_amount              //전년매출금액
            ,fa.main_bank_name                  //주거래은행
            ,fa.funding_appl_amount             //자금지원 신청 금액
            ,fa.funding_hope_yyyymm             //자금지원 희망 년월
            ,fa.repayment_method_code           //상환방법 코드
            ,cv_m.code_name as repayment_method_code_name : String    //상환방법 코드명
            ,fa.appl_user_name                  //신청자 명 
            ,fa.appl_user_tel_number            //신청자 전화번호
            ,fa.appl_user_email_address         //신청자 email
            ,fa.funding_reason_code             //지원 사유 코드
            ,fa.collateral_type_code            //담보구분 코드
            ,cv_c.code_name as collateral_type_code_name : String    //담보구분 코드명
            /*
            ,CM_GET_CODE_NAME_FUNC (fa.tenant_id
                                    ,'SP_SF_COLLATERAL_TYPE_CODE'
                                    ,fa.collateral_type_code
                                    ,'KO'
                                    ) AS collateral_type_text: String        //담보구분 코드명
            */                        
            ,fa.collateral_amount               //담보 금액
            ,fa.collateral_start_date           //담보 시작일자
            ,fa.collateral_end_date             //담보 종료일자
            ,fa.collateral_attch_group_number   //담보 약식확인서 첨부파일 그룹번호
            ,fa.funding_step_code               //자금지원 단계 코드
            ,fa.funding_status_code             //자금지원 상태 코드
            //------------업체정보------------
            ,supp.supplier_local_name as supplier_name : String  //업체명
			,supp.tax_id                                //사업자번호
			,supp.local_full_address                    //주소
			,supp.repre_name                            //대표자명
			,supp.email_address                         //이메일주소
			,supp.tel_number                            //전화번호
            ,supp.mobile_phone_number                   //폰번호
        from sp.Sf_Funding_Application as fa
        left outer join cm_pur_operation_org as org 
        on fa.tenant_id = org.tenant_id 
        and fa.company_code = org.company_code
        and fa.org_type_code = org.org_type_code
        and fa.org_code = org.org_code
        left outer join cm_org_unit as ou
        on org.bizunit_code = ou.bizunit_code
        left outer join codeView as cv_m           //상환방법 공통코드 조인
        on cv_m.tenant_id  = fa.tenant_id
        and cv_m.group_code = 'SP_SF_REPAYMENT_METHOD_CODE'
        and cv_m.code       = fa.repayment_method_code
        and cv_m.language_cd = 'KO'
        left outer join codeView as cv_c           //담보구분 공통코드 조인
        on cv_c.tenant_id  = fa.tenant_id
        and cv_c.group_code = 'SP_SF_COLLATERAL_TYPE_CODE'
        and cv_c.code       = fa.collateral_type_code
        and cv_c.language_cd = 'KO'
        left outer join sp.Sm_Supplier_Mst as supp
        on fa.tenant_id = supp.tenant_id
        and fa.supplier_code = supp.supplier_code
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
            ,pm.investment_type_code            //투자유형코드
            ,pm.investment_project_name         //과제명
            ,pm.investment_yyyymm               //투자년월
            ,pm.appl_amount                     //신청금액
            ,pm.investment_purpose              //투자목적
            ,pm.apply_model_name                //적용모델명
            ,pm.annual_mtlmob_quantity          //연간물동수량
            ,pm.investment_desc                 //투자내역
            ,pm.execution_yyyymm                //집행년월
            ,pm.investment_effect               //투자효과
            ,pm.investment_place                //투자장소
            ,ifnull((select sum(investment_item_purchasing_amt) as sum_item_pur_amt
                        from sp.Sf_Funding_Invest_Plan_Dtl
                        where funding_appl_number = pm.funding_appl_number
                        and investment_plan_sequence = pm.investment_plan_sequence
                    ),0) as sum_item_pur_amt : Decimal   //총 구입금액
        from sp.Sf_Funding_Invest_Plan_Mst as pm
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
            ,pm.investment_type_code            //투자유형코드
            ,cv_a.code_name as investment_type_code_name : String    //투자유형 코드명
            ,pm.investment_project_name         //과제명
            ,pm.investment_yyyymm               //투자년월
            ,pm.appl_amount                     //신청금액
            ,pm.investment_purpose              //투자목적
            ,pm.apply_model_name                //적용모델명
            ,pm.annual_mtlmob_quantity          //연간물동수량
            ,pm.investment_desc                 //투자내역
            ,pm.execution_yyyymm                //집행년월
            ,pm.investment_effect               //투자효과
            ,pm.investment_place                //투자장소
            ,ifnull((select sum(investment_item_purchasing_amt) as sum_item_pur_amt
                        from sp.Sf_Funding_Invest_Plan_Dtl
                        where funding_appl_number = pm.funding_appl_number
                        and investment_plan_sequence = pm.investment_plan_sequence
                    ),0) as sum_item_pur_amt : Decimal   //총 구입금액
            ,ap.supplier_code                   //업체코드
            ,sm.supplier_local_name as supplier_local_name : String //업체명
            ,pm.tenant_id                       //
            ,pm.company_code                    //
            ,ap.org_type_code                   //
            ,ap.org_code                        //
            ,org.org_name as org_name : String  //
        from sp.Sf_Funding_Invest_Plan_Mst pm
        inner join sp.Sf_Funding_Application ap 
        on pm.funding_appl_number = ap.funding_appl_number
        inner join sp.Sm_Supplier_Mst sm 
        on sm.tenant_id = ap.tenant_id
		and sm.supplier_code = ap.supplier_code
        left outer join cm_pur_operation_org org 
        on ap.tenant_id = org.tenant_id
        and ap.company_code = org.company_code
        and ap.org_type_code = org.org_type_code
        and ap.org_code = org.org_code
        left outer join codeView cv_a           //투자유형 공통코드 조인
        on cv_a.tenant_id  = pm.tenant_id
        and cv_a.group_code = 'SP_SF_INVESTMENT_TYPE_CODE'
        and cv_a.code       = pm.investment_type_code
        and cv_a.language_cd = 'KO'
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
             key pd.funding_appl_number             //자금지원신청번호
            ,key pd.investment_plan_sequence        //투자계획 순번
            ,key pd.investment_plan_item_sequence   //투자계획 품목 순번
            ,pd.investment_item_name                //투자품목명
            ,pd.investment_item_purchasing_price    //투자품목구매가격
            ,pd.investment_item_purchasing_qty      //투자품목구매수량
            ,pd.investment_item_purchasing_amt      //투자품목구매금액
        from sp.Sf_Funding_Invest_Plan_Dtl pd
        where 1=1
        ;  




    //----------------------자금지원 현황목록 조회----------------------
    view FundingApplListView as  
        select
             key appl.funding_appl_number				//신청번호
            ,ntfy.funding_notify_number					//공고번호
            ,ntfy.funding_notify_title				    //공고제목
            ,appl.tenant_id                             //테넌트ID
            ,appl.company_code                          //회사코드
            ,appl.org_type_code                         //조직유형코드
            ,appl.org_code								//조직코드
            ,org.bizunit_code                           //본부코드
            ,ou.bizunit_name as bizunit_name : String   //본부명
            ,org.org_name as org_name : String			//조직명
            ,appl.supplier_code							//업체코드
            ,supp.supplier_local_name as supplier_name : String	//업체명
            ,appl.funding_step_code						//스텝코드
            ,cvStep.code_name  as funding_step_name : String        //스텝명
            ,appl.funding_status_code					//상태코드
            ,cvStatus.code_name  as funding_status_name : String    //상태명
            ,appl.funding_appl_date						//자금지원 신청일자
            ,appl.purchasing_department_name			//부서명
            ,appl.funding_appl_amount					//신청금액
        from sp.Sf_Funding_Application as appl
        inner join sp.Sf_Funding_Notify as ntfy        //공고정보 조인
        on appl.funding_notify_number = ntfy.funding_notify_number
        and appl.tenant_id = ntfy.tenant_id
        inner join sp.Sm_Supplier_Mst as supp          //협력사정보 조인
        on appl.tenant_id = supp.tenant_id
        and appl.supplier_code = supp.supplier_code
        left outer join cm_pur_operation_org as org 
        on appl.tenant_id = org.tenant_id
        and appl.company_code = org.company_code
        and appl.org_type_code = org.org_type_code
        and appl.org_code = org.org_code
        left outer join cm_org_unit as ou
        on org.bizunit_code = ou.bizunit_code
        left outer join codeView as cvStep             //단계명 공통코드 조인
        on   cvStep.tenant_id  = appl.tenant_id
        and  cvStep.group_code = 'SP_SF_FUNDING_STEP_CODE'
        and  cvStep.code       = appl.funding_step_code
        and  cvStep.language_cd = 'KO'
        left outer join codeView as cvStatus           //상태명 공통코드 조인
        on   cvStatus.tenant_id  = appl.tenant_id
        and  cvStatus.group_code = 'SP_SF_FUNDING_STATUS_CODE'
        and  cvStatus.code       = appl.funding_status_code
        and  cvStatus.language_cd = 'KO'
        where 1=1    
        ; 


}
