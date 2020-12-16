/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에 @cds.persistence.exists 명시    
  5. namespace : pg
  6. entity : Tm_Master
  7. entity description : 모니터링 마스터
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Task_Monitoring_Master} from '../tm/PG_TM_MASTER-model';

entity Tm_Master {
    key tenant_id            : String(5) not null @title : '회사코드';
    key scenario_number      : Integer64 not null @title : '시나리오번호';
        monitoring_type_code : String(30)         @title : '모니터링구분코드';
        activate_flag        : Boolean not null   @title : '활성화여부';
        monitoring_purpose   : LargeBinary        @title : '모니터링목적';
        scenario_desc        : LargeBinary        @title : '시나리오설명';
        source_system_desc   : LargeBinary        @title : '소스시스템설명';
}


extend Tm_Master with util.Managed;
