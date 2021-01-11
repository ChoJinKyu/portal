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
  6. entity : If_T024d_Rif
  7. entity description : MRP관리자 마스터 Interface
  8. history
  -. 2021.01.11 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_T024d_Rif {
    key tenant_id : String(5) not null @title : '테넌트ID';
    key werks     : String(6) not null @title : '플랜트';
    key dispo     : String(5) not null @title : 'MRP관리자';
        dsnam     : String(27)         @title : 'MRP관리자이름';
        dstel     : String(18)         @title : 'MRP관리자전화번호';
        ekgrp     : String(5)          @title : '구매그룹';
        mempf     : String(18)         @title : '수신자명';
        gsber     : String(6)          @title : '사업영역';
        prctr     : String(15)         @title : '손익센터';
}

extend If_T024d_Rif with util.Managed;