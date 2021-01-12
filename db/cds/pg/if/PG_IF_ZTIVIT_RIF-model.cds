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
  6. entity : If_Ztivit_Rif
  7. entity description : 수입통관 정보 Interface
  8. history
  -. 2020.12.22 : 이기현
*************************************************/
namespace pg;

using util from '../../cm/util/util-model';


entity If_Ztivit_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key zfivno    : String(15) not null @title : '통관요청관리번호';
    key zfivdno   : String(5) not null  @title : '통관요청품목번호';
        zfclseq   : String(5)           @title : '통관순번';
        zfblno    : String(15)          @title : 'BL번호';
        zfblit    : String(5)           @title : 'BL품목번호';
        ebeln     : String(15)          @title : 'PO번호';
        ebelp     : String(5)           @title : 'PO품목번호';
        ccmenge   : Decimal             @title : '통관수량';
        grmenge   : Decimal             @title : '입고수량';
        grtotmn   : Decimal             @title : '실제입고수량';
        meins     : String(5)           @title : '기본단위코드';
        netpr     : Decimal             @title : '단가';
        peinh     : Decimal(5, 0)       @title : '가격단위';
        stawn     : String(26)          @title : 'HS코드';
        umson     : String(2)           @title : '입고처리지시자';
        zfftart   : String(6)           @title : 'FTA코드';
        zfftaty   : String(2)           @title : 'FTA구분코드';
        zfivamc   : String(8)           @title : '송장금액통화코드';
        zfscon    : String(5)           @title : '적출국코드';
        zforig    : String(5)           @title : '자재원산국코드';
        zftxcd    : String(9)           @title : '관세구분코드';
        zfrono    : String(3)           @title : '규격번호';
        zfidrno   : String(21)          @title : '수입신고번호';
        zfidsdt   : Date                @title : '신고수리일자';
}

extend If_Ztivit_Rif with util.Managed;
