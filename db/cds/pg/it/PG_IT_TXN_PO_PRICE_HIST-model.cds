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
  6. entity : It_Txn_Po_Price_Hist
  7. entity description : PO 단가이력 업무용 (SAC)
  8. history
  -. 2021.01.07 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Po_Price_Hist {
    key tenant_id                : String(5) not null  @title : '테넌트ID';
    key company_code             : String(10) not null @title : '회사코드';
    key org_type_code            : String(30) not null @title : '조직유형코드';
    key org_code                 : String(10) not null @title : '조직코드';
    key po_number                : String(50) not null @title : 'PO번호';
    key po_item_number           : String(10) not null @title : 'PO품목번호';
    key pur_info_record_number   : String(50) not null @title : '구매정보레코드번호';
        pur_info_record_category : String(1)           @title : '구매정보레코드범주';
        plant_code               : String(4)           @title : '플랜트코드';
        po_doc_date              : Date                @title : 'PO증빙일자';
        po_currency_code         : String(3)           @title : 'PO통화코드';
        po_net_price             : Decimal             @title : 'PO단가';
        po_price_unit            : Decimal(5, 0)       @title : 'PO가격단위';
        po_unit                  : String(3)           @title : 'PO단위';
        currency_code            : String(3)           @title : '통화코드';
        net_price                : Decimal             @title : '단가';
        price_unit               : Decimal(5, 0)       @title : '가격단위';
        default_unit             : String(3)           @title : '기본단위';
}

extend It_Txn_Po_Price_Hist with util.Managed;

