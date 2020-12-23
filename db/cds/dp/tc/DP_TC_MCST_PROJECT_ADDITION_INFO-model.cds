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
 * 6. entity : Tc_Mcst_Project_Addition_Info
 * 7. entity description : 재료비의 프로젝트 추가 정보(물동/판가/가공비/판관비)
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */

namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Mcst_Project} from './DP_TC_MCST_PROJECT-model';

entity Tc_Mcst_Project_Addition_Info {
    key tenant_id            : String(5) not null  @title : '테넌트ID';
    key project_code         : String(30) not null @title : '프로젝트코드';
    key model_code           : String(40) not null @title : '모델코드';
    key mcst_code            : String(30) not null @title : '재료비코드';
    key version_sequence     : Decimal not null    @title : '버전순서';
    key addition_type_code   : String(30) not null @title : '추가유형코드';
    key period_code          : String(30) not null @title : '기간코드';
        addition_type_value  : String(10)          @title : '추가유형값';
/*
        mcst_mtlmob_ref      : Association[0.. * ] to Mcst_Project.Tc_Mcst_Project
                                   on  mcst_mtlmob_ref.tenant_id        = tenant_id
                                   and mcst_mtlmob_ref.project_code     = project_code
                                   and mcst_mtlmob_ref.model_code       = model_code
                                   and mcst_mtlmob_ref.mcst_code        = mcst_code
                                   and mcst_mtlmob_ref.version_sequence = version_sequence
                                   and addition_type_code               = 'MTLLMOB'; //물동

        mcst_sales_price_ref : Association[0.. * ] to Mcst_Project.Tc_Mcst_Project
                                   on  mcst_sales_price_ref.tenant_id        = tenant_id
                                   and mcst_sales_price_ref.project_code     = project_code
                                   and mcst_sales_price_ref.model_code       = model_code
                                   and mcst_sales_price_ref.mcst_code        = mcst_code
                                   and mcst_sales_price_ref.version_sequence = version_sequence
                                   and addition_type_code                    = 'SALES_PRICE'; //판가

        mcst_prcs_cost_ref   : Association[0.. * ] to Mcst_Project.Tc_Mcst_Project
                                   on  mcst_prcs_cost_ref.tenant_id        = tenant_id
                                   and mcst_prcs_cost_ref.project_code     = project_code
                                   and mcst_prcs_cost_ref.model_code       = model_code
                                   and mcst_prcs_cost_ref.mcst_code        = mcst_code
                                   and mcst_prcs_cost_ref.version_sequence = version_sequence
                                   and addition_type_code                  = 'PROCESSING_COST'; //가공비

        mcst_sgna_ref        : Association[0.. * ] to Mcst_Project.Tc_Mcst_Project
                                   on  mcst_sgna_ref.tenant_id        = tenant_id
                                   and mcst_sgna_ref.project_code     = project_code
                                   and mcst_sgna_ref.model_code       = model_code
                                   and mcst_sgna_ref.mcst_code        = mcst_code
                                   and mcst_sgna_ref.version_sequence = version_sequence
                                   and addition_type_code             = 'SGNA'; //판관비
*/
}

extend Tc_Mcst_Project_Addition_Info with util.Managed;
