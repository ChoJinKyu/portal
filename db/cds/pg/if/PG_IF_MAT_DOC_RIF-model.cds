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
  6. entity : If_Mat_Doc_Rif
  7. entity description : 자재문서 Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Mat_Doc_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key ebeln     : String(15) not null @title : '구매오더번호';
    key ebelp     : String(5) not null  @title : '구매문서품목번호';
    key mblnr     : String(15) not null @title : '자재문서번호';
    key mjahr     : String(4) not null  @title : '자재전표연도';
    key zeile     : String(4) not null  @title : '자재전표품목';
        bwart     : String(5)           @title : '이동유형';
        bldat     : Date                @title : '전표증빙일';
        budat     : Date                @title : '전표의전기일';
        cpudt     : Date                @title : '회계전표입력일';
        matnr     : String(27)          @title : '자재번호';
        werks     : String(6)           @title : '플랜트';
        lgort     : String(6)           @title : '저장위치';
        charg     : String(15)          @title : '배치번호';
        waers     : String(8)           @title : '통화코드';
        dmbtr     : Decimal             @title : '금액(현지통화)';
        menge     : Decimal             @title : '수량';
        meins     : String(5)           @title : '기본단위';
        shkzg     : String(2)           @title : '차대변지시자';
        smbln     : String(15)          @title : '취소자재문서번호';
        sjahr     : String(4)           @title : '취소자재전표연도';
        smblp     : String(4)           @title : '취소자재전표품목';
        umwrk     : String(6)           @title : '입출고플랜트';
        prctr     : String(15)          @title : '손익센터';

}

extend If_Mat_Doc_Rif with util.Managed;
