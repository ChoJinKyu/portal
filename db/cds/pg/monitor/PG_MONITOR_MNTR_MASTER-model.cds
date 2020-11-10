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
  6. entity : Monitor_Mntr_Mst
  7. entity description : 모니터링 시나리오 메인 마스터 
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as Monitoring_Master} from '../monitor/PG_MONITOR_MNTR_MASTER-model';

entity Monitor_Mntr_Mst {
    key tenant_id                        : String(5) not null  @title : '테넌트ID';
    key company_code                     : String(10) not null @title : '회사코드';
    key scenario_code                    : String(10) not null @title : '시나리오';
        separated                        : String(10) not null @title : '구분';
        type_management_header           : Integer64           @title : '유형 관리 Hearder';
        bizdivision_code                 : String(10)          @title : '사업본부코드';
        manager_management_header        : Integer64           @title : '담당자 관리 Hearder';
        operation_mode_management_header : Integer64           @title : '운영방식 관리 Hearder';
        cycle_management_header          : Integer64           @title : '주기 관리 Hearder';
        activate_inactivate_flag         : Boolean             @title : '활성화/비활성화 여부';
        monitoring_purpose               : LargeBinary         @title : '모니터링 목적';
        scenario_description             : LargeBinary         @title : '시나리오 설명';
        source_system_management_header  : Integer64           @title : '소스 시스템 관리 Hearder';
        source_system_detail_description : LargeBinary         @title : '소스 시스템 상세설명';
        indicator_management_header      : Integer64           @title : '지표 관리 Hearder';
        attachments_management_header    : Integer64           @title : '첨부파일 관리 Hearder';
}

extend Monitor_Mntr_Mst with util.Managed;
