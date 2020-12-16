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
  6. entity : Tm_Indicator_Number_Dtl
  7. entity description : 모니터링 지표번호 상세
  8. history
  -. 2020.12.07 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Task_Monitoring_Indicator} from '../tm/PG_TM_INDICATOR_NUMBER_DTL-model';

entity Tm_Indicator_Number_Dtl {
    key tenant_id                        : String(5) not null  @title : '회사코드';
    key scenario_number                  : Integer64 not null  @title : '시나리오번호';
    key monitoring_indicator_number      : String(30) not null @title : '모니터링지표번호';
    key monitoring_indicator_sequence    : Integer64 not null  @title : '모니터링지표순서';
        monitoring_ind_condition_cd      : String(10)          @title : '모니터링지표조건코드';
        monitoring_indicator_start_value : String(100)         @title : '모니터링지표시작값';
        monitoring_indicator_last_value  : String(100)         @title : '모니터링지표최종값';
        monitoring_indicator_grade       : String(10)          @title : '모니터링지표등급';
        monitoring_ind_compare_base_cd   : String(30)          @title : '모니터링지표비교기준코드';
}

extend Tm_Indicator_Number_Dtl with util.Managed;