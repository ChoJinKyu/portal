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
  6. entity : If_Pr_Doc_Rif
  7. entity description : 구매오더 PO Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Pr_Doc_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key banfn     : String(15) not null @title : '구매요청번호';
    key bnfpo     : String(5) not null  @title : '구매요청품목번호';
        ebeln     : String(15) not null @title : 'PO번호';
        ebelp     : String(5) not null  @title : 'PO품목번호';
        loekz     : String(2)           @title : '삭제여부';
        matnr     : String(27)          @title : '자재코드';
        txz01     : String(60)          @title : 'PR내역';
        werks     : String(6)           @title : '플랜트코드';
        lgort     : String(6)           @title : '저장위치코드';
        menge     : Decimal             @title : '구매요청수량';
        meins     : String(5)           @title : '구매요청단위';
        waers     : String(8)           @title : 'PR통화코드';
        afnam     : String(18)          @title : '요청자명';
        lfdat     : Date                @title : '납품요청일';
        frgdt     : Date                @title : '결재완료일자';
        ekgrp     : String(5)           @title : '구매그룹';

}

extend If_Pr_Doc_Rif with util.Managed;
