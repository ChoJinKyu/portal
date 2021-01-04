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
  6. entity : Tm_Attachments_Dtl
  7. entity description : 모니터링 첨부파일 상세
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {cm as Org_Tenant} from '../../cm/CM_ORG_TENANT-model';
using {pg as Scnr_Num} from './PG_TM_MASTER-model';
using {pg as Task_Monitoring_Attachments} from '../tm/PG_TM_ATTACHMENTS_DTL-model';

entity Tm_Attachments_Dtl {
    key tenant_id        : String(5) not null @title : '회사코드';

        tenant_ids       : Association to Org_Tenant.Org_Tenant
                               on tenant_ids.tenant_id = tenant_id;

    key scenario_number  : Integer64 not null @title : '시나리오번호';

        scenario_numbers : Association to Scnr_Num.Tm_Master
                               on  scenario_numbers.tenant_id       = tenant_id
                               and scenario_numbers.scenario_number = scenario_number;

        attch_contents   : LargeBinary        @title : '첨부파일내용';
        attch_type_code  : String(30)         @title : '첨부파일유형코드';
        attch_name       : String(240)        @title : '첨부파일명';
        attch_size       : Integer64          @title : '첨부파일크기';
}

extend Tm_Attachments_Dtl with util.Managed;
