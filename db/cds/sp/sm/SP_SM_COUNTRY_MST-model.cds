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
  5. namespace : sp
  6. entity : Sm_Country_Mst
  7. entity description : 협력사 국가 관리
  8. history
  -. 2021.01.25 : 디포커스 김종현 최초작성
*************************************************/

namespace sp;

using util from '../../cm/util/util-model';

entity Sm_Country_Mst {
    key tenant_id        : String(5) not null  @title : '테넌트ID';
    key country_code     : String(2) not null  @title : '국가코드';
        country_iso_code : String(3) not null  @title : '국가ISO코드';
        country_name     : String(30) not null @title : '국가명';
        region_name      : String(240)         @title : '지역명';
        iso_flag         : String(1)           @title : 'ISO Flag';
        eu_flag          : String(1)           @title : 'EU Flag';
        enable_flag      : String(1)           @title : 'Enable Flag';
}

extend Sm_Country_Mst with util.Managed;