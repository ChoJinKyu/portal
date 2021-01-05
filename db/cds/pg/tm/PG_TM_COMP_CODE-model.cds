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
  6. entity : Tm_Comp_Code
  7. entity description : 모니터링 법인코드
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {cm as Org_Tenant} from '../../cm/CM_ORG_TENANT-model';
using {cm as Org_Company} from '../../cm/CM_ORG_COMPANY-model';
using {pg as Task_Monitoring_Company_Code} from '../tm/PG_TM_COMP_CODE-model';

entity Tm_Comp_Code {
    key tenant_id       : String(5) not null  @title : '회사코드';

        tenant_ids      : Association to Org_Tenant.Org_Tenant
                              on tenant_ids.tenant_id = tenant_id;

    key scenario_number : Integer64 not null  @title : '시나리오번호';
    key company_code    : String(10) not null @title : '법인코드';

        company_codes   : Association to Org_Company.Org_Company
                              on  company_codes.tenant_id    = tenant_id
                              and company_codes.company_code = company_code;
}

extend Tm_Comp_Code with util.Managed;
