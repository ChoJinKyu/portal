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
 * 6. entity : Tc_Project
 * 7. entity description : 목표재료비 프로젝트 정보
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../../cm/util/util-model';
using {dp as Project} from './DP_TC_PROJECT-model';
using {dp as Project_Event} from './DP_TC_PROJECT_EVENT-model';
using {dp as Project_Mcst_Ver} from './DP_TC_PROJECT_MCST_VERSION-model';
using {dp as Project_Similar_model} from './DP_TC_PROJECT_SIMILAR_MODEL-model';
using {cm as language } from '../../../cm/codeMgr/CM_CODE_LNG-model';

entity Tc_Project {
    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key project_code            : String(30) not null @title : '프로젝트코드';
    key model_code              : String(40) not null @title : '모델코드';
        project_name            : String(100)         @title : '프로젝트명';
        company_code            : String(10)          @title : '회사코드';
        org_type_code           : String(2)           @title : '조직유형코드';
        org_code                : String(10)          @title : '조직코드';
        bizdivision_code        : String(10)          @title : '사업부코드';
        product_group_code      : String(10)          @title : '제품군코드';
        source_type_code        : String(30)          @title : '출처구분코드';
        quotation_project_code  : String(50)          @title : '견적프로젝트코드';
        project_status_code     : String(30)          @title : '프로젝트상태코드';
        project_grade_code      : String(30)          @title : '프로젝트등급코드';
        production_company_code : String(10)          @title : '생산회사코드';
        project_leader_empno    : String(30)          @title : '프로젝트리더사번';
        buyer_empno             : String(30)          @title : '구매담당자사번';
        customer_local_name     : String(50)          @title : '고객로컬명';
        oem_customer_name       : String(100)         @title : 'OEM고객명';
        car_type_name           : String(50)          @title : '차종명';
        mcst_yield_rate         : Decimal             @title : '재료비수율';
        bom_type_code           : String(30)          @title : '자재명세서유형코드';
        sales_currency_code     : String(3)           @title : '매출통화코드';
        massprod_start_date     : Date                @title : '양산시작일자';
        massprod_end_date       : Date                @title : '양산종료일자';
        mcst_excl_flag          : Boolean             @title : '재료비제외여부';
        mcst_excl_reason        : String(3000)        @title : '재료비제외사유';

        events                  : Composition of many dp.Tc_Project_Event
                                      on  events.tenant_id    = tenant_id
                                      and events.project_code = project_code
                                      and events.model_code   = model_code;

        mcst_ver                : Composition of many dp.Tc_Project_Mcst_Version
                                      on  mcst_ver.tenant_id    = tenant_id
                                      and mcst_ver.project_code = project_code
                                      and mcst_ver.model_code   = model_code;

        silimar_model                : Composition of many dp.Tc_Project_Similar_Model
                                      on  silimar_model.tenant_id    = tenant_id
                                      and silimar_model.project_code = project_code
                                      and silimar_model.model_code   = model_code;        
                                           
}

extend Tc_Project with util.Managed;
