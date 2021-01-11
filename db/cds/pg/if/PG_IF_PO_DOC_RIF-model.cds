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
  6. entity : If_Po_Doc_Rif
  7. entity description : 구매오더 PO Interface
  8. history
  -. 2021.01.09 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity If_Po_Doc_Rif {
    key tenant_id   : String(5) not null  @title : '테넌트ID';
    key ebeln       : String(15) not null @title : 'PO번호';
    key ebelp       : String(5) not null  @title : 'PO품목번호';
        bstyp       : String(2)           @title : 'PO범주코드';
        bsart       : String(6)           @title : 'PO유형코드';
        lifnr       : String(15)          @title : '공급업체코드';
        zterm       : String(6)           @title : '지불조건코드';
        zbd1t       : Decimal(3, 0)       @title : 'PO지급일수';
        ekorg       : String(6)           @title : '구매조직코드';
        ekgrp       : String(5)           @title : '구매그룹코드';
        waers       : String(8)           @title : 'PO통화코드';
        wkurs       : Decimal(20, 10)     @title : 'PO환율';
        bedat       : Date                @title : 'PO증빙일자';
        kdatb       : Date                @title : '유효시작일자';
        kdate       : Date                @title : '유효종료일자';
        reswk       : String(6)           @title : '출고플랜트코드';
        inco1       : String(5)           @title : '인도조건코드';
        inco2       : String(42)          @title : '인도조건내역2';
        unsez       : String(18)          @title : '비고';
        zpernr      : String(24)          @title : '구매담당자사번';
        zfprnam     : String(30)          @title : '구매담당자명';
        producttype : String(2)           @title : '양산여부';
        loekz       : String(2)           @title : '삭제여부';
        txz01       : String(60)          @title : 'PO내역';
        matnr       : String(27)          @title : '자재코드';
        werks       : String(6)           @title : '플랜트코드';
        lgort       : String(6)           @title : '저장위치코드';
        meins       : String(5)           @title : '구매오더단위';
        menge       : Decimal             @title : '구매수량';
        bpumz       : Decimal(5, 0)       @title : '가격단위전환분자';
        bpumn       : Decimal(5, 0)       @title : '가격단위전환분모';
        umrez       : Decimal(5, 0)       @title : '기본단위전환분자';
        umren       : Decimal(5, 0)       @title : '기본단위전환분모';
        netpr       : Decimal             @title : 'PO단가';
        peinh       : Decimal(5, 0)       @title : 'PO가격단위';
        netwr       : Decimal             @title : '구매오더금액';
        mwskz       : String(3)           @title : '세금코드';
        bwtar       : String(15)          @title : '평가유형코드';
        elikz       : String(2)           @title : '납품완료지시자';
        pstyp       : String(2)           @title : 'PO품목범주코드';
        knttp       : String(2)           @title : '계정지정범주코드';
        konnr       : String(15)          @title : '구매계약번호';
        ktpnr       : String(5)           @title : '계약품목번호';
        sobkz       : String(2)           @title : '특별재고지시자';
        inco1_item  : String(5)           @title : '품목인도조건코드';
        inco2_item  : String(42)          @title : '품목인도조건내역2';
        banfn       : String(15)          @title : 'ERP구매요청번호';
        bnfpo       : String(5)           @title : '구매요청품목번호';
        mtart       : String(6)           @title : '자재유형코드';
        retpo       : String(2)           @title : '반품품목여부';
        zfuseyn     : String(2)           @title : '기납증처리여부';
        sakto       : String(15)          @title : 'GL계정코드';
        kostl       : String(15)          @title : '비용부서코드';
        prctr       : String(15)          @title : '손익센터코드';
        ps_psp_pnr  : String(8)           @title : '프로젝트코드';
        etenr       : String(4)           @title : '납품일정품목번호';
        eindt       : Date                @title : '납품요청일자';
        clustid     : LargeString         @title : '특기사항';
        lblni       : String(15)          @title : '서비스입력서번호';
        loekz_srv   : String(2)           @title : '서비스입력서삭제지시자';
        jiche_srv   : String(2)           @title : '지체상금부과여부';

}

extend If_Po_Doc_Rif with util.Managed;
