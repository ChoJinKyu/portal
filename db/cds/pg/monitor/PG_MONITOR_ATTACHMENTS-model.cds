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
  6. entity : Monitoring_Attachments
  7. entity description : 모니터링 시나리오 첨부파일
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as Monitoring_Attachments} from '../monitor/PG_MONITOR_ATTACHMENTS-model';

entity Monitor_Attachments {
    key tenant_id       : String(5) not null  @title : '회사코드';
    key company_code    : String(10) not null @title : '법인코드';
    key bizunit_code    : String(10) not null @title : '사업부분코드';
    key scenario        : Integer64 not null  @title : '시나리오';
        attch           : LargeBinary         @title : '첨부파일';
        attch_type_code : String(100)         @title : '첨부파일유형코드';
        attch_name      : String(240)         @title : '첨부파일명';
        attch_size      : Integer64           @title : '첨부파일크기';
}

extend Monitor_Attachments with util.Managed;