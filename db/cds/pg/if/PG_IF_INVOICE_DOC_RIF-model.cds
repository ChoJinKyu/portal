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
  6. entity : If_Invoice_Doc_Rif
  7. entity description : 송장문서 Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Invoice_Doc_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key ebeln     : String(15) not null @title : '구매오더번호';
    key ebelp     : String(5) not null  @title : '구매문서품목번호';
    key belnr     : String(15) not null @title : '물류송장전표번호';
    key gjahr     : String(4) not null  @title : '회계연도';
    key buzei     : String(4) not null  @title : '송장전표의전표품목';
        blart     : String(3)           @title : '전표유형';
        bldat     : Date                @title : '전표증빙일';
        budat     : Date                @title : '전표의전기일';
        cpudt     : Date                @title : '회계전표입력일';
        waers     : String(8)           @title : '통화키';
        kursf     : Decimal(20, 10)     @title : '환율';
        zbd1t     : Decimal(3, 0)       @title : '현금할인기간1';
        zfbdt     : Date                @title : '만기계산기준일';
        matnr     : String(27)          @title : '자재번호';
        wrbtr     : Decimal             @title : '전표통화금액';
        shkzg     : String(2)           @title : '차대변지시자';
        menge     : Decimal             @title : '수량';
        saknr     : String(15)          @title : 'GL계정번호';
        belnr_fi  : String(15)          @title : '회계전표번호';
        gjahr_fi  : String(4)           @title : '회계연도';
        augdt     : Date                @title : '반제일';
        dmbtr     : Decimal             @title : '금액(현지통화)';
        zfbdt_fi  : Date                @title : '만기계산기준일';
        zterm_fi  : String(6)           @title : '지급조건키';
        zbd1t_fi  : Decimal(3, 0)       @title : '현금할인기간1';
        zlsch_fi  : String(2)           @title : '지급방법';
        prctr     : String(15)          @title : '손익센터';

}

extend If_Invoice_Doc_Rif with util.Managed;
