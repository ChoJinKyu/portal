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
*************************************************/
namespace dp;
using { User } from '@sap/cds/common';
using util from '../../../util/util-model';
using {dp.Dc_Project as pjt} from './DP_DC_PROJECT-model';

entity Dc_Project_His {
    key tenant_id: String(5) not null @title: '테넌트ID';
    key project_code: String(50) not null @title: '프로젝트코드';
    key version: Integer not null @title: '버전';

    ref : Association to pjt
        on ref.tenant_id = tenant_id
        and ref.project_code = project_code;

    project_name: String(200) @title: '프로젝트명';
    operation_type: String(200) @title: '구매운영조직유형';	
    operation_code: String(200) @title: '구매운영조직코드';
    division_code: String(50) @title: 'DIVISION CODE';
    division_name: String(200) @title: 'DIVISION NAME';
    model_code: String(50) @title: '모델코드';
    grade_code: String(20) @title: '개발등급코드';
    event_code: String(20) @title: '개발단계코드';
    status_code: String(20) @title: '상태코드';
    status_name: String(50) @title: '상태명';
    product_code: String(50) @title: '제품군코드';
    project_manager_empno: String(20) @title: '프로젝트매니저사번';
    purchase_manager_empno: String(20) @title: '구매매니저사번';
    customer: String(100) @title: '고객';
    mp_date: Date @title: '양산일자';
    currency_code: String(5) @title: '통화코드';
    reference_model_code: String(50) @title: '관련모델코드';
    proposal_empno: String(20) @title: '개발발의자사번';
    account_unit_code: String(30) @title: '회계단위코드';
    account_department_code: String(30) @title: '회계(비용)부서코드';
    skip_cp_flag: Boolean @title: 'CP단계SKIP여부';
    skip_pp_flag: Boolean @title: 'PP단계SKIP여부';
    skip_dv1_flag: Boolean @title: 'DV1단계SKIP여부';
    skip_dv2_flag: Boolean @title: 'DV2단계SKIP여부';
    skip_pv_flag: Boolean @title: 'PV단계SKIP여부';
    skip_mp_flag: Boolean @title: 'MP단계SKIP여부';
    operating_unit_id: Integer @title: 'OPERATING UNIT ID';
    mbom_exists_flag: Boolean @title: 'MBOM존재여부';
    nti_event_name: String(50) @title: 'NTI(기술개발) PROJECT EVENT NAME';
}

  extend Dc_Project_His with util.Managed;