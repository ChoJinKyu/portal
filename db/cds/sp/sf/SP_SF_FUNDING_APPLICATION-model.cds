/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시  
  
  5. namespace : sp
  6. entity : Sf_Funding_Application
  7. entity description : 자금지원신청 관리
  8. history
  -. 2021.01.11 : 위성찬 최초작성
*************************************************/

namespace sp;

using util from '../../cm/util/util-model';
using {sp as invPlanMst} from './SP_SF_FUNDING_INVEST_PLAN_MST-model';

entity Sf_Funding_Application {
    key funding_appl_number           : String(10) not null @title : '자금지원신청번호';
        funding_notify_number         : String(10) not null @title : '자금지원공고번호';
        supplier_code                 : String(10) not null @title : '공급업체코드';
        tenant_id                     : String(5) not null  @title : '테넌트ID';
        company_code                  : String(10) not null @title : '회사코드';
        org_type_code                 : String(2) not null  @title : '조직유형코드';
        org_code                      : String(10) not null @title : '조직코드';
        funding_appl_date             : Date                @title : '자금지원신청일자';
        purchasing_department_name    : String(100)         @title : '구매부서명';
        pyear_sales_amount            : Decimal             @title : '전년매출금액';
        main_bank_name                : String(100)         @title : '주요은행명';
        funding_appl_amount           : Decimal             @title : '자금지원신청금액';
        funding_hope_yyyymm           : String(6)           @title : '자금지원희망년월';
        repayment_method_code         : String(30)          @title : '상환방법코드';
        appl_user_name                : String(240)         @title : '신청사용자명';
        appl_user_tel_number          : String(15)          @title : '신청사용자전화번호';
        appl_user_email_address       : String(240)         @title : '신청사용자이메일주소';
        funding_reason_code           : String(30)          @title : '자금지원사유코드';
        collateral_type_code          : String(30)          @title : '담보구분코드';
        collateral_amount             : Decimal             @title : '담보금액';
        collateral_start_date         : Date                @title : '담보시작일자';
        collateral_end_date           : Date                @title : '담보종료일자';
        collateral_attch_group_number : String(100)         @title : '담보첨부파일그룹번호';
        funding_step_code             : String(30) not null @title : '자금지원단계코드';
        funding_status_code           : String(30) not null @title : '자금지원상태코드';                               
}

extend Sf_Funding_Application with util.Managed;
