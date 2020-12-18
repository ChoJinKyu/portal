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
 * 6. entity : Tc_Project_Mcst_Version
 * 7. entity description : 프로젝트의 목표재료비 버전 정보(견적/목표/예상)
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Project_Member} from './DP_TC_PROJECT_MCST_VERSION-model';
using {dp as Project} from './DP_TC_PROJECT-model';

entity Tc_Project_Mcst_Version {
    key tenant_id        : String(5) not null  @title : '테넌트ID';
    key project_code     : String(30) not null @title : '프로젝트코드';
    key model_code       : String(40) not null @title : '모델코드';
    key mcst_code        : String(30) not null @title : '재료비코드';
    key version_sequence : Decimal not null    @title : '버전순서';
        full_sequence    : Decimal             @title : '전체순서';
        mcst_status_code : String(30)          @title : '재료비상태코드';
        mcst_sum_value   : Decimal             @title : '재료비합계값';

        mcst_ver_ref     : Association[0..*] to dp.Tc_Project
                               on  mcst_ver_ref.tenant_id    = tenant_id
                               and mcst_ver_ref.project_code = project_code
                               and mcst_ver_ref.model_code   = model_code;
}

extend Tc_Project_Mcst_Version with util.Managed;
