/**
 * * * *
 *
 * 1. namespace
 *
 * - 모듈코드 소문자로 작성
 * - 소모듈 존재시 대모듈.소모듈 로 작성
 *
 * 2. entity
 *
 * - 대문자로 작성
 * - 테이블명 생성을 고려하여 '\_' 추가
 *
 * 3. 컬럼(속성)
 *
 * - 소문자로 작성
 *
 * 4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에
 *    @cds.persistence.exists 명시
 * 5. namespace : sp
 * 6. entity : Sf_Funding_Invest_Plan_Mst
 * 7. entity description : 자금지원신청 투자계획서 마스터
 * 8. history -. 2021.01.11 : 위성찬 최초작성
 *
 * * * *
 */

namespace sp;

using util from '../../cm/util/util-model';
using {sp as invPlanDtl} from './SP_SF_FUNDING_INVEST_PLAN_DTL-model';

entity Sf_Funding_Invest_Plan_Mst {
    key funding_appl_number      : String(10) not null  @title : '자금지원신청번호';
    key investment_plan_sequence : Integer not null     @title : '투자계획순번';
        investment_type_code     : String(30) not null  @title : '투자유형코드';
        investment_project_name  : String(200) not null @title : '투자과제명';
        investment_yyyymm        : String(6) not null   @title : '투자년월';
        appl_amount              : Decimal not null     @title : '신청금액';
        investment_purpose       : String(500)          @title : '투자목적';
        apply_model_name         : String(200) not null @title : '적용모델명';
        annual_mtlmob_quantity   : Decimal not null     @title : '연간물동수량';
        investment_desc          : String(500)          @title : '투자 내역';
        execution_yyyymm         : String(6) not null   @title : '집행년월';
        investment_effect        : String(500)          @title : '투자효과';
        investment_place         : String(500)          @title : '투자장소';
}

extend Sf_Funding_Invest_Plan_Mst with util.Managed;
