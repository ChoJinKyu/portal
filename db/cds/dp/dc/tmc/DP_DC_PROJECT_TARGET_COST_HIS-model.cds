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
using {dp.Dc_Project_Target_Cost as pjtTargetCost} from './DP_DC_PROJECT_TARGET_COST-model';

entity Dc_Project_Target_Cost_His {
    key tenant_id: String(5) not null @title: '테넌트ID';
    key project_code: String(50) not null @title: '프로젝트코드';
    key event_code: String(20) not null @title: '개발단계코드';
    key version: Integer not null @title: '버전';
    key target_cost_code: String(10) not null @title: '목표비용코드';

    ref: Association to pjtTargetCost
        on ref.tenant_id = tenant_id
        and ref.project_code = project_code;

    target_cost_value: String(500) @title: '목표비용값';
}

  extend Dc_Project_Target_Cost_His with util.Managed;