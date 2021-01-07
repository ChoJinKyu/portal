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
  6. entity : It_Txn_Po_Hist
  7. entity description : PO 이력 업무용 (SAC)
  8. history
  -. 2021.01.07 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Po_Hist {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key company_code                : String(10) not null @title : '회사코드';
    key org_type_code               : String(30) not null @title : '조직유형코드';
    key org_code                    : String(10) not null @title : '조직코드';
    key po_number                   : String(50) not null @title : 'PO번호';
    key po_item_number              : String(10) not null @title : 'PO품목번호';
    key txn_event_type_code         : String(1) not null  @title : '거래이벤트유형코드';
    key material_document_number    : String(50) not null @title : '자재문서번호';
    key material_document_year      : String(4) not null  @title : '자재전표연도';
    key material_document_item      : String(10) not null @title : '자재전표품목';
        po_history_type_code        : String(1)           @title : 'PO이력구분코드';
        moving_type_code            : String(3)           @title : '이동유형코드';
        document_posting_date       : Date                @title : '전표전기일자';
        quantity                    : Decimal             @title : '수량';
        document_currency_amount    : Decimal             @title : '전표통화금액';
        local_currency_amount       : Decimal             @title : '현지통화금액';
        document_currency_code      : String(3)           @title : '전표통화코드';
        local_currency_code         : String(3)           @title : '현지통화코드';
        dc_indicator                : String(1)           @title : '차대변지시자';
        delivery_complete_indicator : String(1)           @title : '납품완료지시자';
        reference_number            : String(50)          @title : '참조번호';
        reference_document_number   : String(50)          @title : '참조문서번호';
        reference_document_item     : String(10)          @title : '참조전표품목';
        material_code               : String(40)          @title : '자재코드';
        batch_number                : String(10)          @title : '배치번호';
        plant_code                  : String(4)           @title : '플랜트코드';
}

extend It_Txn_Po_Hist with util.Managed;
