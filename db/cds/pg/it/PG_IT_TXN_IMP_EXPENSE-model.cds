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
  6. entity : It_Txn_Imp_Expense
  7. entity description : 수입 비용문서 업무용 (SAC)
  8. history
  -. 2021.01.04 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Imp_Expense {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key company_code                : String(10) not null @title : '회사코드';
    key org_type_code               : String(30) not null @title : '조직유형코드';
    key org_code                    : String(10) not null @title : '조직코드';
    key imp_expense_document_number : String(50) not null @title : '수입비용문서번호';
    key accounting_document_year    : String(4) not null  @title : '회계전표연도';
    key accounting_document_item    : String(10) not null @title : '회계전표품목';
        document_posting_date       : Date                @title : '전표전기일자';
        expense_group_code          : String(3)           @title : '비용그룹코드';
        document_processed_flag     : String(1)           @title : '전표처리여부';
        management_code             : String(30)          @title : '관리코드';
        imp_document_number         : String(50)          @title : '수입문서번호';
}

extend It_Txn_Imp_Expense with util.Managed;
