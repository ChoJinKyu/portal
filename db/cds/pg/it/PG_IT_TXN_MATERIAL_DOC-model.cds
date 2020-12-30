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
  6. entity : It_Txn_Material_Doc
  7. entity description : 자재전표 업무용 (SAC)
  8. history
  -. 2020.12.29 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Material_Doc {
    key tenant_id                      : String(5) not null  @title : '테넌트ID';
    key company_code                   : String(10) not null @title : '회사코드';
    key org_type_code                  : String(30) not null @title : '조직유형코드';
    key org_code                       : String(10) not null @title : '조직코드';
    key po_number                      : String(50) not null @title : 'PO번호';
    key po_item_number                 : String(10) not null @title : 'PO품목번호';
    key material_document_number       : String(50) not null @title : '자재문서번호';
    key material_document_year         : String(4) not null  @title : '자재전표연도';
    key material_document_item         : String(10) not null @title : '자재전표품목';
        moving_type_code               : String(3)           @title : '이동유형코드';
        document_doc_date              : Date                @title : '전표증빙일자';
        document_posting_date          : Date                @title : '전표전기일자';
        accounting_document_input_date : Date                @title : '회계전표입력일자';
        material_code                  : String(40)          @title : '자재코드';
        batch_number                   : String(10)          @title : '배치번호';
        currency_code                  : String(3)           @title : '통화코드';
        document_purchasing_amount     : Decimal             @title : '전표구매금액';
        receipt_quantity               : Decimal             @title : '입고수량';
        base_unit_code                 : String(3)           @title : '기본단위코드';
        dc_indicator                   : String(1)           @title : '차대변지시자';
        canc_material_document_number  : String(50)          @title : '취소자재문서번호';
        canc_material_document_year    : String(4)           @title : '취소자재전표연도';
        canc_material_document_item    : String(10)          @title : '취소자재전표품목';
        re_is_plant_code               : String(4)           @title : '입출고플랜트코드';
        prctr_code                     : String(15)          @title : '손익센터코드';

}

extend It_Txn_Material_Doc with util.Managed;
