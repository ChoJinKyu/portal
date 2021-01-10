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
  6. entity : If_Po_Hst_Rif
  7. entity description : PO이력 Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Po_Hst_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key ebeln     : String(15) not null @title : 'PO번호';
    key ebelp     : String(5) not null  @title : 'PO품목번호';
    key vgabe     : String(2) not null  @title : '거래이벤트유형코드';
    key belnr     : String(15) not null @title : '자재문서번호';
    key gjahr     : String(4) not null  @title : '자재전표연도';
    key buzei     : String(4) not null  @title : '자재전표품목';
        bewtp     : String(2)           @title : 'PO이력구분코드';
        bwart     : String(5)           @title : '이동유형코드';
        budat     : Date                @title : '전표전기일자';
        menge     : Decimal             @title : '수량';
        wrbtr     : Decimal             @title : '전표통화금액';
        dmbtr     : Decimal             @title : '현지통화금액';
        waers     : String(8)           @title : '전표통화코드';
        hswae     : String(8)           @title : '현지통화코드';
        shkzg     : String(2)           @title : '차대변지시자';
        elikz     : String(2)           @title : '납품완료지시자';
        xblnr     : String(24)          @title : '참조번호';
        lfbnr     : String(15)          @title : '참조문서번호';
        lfpos     : String(4)           @title : '참조전표품목';
        matnr     : String(27)          @title : '자재코드';
        charg     : String(15)          @title : '배치번호';
        werks     : String(6)           @title : '플랜트코드';
}


extend If_Po_Hst_Rif with util.Managed;
