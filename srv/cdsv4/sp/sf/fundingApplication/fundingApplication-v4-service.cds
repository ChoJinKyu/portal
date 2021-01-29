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

@path : '/sp.FundingApplicationV4Service'
service FundingApplicationV4Service {

    //************************************************
    // 테이블정보 entity
    //************************************************
    entity SfFundingApplication as projection on sp.Sf_Funding_Application;         //자금지원신청 마스터 
    entity SfFundingInvestPlanMst as projection on sp.Sf_Funding_Invest_Plan_Mst;   //투자계획서 헤더테이블
    entity SfFundingInvestPlanDtl as projection on sp.Sf_Funding_Invest_Plan_Dtl;   //투자계획서 상세테이블
    


    
    //************************************************
    // 프로시저 관련 type 정의
    //************************************************
    //리턴타입: 프로시저 저장 후 리턴 값
    type RtnObj : {
        result_code: String(2);
 	    err_type: String(20);
        err_code: String(20);
        rtn_funding_appl_number: String(10);
    } 

    //리턴타입: 투자계획서 상세 작업후 리턴값
    type RtnObjInvDtl : {
        result_code: String(2);
 	    err_type: String(20);
        err_code: String(20);
        rtn_funding_appl_number: String(10);
        rtn_investment_plan_sequence: Integer;
    } 

    //저장타입: 투자계획서 마스터
    type InvPlanMstType : {
        crud_type : String(1);                  //C:신규/R:읽기/U:수정/D:삭제
        funding_appl_number : String(10);       //자금지원신청번호
        investment_plan_sequence : Integer;     //투자계획순번
        investment_type_code : String(30);      //투자유형코드
        investment_project_name : String(200);  //투자과제명
        investment_yyyymm : String(6);          //투자년월
        appl_amount : Decimal;                  //신청금액
        investment_purpose : String(500);       //투자목적
        apply_model_name : String(200);         //적용모델명
        annual_mtlmob_quantity : Decimal;       //연간물동수량
        investment_desc : String(500);          //투자 내역
        execution_yyyymm : String(6);           //집행년월
        investment_effect : String(500);        //투자효과
        investment_place : String(500);         //투자장소
    };

    //저장타입: 투자계획서 상세
    type InvPlanDtlType : {
        crud_type : String(1);                      //C:신규/R:읽기/U:수정/D:삭제
        funding_appl_number : String(10);           //자금지원신청번호	
        investment_plan_sequence : Integer;         //투자계획순번	
        investment_plan_item_sequence : Integer;    //투자계획품목순번	
        investment_item_name : String(500);         //투자품목명	
        investment_item_purchasing_price : Decimal; //투자품목구매가격	
        investment_item_purchasing_qty : Decimal;   //투자품목구매수량	
        investment_item_purchasing_amt : Decimal;   //투자품목구매금액	
    };

    //삭제타입: 투자계획서 마스터
    type InvPlanMstDelType : {
        funding_appl_number : String(10);           //자금지원신청번호	
        investment_plan_sequence : Integer;         //투자계획순번	
    };
    
    //삭제타입: 투자계획서 상세
    type InvPlanDtlDelType : {
        funding_appl_number : String(10);           //자금지원신청번호	
        investment_plan_sequence : Integer;         //투자계획순번	
        investment_plan_item_sequence : Integer;    //투자계획품목순번	
    };



    //************************************************
    // 프로시저 호출 액션
    //************************************************
    //------------------임시저장
    action ProcSaveTemp (funding_appl_number           : String(10),    //자금지원신청번호
                        funding_notify_number         : String(10),    //자금지원공고번호
                        supplier_code                 : String(10),    //공급업체코드
                        tenant_id                     : String(5),     //테넌트ID
                        company_code                  : String(10),    //회사코드
                        org_type_code                 : String(2),     //조직유형코드
                        org_code                      : String(10),    //조직코드
                        purchasing_department_name    : String(100),   //구매부서명
                        pyear_sales_amount            : Decimal,       //전년매출금액
                        main_bank_name                : String(100),   //주요은행명
                        funding_appl_amount           : Decimal,       //자금지원신청금액
                        funding_hope_yyyymm           : String(6),     //자금지원희망년월
                        repayment_method_code         : String(30),    //상환방법코드
                        appl_user_name                : String(240),   //신청사용자명
                        appl_user_tel_number          : String(15),    //신청사용자전화번호
                        appl_user_email_address       : String(240),   //신청사용자이메일주소
                        funding_reason_code           : String(30),    //자금지원사유코드
                        collateral_type_code          : String(30),    //담보구분코드
                        collateral_amount             : Decimal,       //담보금액
                        collateral_attch_group_number : String(100),   //담보첨부파일그룹번호
                        funding_step_code             : String(30),    //자금지원단계코드
                        funding_status_code           : String(30),    //자금지원상태코드
                        user_id : String(30)           //작성자id
    ) returns array of RtnObj;

    //------------------제출
    action ProcRequest (funding_appl_number           : String(10),    //자금지원신청번호
                        funding_notify_number         : String(10),    //자금지원공고번호
                        supplier_code                 : String(10),    //공급업체코드
                        tenant_id                     : String(5),     //테넌트ID
                        company_code                  : String(10),    //회사코드
                        org_type_code                 : String(2),     //조직유형코드
                        org_code                      : String(10),    //조직코드
                        purchasing_department_name    : String(100),   //구매부서명
                        pyear_sales_amount            : Decimal,       //전년매출금액
                        main_bank_name                : String(100),   //주요은행명
                        funding_appl_amount           : Decimal,       //자금지원신청금액
                        funding_hope_yyyymm           : String(6),     //자금지원희망년월
                        repayment_method_code         : String(30),    //상환방법코드
                        appl_user_name                : String(240),   //신청사용자명
                        appl_user_tel_number          : String(15),    //신청사용자전화번호
                        appl_user_email_address       : String(240),   //신청사용자이메일주소
                        funding_reason_code           : String(30),    //자금지원사유코드
                        collateral_type_code          : String(30),    //담보구분코드
                        collateral_amount             : Decimal,       //담보금액
                        collateral_attch_group_number : String(100),   //담보첨부파일그룹번호
                        funding_step_code             : String(30),    //자금지원단계코드
                        funding_status_code           : String(30),    //자금지원상태코드
                        user_id                       : String(30)           //작성자id
    ) returns array of RtnObj;

    //------------------투자계획서 저장
    // action ProcSaveInvPlan (mstType: invPlanMstType //마스터 데이터 타입
    //                        ,dtlType: array of invPlanDtlType //상세 데이터 타입
    //                        ,user_id : String(30)    //작성자id
    // ) returns array of RtnObj;

    // //------------------투자계획서 마스터 삭제
    // action procDelInvPlan (mstType: array of invPlanMstDelType  //마스터 삭제 데이터 타입
    //                        ,user_id : String(30)                //작성자id
    // ) returns array of RtnObj;

    // //------------------투자계획서 상세 삭제
    // action procDelInvPlanDtl (dtlType: array of invPlanDtlType  //상세 삭제 데이터 타입
    //                        ,user_id : String(30)                //작성자id
    // ) returns array of RtnObj;

    
}
