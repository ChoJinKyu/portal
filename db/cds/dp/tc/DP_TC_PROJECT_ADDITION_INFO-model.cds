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
 * 6. entity : Tc_Project_Addition_Info
 * 7. entity description : 최신 프로젝트 추가 정보(물동/판가/가공비/판관비)
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */

namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Project} from './DP_TC_PROJECT-model';

entity Tc_Project_Addition_Info {
    key tenant_id           : String(5) not null  @title : '테넌트ID';
    key project_code        : String(30) not null @title : '프로젝트코드';
    key model_code          : String(40) not null @title : '모델코드';
    key addition_type_code  : String(30) not null @title : '추가유형코드';
    key period_code         : String(30) not null @title : '기간코드';
        uom_code            : String(3)           @title : 'UOM코드';    
        addition_type_value : String(10)          @title : '추가유형값';
/*
        mtlmob_ref          : Association[0.. * ] to Project.Tc_Project
                                  on  mtlmob_ref.tenant_id    = tenant_id
                                  and mtlmob_ref.project_code = project_code
                                  and mtlmob_ref.model_code   = model_code
                                  and addition_type_code      = 'MTLMOB'; //물동

        sales_price_ref     : Association[0.. * ] to Project.Tc_Project
                                  on  sales_price_ref.tenant_id    = tenant_id
                                  and sales_price_ref.project_code = project_code
                                  and sales_price_ref.model_code   = model_code
                                  and addition_type_code           = 'SALES_PRICE'; //판가

        prcs_cost_ref       : Association[0.. * ] to Project.Tc_Project
                                  on  prcs_cost_ref.tenant_id    = tenant_id
                                  and prcs_cost_ref.project_code = project_code
                                  and prcs_cost_ref.model_code   = model_code
                                  and addition_type_code         = 'PROCESSING_COST'; //가공비

        sgna_ref            : Association[0.. * ] to Project.Tc_Project
                                  on  sgna_ref.tenant_id    = tenant_id
                                  and sgna_ref.project_code = project_code
                                  and sgna_ref.model_code   = model_code
                                  and addition_type_code    = 'SGNA'; //판관비
*/
}

extend Tc_Project_Addition_Info with util.Managed;
