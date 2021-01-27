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
  6. entity : It_Mst_Exch_Rate
  7. entity description : 환율 마스터 업무용 (SAC)
  8. history
  -. 2020.12.23 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Mst_Exch_Rate {
    key tenant_id            : String(5) not null  @title : '테넌트ID';
    key exrate_type_code     : String(30) not null @title : '환율유형코드';
    key source_currency_code : String(3) not null  @title : '소스통화코드';
    key target_currency_code : String(3) not null  @title : '대상통화코드';
    key exrate_start_date    : Date not null       @title : '환율시작일자';
        exchange_rate        : Decimal(20, 10)     @title : '환율';
}

extend It_Mst_Exch_Rate with util.Managed;
