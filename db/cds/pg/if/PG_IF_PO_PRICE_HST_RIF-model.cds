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
  6. entity : If_Po_Price_Hst_Rif
  7. entity description : PO가격 이력 Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Po_Price_Hst_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key ebeln     : String(15) not null @title : 'PO번호';
    key ebelp     : String(5) not null @title : 'PO품목번호';
    key infnr     : String(15) not null @title : '구매정보레코드번호';
        esokz     : String(2)           @title : '구매정보레코드범주';
        werks     : String(6)           @title : '플랜트코드';
        bedat     : Date                @title : 'PO증빙일자';
        bwaer     : String(8)           @title : 'PO통화코드';
        preis     : Decimal             @title : 'PO단가';
        peinh     : Decimal(5, 0)       @title : 'PO가격단위';
        bprme     : String(5)           @title : 'PO단위';
        lwaer     : String(8)           @title : '통화코드';
        lprei     : Decimal             @title : '단가';
        lpein     : Decimal(5, 0)       @title : '가격단위';
        lmein     : String(5)           @title : '기본단위';

}

extend If_Po_Price_Hst_Rif with util.Managed;
