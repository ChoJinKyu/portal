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
  6. entity : Monitor_Manager
  7. entity description : 모니터링 담당자관리 
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Monitoring_Manager} from '../monitor/PG_MONITOR_MANAGER-model';

entity Monitor_Manager {
    key tenant_id                   : String(5) not null  @title : '회사코드';
    key company_code                : String(10) not null @title : '법인코드';
    key bizunit_code                : String(10) not null @title : '사업부분코드';
    key scenario                    : Integer64 not null  @title : '시나리오';
    key manager                     : String(30) not null @title : '관리자';
        manager_korean_name         : String(240)         @title : '관리자한국어명';
        manager_english_name        : String(240)         @title : '관리자영문명';
        manager_job_title           : String(100)         @title : '관리자업무제목';
        manager_mobile_phone_number : String(50)          @title : '관리자휴대폰번호';
        manager_department_code     : String(16)          @title : '관리자부서코드';
}

extend Monitor_Manager with util.Managed;
