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
  6. entity : Monitor_Full_Master
  7. entity description : 모니터링 시나리오 전체 마스터
  8. history
  -. 2020.11.17 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {cm as orgTenant} from '../../cm/orgMgr/CM_ORG_TENANT-model';
using {cm as orgCompany} from '../../cm/orgMgr/CM_ORG_COMPANY-model';
using {cm as orgBizunit} from '../../cm/orgMgr/CM_ORG_UNIT-model';

entity Monitor_Full_Master {
    key tenant_id                        : String(5) not null  @title : '회사코드';
        tenant                           : Association to orgTenant.Org_Tenant
                                               on tenant.tenant_id = tenant_id;
    key company_code                     : String(10) not null @title : '법인코드';
        comapny                          : Association to orgCompany.Org_Company
                                               on  comapny.tenant_id    = tenant_id
                                               and comapny.company_code = company_code;
    key bizunit_code                     : String(10) not null @title : '사업부분코드';
        bizunit                          : Association to orgBizunit.Org_Unit
                                               on  bizunit.tenant_id    = tenant_id
                                               and bizunit.bizunit_code = bizunit_code;
    key scenario_code                    : Integer64 not null  @title : '시나리오코드';
        separated_code                   : String(10)          @title : '구분코드';
        activate_flag                    : Boolean             @title : '활성화여부';
        monitoring_purpose               : LargeBinary         @title : '모니터링목적';
        scenario_desc                    : LargeBinary         @title : '시나리오설명';
        source_system_detail_description : LargeBinary         @title : '소스시스템상세설명';
}

extend Monitor_Full_Master with util.Managed;

