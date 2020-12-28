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
 * 6. entity : Tc_Project_Base_Exrate
 * 7. entity description : 최신 프로젝트 기준 환율
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Project} from './DP_TC_PROJECT-model';

entity Tc_Project_Base_Exrate {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key project_code  : String(30) not null @title : '프로젝트코드';
    key model_code    : String(40) not null @title : '모델코드';
    key currency_code : String(3) not null  @title : '통화코드';
    key period_code   : String(30) not null @title : '기간코드';
        exrate        : Decimal             @title : '환율';
/*
        exrate_ref    : Association[1.. * ] to Project.Tc_Project
                            on  exrate_ref.tenant_id    = tenant_id
                            and exrate_ref.project_code = project_code
                            and exrate_ref.model_code   = model_code;
*/
}

extend Tc_Project_Base_Exrate with util.Managed;
