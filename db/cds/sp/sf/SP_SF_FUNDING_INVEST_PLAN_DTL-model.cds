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
  6. entity : Sf_Funding_Invest_Plan_Dtl
  7. entity description : 자금지원신청 투자계획서 상세
  8. history
  -. 2021.01.11 : 위성찬 최초작성
*************************************************/

namespace sp;

using util from '../../cm/util/util-model';
// using {sp as fundingInvPlanDtl} from 'db/cds/sp/sf/SP_SF_FUNDING_INVEST_PLAN_DTL-model';

entity Sf_Funding_Invest_Plan_Dtl {
    key funding_appl_number              : String(10) @title : '자금지원신청번호';
    key investment_plan_sequence         : Integer    @title : '투자계획순번';
    key investment_plan_item_sequence    : Integer    @title : '투자계획품목순번';
        tenant_id                        : String(5) not null  @title : '테넌트ID';
        company_code                     : String(10) not null @title : '회사코드';
        investment_item_name             : String(500) not null @title : '투자품목명';
        investment_item_purchasing_price : Decimal    not null @title : '투자품목구매가격';
        investment_item_purchasing_qty   : Decimal    not null @title : '투자품목구매수량';
        investment_item_purchasing_amt   : Decimal    not null @title : '투자품목구매금액';
}

extend Sf_Funding_Invest_Plan_Dtl with util.Managed;
