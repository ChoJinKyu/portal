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
  6. entity : Monitor_Idc_Cmp_Bsc_Mst
  7. entity description : 지표 비교기준
  8. history
  -. 2020.11.04 : 디포커스 김종현 최초작성
*************************************************/

namespace pg;

using util from '../../util/util-model';
using {pg as Indicator_Comparison_Basic} from '../monitor/PG_MONITOR_IDC_CMP_BSC-model';

entity Monitor_Idc_Cmp_Bsc_Mst {
    key tenant_id                       : String(5) not null  @title : '테넌트ID';
    key indicator_comparison_basic      : String(10) not null @title : '지표 비교기준';
    key language_code                   : String(10) not null @title : '언어코드';
        indicator_comparison_basic_text : String(300)         @title : '지표 비교기준 내역';
}

extend Monitor_Idc_Cmp_Bsc_Mst with util.Managed;
