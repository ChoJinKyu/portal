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
  6. entity : Tm_Type_Code_Lng
  7. entity description : 모니터링 구분코드 다국어
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {cm as Org_Tenant} from '../../cm/CM_ORG_TENANT-model';
using {pg as Scnr_Num} from './PG_TM_MASTER-model';
using {pg as Task_Monitoring_Type} from '../tm/PG_TM_TYPE_CODE_LNG-model';

entity Tm_Type_Code_Lng {
    key tenant_id            : String(5) not null  @title : '회사코드';

        tenant_ids           : Association to Org_Tenant.Org_Tenant
                                   on tenant_ids.tenant_id = tenant_id;

    key scenario_number      : Integer64 not null  @title : '시나리오번호';

        scenario_numbers     : Association to Scnr_Num.Tm_Master
                                   on  scenario_numbers.tenant_id       = tenant_id
                                   and scenario_numbers.scenario_number = scenario_number;

    key monitoring_type_code : String(30) not null @title : '모니터링구분코드';
    key language_code        : String(10) not null @title : '언어코드';
        monitoring_type_name : String(240)         @title : '모니터링구분명';
}

extend Tm_Type_Code_Lng with util.Managed;	
