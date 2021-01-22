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
  6. entity : Tm_Manager_Dtl
  7. entity description : 모니터링 담당자 상세
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {cm as Org_Tenant} from '../../cm/CM_ORG_TENANT-model';
using {cm as Employee} from '../../cm/CM_HR_EMPLOYEE-model';
using {pg as Scnr_Num} from './PG_TM_MASTER-model';
using {pg as Task_Monitoring_Manager} from '../tm/PG_TM_MANAGER_DTL-model';

entity Tm_Manager_Dtl {
    key tenant_id                       : String(5) not null  @title : '테넌트ID';

        tenant_ids                      : Association to Org_Tenant.Org_Tenant
                                              on tenant_ids.tenant_id = tenant_id;

    key scenario_number                 : Integer64 not null  @title : '시나리오번호';

        scenario_numbers                : Association to Scnr_Num.Tm_Master
                                              on  scenario_numbers.tenant_id       = tenant_id
                                              and scenario_numbers.scenario_number = scenario_number;

    key monitoring_manager_empno        : String(30) not null @title : '모니터링관리자사번';

        // monitoring_manager_empnos       : Association to Employee.Hr_Employee
        //                                       on  monitoring_manager_empnos.tenant_id       = tenant_id
        //                                       and monitoring_manager_empnos.employee_number = monitoring_manager_empno;

        monitoring_super_authority_flag : Boolean not null    @title : '모니터링최상위권한여부';
}

extend Tm_Manager_Dtl with util.Managed;
