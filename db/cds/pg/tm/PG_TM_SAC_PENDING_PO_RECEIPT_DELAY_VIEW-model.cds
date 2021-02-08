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
  6. entity : Tm_Sac_Pending_Po_Receipt_Delay_View
  7. entity description : 미결 PO 정리 지연 (SAC 모니터링 제공용)
  8. history
  -. 2021.02.08 : 차재근
*************************************************/

namespace pg;

@cds.persistence.exists

entity Tm_Sac_Pending_Po_Receipt_Delay_View {
    key base_yyyy_mm                : String(7)         @title : '기준년월';
    key date                        : Date              @title : '기준일자';
    key monitoring_scenario         : String(30)        @title : '모니터링 시나리오';
    key tenant                      : String(5)         @title : '터넌트ID';
    key company                     : String(10)        @title : '회사코드';
    key bizunit                     : String(10)        @title : '사업본부코드';
    key purchasing_group            : String(3)         @title : '구매그룹';
    key supplier                    : String(15)        @title : '공급업체코드';
    key material                    : String(40)        @title : '자재코드';
    key plant                       : String(10)        @title : '플랜트';
    key po                          : String(50)        @title : '구매오더';
    key po_item_number              : String(10)        @title : '구매오더 품목번호';
        po_create_date              : Date              @title : '구매오더 생성일자';
        po_creator                  : String(30)        @title : '구매오더 생성자';
        po_creator_name             : String(50)        @title : '구매오더 생성자 이름';
        po_type                     : String(6)         @title : '구매오더 유형';
        po_by_item_delivery_date    : Date              @title : '구매오더 품목 납품요청일자';
        po_price_unit               : Decimal(5, 0)     @title : '구매오더 금액단위';
        po_quantity_unit            : String(3)         @title : '구매오더 수량단위';
        po_currency                 : String(3)         @title : '구매오더 통화';
        receipt_quantity_unit       : String(3)         @title : '입고 수량단위';
        delay_days_type             : String(10)        @title : '납품 지연 일수 구분';
        confirmed_flag              : String(10)        @title : '확정여부';
        receipt_date                : Date              @title : '입고일자';

        base_count                  : Integer           @title : '기준 개수';
        delay_days                  : Integer           @title : '납품 지연 일수';
        po_exrate                   : Decimal(20,10)    @title : '구매오더 환율';
        po_amount                   : Decimal(24,10)    @title : '구매오더 금액';
        po_krw_amount               : Decimal(24,10)    @title : '구매오더 원화 금액';
        po_quantity                 : Decimal(24,10)    @title : '구매오더 수량';
        po_price                    : Decimal(24,10)    @title : '구매오더 단가';
        receipt_quantity            : Decimal(24,10)    @title : '입고 수량';
        pending_quantity            : Decimal(24,10)    @title : '미결 수량';
}