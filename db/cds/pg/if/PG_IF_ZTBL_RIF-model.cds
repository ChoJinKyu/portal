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
  6. entity : If_Ztbl_Rif
  7. entity description : 수입BL정보 Interface
  8. history
  -. 2021.01.11 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Ztbl_Rif {
    key tenant_id : String(5) not null  @title : '테넌트ID';
    key zfblno    : String(15) not null @title : 'BL번호';
    key zfblit    : String(5) not null  @title : 'BL품목번호';
        zfshno    : String(2)           @title : '선적차수';
        ebeln     : String(15)          @title : 'PO번호';
        ebelp     : String(5)           @title : 'PO품목번호';
        zfbldt    : Date                @title : 'BL발행일자';
        zfhblno   : String(36)          @title : 'HouseBL번호';
        zfpoyn    : String(2)           @title : '유환여부';
        zfetd     : Date                @title : '출발예정일자';
        zfeta     : Date                @title : '도착예정일자';
        zfrelpr   : String(2)           @title : '수입신고수리전반출지시자';
        zfreta    : Date                @title : '실제도착일자';
        zfrmk2    : String(105)         @title : '비고2';
        zfrmk3    : String(105)         @title : '비고3';
        zfrmk4    : String(105)         @title : '비고';
        zfrptty   : String(2)           @title : '수입신고유형코드';
        zfspro    : String(2)           @title : '전략구매지시자';
        zfsprtc   : String(5)           @title : '선적항코드';
        zfsprt    : String(98)          @title : '선적항코드명';
        zfvia     : String(5)           @title : 'VIA';
        zfwerks   : String(6)           @title : '플랜트코드';
        cdat      : Date                @title : '생성일자';
        ekgrp     : String(5)           @title : '구매그룹코드';
        lifnr     : String(15)          @title : '공급업체코드';
        zbwt      : String(2)           @title : 'BWT인코텀즈';
        zfaprtc   : String(5)           @title : '도착항코드';
        zfaprt    : String(98)          @title : '도착항코드명';
        zfblamc   : String(8)           @title : 'BL금액통화코드';
        zfblamt   : Decimal             @title : 'BL금액';
        zfblsdp   : String(5)           @title : '선적서류수신자명';
        zfblsdt   : Date                @title : 'BL송부일자';
        zfcarc    : String(5)           @title : '선기국적코드';
        matnr     : String(27)          @title : '자재코드';
        meins     : String(5)           @title : 'BL기본단위코드';
        netpr     : Decimal             @title : 'BL단가';
        peinh     : Decimal(5, 0)       @title : 'BL가격단위';
        blmenge   : Decimal             @title : 'BL수량';
        zfabnar   : String(15)          @title : '보세구역코드';
        zfbnarcd  : String(3)           @title : '내부관리코드';
        zfbtseq   : String(5)           @title : '보세운송일련번호';
        zfindt    : Date                @title : '반입일자';
        zfivamt   : Decimal             @title : '송장금액';
        zfivamc   : String(8)           @title : '송장금액통화코드';
        zfivamk   : Decimal             @title : '송장현지통화금액';
        zfexrt    : Decimal(20, 10)     @title : '환율';
        cmenge    : Decimal             @title : '상업송장수량';
        zfgidt    : Date                @title : '보세창고출고일자';
        gimenge   : Decimal             @title : '보세창고출고수량';
        meins_gi  : String(5)           @title : '출고단위';
}

extend If_Ztbl_Rif with util.Managed;