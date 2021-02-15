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
  6. entity : It_Txn_Imp_Declation
  7. entity description : 수입면허 업무용 (SAC)
  8. history
  -. 2021.02.15 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Imp_Declation {
    key tenant_id             : String(5) not null  @title : '테넌트ID';
    key company_code          : String(10) not null @title : '회사코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key bl_number             : String(50) not null @title : 'BL번호';
    key clearance_sequence    : String(10) not null @title : '통관순번';
    key item_number           : String(50) not null @title : '품목번호';
        import_declare_number : String(30)          @title : '수입신고번호';
        plant_code            : String(4)           @title : '플랜트';
        exrate                : Decimal             @title : '환율';
        customs_rate          : Decimal             @title : '관세율';
        hs_code               : String(17)          @title : 'HS_CODE';
        item_desc             : String(1000)        @title : '품목내역';
        clearance_req_mngt_no : String(50)          @title : '통관요청관리번호';
        customs_duty          : Decimal             @title : '관세';
        vat                   : Decimal             @title : '부가세';
        clearance_fee         : Decimal             @title : '통관수수료';
        agent_fee             : Decimal             @title : '대행수수료';
}

extend It_Txn_Imp_Declation with util.Managed;

                          
