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
  6. entity : It_Txn_Pr_Doc
  7. entity description : PR 업무용 (SAC)
  8. history
  -. 2021.01.04 : 이기현
*************************************************/

namespace pg;

using util from '../../cm/util/util-model';


entity It_Txn_Pr_Doc {
    key tenant_id             : String(5) not null  @title : '테넌트ID';
    key company_code          : String(10) not null @title : '회사코드';
    key org_type_code         : String(30) not null @title : '조직유형코드';
    key org_code              : String(10) not null @title : '조직코드';
    key erp_pr_number         : String(50) not null @title : '구매요청번호';
    key pr_item_number        : String(10) not null @title : '구매요청품목번호';
        po_number             : String(50)          @title : 'PO번호';
        po_item_number        : String(10)          @title : 'PO품목번호';
        delete_flag           : String(1)           @title : '삭제여부';
        material_code         : String(40)          @title : '자재코드';
        pr_desc               : String(100)         @title : 'PR내역';
        plant_code            : String(4)           @title : '플랜트코드';
        sloc_code             : String(6)           @title : '저장위치코드';
        pr_quantity           : Decimal             @title : '구매요청수량';
        pr_unit               : String(3)           @title : '구매요청단위';
        pr_currency_code      : String(3)           @title : 'PR통화코드';
        pr_requestor_name     : String(50)          @title : '요청자명';
        delivery_request_date : Date                @title : '납품요청일';
        approve_date          : Date                @title : '결재완료일자';
        purchasing_group_code : String(3)           @title : '구매그룹';
}

extend It_Txn_Pr_Doc with util.Managed;
