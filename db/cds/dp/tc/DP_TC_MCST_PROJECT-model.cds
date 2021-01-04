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
 * 5. namespace : dp
 * 6. entity : Tc_Mcst_Project
 * 7. entity description : 재료비의 프로젝트 정보
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Mcst_Project_Event} from './DP_TC_MCST_PROJECT_EVENT-model';
using {dp as Mcst_Project_Similar_Model} from './DP_TC_MCST_PROJECT_SIMILAR_MODEL-model';
using {dp as Mcst_Project_Base_Exrate} from './DP_TC_MCST_PROJECT_BASE_EXRATE-model';
using {dp as Mcst_Project_Addition_Info} from './DP_TC_MCST_PROJECT_ADDITION_INFO-model';

entity Tc_Mcst_Project {
    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key project_code            : String(30) not null @title : '프로젝트코드';
    key model_code              : String(40) not null @title : '모델코드';
    key version_number          : String(30) not null @title : '버전번호';
        project_name            : String(100)         @title : '프로젝트명';
        model_name              : String(100)         @title : '모델명';
        mcst_code               : String(30) not null @title : '재료비코드';
        version_sequence        : Decimal not null    @title : '버전순서';
        company_code            : String(10)          @title : '회사코드';
        org_type_code           : String(2)           @title : '조직유형코드';
        org_code                : String(10)          @title : '조직코드';
        bizdivision_code        : String(10)          @title : '사업부코드';
        product_group_code      : String(10)          @title : '제품군코드';
        source_type_code        : String(30)          @title : '출처구분코드';
        quotation_project_code  : String(50)          @title : '견적프로젝트코드';
        project_status_code     : String(30)          @title : '프로젝트상태코드';
        project_grade_code      : String(30)          @title : '프로젝트등급코드';
        develope_event_code     : String(30)          @title : '개발이벤트코드';
        production_company_code : String(10)          @title : '생산회사코드';
        project_leader_empno    : String(30)          @title : '프로젝트리더사번';
        buyer_empno             : String(30)          @title : '구매담당자사번';
        marketing_person_empno  : String(30)          @title : '마케팅담당자사번';
        planning_person_empno   : String(30)          @title : '기획담당자사번';
        customer_local_name     : String(50)          @title : '고객로컬명';
        last_customer_name      : String(240)         @title : '최종고객명';
        customer_model_desc     : String(1000)        @title : '고객모델설명';
        mcst_yield_rate         : Decimal             @title : '재료비수율';
        bom_type_code           : String(30)          @title : '자재명세서유형코드';
        sales_currency_code     : String(3)           @title : '매출통화코드';
        project_creator_empno   : String(30)          @title : '프로젝트생성자사번';
        project_create_date     : Date                @title : '프로젝트생성일자';
        massprod_start_date     : Date                @title : '양산시작일자';
        massprod_end_date       : Date                @title : '양산종료일자';
        mcst_excl_flag          : Boolean             @title : '재료비제외여부';
        mcst_excl_reason        : String(3000)        @title : '재료비제외사유';
        direct_register_flag    : Boolean             @title : '직접등록여부';
        mcst_status_code        : String(30)          @title : '재료비상태코드';
        full_sequence           : Decimal             @title : '전체순서';
        mcst_sum_value          : Decimal             @title : '재료비합계값';

        mcst_events             : Composition of many Mcst_Project_Event.Tc_Mcst_Project_Event
                                      on  mcst_events.tenant_id      = tenant_id
                                      and mcst_events.project_code   = project_code
                                      and mcst_events.model_code     = model_code
                                      and mcst_events.version_number = version_number;

        mcst_similar_model      : Composition of many Mcst_Project_Similar_Model.Tc_Mcst_Project_Similar_Model
                                      on  mcst_similar_model.tenant_id      = tenant_id
                                      and mcst_similar_model.project_code   = project_code
                                      and mcst_similar_model.model_code     = model_code
                                      and mcst_similar_model.version_number = version_number;

        mcst_base_extra         : Composition of many Mcst_Project_Base_Exrate.Tc_Mcst_Project_Base_Exrate
                                      on  mcst_base_extra.tenant_id      = tenant_id
                                      and mcst_base_extra.project_code   = project_code
                                      and mcst_base_extra.model_code     = model_code
                                      and mcst_base_extra.version_number = version_number;


        mcst_mtlmob             : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  mcst_mtlmob.tenant_id          = tenant_id
                                      and mcst_mtlmob.project_code       = project_code
                                      and mcst_mtlmob.model_code         = model_code
                                      and mcst_mtlmob.version_number     = version_number
                                      and mcst_mtlmob.addition_type_code = 'MTLLMOB'; //물동

        mcst_sales_price        : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  mcst_sales_price.tenant_id          = tenant_id
                                      and mcst_sales_price.project_code       = project_code
                                      and mcst_sales_price.model_code         = model_code
                                      and mcst_sales_price.version_number     = version_number
                                      and mcst_sales_price.addition_type_code = 'SALES_PRICE'; //판가

        mcst_prcs_cost          : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  mcst_prcs_cost.tenant_id          = tenant_id
                                      and mcst_prcs_cost.project_code       = project_code
                                      and mcst_prcs_cost.model_code         = model_code
                                      and mcst_prcs_cost.version_number     = version_number
                                      and mcst_prcs_cost.addition_type_code = 'PROCESSING_COST'; //가공비

        mcst_sgna               : Composition of many Mcst_Project_Addition_Info.Tc_Mcst_Project_Addition_Info
                                      on  mcst_sgna.tenant_id          = tenant_id
                                      and mcst_sgna.project_code       = project_code
                                      and mcst_sgna.model_code         = model_code
                                      and mcst_sgna.version_number     = version_number
                                      and mcst_sgna.addition_type_code = 'SGNA'; //판관비
}

extend Tc_Mcst_Project with util.Managed;
