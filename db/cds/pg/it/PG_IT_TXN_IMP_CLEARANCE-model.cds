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
  6. entity : It_Txn_Imp_Clearance
  7. entity description : 수입통관 정보 업무용 (SAC)
  8. history
  -. 2021.01.11 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Imp_Clearance {
    key tenant_id                    : String(5) not null  @title : '테넌트ID';
    key company_code                 : String(10) not null @title : '회사코드';
    key org_type_code                : String(30) not null @title : '조직유형코드';
    key org_code                     : String(10) not null @title : '조직코드';
    key clearance_req_mngt_no        : String(50) not null @title : '통관요청관리번호';
    key clearance_req_item_number    : String(10) not null @title : '통관요청품목번호';
        clearance_sequence           : String(10)          @title : '통관순번';
        bl_number                    : String(50)          @title : 'BL번호';
        bl_item_number               : String(10)          @title : 'BL품목번호';
        po_number                    : String(50)          @title : 'PO번호';
        po_item_number               : String(10)          @title : 'PO품목번호';
        clearance_quantity           : Decimal             @title : '통관수량';
        receipt_quantity             : Decimal             @title : '입고수량';
        accutual_receipt_quantity    : Decimal             @title : '실제입고수량';
        base_unit_code               : String(3)           @title : '기본단위코드';
        net_price                    : Decimal             @title : '단가';
        price_unit                   : Decimal(5, 0)       @title : '가격단위';
        hs_code                      : String(17)          @title : 'HS코드';
        receipt_processed_indicator  : String(1)           @title : '입고처리지시자';
        fta_code                     : String(30)          @title : 'FTA코드';
        fta_type_code                : String(30)          @title : 'FTA구분코드';
        invoice_amount_currency_code : String(3)           @title : '송장금액통화코드';
        shipping_country_code        : String(2)           @title : '적출국코드';
        material_origin_code         : String(2)           @title : '자재원산국코드';
        customs_type_code            : String(30)          @title : '관세구분코드';
        spec_number                  : String(10)          @title : '규격번호';
        import_declare_number        : String(30)          @title : '수입신고번호';
        declare_accept_date          : Date                @title : '신고수리일자';
}

extend It_Txn_Imp_Clearance with util.Managed;