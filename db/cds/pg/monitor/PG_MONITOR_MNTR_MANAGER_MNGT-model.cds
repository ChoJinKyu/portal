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
  6. entity : Monitoring_Manager_Management
  7. entity description : 모니터링 시나리오 담당자관리 
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as Monitoring_Manager_Management} from '../monitor/PG_MONITOR_MNTR_MANAGER_MNGT-model';

entity Monitor_Mntr_Manager_Mngt {
    key tenant_id                 : String(5) not null  @title : '테넌트ID';
    key company_code              : String(10) not null @title : '회사코드';
    key scenario_code             : String(10) not null @title : '시나리오';
    key manager_management_header : Integer64 not null  @title : '담당자 관리 Hearder';
    key manager_management_item   : Integer64 not null  @title : '담당자 관리 Item';
        manager                   : String(30)          @title : '담당자';
        user_korean_name          : String(240)         @title : '담당자명(KO)';
        user_english_name         : String(240)         @title : '담당자명(EN)';
}

extend Monitor_Mntr_Manager_Mngt with util.Managed;
