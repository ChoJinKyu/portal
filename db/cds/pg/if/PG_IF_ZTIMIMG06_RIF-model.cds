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
  6. entity : If_Ztimimg06_Rif
  7. entity description : 관세청 고시환율 Interface
  8. history
  -. 2020.12.28 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Ztimimg06_Rif {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key company_code  : String(10) not null @title : '회사코드';
    key org_type_code : String(30) not null @title : '조직유형코드';
    key org_code      : String(10) not null @title : '조직코드';
    key waers         : String(8) not null  @title : '통화코드';
    key zfapldt       : Date not null       @title : '환율시작일자';
        zfexpdt       : Date                @title : '환율종료일자';
        zfexrt        : Decimal(9, 5)       @title : '환율';
        ffact         : Decimal(9, 0)       @title : '통화단위비율';
}

extend If_Ztimimg06_Rif with util.Managed;
