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
using {dp.Dc_Project_Master as pjtMst} from './DP_DC_PROJECT_MASTER-model';

entity Dc_Project_Member {
    key tenant_id: String(5) not null @title: '테넌트ID';
    key project_code: String(50) not null @title: '프로젝트코드';
    key emp_no: String(20) not null @title: '사번';
    project_manager_flag: String(50) @title: '프로젝트매니저여부';

    ref: Association to pjtMst
        on ref.tenant_id = tenant_id
        and ref.project_code = project_code;
}

  extend Dc_Project_Member with util.Managed;