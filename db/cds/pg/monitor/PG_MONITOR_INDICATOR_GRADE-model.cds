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
  6. entity : Monitor_Indicator_Grade
  7. entity description : 지표 등급
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';
using {pg as Indicator_Grade} from '../monitor/PG_MONITOR_INDICATOR_GRADE-model';

entity Monitor_Indicator_Grade {
    key tenant_id            : String(5) not null  @title : '회사코드';
    key indicator_grade      : String(10) not null @title : '지표등급';
    key language_code        : String(10) not null @title : '언어코드';
        indicator_grade_name : String(240)         @title : '지표등급명';
}

extend Monitor_Indicator_Grade with util.Managed;
