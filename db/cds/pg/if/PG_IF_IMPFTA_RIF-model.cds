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
  6. entity : If_Impfta_Rif
  7. entity description : 수입FTA협정코드 마스터 Interface
  8. history
  -. 2020.12.22 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Impfta_Rif {
    key tenant_id : String(5) not null @title : '테넌트ID';
    key zfftart   : String(6) not null @title : 'FTA코드';
        zfftart_t : String(383)        @title : 'FTA코드내역';
}

extend If_Impfta_Rif with util.Managed;