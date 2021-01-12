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
  6. entity : If_Ztbkpf_Rif
  7. entity description : 수입 비용문서 Interface
  8. history
  -. 2021.01.04 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Ztbkpf_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key belnr     : String(15) not null @title : '수입비용문서번호';
    key gjahr     : String(4) not null  @title : '회계전표연도';
    key buzei     : String(3) not null  @title : '회계전표품목';
        budat     : Date                @title : '전표전기일자';
        zfcstgrp  : String(5)           @title : '비용그룹코드';
        zfposyn   : String(2)           @title : '전표처리여부';
        zfcd      : String(5)           @title : '관리코드';
        zfimdno   : String(15)          @title : '수입문서번호';
}

extend If_Ztbkpf_Rif with util.Managed;
