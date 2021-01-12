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
  6. entity : If_Zttaxbkit_Rif
  7. entity description : 수입 기납증문서 Interface
  8. history
  -. 2021.01.04 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Zttaxbkit_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key zftbno    : String(15) not null @title : '기납증관리번호';
    key zftbit    : String(5) not null  @title : '기납증품목번호';
        ebeln     : String(15)          @title : 'PO번호';
        ebelp     : String(5)           @title : 'PO품목번호';
}

extend If_Zttaxbkit_Rif with util.Managed;

