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

entity Dc_Project_Schedule {
    key tenant_id: String(5) not null @title: '테넌트ID';
    key project_code: String(50) not null @title: '프로젝트코드';
    key event_code: String(20) not null @title: '개발단계코드';

    ref : Association to pjt
        on ref.tenant_id = tenant_id
        and ref.project_code = project_code;

    plan_start_date: DateTime @title: '계획시작일';
    plan_end_date: DateTime @title: '계획종료일';
    result_start_date: DateTime @title: '결과시작일';
    result_end_date: DateTime @title: '결과종료일';
}

  extend Dc_Project_Schedule with util.Managed;