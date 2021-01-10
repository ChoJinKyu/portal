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
  6. entity : It_Txn_Invoice_Doc
  7. entity description : 송장전표 업무용 (SAC)
  8. history
  -. 2020.12.29 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Invoice_Doc {
    key tenant_id                      : String(5) not null  @title : '테넌트ID';
    key company_code                   : String(10) not null @title : '회사코드';
    key org_type_code                  : String(30) not null @title : '조직유형코드';
    key org_code                       : String(10) not null @title : '조직코드';
    key po_number                      : String(50) not null @title : 'PO번호';
    key po_item_number                 : String(10) not null @title : 'PO품목번호';
    key invoice_number                 : String(50) not null @title : '송장번호';
    key invoice_document_year          : String(4) not null  @title : '송장전표연도';
    key invoice_document_item          : String(10) not null @title : '송장전표품목';
        document_type_code             : String(50)          @title : '전표유형코드';
        document_doc_date              : Date                @title : '전표증빙일자';
        document_posting_date          : Date                @title : '전표전기일자';
        accounting_document_input_date : Date                @title : '회계전표입력일자';
        currency_code                  : String(3)           @title : '통화코드';
        exchange_rate                  : Decimal(20, 10)     @title : '환율';
        pay_idays                      : Decimal(5, 0)       @title : '지급기산일수';
        maturity_calc_date             : Date                @title : '만기계산일자';
        material_code                  : String(40)          @title : '자재코드';
        invoice_document_amount        : Decimal             @title : '송장전표금액';
        dc_indicator                   : String(1)           @title : '차대변지시자';
        invoice_quantity               : Decimal             @title : '송장수량';
        gl_account_code                : String(30)          @title : 'GL계정코드';
        accounting_document_number     : String(50)          @title : '회계전표번호';
        accounting_document_year       : String(4)           @title : '회계전표연도';
        clearing_date                  : Date                @title : '반제일자';
        document_amount                : Decimal             @title : '전표금액';
        accounting_maturity_calc_date  : Date                @title : '회계만기계산일자';
        accounting_payterms_code       : String(30)          @title : '회계지불조건코드';
        accounting_pay_idays           : Decimal(5, 0)       @title : '회계지급기산일수';
        accounting_pay_method          : String(4)           @title : '회계지급방법';
        prctr_code                     : String(15)          @title : '손익센터코드';
}

extend It_Txn_Invoice_Doc with util.Managed;

                          
