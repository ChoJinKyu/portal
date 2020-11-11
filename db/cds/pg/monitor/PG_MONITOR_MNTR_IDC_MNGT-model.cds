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
  6. entity : Monitor_Mntr_Idc_Mngt
  7. entity description : 모니터링 시나리오 지표관리
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as Monitoring_Indicator_Management} from '../monitor/PG_MONITOR_MNTR_IDC_MNGT-model';

entity Monitor_Mntr_Idc_Mngt {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key company_code                : String(10) not null @title : '회사코드';
    key scenario_code               : String(10) not null @title : '시나리오';
    key indicator_management_header : Integer64 not null  @title : '지표 관리 Hearder';
    key indicator_management_item   : Integer64 not null  @title : '지표 관리 Item';
        indicator                   : String(10)          @title : '지표';
        language_code               : String(10)          @title : '언어코드';
        indicator_text              : String(300)         @title : '지표 내역';
        indicator_sequence          : Integer64           @title : '지표 순서';
        indicator_condition         : String(10)          @title : '지표 조건';
        indicator_start_value       : Decimal(17, 3)      @title : '지표 시작값';
        indicator_last_value        : Decimal(17, 3)      @title : '지표 최종값';
        indicator_grade             : String(10)          @title : '지표 등급';
        indicator_comparison_basic  : String(10)          @title : '지표 비교기준';
}

extend Monitor_Mntr_Idc_Mngt with util.Managed;
